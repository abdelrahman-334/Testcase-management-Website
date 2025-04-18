import { Request, Response, NextFunction } from 'express';
import { fork } from 'child_process';
import path from 'path';
import Project from '../models/projectModel';
import fs from 'fs';

export const executeTests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.body;

    const project = await Project.findById(projectId).select('github_repo').lean().exec();
    if (!project || !project.github_repo) {
       res.status(404).json({ message: 'Project or repo URL not found.' });
       return;
    }
    const workerPath = path.join(__dirname, '../services/test-worker.js');

    

    console.log("Resolved worker path:", workerPath);

    if (!fs.existsSync(workerPath)) {
        console.error("❌ test-worker.js not found at path:", workerPath);
    }   
    const child = fork(workerPath, [project.github_repo, projectId]);

    child.on('message', (msg: { success: boolean; results?: any; error?: string }) => {
         console.log('Message from child process:', msg.results[0].testResults);
         if (msg.success && Array.isArray(msg.results)) {
          const report = msg.results.flatMap((r: any) =>
            r.testResults.map((t: any) => {
              // Extract numeric ID from the title like "[4] reverse"
              const match = t.title.match(/\[(\d+)\]/);
              const id = match ? parseInt(match[1], 10) : null;
        
              return {
                title: t.title,
                id,
                status: t.status,
                duration: t.duration || 0,
              };
            })
          );
        
          return res.status(200).json({
            message: '✅ Test execution completed.',
            report,
          });
        } else {
        res.status(500).json({ message: '❌ Test execution failed.', error: msg.error });
      }
    });

    child.on('error', (err) => {
      console.error('Child process error:', err);
      res.status(500).json({ message: 'Child process error.', error: err.message });
    });

  } catch (err) {
    next(err);
  }
};
