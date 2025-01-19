import { NextFunction, Request, Response } from "express";
import Testcase from "../models/testcaseModel";
import Project from "../models/projectModel";

export const getProjectTestcases = async (req:Request, res:Response, next: NextFunction) => {
    try {
        const { projectId } = req.params;
        const testcases = await Testcase.find({project: projectId}).populate('assignedTo', 'username email');
        if (!testcases) {
              next (new Error('No test cases found for this project.'));
          }
      
          res.status(200).json(testcases);
      } catch (error) {
        next(error);
      }
}

export const getProjectTestcaseById = async (req:Request, res:Response, next: NextFunction) => {
    try {
        const { projectId, testCaseId } = req.params;
        const testcases = await Testcase.find({project: projectId, _id:testCaseId}).populate('assignedTo', 'username email');
        if (!testcases) {
              next (new Error('No test cases found for this project.'));
          }
      
          res.status(200).json(testcases);
      } catch (error) {
        next(error);
      }
}

export const addTestcase = async (req:Request, res:Response, next:NextFunction) =>{
    try {
        const { id,name, description, priority, assignedTo, status, preconditions, steps,  } = req.body;
        const {projectId} = req.params;
        const project = projectId;
        const projectFound = await Project.findOne({_id: projectId});
        const cycle = projectFound?.cycle;
        const build = projectFound?.build;
        // Create a new TestCase document
        const newTestCase = new Testcase({
          id,
          name,
          description,
          priority,
          project,
          assignedTo,
          status,
          preconditions,
          steps,
          cycle,
          build,
        });
    
        // Save the TestCase
        const savedTestCase = await newTestCase.save();
    
        res.status(201).json(savedTestCase);
      } catch (error) {
        next(error);
      }
}

export const updateTestcase = async (req:Request, res:Response, next:NextFunction) =>{
      try {
        const { testCaseId } = req.params;
        const updateData = req.body;
        
        // Update the test case
        const updatedTestCase = await Testcase.findByIdAndUpdate(testCaseId, updateData, { new: true });
        
        if (!updatedTestCase) {
          next(new Error ('Test case not found.'));
        }
        
        res.status(200).json(updatedTestCase);
      } catch (error) {
        next(error);
      }
}

export const deleteTestcase = async (req:Request, res:Response, next:NextFunction) =>{
    try {
      const { testCaseId } = req.params;
      
      
      const response = await Testcase.findByIdAndDelete(testCaseId);
      
      if (!response) {
        next(new Error ('Test case not found.'));
      }
      
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
}