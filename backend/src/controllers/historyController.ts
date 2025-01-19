import HistoricalData, { IHistoricalData } from '../models/historyModel';
import { NextFunction, Request, Response } from 'express';

// Add historical data
export const addHistoricalData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { testCaseId } = req.params;
        const newData = new HistoricalData({ ...req.body, testCaseId });
        await newData.save();
        res.status(201).json({ status: 'success', message: 'Historical data added successfully', data: newData });
    } catch (error) {
        next(error);  // Pass error to the error-handling middleware
    }
};

// Get historical data for a test case
export const getHistoricalData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { testCaseId, historyId } = req.params;

        // If historyId is provided, fetch that specific record
        const query = historyId ? { _id: historyId, testCaseId } : { testCaseId };
        const data = await HistoricalData.find(query);

        if (!data.length) {
            next(new Error('No historical data found'));  // Pass error to next middleware
        } else {
            res.status(200).json(data);
        }
    } catch (error) {
        next(error);  // Pass error to the error-handling middleware
    }
};

// Update historical data
export const updateHistoricalData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { historyId } = req.params;
        const updatedData = await HistoricalData.findOneAndUpdate(
            { _id: historyId }, 
            req.body, 
            { new: true }
        );

        if (!updatedData) {
            next(new Error('Historical data not found'));  // Pass error to next middleware
        } else {
            res.status(200).json({
                status: 'success',
                message: 'Historical data updated successfully',
                data: updatedData,
            });
        }
    } catch (error) {
        next(error);  // Pass error to the error-handling middleware
    }
};

// Delete historical data
export const deleteHistoricalData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { historyId } = req.params;
        const deletedData = await HistoricalData.findOneAndDelete({ _id: historyId });

        if (!deletedData) {
            next(new Error('Historical data not found'));  // Pass error to next middleware
        } else {
            res.status(200).json({ status: 'success', message: 'Historical data deleted successfully' });
        }
    } catch (error) {
        next(error);  // Pass error to the error-handling middleware
    }
};
