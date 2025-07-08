import { useState } from "react";
import { Filter, Plus, Trash2, Pencil, X } from "lucide-react";

const tasks = [
  {
    id: 1,
    title: "Draft incorporation documents",
    case: "Davis Incorporation",
    description: "Prepare articles of incorporation and bylaws",
    assignedTo: "John Cooper",
    status: "Completed",
    dueDate: "Dec 1, 2022",
    completedDate: "Nov 25, 2022",
  },
  {
    id: 2,
    title: "Prepare deposition questions",
    case: "Smith vs. Henderson",
    description: "Draft questions for opposing party deposition",
    assignedTo: "Emma Thompson",
    status: "Pending",
    dueDate: "Apr 1, 2023",
    completedDate: null,
  },
  {
    id: 3,
    title: "Site inspection",
    case: "Wilson Property Dispute",
    description: "Visit property to document current boundary markers",
    assignedTo: "Sarah Wilson",
    status: "In Progress",
    dueDate: "Apr 1, 2023",
    completedDate: null,
  },
];

const statusColor = {
  Completed: "text-green-600",
  Pending: "text-yellow-600",
  "In Progress": "text-blue-500",
};

const Tasks = () => {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [selectedUploader, setSelectedUploader] = useState("");

  const toggleFilterModal = () => setShowFilterModal(!showFilterModal);
  const toggleUploadModal = () => setShowUploadModal(!showUploadModal);

  const applyFilters = () => {
    console.log("Filters applied:", selectedType, selectedUploader);
    toggleFilterModal();
  };

  return (
    <div className="min-h-screen p-6 text-black">
      {/* Header without Search */}
      <div className="flex justify-end items-center mb-6 gap-2">
        <button
          className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 text-sm"
          onClick={toggleFilterModal}
        >
          <Filter size={16} />
          Filters
        </button>
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
          onClick={toggleUploadModal}
        >
          <Plus size={16} />
          Add Tasks
        </button>
      </div>

      {/* Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold dark:text-white">Tasks</h2>
        <p className="text-sm text-gray-600">Manage and track all case-related tasks</p>
      </div>

      {/* Task Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white border rounded shadow p-4 relative">
            <div className="absolute top-3 right-4 text-sm font-medium">
              <span className={statusColor[task.status]}>{task.status}</span>
            </div>

            <h3 className="font-semibold text-blue-700 hover:underline cursor-pointer mb-1">
              {task.title}
            </h3>
            <p className="text-sm"><strong>Case:</strong> {task.case}</p>
            <p className="text-sm mb-2">{task.description}</p>
            <p className="text-sm mb-1"><strong>Assigned to:</strong> {task.assignedTo}</p>
            <p className="text-sm mb-1">
              <strong className="text-red-600">Due:</strong> {task.dueDate}
              {task.status !== "Completed" && task.dueDate === "Apr 1, 2023" && (
                <span className="text-red-500 ml-1">(Overdue)</span>
              )}
            </p>
            {task.status === "Completed" && (
              <p className="text-sm mb-2 text-green-600">
                <strong>Completed:</strong> {task.completedDate}
              </p>
            )}

            {/* Actions */}
            <div className="mt-3 flex justify-between items-center">
              {task.status !== "Completed" && (
                <button className="bg-gray-100 text-sm px-3 py-1 rounded text-blue-700">
                  Mark Completed
                </button>
              )}
              <div className="flex gap-2">
                <button className="text-blue-600">
                  <Pencil size={16} />
                </button>
                <button className="text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
            <button
              onClick={toggleFilterModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4">Filter Tasks</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">All Cases</option>
                  <option value="Davis Incorporation">Davis Incorporation</option>
                  <option value="Smith vs. Henderson">Smith vs. Henderson</option>
                  <option value="Wilson Property Dispute">Wilson Property Dispute</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Uploaded By</label>
                <select
                  value={selectedUploader}
                  onChange={(e) => setSelectedUploader(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">All Users</option>
                  <option value="Lawyer">Lawyer</option>
                  <option value="Paralegal">Paralegal</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={applyFilters}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal Placeholder */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow text-black">
            <h3 className="text-lg font-semibold mb-4">Upload Document</h3>
            <p>Upload modal content here.</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
              onClick={toggleUploadModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
