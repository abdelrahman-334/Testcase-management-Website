import express from "express";
import { upload } from "../middleware/multerConfig";
import { uploadTestScript, getScriptsByTestcase } from "../controllers/testscriptController";
import { authenticate } from "../middleware/authMiddleware";

const testscriptRouter = express.Router();

testscriptRouter.post("/upload", upload.single("scriptContent"), uploadTestScript);
testscriptRouter.get("/:testcaseId",getScriptsByTestcase);

export default testscriptRouter;