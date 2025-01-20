import HistoricalData, { IHistoricalData } from '../models/historyModel';
import { NextFunction, Request, Response } from 'express';
import Project from '../models/projectModel';
import multer from 'multer';
import csvParser from 'csv-parser';
import fs from 'fs';
import path from 'path';
import History from '../models/historyModel';


const upload = multer({ dest: 'uploads/' }); // 'uploads/' is the temporary directory for uploaded files

// Add historical data from a CSV file
export const addBatchHistoricalData = [
  upload.single('file'), // Expect a file named "file" in the form data
  async (req: Request, res: Response, next: NextFunction) => {
    const { projectId } = req.params;

    try {
      if (!req.file) {
        next('No file uploaded' );
        return;
      }

      const filePath = path.resolve(req.file?.path); // Path to the uploaded CSV file
      const historicalData: any[] = [];

      // Parse the CSV file
      fs.createReadStream(filePath)
        .pipe(csvParser({ separator: ';' })) // Use ';' as the delimiter
        .on('data', (row) => {
          // Transform CSV row into the correct format
          const formattedRow = {
            project: projectId,
            Id: parseInt(row.Id, 10),
            Name: row.Name,
            BuildId: parseInt(row.BuildId, 10),
            Duration: parseFloat(row.Duration),
            CalcPrio: parseFloat(row.CalcPrio),
            LastRun: row.LastRun, // Parse date
            NumRan: parseInt(row.NumRan, 10),
            Verdict: parseInt(row.Verdict, 10),
            Cycle: parseInt(row.Cycle, 10),
            LastResults: JSON.parse(row.LastResults || '[]'), // Handle empty array
          };

          historicalData.push(formattedRow);
        })
        .on('end', async () => {
          // Insert parsed data into MongoDB
          await History.insertMany(historicalData);

          // Cleanup: Remove the uploaded file
          fs.unlinkSync(filePath);

          res.status(201).json({
            status: 'success',
            message: 'Historical data added successfully',
            data: historicalData,
          });
        })
        .on('error', (error) => {
          // Cleanup: Remove the uploaded file in case of error
          fs.unlinkSync(filePath);
          next(error); // Pass error to error-handling middleware
        });
    } catch (error) {
      next(error); // Pass error to the error-handling middleware
    }
  },
];


// Add historical data
export const addHistoricalData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { projectId } = req.params;
        const newData = { project:projectId,...req.body };
        await History.create(newData);
        res.status(201).json({ status: 'success', message: 'Historical data added successfully', data: newData });
    } catch (error) {
        next(error);  // Pass error to the error-handling middleware
    }
};

// Get historical data for a test case
export const getHistoricalData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { projectId, historyId } = req.params;

        // If historyId is provided, fetch that specific record
        const query = historyId ? { _id: historyId, projectId } : { projectId };
        const data = await History.find(query);

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
        const updatedData = await History.findOneAndUpdate(
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
        const deletedData = await History.findOneAndDelete({ _id: historyId });

        if (!deletedData) {
            next(new Error('Historical data not found'));  // Pass error to next middleware
        } else {
            res.status(200).json({ status: 'success', message: 'Historical data deleted successfully' });
        }
    } catch (error) {
        next(error);  // Pass error to the error-handling middleware
    }
};
