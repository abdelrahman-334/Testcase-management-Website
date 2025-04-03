"use client";

import React, { useState } from "react";

interface ConfigModalProps {
  projectId: string;
  onClose: () => void;
}

const ConfigModal: React.FC<ConfigModalProps> = ({ projectId, onClose }) => {
  const [timeRatio, setTimeRatio] = useState<string>("0.5");
  const [algorithm, setAlgorithm] = useState<string>("FRRMAB");
  const [policy, setPolicy] = useState<string>("TimeRank");

  const handleSaveConfig = async () => {
    const configRequest = {
      project: projectId,
      config: {
        execution: {
          parallel_pool_size: 10,
          independent_executions: 1,
          verbose: true,
        },
        experiment: {
          scheduled_time_ratio: [parseFloat(timeRatio)],
          datasets_dir: "examples",
          datasets: ["received"],
          experiment_dir: "results/experiments/",
          rewards: ["RNFail", "TimeRank"],
          policies: [policy],
        },
        algorithm: {
          [algorithm.toLowerCase()]: {
            timerank: { c: 0.5 },
            rnfail: { c: 0.3 },
          },
        },
        hcs_configuration: {
          wts_strategy: false,
        },
        contextual_information: {
          config: {
            previous_build: ["Duration", "NumRan", "NumErrors"],
          },
          feature_group: [
            {
              feature_group_name: "time_execution",
              feature_group_values: ["Duration", "NumErrors"],
            },
          ],
        },
      },
    };

    try {
      const response = await fetch(`http://localhost:8000/configure`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(configRequest),
      });

      if (response.ok) {
        console.log("Configuration saved successfully!");
        onClose();
      } else {
        console.error("Failed to save configuration.");
      }
    } catch (error) {
      console.error("Error saving configuration:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded shadow-lg w-96 p-6">
        <h2 className="text-xl font-bold mb-4">Configure Backend Model</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Time Ratio</label>
            <select
              value={timeRatio}
              onChange={(e) => setTimeRatio(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="0">0</option>
              <option value="0.5">0.5</option>
              <option value="0.8">0.8</option>
              <option value="1">1</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Algorithm</label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="Random">Random</option>
              <option value="Greedy">Greedy</option>
              <option value="EpsilonGreedy">EpsilonGreedy</option>
              <option value="UCB">UCB</option>
              <option value="FRRMAB">FRRMAB</option>
              <option value="LinUCB">LinUCB</option>
              <option value="SWLinUCB">SWLinUCB</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Policy</label>
            <select
              value={policy}
              onChange={(e) => setPolicy(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="RNFail">RNFail</option>
              <option value="TimeRank">TimeRank</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveConfig}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigModal;
