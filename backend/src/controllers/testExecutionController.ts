import { Request, Response, NextFunction } from 'express';
import { TestExecutionService } from '../services/TestExecutionService';
import Project from '../models/projectModel';

export const executeTests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.body;
    const repoUrl = await Project.findById(projectId).select('github_repo').lean().exec();
    if (!repoUrl) { 
         res.status(404).json({ message: 'Project not found' });
         return;
    }
    const result = await TestExecutionService.execute(repoUrl.github_repo, projectId);
    res.status(200).json({ message: 'Test execution completed', result });
  } catch (error) {
    next(error);
  }
};