import React from "react";
import HistoricalData from "../types/historical";
import TestCase from "../types/testcase";

interface historyModalProps {
    newHistoricalData:HistoricalData;
    setNewHistoricalData: React.Dispatch<React.SetStateAction<HistoricalData>>;
    setIsHistoryModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleSaveHistoricalData:  (testcase: TestCase) => void;
    newTestCase: TestCase
}
const HistoryModal: React.FC<historyModalProps> = ({
    newHistoricalData,
    setNewHistoricalData,
    setIsHistoryModalOpen,
    handleSaveHistoricalData,
    newTestCase
}) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded shadow-lg w-1/2 p-6">
            <h2 className="text-xl font-bold mb-4">Add Historical Data</h2>
            <div className="space-y-4">
                <input
                    type="number"
                    placeholder="Test Case ID"
                    value={newHistoricalData.Id}
                    onChange={(e) => setNewHistoricalData({ ...newHistoricalData, Id: Number(e.target.value) })}
                    className="w-full px-4 py-2 border rounded" />
                <input
                    type="text"
                    placeholder="Name"
                    value={newHistoricalData.Name}
                    onChange={(e) => setNewHistoricalData({ ...newHistoricalData, Name: e.target.value })}
                    className="w-full px-4 py-2 border rounded" />
                <input
                    type="number"
                    placeholder="Build ID"
                    value={newHistoricalData.BuildId}
                    onChange={(e) => setNewHistoricalData({ ...newHistoricalData, BuildId: Number(e.target.value) })}
                    className="w-full px-4 py-2 border rounded" />
                <input
                    type="number"
                    placeholder="Duration"
                    value={newHistoricalData.Duration}
                    onChange={(e) => setNewHistoricalData({ ...newHistoricalData, Duration: Number(e.target.value) })}
                    className="w-full px-4 py-2 border rounded" />
                <input
                    type="number"
                    placeholder="CalcPrio"
                    value={newHistoricalData.CalcPrio}
                    onChange={(e) => setNewHistoricalData({ ...newHistoricalData, CalcPrio: Number(e.target.value) })}
                    className="w-full px-4 py-2 border rounded" />
                <input
                    type="text"
                    placeholder="Last Run Date"
                    value={newHistoricalData.LastRun}
                    onChange={(e) => setNewHistoricalData({ ...newHistoricalData, LastRun: e.target.value })}
                    className="w-full px-4 py-2 border rounded" />
                <input
                    type="number"
                    placeholder="NumRan"
                    value={newHistoricalData.NumRan}
                    onChange={(e) => setNewHistoricalData({ ...newHistoricalData, NumRan: Number(e.target.value) })}
                    className="w-full px-4 py-2 border rounded" />
                <input
                    type="number"
                    placeholder="Verdict"
                    value={newHistoricalData.Verdict}
                    onChange={(e) => setNewHistoricalData({ ...newHistoricalData, Verdict: Number(e.target.value) })}
                    className="w-full px-4 py-2 border rounded" />
                <input
                    type="number"
                    placeholder="Cycle"
                    value={newHistoricalData.Cycle}
                    onChange={(e) => setNewHistoricalData({ ...newHistoricalData, Cycle: Number(e.target.value) })}
                    className="w-full px-4 py-2 border rounded" />
                <textarea
                    placeholder="Last Results (comma-separated)"
                    value={newHistoricalData.LastResults.join(", ")}
                    onChange={(e) => setNewHistoricalData({ ...newHistoricalData, LastResults: e.target.value.split(", ") })}
                    className="w-full px-4 py-2 border rounded"
                ></textarea>
            </div>
            <div className="flex justify-end mt-4">
                <button
                    onClick={() => setIsHistoryModalOpen(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 mr-2"
                >
                    Cancel
                </button>
                <button
                    onClick={() => {
                        handleSaveHistoricalData(newTestCase);
                    } }
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Save
                </button>
            </div>
        </div>
    </div>
); 
export default HistoryModal;