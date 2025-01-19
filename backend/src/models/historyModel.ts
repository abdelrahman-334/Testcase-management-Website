import mongoose, { Document, Schema, Types } from 'mongoose';
// Define the interface for the document
export interface IHistoricalData extends Document {
    _id: string;
    project:Types.ObjectId;
    Id: number;
    Name: string;
    BuildId: number;
    Duration: number;
    CalcPrio: number;
    LastRun: string;
    NumRan: number;
    Verdict: number;
    Cycle: number;
    LastResults: string[];
}

// Define the schema for the document
const historicalDataSchema = new Schema<IHistoricalData>({
    project: {type:mongoose.Schema.Types.ObjectId, required:true},
    Id: { type: Number, required: true },
    Name: { type: String, required: true },
    BuildId: { type: Number, required: true },
    Duration: { type: Number, required: true },
    CalcPrio: { type: Number, required: true },
    LastRun: { type: String, required: true },
    NumRan: { type: Number, required: true },
    Verdict: { type: Number, required: true },
    Cycle: { type: Number, required: true },
    LastResults: { type: [String], required: true },
}, { timestamps: true });

const History = mongoose.model<IHistoricalData>('history', historicalDataSchema);

export default History;