"use client";

import React, { useState, useEffect } from "react";

interface Step {
  step_description: string;
  expected_result: string;
}

interface HistoricalData {
    testcase: string, // ObjectId from the test case
    project: string, // Use the project ID
    Id: number,
    Name: string,
    BuildId: number,
    Duration: number,
    CalcPrio: number,
    LastRun: string,
    NumRan: number,
    Verdict: number,
    Cycle: number,
    LastResults: string[],
}

interface TestCase {
  _id?: string; // MongoDB _id field
  id: number;
  name: string;
  priority: number;
  description: string;
  assignedTo: string; // User ID
  status: string;
  preconditions: string;
  steps: Step[];
}

interface User {
  email: string;
  _id: string;
  username: string;
}

interface TestCasesPageProps {
  projectId: string;
}

const TestCasesPage: React.FC<TestCasesPageProps> = ({ projectId }) => {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [config, setConfig] = useState({
    timeRatio: 0.5,
    algorithm: "Random",
    policy: "RNFail",
  });
  const [newTestCase, setNewTestCase] = useState<TestCase>({
    id: 0,
    name: "",
    priority: 0,
    description: "",
    assignedTo: "",
    status: "not tested",
    preconditions: "",
    steps: [],
  });
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [newHistoricalData, setNewHistoricalData] = useState<HistoricalData>({
    testcase: "", // ObjectId from the test case
    project: projectId, // Use the project ID
    Id: 0,
    Name: "",
    BuildId: 0,
    Duration: 0,
    CalcPrio: 0,
    LastRun: "",
    NumRan: 0,
    Verdict: 0,
    Cycle: 0,
    LastResults: [],
  });
  const [projectUsers, setProjectUsers] = useState<User[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [prioritizationOrder,setPrioritizationOrder] = useState<string[]>([]);
  useEffect(() => {
    const fetchTestCases = async () => {
      try {
        const response = await fetch(`http://localhost:4000/projects/${projectId}/test-cases/`, {
          credentials: "include",
        });
        const data = await response.json();
        setTestCases(data);
      } catch (error) {
        console.error("Failed to fetch test cases:", error);
      }
    };

    const fetchProjectUsers = async () => {
      try {
        const response = await fetch(`http://localhost:4000/projects/${projectId}/get-users`, {
          credentials: "include",
        });
        const data = await response.json();
        setProjectUsers(data);
      } catch (error) {
        console.error("Failed to fetch project users:", error);
      }
    };

    fetchTestCases();
    fetchProjectUsers();
  }, [projectId]);
  const handleSaveHistoricalData = async (testcase: TestCase) => {
    try {
      console.log(newHistoricalData

      )
      const response = await fetch(`http://localhost:4000/projects/${projectId}/test-cases/${testcase._id}/history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newHistoricalData),
      });
  
      if (response.ok) {
        const savedData = await response.json();
        console.log("Historical Data Saved:", savedData);
        setIsHistoryModalOpen(false);
      } else {
        console.error("Failed to save historical data");
      }
    } catch (error) {
      console.error("Error saving historical data:", error);
    }
  };
  
  // Handle adding or editing a test case
  const handleSaveTestCase = async () => {
    try {
      const method = isEditMode ? "PUT" : "POST";
      const endpoint = isEditMode
        ? `http://localhost:4000/projects/${projectId}/test-cases/${newTestCase._id}`
        : `http://localhost:4000/projects/${projectId}/test-cases/`;

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newTestCase),
      });

      if (response.ok) {
        const updatedTestCase = await response.json();
        setTestCases((prev) => {
          if (isEditMode) {
            return prev.map((testCase) =>
              testCase._id === updatedTestCase._id ? updatedTestCase : testCase
            );
          }
          return [...prev, updatedTestCase];
        });
        setIsModalOpen(false);
        resetNewTestCase();
      } else {
        console.error("Failed to save test case");
      }
    } catch (error) {
      console.error("Error saving test case:", error);
    }
  };

  const resetNewTestCase = () => {
    setNewTestCase({
      id: 0,
      name: "",
      priority: 0,
      description: "",
      assignedTo: "",
      status: "not tested",
      preconditions: "",
      steps: [],
    });
    setIsEditMode(false);
  };

  const handleDeleteTestCase = async (_id: string) => {
    try {
      const response = await fetch(`http://localhost:4000/projects/${projectId}/test-cases/${_id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setTestCases((prev) => prev.filter((testCase) => testCase._id !== _id));
      } else {
        console.error("Failed to delete test case");
      }
    } catch (error) {
      console.error("Error deleting test case:", error);
    }
  };
  
  const handleNextCycle = async () => {
    try {
      const response = await fetch(`http://localhost:4000/projects/${projectId}/increment-cycle}`, {
        method: "PUT",
        credentials: "include",
      });

      if (response.ok) {
      } else {
        console.error("Failed to increase cycle");
      }
    } catch (error) {
      console.error("Error incrementing cycle:", error);
    }
  }

  const handleConfigSave = async () => {
    try {
      const requestPayload = {
        project: projectId,
        config: {
          execution: {
            parallel_pool_size: 10,
            independent_executions: 1,
            verbose: true,
          },
          experiment: {
            scheduled_time_ratio: [config.timeRatio],
            datasets_dir: "examples",
            datasets: ["received"],
            experiment_dir: "results/experiments/",
            rewards: [config.policy],
            policies: [config.algorithm],
          },
          algorithm: {
            frrmab: { window_sizes: [100], timerank: { c: 0.5 }, rnfail: { c: 0.3 } },
            ucb: { timerank: { c: 0.5 }, rnfail: { c: 0.3 } },
            epsilongreedy: { timerank: { epsilon: 0.5 }, rnfail: { epsilon: 0.3 } },
            linucb: { timerank: { alpha: 0.5 }, rnfail: { alpha: 0.5 } },
            swlinucb: { window_sizes: [100], timerank: { alpha: 0.5 }, rnfail: { alpha: 0.5 } },
          },
          hcs_configuration: { wts_strategy: false },
          contextual_information: {
            config: { previous_build: ["Duration", "NumRan", "NumErrors"] },
            feature_group: [
              { feature_group_name: "time_execution", feature_group_values: ["Duration", "NumErrors"] },
            ],
          },
        },
      };
  
      const response = await fetch(`http://localhost:8000//configure`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(requestPayload),
      });
  
      if (response.ok) {
        const { prioritizationOrder } = await response.json();
        setTestCases((prev) =>
          [...prev].sort((a, b) =>
            prioritizationOrder.indexOf(a.id) - prioritizationOrder.indexOf(b.id)
          )
        );
        setIsConfigModalOpen(false);
      } else {
        console.error("Failed to configure model");
      }
    } catch (error) {
      console.error("Error configuring model:", error);
    }
  };
  const handleNextBuild =  async () => {
    try {
      const response = await fetch(`http://localhost:4000/projects/${projectId}/increment-build}`, {
        method: "PUT",
        credentials: "include",
      });

      if (response.ok) {
      } else {
        console.error("Failed to increase build");
      }
    } catch (error) {
      console.error("Error incrementing build:", error);
    }
  }

  const openEditTestCase = (testCase: TestCase) => {
    setNewTestCase(testCase);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  // Step Management
  const addStep = () => {
    setNewTestCase((prev) => ({
      ...prev,
      steps: [...prev.steps, { step_description: "", expected_result: "" }],
    }));
  };

  const removeStep = (index: number) => {
    setNewTestCase((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }));
  };

  const moveStep = (index: number, direction: "up" | "down") => {
    setNewTestCase((prev) => {
      const steps = [...prev.steps];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= steps.length) return prev;

      // Swap steps
      [steps[index], steps[targetIndex]] = [steps[targetIndex], steps[index]];
      return { ...prev, steps };
    });
  };

  const updateStepField = (index: number, field: keyof Step, value: string) => {
    setNewTestCase((prev) => {
      const steps = [...prev.steps];
      steps[index][field] = value;
      return { ...prev, steps };
    });
  };

  

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Test Cases</h1>
        <div>
        <button
            onClick={() => setIsConfigModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mx-3"
          >
            Configure Model
          </button>
        <button
          onClick={() => {
            setIsModalOpen(true);
            resetNewTestCase();
          }}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-3"
        >
          + Add Test Case
        </button>
        <button
          onClick={() => {
            handleNextCycle()
          }}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-3"
        >
          Next Cycle
        </button>

        <button
          onClick={() => {
            handleNextBuild()
          }}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-3"
        >
          Next Build
        </button>
        </div>
      </div>

      <div className="bg-white rounded shadow-md overflow-hidden">
        {testCases.length > 0 ? (
          <ul>
            {testCases.map((testCase) => (
              <li key={testCase._id} className="p-4 border-b">
                <div>
                  <p className="font-bold">{testCase.name}</p>
                  <p className="text-sm text-gray-500">Priority: {testCase.priority}</p>
                  <p className="text-sm text-gray-500">Status: {testCase.status}</p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => openEditTestCase(testCase)}
                    className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTestCase(testCase._id!)}
                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                  <button
                    onClick={
                      
                      () => {
                        setNewTestCase(testCase)
                        setIsHistoryModalOpen(true)
                      }

                    }
                    className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 mx-3"
                    >
                    Add Historical Data
                    </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-4 text-gray-500">No test cases found.</p>
        )}
      </div>
        {/* Config Modal */}
            {isConfigModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded shadow-lg w-96 p-6">
          <h2 className="text-xl font-bold mb-4">Configure Model</h2>
          <div className="space-y-4">
            <label>
              Time Ratio
              <select
                value={config.timeRatio}
                onChange={(e) => setConfig({ ...config, timeRatio: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border rounded"
              >
                <option value={0}>0</option>
                <option value={0.5}>0.5</option>
                <option value={0.8}>0.8</option>
                <option value={1}>1</option>
              </select>
            </label>
            <label>
              Algorithm
              <select
                value={config.algorithm}
                onChange={(e) => setConfig({ ...config, algorithm: e.target.value })}
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
            </label>
            <label>
              Policy
              <select
                value={config.policy}
                onChange={(e) => setConfig({ ...config, policy: e.target.value })}
                className="w-full px-4 py-2 border rounded"
              >
                <option value="RNFail">RNFail</option>
                <option value="TimeRank">TimeRank</option>
              </select>
            </label>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setIsConfigModalOpen(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleConfigSave}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )}
    {/*history modal*/}
        {isHistoryModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded shadow-lg w-96 p-6">
          <h2 className="text-xl font-bold mb-4">Add Historical Data</h2>
          <div className="space-y-4">
            <input
              type="number"
              placeholder="Test Case ID"
              value={newHistoricalData.Id}
              onChange={(e) => setNewHistoricalData({ ...newHistoricalData, Id: Number(e.target.value) })}
              className="w-full px-4 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="Name"
              value={newHistoricalData.Name}
              onChange={(e) => setNewHistoricalData({ ...newHistoricalData, Name: e.target.value })}
              className="w-full px-4 py-2 border rounded"
            />
            <input
              type="number"
              placeholder="Build ID"
              value={newHistoricalData.BuildId}
              onChange={(e) => setNewHistoricalData({ ...newHistoricalData, BuildId: Number(e.target.value) })}
              className="w-full px-4 py-2 border rounded"
            />
            <input
              type="number"
              placeholder="Duration"
              value={newHistoricalData.Duration}
              onChange={(e) => setNewHistoricalData({ ...newHistoricalData, Duration: Number(e.target.value) })}
              className="w-full px-4 py-2 border rounded"
            />
            <input
              type="number"
              placeholder="CalcPrio"
              value={newHistoricalData.CalcPrio}
              onChange={(e) => setNewHistoricalData({ ...newHistoricalData, CalcPrio: Number(e.target.value) })}
              className="w-full px-4 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="Last Run Date"
              value={newHistoricalData.LastRun}
              onChange={(e) => setNewHistoricalData({ ...newHistoricalData, LastRun: e.target.value })}
              className="w-full px-4 py-2 border rounded"
            />
            <input
              type="number"
              placeholder="NumRan"
              value={newHistoricalData.NumRan}
              onChange={(e) => setNewHistoricalData({ ...newHistoricalData, NumRan: Number(e.target.value) })}
              className="w-full px-4 py-2 border rounded"
            />
            <input
              type="number"
              placeholder="Verdict"
              value={newHistoricalData.Verdict}
              onChange={(e) => setNewHistoricalData({ ...newHistoricalData, Verdict: Number(e.target.value) })}
              className="w-full px-4 py-2 border rounded"
            />
            <input
              type="number"
              placeholder="Cycle"
              value={newHistoricalData.Cycle}
              onChange={(e) => setNewHistoricalData({ ...newHistoricalData, Cycle: Number(e.target.value) })}
              className="w-full px-4 py-2 border rounded"
            />
            <textarea
              placeholder="Last Results (comma-separated)"
              value={newHistoricalData.LastResults.join(", ")}
              onChange={(e) =>
                setNewHistoricalData({ ...newHistoricalData, LastResults: e.target.value.split(", ") })
              }
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
                handleSaveHistoricalData(newTestCase)
              }}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded shadow-lg w-96 p-6">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? "Edit Test Case" : "Add Test Case"}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={newTestCase.name}
                onChange={(e) => setNewTestCase({ ...newTestCase, name: e.target.value })}
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="number"
                placeholder="Priority"
                value={newTestCase.priority}
                onChange={(e) => setNewTestCase({ ...newTestCase, priority: Number(e.target.value) })}
                className="w-full px-4 py-2 border rounded"
              />
              <textarea
                placeholder="Description"
                value={newTestCase.description}
                onChange={(e) =>
                  setNewTestCase({ ...newTestCase, description: e.target.value })
                }
                className="w-full px-4 py-2 border rounded"
              ></textarea>
              <select
                value={newTestCase.assignedTo}
                onChange={(e) => setNewTestCase({ ...newTestCase, assignedTo: e.target.value })}
                className="w-full px-4 py-2 border rounded"
                >
                <option value="">Assign To</option>
                {projectUsers.map((user) => (
                  <option key={user._id} value={user._id}>                    
                    {user.email}
                  </option>
                ))}
              </select>
              <textarea
                placeholder="Preconditions"
                value={newTestCase.preconditions}
                onChange={(e) =>
                  setNewTestCase({ ...newTestCase, preconditions: e.target.value })
                }
                className="w-full px-4 py-2 border rounded"
              ></textarea>

              {/* Steps */}
              <div>
                <h3 className="text-lg font-bold mb-2">Steps</h3>
                <div className="max-h-64 overflow-y-auto border rounded p-2 bg-gray-50">
                  {newTestCase.steps.map((step, index) => (
                    <div key={index} className="mb-4">
                      <input
                        type="text"
                        placeholder="Step Description"
                        value={step.step_description}
                        onChange={(e) =>
                          updateStepField(index, "step_description", e.target.value)
                        }
                        className="w-full px-4 py-2 border rounded mb-2"
                      />
                      <input
                        type="text"
                        placeholder="Expected Result"
                        value={step.expected_result}
                        onChange={(e) =>
                          updateStepField(index, "expected_result", e.target.value)
                        }
                        className="w-full px-4 py-2 border rounded mb-2"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => moveStep(index, "up")}
                          className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                        >
                          Up
                        </button>
                        <button
                          onClick={() => moveStep(index, "down")}
                          className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                        >
                          Down
                        </button>
                        <button
                          onClick={() => removeStep(index)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addStep}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
                >
                  + Add Step
                </button>
              </div>

            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTestCase}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestCasesPage;
