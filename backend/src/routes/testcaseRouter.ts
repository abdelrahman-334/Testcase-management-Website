import express from "express";
import { authenticate } from "../middleware/authMiddleware";
import { addTestcase, deleteTestcase, getProjectTestcaseById, getProjectTestcases, updateTestcase } from "../controllers/testcaseController";
import historyRouter from "./historyRoutes";
import { addBatchHistoricalData } from "../controllers/historyController";

const TestcaseRouter = express.Router({ mergeParams: true });

// CRUD operations for test cases within a project
TestcaseRouter.get("/",getProjectTestcases);
TestcaseRouter.get("/:testCaseId",getProjectTestcases);
TestcaseRouter.get("/:testCaseId",getProjectTestcaseById);
TestcaseRouter.post("/",addTestcase);
TestcaseRouter.put("/:testCaseId",updateTestcase);
TestcaseRouter.delete("/:testCaseId", deleteTestcase);
TestcaseRouter.use("/:testCaseId/history",historyRouter)
TestcaseRouter.post("/add-batch",addBatchHistoricalData)
export default TestcaseRouter;
