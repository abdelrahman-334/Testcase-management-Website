import express from 'express';
import { addHistoricalData, getHistoricalData, updateHistoricalData, deleteHistoricalData } from '../controllers/historyController';

const historyRouter = express.Router({ mergeParams: true });

// Routes for handling historical data associated with a test case
historyRouter.post("/", addHistoricalData); // Add historical data
historyRouter.get("/", getHistoricalData); // Get all historical data for the test case
historyRouter.get("/:historyId", getHistoricalData); // Get historical data by ID
historyRouter.put("/:historyId", updateHistoricalData); // Update historical data by ID
historyRouter.delete("/:historyId", deleteHistoricalData); // Delete historical data by ID

export default historyRouter;
