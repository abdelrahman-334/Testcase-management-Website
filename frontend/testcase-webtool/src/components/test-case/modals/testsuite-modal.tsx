import React from "react";

interface TestSuiteModalProps {
  onClose: () => void;
  onSave: (suite: { name: string; description: string }) => void;
}

const TestSuiteModal: React.FC<TestSuiteModalProps> = ({ onClose, onSave }) => {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded p-6 w-96">
        <h2 className="text-lg font-bold mb-4">Add Test Suite</h2>
        <input
          type="text"
          placeholder="Suite Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-2"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-2"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ name, description })}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestSuiteModal;
