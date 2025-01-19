import mongoose, { Schema, Document, Model, Types } from "mongoose";
import User from "./userModel";

export interface IStep {
    
        step_description: string,
        expected_result: string,
      
}
// Define an interface for the User document
export interface ITestCase extends Document {
  _id: string;
  id: number;
  name: string;
  description: string;
  priority: number;
  project:Types.ObjectId;
  assignedTo: Types.ObjectId;
  status: string;
  preconditions: string;
  steps:[{
    step_description: string,
    expected_result: string,
  }];
  cycle : number;
  build : number;
}

// Define the User schema
const TestcaseSchema: Schema = new mongoose.Schema<ITestCase>({
    id: {required: true,type: Number},
    name: {required: true,type: String},
    description: {required: true,type: String},
    priority: {required: true,type: Number},
    project: {required: true, type:mongoose.Schema.Types.ObjectId, ref:"Project"},
    assignedTo: {required: true, type:mongoose.Schema.Types.ObjectId, ref:"User"},
    status: {default:"not tested", type:String , enum:["pass","fail","not tested"]},
    preconditions: {default:"", type:String},
    steps: {required: true, type:[{
        step_description: String,
        expected_result: String,
      }]},
    cycle: {default: 0,type: Number},
    build: {default: 0,type: Number}
}, { timestamps: true });

const Testcase = mongoose.model<ITestCase>("Testcase", TestcaseSchema);
export default Testcase;