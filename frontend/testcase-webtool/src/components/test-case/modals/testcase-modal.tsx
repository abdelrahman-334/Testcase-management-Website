import React from "react";
import User from "../types/user";
import TestCase from "../types/testcase";
import Step from "../types/step";

 
  

interface TestCaseModalProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newTestCase: TestCase;
  setNewTestCase: React.Dispatch<React.SetStateAction<TestCase>>;
  projectUsers: User[];
  isEditMode: boolean;
  handleSaveTestCase: () => void;
  addStep: () => void;
  removeStep: (index: number) => void;
  moveStep: (index: number, direction: "up" | "down") => void;
  updateStepField: (index: number, field: keyof Step, value: string) => void;
}

const TestCaseModal: React.FC<TestCaseModalProps> = ({
  setIsModalOpen,
  newTestCase,
  setNewTestCase,
  projectUsers,
  isEditMode,
  handleSaveTestCase,
  addStep,
  removeStep,
  moveStep,
  updateStepField
}) => {
  return (
    <>
       (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded shadow-lg w-96 p-6">
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? "Edit Test Case" : "Add Test Case"}
            </h2>
            <div className="space-y-4">
              <input
                type="number"
                placeholder="0"
                value={newTestCase.id}
                onChange={(e) =>
                  setNewTestCase({ ...newTestCase, id: Number.parseInt(e.target.value) })
                }
                className="w-full px-4 py-2 border rounded"
              />
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
      )
    </>
  );
};

export default TestCaseModal;
