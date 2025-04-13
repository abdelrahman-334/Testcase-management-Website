import express from "express";
import { getUser } from "../controllers/userController";
import { addProject, addUserToProject, deleteProject, getProjectById, getUserProjects, getUsersForProject, incrementBuild, incrementCycle, removeUserFromProject, updateProjectName } from "../controllers/projectController";
import { authenticate, isRole } from "../middleware/authMiddleware";
import TestcaseRouter from "./testcaseRouter";

const projectRouter = express.Router();

projectRouter.get("/", getUserProjects);
projectRouter.get("/:projectId", authenticate, getProjectById);
projectRouter.post("/", addProject);
projectRouter.put("/:projectId", updateProjectName);
projectRouter.delete("/:projectId", deleteProject);
projectRouter.put("/:projectId/increment-cycle", incrementCycle);
projectRouter.put("/:projectId/add-user",addUserToProject);
projectRouter.put("/:projectId/remove-user",removeUserFromProject);
projectRouter.use("/:projectId/get-users", authenticate, getUsersForProject);
projectRouter.put("/:projectId/increment-build", incrementBuild);
projectRouter.use("/:projectId/test-cases", TestcaseRouter);

export default projectRouter;