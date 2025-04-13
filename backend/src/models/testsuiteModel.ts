import mongoose, { Schema, Document } from 'mongoose';

export interface ITestSuite extends Document {
  id: number;
  name: string;
  description: string;
  project: mongoose.Types.ObjectId;
  status: 'active' | 'archived';
}

const testSuiteSchema = new Schema<ITestSuite>({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
}, { timestamps: true });

export default mongoose.model<ITestSuite>('TestSuite', testSuiteSchema);