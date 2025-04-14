import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import simpleGit from 'simple-git';
import HistoricalData from '../models/historyModel';
import Project from '../models/projectModel';
import { v4 as uuidv4 } from 'uuid';
import injectReporter from '../utils/codeInject';
import Testcase from '../models/testcaseModel';
import mongoose from 'mongoose';
const WORKDIR = path.join(__dirname, '../../../temp');
import dayjs from 'dayjs';
export class TestExecutionService {
  static async execute(repoUrl: string, projectId: string) {
    const repoPath = path.join(WORKDIR, uuidv4());

    await this.downloadRepo(repoUrl, repoPath);
    await this.injectReporter(repoPath);
    await this.installDependencies(repoPath);
    await this.runTests(repoPath);
    const parsedResults = await this.parseResults(repoPath);
    await this.saveHistoricalData(parsedResults, projectId);

    return parsedResults;
  }

  static async downloadRepo(repoUrl: string, dest: string) {
    await simpleGit().clone(repoUrl, dest);
  }

  static async installDependencies(dest: string) {
    execSync('npm install', { cwd: dest, stdio: 'inherit' });
  }

  static async runTests(dest: string) {
    execSync('npx jest --runInBand', { cwd: dest, stdio: 'inherit' });
  }

  static async parseResults(dest: string) {
    const resultsPath = path.join(dest, 'reports/results.json');
    const data = await fs.readFile(resultsPath, 'utf-8');
    return JSON.parse(data); // Your customJsonReporter should output this format
  }

  static async injectReporter(dest: string) {
    const reporterSource = path.join(__dirname, '../reporting/customJsonReporter.js');
    const reporterDest = path.join(dest, 'customJsonReporter.js');
    const configPath = path.join(dest, 'jest.config.js');

    const reporterCode = await fs.readFile(reporterSource, 'utf-8');
    await fs.writeFile(reporterDest, reporterCode);

    const jestConfig = `
      module.exports = {
        reporters: [
          "default",
          "./customJsonReporter.js"
        ]
      };
    `;
    await fs.writeFile(configPath, jestConfig);
  }

  static async saveHistoricalData(parsed: any[], projectId: string) {
    const project = await Project.findById(projectId);
    const { cycle, build } = project || {};
  
    const toInsert: any[] = [];
  
    for (const suite of parsed) {
      for (const t of suite.testResults) {
        // Extract numeric ID from test title like "[1] does something"
        const idMatch = t.title.match(/\[(\d+)\]/);
        const numericId = idMatch ? parseInt(idMatch[1]) : null;
  
        if (numericId === null) {
          console.warn(`Skipped test with no ID: ${t.title}`);
          continue;
        }
  
        // Find matching test case
        const testcase = await Testcase.findOne({ id:numericId, project:projectId });
        if (!testcase) {
          console.warn(`No matching test case found for ID ${numericId}`);
          continue;
        }


        const latestHistory = await HistoricalData.findOne({
          Id: testcase.id,
          project: projectId
        }).sort({ createdAt: -1 });
        console.log("latestHistory", latestHistory);
        const previousResults = latestHistory
        ? [...(latestHistory.LastResults || []), String(latestHistory.Verdict)]
        : [];
        const currentResult = t.status === 'passed' ? '1' : '0';
        console.log("currentResult", previousResults);
        const updatedResults = [...previousResults, currentResult];
        toInsert.push({
          project: projectId,
          Id: testcase.id,
          Name: testcase.name,
          BuildId: build || 0,
          Duration: t.duration || 0,
          CalcPrio: 0,
          LastRun: dayjs(new Date()).format('DD/MM/YYYY HH:mm'),
          NumRan: 1,
          Verdict: currentResult === '1' ? 1 : 0,
          Cycle: cycle || 0,
          LastResults: previousResults,
        });
      }
    }
  
    if (toInsert.length > 0) {
      await HistoricalData.insertMany(toInsert);
    }
  }
}
