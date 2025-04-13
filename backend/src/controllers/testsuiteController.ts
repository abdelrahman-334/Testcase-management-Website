import { Request, Response, NextFunction } from 'express';
import TestSuite from '../models/testsuiteModel';
import Project from '../models/projectModel';
import Testcase from '../models/testcaseModel';
import mongoose from 'mongoose';

export const getProjectTestSuites = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params;
    const suites = await TestSuite.find({ project: projectId });
    res.status(200).json(suites);
  } catch (err) {
    next(err);
  }
};

export const getTestSuiteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const suite = await TestSuite.findById(req.params.testSuiteId);
    if (!suite) { 
    res.status(404).json({ message: 'Test suite not found.' });
    return;
    }
    res.status(200).json(suite);
  } catch (err) {
    next(err);
  }
};

export const createTestSuite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, name, description, status } = req.body;
    const { projectId } = req.params;

    const projectExists = await Project.findById(projectId);
    if (!projectExists) {
         res.status(404).json({ message: 'Project not found.' });
         return;
    }

    const newSuite = new TestSuite({ id, name, description, project: projectId });
    const saved = await newSuite.save();
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};

export const updateTestSuite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { testSuiteId } = req.params;
    const updated = await TestSuite.findByIdAndUpdate(testSuiteId, req.body, { new: true });
    if (!updated){  res.status(404).json({ message: 'Test suite not found.'  });
    return;}
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteTestSuite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { testSuiteId } = req.params;
    const deleted = await TestSuite.findByIdAndDelete(testSuiteId);
    if (!deleted) { res.status(404).json({ message: 'Test suite not found.' });
    return;}

    res.status(200).json(deleted);
  } catch (err) {
    next(err);
  }
};
export const addTestcaseToSuite = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { testSuiteId, testCaseId } = req.params;
  
      const testcase = await Testcase.findById(testCaseId);
      if (!testcase) { 
        res.status(404).json({ message: 'Test case not found.' });
        return;}
  
      testcase.testSuite = new mongoose.Types.ObjectId(testSuiteId);
      const updated = await testcase.save();
  
      res.status(200).json({ message: 'Test case added to test suite.', testcase: updated });
    } catch (err) {
      next(err);
    }
  };   


  export const getTestcasesInSuite = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { testSuiteId } = req.params;
      const testcases = await Testcase.find({ testSuite: testSuiteId }).populate('assignedTo');
      res.status(200).json(testcases);
    } catch (err) {
      next(err);
    }
  };