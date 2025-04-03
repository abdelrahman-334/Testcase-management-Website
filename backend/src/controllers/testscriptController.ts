import fs from "fs/promises";
import path from "path";
import { NextFunction, Request, Response } from "express";
import TestScriptModel from "../models/testscriptModel";
import TestcaseModel from "../models/testcaseModel";

// Upload script and extract text
export const uploadTestScript = async (req: Request, res: Response,next:NextFunction) => {
  try {
    if (!req.file) {
        next(new Error('No file found'));
        return;
    }

    const { testcaseId, scriptName, scriptType } = req.body;

    // Read and extract text from the uploaded script
    const scriptPath = path.join(__dirname, "../../uploads", req.file.filename);
    const scriptContent = await fs.readFile(scriptPath, "utf-8");
    // Save extracted content in MongoDB
    const script = await TestScriptModel.create({
      testcaseId: testcaseId,
      scriptName: scriptName,
      scriptType: scriptType,
      scriptContent: scriptContent,
    });

    // Associate script with the test case
    await TestcaseModel.findByIdAndUpdate(testcaseId, { $push: { scripts: script._id } });

    // Delete the uploaded file (optional)
    fs.unlink(scriptPath).catch((err) => console.error("Error deleting file:", err));

     res.status(201).json({ success: true, data: script });
  } catch (error : any) {
    next(error);
  }
};

// Get scripts by Test Case ID
export const getScriptsByTestcase = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const { testcaseId } = req.params;
    const scripts = await TestScriptModel.find({ testcase: testcaseId });

     res.status(200).json({ success: true, data: scripts });
  } catch (error: any) {
        next(error);
  }
};