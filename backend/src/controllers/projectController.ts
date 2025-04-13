import { NextFunction, Request, Response } from "express";
import Project from "../models/projectModel";
import User from "../models/userModel";

// Add a new project
export const addProject = async (req: Request, res: Response,next: NextFunction) => {
    try {
      
      const userId = req.user?._id; // Get the user's ID from the authenticated request
      const username = (await User.findById(userId))?.username

      const { name, github_repo, cycle = 0, build = 0 } = req.body;
  
      const newProject = await Project.create({ name, leader: userId, cycle, build, github_repo });
  
      // Add the project to the user's projects array
        await User.findByIdAndUpdate(userId, { $push: { projects: newProject._id } });
  
       res.status(201).json({updatedProject:newProject,name:username });
    } 
    catch (error) {
        next(error)
      }
      
  };
  
  export const addUserToProject = async (req: Request, res: Response,next: NextFunction) => {
    try {
      
      const { projectId } = req.params;
      const { email } = req.body;
      
      const user = await User.findOne({email:email});
      if(!user){
        return next(new Error( `User not found with email: ${email} ` ));
      }
      // Add the project to the user's projects array
      await User.findByIdAndUpdate(user?._id, { $push: { projects: projectId } });
  
       res.status(201).json(user);
    } 
    catch (error) {
        next(error)
      }
      
  };

  export const removeUserFromProject = async (req: Request, res: Response,next: NextFunction) => {
    try {
      
      const { projectId } = req.params;
      const { email } = req.body;
      
      const user = await User.findOne({email:email});
      if(!user){
        return next(new Error( `User not found with email: ${email} ` ));
      }
      // Add the project to the user's projects array
      await User.findByIdAndUpdate(user?._id, { $pull: { projects: projectId } });
  
       res.status(201).json(user);
    } 
    catch (error) {
        next(error)
      }
      
  };


export const getUsersForProject = async (req:Request, res:Response, next: NextFunction) => {
  try{
  const {projectId} = req.params;
  const usersInProject = await User.find({ projects: {$in: projectId} }).select("username email");
  if (!usersInProject || usersInProject.length === 0) {
    next(new Error ("No users found for this project." ));
  }
  
  res.status(200).json(usersInProject);
  }
 catch (error) {
  next(error);
}
}

// Delete a project
export const deleteProject = async (req: Request, res: Response,next: NextFunction) => {
    try {
      const userId = req.user?._id; // Get the user's ID from the authenticated request
      const { projectId } = req.params;
  
      const project = await Project.findOneAndDelete({ _id: projectId, leader: userId });
      if (!project) {
        return next(new Error( "Project not found or not authorized to delete" ));
      }
  
      // Remove the project from the user's projects array
      await User.findByIdAndUpdate(userId, { $pull: { projects: projectId } });
  
       res.status(200).json({ message: "Project deleted successfully" });
       
    } 
    catch (error) {
        next(error)
      }
      
  };
  

// Update project name
export const updateProjectName = async (req: Request, res: Response,next: NextFunction) => {
    try {
      const userId = req.user?._id; // Get the user's ID from the authenticated request
      const { projectId } = req.params;
      const { name,github_repo } = req.body;
      const username = (await User.findById(userId))?.username

      const updatedProject = await Project.findOneAndUpdate(
        { _id: projectId, leader: userId }, // Ensure the user owns the project
        { name, github_repo },
        { new: true }
      );
  
      if (!updatedProject) {
         return next(new Error(`Project not found or not authorized to update` ));
      }
  
       res.status(200).json({updatedProject:updatedProject,name:username });
    }
    catch (error) {
        next(error)
      }
      
  };
  
  export const getProjectById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?._id; // Get the user's ID from the authenticated request
      const { projectId } = req.params; // Get the project ID from the route parameters
  
      // Find the project with the given ID where the user is the leader
      const project = await Project.findOne({
        _id: projectId,
        leader: userId,
      });
  
      if (!project) {
        // If no project is found, pass an error to the error handler
        return next(new Error(`Project not found or not authorized to view`));
      }
  
      // Return the project if found
      res.status(200).json(project);
    } catch (error) {
      next(error); // Pass any caught errors to the error handler
    }
  };

  export const getProject = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?._id; // Get the user's ID from the authenticated request
      const { projectId } = req.params; // Get the project ID from the route parameters
  
      // Find the project with the given ID where the user is the leader
      const project = await Project.findOne({
        _id: projectId,
        leader: userId,
      });
  
      if (!project) {
        // If no project is found, pass an error to the error handler
        return next(new Error(`Project not found or not authorized to view`));
      }
  
      // Return the project if found
      res.status(200).json(project);
    } catch (error) {
      next(error); // Pass any caught errors to the error handler
    }
  };

// Retrieve projects for a specific user
export const getUserProjects  = async (req: Request, res: Response,next: NextFunction) : Promise<void> => {
  try {
    const  userId  = req.user?._id;

    const user = await User.findById(userId).populate({
      path: "projects",
      populate: {
        path: "leader", // Populate the `leader` field within each project
        select: "username", // Only retrieve the leader's name
      },
    });
    if (!user) {
      return next(new Error( "User not found" ));
    }
     
     res.status(200).json(user?.projects);
  } catch (error) {
        next(error);
  }
  
};

// Increment project cycle
export const incrementCycle = async (req: Request, res: Response,next: NextFunction) => {
    try {
      const userId = req.user?._id; // Get the user's ID from the authenticated request
      const { projectId } = req.params;
  
      const updatedProject = await Project.findOneAndUpdate(
        { _id: projectId, leader: userId }, // Ensure the user owns the project
        { $inc: { cycle: 1 } },
        { new: true }
      );
  
      if (!updatedProject) {
        return next(new Error( "Project not found or not authorized to update" ));
      }
  
       res.status(200).json(updatedProject);
    } 
    catch (error) {
        next(error);
      }
      
  };
  

// Increment project build
export const incrementBuild = async (req: Request, res: Response,next: NextFunction) : Promise<void> => {
    try {
      const userId = req.user?._id; // Get the user's ID from the authenticated request
      const { projectId } = req.params;
  
      const updatedProject = await Project.findOneAndUpdate(
        { _id: projectId, leader: userId }, // Ensure the user owns the project
        { $inc: { build: 1 } },
        { new: true }
      );
  
      if (!updatedProject) {
         return next(new Error("Project not found or not authorized to update"));

      }
  
       res.status(200).json(updatedProject);
    }

    catch (error) {
        next(error)
      }
  };
  
