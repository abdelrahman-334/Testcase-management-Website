import { Request, Response } from "express";
import Project from "../models/projectModel";
import User from "../models/userModel";

// Add a new project
export const addProject = async (req: Request, res: Response) => {
    try {
      
      const userId = req.user?._id; // Get the user's ID from the authenticated request
      const { name, cycle = 0, build = 0 } = req.body;
  
      const newProject = await Project.create({ name, leader: userId, cycle, build });
  
      // Add the project to the user's projects array
      await User.findByIdAndUpdate(userId, { $push: { projects: newProject._id } });
  
      return res.status(201).json(newProject);
    } 
    catch (error) {
        if (error instanceof Error) {
          return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: "An unexpected error occurred" });
      }
      
  };
  

// Delete a project
export const deleteProject = async (req: Request, res: Response) => {
    try {
      const userId = req.user?._id; // Get the user's ID from the authenticated request
      const { projectId } = req.params;
  
      const project = await Project.findOneAndDelete({ _id: projectId, leader: userId });
      if (!project) {
        return res.status(404).json({ error: "Project not found or not authorized to delete" });
      }
  
      // Remove the project from the user's projects array
      await User.findByIdAndUpdate(userId, { $pull: { projects: projectId } });
  
      return res.status(200).json({ message: "Project deleted successfully" });
    } 
    catch (error) {
        if (error instanceof Error) {
          return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: "An unexpected error occurred" });
      }
      
  };
  

// Update project name
export const updateProjectName = async (req: Request, res: Response) => {
    try {
      const userId = req.user?._id; // Get the user's ID from the authenticated request
      const { projectId } = req.params;
      const { name } = req.body;
  
      const updatedProject = await Project.findOneAndUpdate(
        { _id: projectId, leader: userId }, // Ensure the user owns the project
        { name },
        { new: true }
      );
  
      if (!updatedProject) {
        return res.status(404).json({ error: "Project not found or not authorized to update" });
      }
  
      return res.status(200).json(updatedProject);
    }
    catch (error) {
        if (error instanceof Error) {
          return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: "An unexpected error occurred" });
      }
      
  };
  

// Retrieve projects for a specific user
export const getUserProjects = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate("projects");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user.projects);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
  
};

// Increment project cycle
export const incrementCycle = async (req: Request, res: Response) => {
    try {
      const userId = req.user?._id; // Get the user's ID from the authenticated request
      const { projectId } = req.params;
  
      const updatedProject = await Project.findOneAndUpdate(
        { _id: projectId, leader: userId }, // Ensure the user owns the project
        { $inc: { cycle: 1 } },
        { new: true }
      );
  
      if (!updatedProject) {
        return res.status(404).json({ error: "Project not found or not authorized to update" });
      }
  
      return res.status(200).json(updatedProject);
    } 
    catch (error) {
        if (error instanceof Error) {
          return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: "An unexpected error occurred" });
      }
      
  };
  

// Increment project build
export const incrementBuild = async (req: Request, res: Response) => {
    try {
      const userId = req.user?._id; // Get the user's ID from the authenticated request
      const { projectId } = req.params;
  
      const updatedProject = await Project.findOneAndUpdate(
        { _id: projectId, leader: userId }, // Ensure the user owns the project
        { $inc: { build: 1 } },
        { new: true }
      );
  
      if (!updatedProject) {
        return res.status(404).json({ error: "Project not found or not authorized to update" });
      }
  
      return res.status(200).json(updatedProject);
    }

    catch (error) {
        if (error instanceof Error) {
          return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: "An unexpected error occurred" });
      }
      
  };
  
