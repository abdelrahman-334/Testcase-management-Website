import express from "express";
import { authenticate } from "../middleware/authMiddleware";
import { addTestcase, deleteTestcase, getProjectTestcaseById, getProjectTestcases, updateTestcase } from "../controllers/testcaseController";

const TestcaseRouter = express.Router({ mergeParams: true });

// CRUD operations for test cases within a project
TestcaseRouter.get("/",getProjectTestcases);
TestcaseRouter.get("/:testCaseId",getProjectTestcases);
TestcaseRouter.get("/:testCaseId",getProjectTestcaseById);
TestcaseRouter.post("/",addTestcase);
TestcaseRouter.put("/:testCaseId",updateTestcase);
TestcaseRouter.delete("/:testCaseId", deleteTestcase);

export default TestcaseRouter;
