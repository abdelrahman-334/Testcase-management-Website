// scripts/test-worker.ts
import { execSync } from 'child_process';
import mongoose from 'mongoose';

// Replace this with your real connection string
const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://abdelrahmannader:callofdirt1@cluster0.ytujf.mongodb.net/TestCaseWebsite?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI, {
  dbName: 'TestCaseWebsite',
}).then(() => {
  console.log('✅ MongoDB connected in test worker');
}).catch(err => {
  console.error('❌ MongoDB connection failed in test worker:', err);
  process.exit(1);
});

const [,, repoUrl, projectId] = process.argv;

import('./TestExecutionService').then(async ({ TestExecutionService }) => {
  try {
    const results = await TestExecutionService.execute(repoUrl, projectId);
    process.send?.({ success: true, results });
    process.exit(0);
  } catch (err) {
    process.send?.({ success: false, error: (err as Error).message });
    process.exit(1);
  }
});
