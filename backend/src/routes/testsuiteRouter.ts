import express from 'express';
import {
  getProjectTestSuites,
  getTestSuiteById,
  createTestSuite,
  updateTestSuite,
  deleteTestSuite,
  getTestcasesInSuite
} from '../controllers/testsuiteController';

const router = express.Router();

router.get('/projects/:projectId/suites', getProjectTestSuites);
router.get('/suites/:testSuiteId', getTestSuiteById);
router.post('/projects/:projectId/suites', createTestSuite);
router.put('/suites/:testSuiteId', updateTestSuite);
router.delete('/suites/:testSuiteId', deleteTestSuite);
router.get('/suites/:testSuiteId/testcases', getTestcasesInSuite);


export default router;