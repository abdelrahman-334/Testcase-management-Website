// models/TestResultModel.ts
export interface TestCaseResult {
    title: string;
    status: 'passed' | 'failed';
    duration: number;
  }
  
  export interface TestSuiteResult {
    file: string;
    status: string;
    numPassing: number;
    numFailing: number;
    testResults: TestCaseResult[];
  }
  
  // Example using Mongoose
  import mongoose from 'mongoose';
  
  const TestCaseResultSchema = new mongoose.Schema({
    title: String,
    status: String,
    duration: Number,
  });
  
  const TestSuiteResultSchema = new mongoose.Schema({
    file: String,
    status: String,
    numPassing: Number,
    numFailing: Number,
    testResults: [TestCaseResultSchema],
    timestamp: { type: Date, default: Date.now },
  });
  
  export default mongoose.model('TestResult', TestSuiteResultSchema);
  