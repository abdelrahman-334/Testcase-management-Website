import React from "react";
interface TestscriptProps {
    scriptName: string;
    scriptType:string;
    scriptFile:File | null;
    setScriptName: React.Dispatch<React.SetStateAction<string>>;
    setScriptType: React.Dispatch<React.SetStateAction<string>>;
    handleTestscriptFileChange:(e: React.ChangeEvent<HTMLInputElement>) => void;
    handleTestscriptUploadCloseModal: () => void;
    handleTestscriptUpload: () => void;
}
const TestscriptModal: React.FC<TestscriptProps> = ({
    scriptName,
    scriptType,
    handleTestscriptFileChange,
    setScriptName,
    setScriptType,
    handleTestscriptUploadCloseModal,
    handleTestscriptUpload
}) => (
    <div className=" flex fixed bg-black bg-opacity-50 inset-0 z-50 justify-center items-center">
        <div className="bg-white flex-col p-4 w-1/2 border rounded space-y-4">
            <h2 className=" font-bold text-xl">Upload Testscript</h2>
            <div>
            <h4 className="font-bold text-lg">Testscript name</h4>
            <input 
                type="text" 
                value={scriptName} 
                onChange={(e)=> {setScriptName(e.target.value)}}
                className="w-full px-4 py-2 border rounded">
            </input>
            </div>
            <select
            value={scriptType}  // Bind the selected value
            onChange={(e) => setScriptType(e.target.value)}  // Update the state when the user selects an option
            className="w-full px-4 py-2 border rounded bg-slate-400"
            >
              <option value="">Select Script Type</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
            </select>
            <input
            type="file"
            onChange={handleTestscriptFileChange}
            className="mb-4 p-2 border border-gray-300 rounded"
            >
            </input>
            <div className="flex gap-2 flex-none">
                <button className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded" onClick={handleTestscriptUpload}>
                    Upload
                </button>
                <button className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded mx-4" onClick={handleTestscriptUploadCloseModal}>
                    Cancel
                </button>
            </div>
        </div>
    </div>
);

export default TestscriptModal;