"use client";

import TestCase from "../types/testcase";

interface addTestcaseToSuiteModalProps {
    Testsuite: string;
    currentTestcase: string;
    setCurrentTestcase: React.Dispatch<React.SetStateAction<string>>;
    testcases: TestCase[];
    handleAddTestcaseToSuite: (_id: string,testcase:string) =>  void;
    handleAddTestcaseToSuiteCloseModal: () => void;
}


const AddTestcaseToSuiteModal: React.FC<addTestcaseToSuiteModalProps> = ({
    Testsuite,
    currentTestcase,
    setCurrentTestcase,
    testcases,
    handleAddTestcaseToSuite,
    handleAddTestcaseToSuiteCloseModal
     }) => {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded shadow-lg w-96 p-6">
                <h1 className="text-2xl font-bold mb-4">Add Test Case to Suite</h1>
                 <select
                value={currentTestcase}
                onChange={(e) => setCurrentTestcase(e.target.value)}
                className="w-full px-4 py-2 border rounded"
              >
                <option value="">Add Testcase</option>
                {testcases.map((testcase) => (
                  <option key={testcase._id} value={testcase._id}>
                    {testcase.name}
                  </option>
                ))}
              </select>
                <div className="flex justify-end mt-4">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={()=>{handleAddTestcaseToSuite(Testsuite,currentTestcase)}}>
                        Add Test Case
                    </button>
                    <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 ml-2" onClick={handleAddTestcaseToSuiteCloseModal}>
                        Cancel
                    </button>
                </div>
                </div>
            </div>
        )

}

export default AddTestcaseToSuiteModal;