import express from 'express';
import { executeTests } from '../controllers/testExecutionController';

const TestExecutionrouter = express.Router();
TestExecutionrouter.post('/execute-tests', executeTests);

export default TestExecutionrouter;
