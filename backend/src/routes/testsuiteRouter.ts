import express from 'express';
import {
  getProjectTestSuites,
  getTestSuiteById,
  createTestSuite,
  updateTestSuite,
  deleteTestSuite,
  getTestcasesInSuite,
  addTestcaseToSuite
} from '../controllers/testsuiteController';

const TestSuiteRouter = express.Router();

TestSuiteRouter.get('/projects/:projectId/suites', getProjectTestSuites);
TestSuiteRouter.get('/suites/:testSuiteId', getTestSuiteById);
TestSuiteRouter.post('/projects/:projectId/suites', createTestSuite);
TestSuiteRouter.put('/suites/:testSuiteId', updateTestSuite);
TestSuiteRouter.delete('/suites/:testSuiteId', deleteTestSuite);
TestSuiteRouter.get('/suites/:testSuiteId/testcases', getTestcasesInSuite);
TestSuiteRouter.put('/suites/:testSuiteId/testcases', addTestcaseToSuite);

export default TestSuiteRouter;