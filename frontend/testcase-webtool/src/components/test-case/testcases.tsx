"use client";

import React, { useState, useEffect } from "react";
import { Progress } from "../ui/progress";
import TestCaseModal from "./modals/testcase-modal";
import HistoryModal from "./modals/history-modal";
import TestscriptModal from "./modals/testscript-modal";
import TestSuiteModal from "./modals/testsuite-modal";
import AddTestcaseToSuiteModal from "./modals/addTestcaseToSuite-modal";

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
  testSuite?: string; // Optional field for test suite association
}

interface User {
  email: string;
  _id: string;
  username: string;
}

interface TestCasesPageProps {
  projectId: string;
}
interface TestSuite {
  _id?: string;
  id: number;
  name: string;
  description: string;
  project: string;
}


const TestCasesPage: React.FC<TestCasesPageProps> = ({ projectId }) => {
 
  /* test scripts states*/
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [openSuites, setOpenSuites] = useState<{ [suiteId: string]: boolean }>({});
  const [isSuiteModalOpen, setIsSuiteModalOpen] = useState(false);
  const [scriptName,setScriptName] = useState("");
  const [scriptType,setScriptType] = useState("");
  const [scriptFile,setscriptFile] = useState<File | null>(null);
  const [isTestscriptUploadModalOpen,setIsTestscriptUploadModalOpen] = useState(false);
  const [currentTestcaseId,setCurrentTestcaseId] = useState<string |null>(null);
  /*test case states*/
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddToSuiteModalOpen,setIsAddToSuiteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false); // State to control modal visibility
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

  /*History states*/
  const [historyFile, setHistoryFile] = useState<File | null>(null); // State to store the selected file
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

  const [currentTestcase,setCurrentTestcase] = useState<string>("");
  const [currentTestsuite,setCurrentTestsuite] = useState<string>("");


  const handleSaveTestSuite = async (data: { name: string; description: string }) => {
    try {
      const response = await fetch(`http://localhost:4000/api/projects/${projectId}/suites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...data, id: Date.now(), status: "active" }),
      });
  
      if (response.ok) {
        const newSuite = await response.json();
        setTestSuites((prev) => [...prev, newSuite]);
        setIsSuiteModalOpen(false);
      } else {
        console.error("Failed to create test suite");
      }
    } catch (err) {
      console.error("Error saving test suite", err);
    }
  };
  
    
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setHistoryFile(e.target.files[0]); // Set the selected file to state
    }
  };
  const handleTestscriptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setscriptFile(e.target.files[0]); // Set the selected file to state
    }
  };
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
    const fetchTestSuites = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/projects/${projectId}/suites`, {
          credentials: "include",
        });
        const data = await response.json();
    
        if (Array.isArray(data)) {
          setTestSuites(data);
        } else if (data && Array.isArray(data.testSuites)) {
          setTestSuites(data.testSuites);
        } else {
          console.error("Unexpected format for test suites:", data);
          setTestSuites([]);
        }
      } catch (error) {
        console.error("Failed to fetch test suites:", error);
        setTestSuites([]);
      }
    };
    
    fetchTestSuites();
    fetchTestCases();
    fetchProjectUsers();
  }, [testCases]);


  const toggleSuite = (suiteId: string) => {
    setOpenSuites((prev) => ({
      ...prev,
      [suiteId]: !prev[suiteId],
    }));
  };
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


  const handleAddTestcaseToSuiteOpenModal = () => {
    setIsAddToSuiteModalOpen(true);
  }
  const handleAddTestcaseToSuiteCloseModal = () => {
    setIsAddToSuiteModalOpen(false);
  }
  const handleRunExecution = async () => {
    try {
      setIsLoading(true);
      setProgress(0);
      const progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress < 100) {
            return prevProgress + 10; // Increment progress by 10%
          }
          return prevProgress;
        });
      }, 500);
      const response = await fetch("http://localhost:4000/api/testExecution/execute-tests", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({projectId:projectId}),
      });
    
      if (response.ok) {
        console.log("Execution started successfully");
      } else {
        console.error("Failed to start execution");
      }
    } catch (error) {
      console.error("Error starting execution:", error);
    }
  finally{
    setProgress(100);
    setIsLoading(false);
  }
}
  const handleAddTestcaseToSuite = async (_id: string,testcase:string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/suites/${_id}/testcases`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({testCaseId:testcase}),
      });

      if (response.ok) {
        
      } else {
        console.error("Failed to add test case to suite");
      }
    } catch (error) {
      console.error("Error add testcase to suite:", error);
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
    setIsLoading(true);
    setProgress(0);
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

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress < 100) {
            return prevProgress + 10; // Increment progress by 10%
          }
          return prevProgress;
        });
      }, 500);
      const response = await fetch(`http://localhost:8000/configure`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
      });
  
      if (response.ok) {
        const { prioritizationOrder } = await response.json();
        console.log(prioritizationOrder)
        setTestCases((prev) =>
          [...prev].sort((a, b) => 
            
            prioritizationOrder.indexOf(a.id) - prioritizationOrder.indexOf(b.id)
          )
        );
        console.log(testCases)
        setIsConfigModalOpen(false);
      } else {
        console.error("Failed to configure model");
      }
    } catch (error) {
      console.error("Error configuring model:", error);
    }
    finally{
    setProgress(100);
    setIsLoading(false);
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
  const handleFileUpload = async () => {
    if (!historyFile) {
      alert("Please select a file to upload.");
      return;
    }
    const formData = new FormData();
    formData.append("file", historyFile);
  
    try {
      const response = await fetch(
        `http://localhost:4000/projects/${projectId}/test-cases/add-batch`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );
  
      if (response.ok) {
         await response.json();
        alert("Batch historical data uploaded");
        setIsUploadModalOpen(false);
        // Optionally, update your UI or test cases after upload
      } else {
        console.error("Failed to upload batch historical data.");
      }
    } catch (error) {
      console.error("Error during file upload:", error);
    }
  };
  const handleTestscriptUploadOpenModal =  (testcaseId: string) => {
    setCurrentTestcaseId(testcaseId);
    setIsTestscriptUploadModalOpen(true);
  };
  const handleTestscriptUploadCloseModal =  () => {
    setIsTestscriptUploadModalOpen(false);
  };
  const handleTestscriptUpload = async () => {
      if(!scriptFile ){
        alert("no testscript provided");
        return;
      }
      if(!currentTestcaseId){
        alert("chosen test case doesn't exist");
        return;
      }

      const formdata = new FormData();
      formdata.append("scriptContent",scriptFile);
      formdata.append("scriptName",scriptName);
      formdata.append("scriptType",scriptType);
      formdata.append("testcaseId",currentTestcaseId.toString());
      console.log(formdata);
      try {
        const response = await fetch("http://localhost:4000/api/testscripts/upload",
          {
          method: "POST",
          body: formdata,
          credentials: "include",
        });
        if(response.ok){
          await response.json();
        }
        else{
          console.error("failed to upload data");
        }
      }
      catch(error){
        console.error("An error happened during file upload",error)

      }
  };
  const handleUploadOpenModal = () => {
    setIsUploadModalOpen(true); // Open the modal
  };
  const handleUploadCloseModal = () => {
    setIsUploadModalOpen(false); // Close the modal
  };

  return (
    <div className="container mx-auto py-10">
     

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Test Cases</h1>
        <div className="flex gap-2 flex-none">
                <button
          onClick={handleUploadOpenModal}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Upload Data
        </button>

        <button
            onClick={() => setIsConfigModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 "
          >
            Configure Model
          </button>

        <button
          onClick={() => {
            setIsModalOpen(true);
            resetNewTestCase();
          }}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 "
        >
          + Add Test Case
        </button>
        <button
          onClick={() => setIsSuiteModalOpen(true)}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          + Add Test Suite
        </button>
        <button
          onClick={handleRunExecution}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Run execution
        </button>
        <button
          onClick={() => {
            handleNextCycle()
          }}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 "
        >
          Next Cycle
        </button>

        <button
          onClick={() => {
            handleNextBuild()
          }}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 "
        >
          Next Build
        </button>
        </div>
      </div>
      {/* display test cases*/}
      <div className="bg-white rounded shadow-md overflow-hidden border-2 w-full">
  {[...testSuites, { _id: "unsorted", name: "Unsorted", id: 9999, description: "", project: ""}].map((suite) => {
    const suiteCases = testCases.filter(tc => (tc.testSuite || "unsorted") === suite._id);

    return (
      <div key={suite._id} className="border-b p-4">
        <div className="flex justify-between items-center">
          <h2
            className="text-lg font-semibold cursor-pointer"
            onClick={() => toggleSuite(suite._id!)}
          >
            {suite.name}
          </h2>
          <button
            onClick={() => {
              setCurrentTestsuite(suite._id!);
              handleAddTestcaseToSuiteOpenModal();
            }}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
          >
            + Add Test Case
          </button>
        </div>

        {openSuites[suite._id!] && (
          <ul className="mt-2 space-y-2">
            {suiteCases.map((testCase) => (
              <li key={testCase._id} className="p-4 border bg-gray-50 rounded">
                <div>
                  <p className="font-bold">{testCase.name}</p>
                  <p className="text-sm text-gray-500">Priority: {testCase.priority}</p>
                  <p className="text-sm text-gray-500">Status: {testCase.status}</p>
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
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
                    onClick={() => {
                      setNewTestCase(testCase);
                      setIsHistoryModalOpen(true);
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Add Historical Data
                  </button>
                  <button
                    onClick={() => handleTestscriptUploadOpenModal(testCase._id!)}
                    className="bg-sky-500 text-white px-3 py-2 rounded hover:bg-sky-600"
                  >
                    Upload Test Script
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  })}
</div>
{isLoading && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-md text-center">
      <div className="flex justify-center mb-4">
        <svg
          className="animate-spin h-6 w-6 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </div>
      <p className="text-lg font-semibold mb-2">Running Test Execution...</p>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-sm text-gray-500 mt-2">{progress}%</p>
    </div>
  </div>
)}


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
             {/* Render a progress bar if the model is running */}
            {isLoading ? (
              <>
              <Progress value={progress} max={100} className="h-2 mb-4" />
            <p>Processing...</p>
            </>
            ) : (
            <button
              onClick={handleConfigSave}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save
            </button>
            )}
          </div>
        </div>
      </div>
    )}
    {/*history modal*/}
        { isHistoryModalOpen && (<HistoryModal 
        newHistoricalData={newHistoricalData}
        setIsHistoryModalOpen={setIsHistoryModalOpen}
        setNewHistoricalData={setNewHistoricalData}
        handleSaveHistoricalData={handleSaveHistoricalData}
        newTestCase={newTestCase}
        />)} {/*
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded shadow-lg w-1/2 p-6">
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
    )} */}
          {/*upload */}
          {isUploadModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-lg font-semibold mb-4">Upload Batch Data</h2>
          
          {/* File Input */}
          <input
            type="file"
            onChange={handleFileChange}
            accept=".json, .csv"
            className="mb-4 p-2 border border-gray-300 rounded"
          />

          {/* Upload Button */}
          <button
            onClick={handleFileUpload}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
          >
            Upload Data
          </button>
          
          {/* Close Modal Button */}
          <button
            onClick={handleUploadCloseModal}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    )}
      {/* Modal */}
      { isModalOpen && (<TestCaseModal
        setIsModalOpen={setIsModalOpen}
        newTestCase={newTestCase}
        setNewTestCase={setNewTestCase}
        projectUsers={projectUsers}
        isEditMode={isEditMode}
        handleSaveTestCase={handleSaveTestCase}
        addStep={addStep}
        removeStep={removeStep}
        moveStep={moveStep}
        updateStepField={updateStepField}
      />)}
      {/*TestScript modal*/}
      {isTestscriptUploadModalOpen && 
      (
      <TestscriptModal 
      scriptName={scriptName} 
      scriptType={scriptType} 
      scriptFile={scriptFile}
      setScriptName={setScriptName}
      setScriptType={setScriptType}
      handleTestscriptFileChange={handleTestscriptFileChange}
      handleTestscriptUploadCloseModal={handleTestscriptUploadCloseModal}
      handleTestscriptUpload={handleTestscriptUpload}
      />)}
      
      {/*add  testcase to suite modal*/ }
      {isAddToSuiteModalOpen && 
      (
      <AddTestcaseToSuiteModal 
      Testsuite={currentTestsuite}
      testcases={testCases}
      currentTestcase={currentTestcase}
      setCurrentTestcase={setCurrentTestcase}
      handleAddTestcaseToSuite={handleAddTestcaseToSuite}
      handleAddTestcaseToSuiteCloseModal={handleAddTestcaseToSuiteCloseModal}
      />)}
      



      {/* Test Suite Modal */}
      {isSuiteModalOpen && (
      <TestSuiteModal
      onClose={() => setIsSuiteModalOpen(false)}
      onSave={handleSaveTestSuite}
      />
      )}
      {/*
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
                onChange={(e) => setNewTestCase({ ...newTestCase, id: Number.parseInt(e.target.value) })}
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

              {}
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
      )} */}
    </div>
  );
};

export default TestCasesPage;
