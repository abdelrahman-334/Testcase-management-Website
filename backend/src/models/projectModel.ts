import mongoose, { Schema, Document, Model, Types } from "mongoose";
import User, { IUser } from "./userModel";

// Define an interface for the User document
export interface IProject extends Document {
  _id: string;
  name: string;
  leader: Types.ObjectId;
  cycle : number;
  build : number;
}

// Define the User schema
const ProjectSchema: Schema = new mongoose.Schema({
  name : {required: true, type: String},
  leader : {required: true, type: mongoose.Schema.Types.ObjectId, ref: "User"},
  cycle : {default : 0, type: Number},
  build : {default: 0, type: Number},
}, { timestamps: true });

const Project = mongoose.model<IProject>("Project", ProjectSchema);
export default Project;