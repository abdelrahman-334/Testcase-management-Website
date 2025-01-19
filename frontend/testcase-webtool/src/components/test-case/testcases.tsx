"use client";

import React, { useState, useEffect } from "react";

interface Step {
  step_description: string;
  expected_result: string;
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
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-4 text-gray-500">No test cases found.</p>
        )}
      </div>

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
