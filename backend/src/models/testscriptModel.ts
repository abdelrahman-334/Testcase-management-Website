import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITestScript extends Document {
  testcaseId: Types.ObjectId;
  scriptName: string;
  scriptType: string;
  scriptContent: string;
  createdAt: Date;
  updatedAt: Date;
}

const TestScriptSchema: Schema = new mongoose.Schema<ITestScript>({
  testcaseId: { type: mongoose.Schema.Types.ObjectId, ref: "Testcase", required: true },
  scriptName: { type: String, required: true },
  scriptType: { type: String, required: true },
  scriptContent: { type: String, required: true }, // Store extracted text
}, { timestamps: true });

export default mongoose.model<ITestScript>("TestScript", TestScriptSchema);