import { useState } from "react";
import {
  Filter,
  Plus,
  Trash2,
  Pencil,
  X,
  UploadCloud,
} from "lucide-react";

const initialTasks = [
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
  const [tasks, setTasks] = useState(initialTasks);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [taskToRemove, setTaskToRemove] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [selectedUploader, setSelectedUploader] = useState("");

  const [newDoc, setNewDoc] = useState({
    title: "",
    case: "",
    description: "",
    assignedTo: "",
    status: "Pending",
    dueDate: "",
    file: null,
  });

  const [editDoc, setEditDoc] = useState({
    id: null,
    title: "",
    case: "",
    description: "",
    assignedTo: "",
    status: "",
    dueDate: "",
    completedDate: "",
  });

  const toggleFilterModal = () => setShowFilterModal(!showFilterModal);
  const toggleUploadModal = () => setShowUploadModal(!showUploadModal);

  const applyFilters = () => {
    console.log("Filters applied:", selectedType, selectedUploader);
    toggleFilterModal();
  };

  const handleUpload = () => {
    if (!newDoc.title || !newDoc.case || !newDoc.description) {
      alert("Please fill all fields.");
      return;
    }

    const newTask = {
      ...newDoc,
      id: tasks.length + 1,
      completedDate: null,
    };

    setTasks([...tasks, newTask]);
    setNewDoc({
      title: "",
      case: "",
      description: "",
      assignedTo: "",
      status: "Pending",
      dueDate: "",
      file: null,
    });
    toggleUploadModal();
  };

  const openEditModal = (task) => {
    setEditDoc(task);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditDoc((prev) => ({ ...prev, [name]: value }));
  };

  const updateTask = () => {
    setTasks((prev) =>
      prev.map((t) => (t.id === editDoc.id ? { ...editDoc } : t))
    );
    setShowEditModal(false);
  };

  return (
    <div className="min-h-screen p-6 text-black">
      {/* Header */}
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
        <p className="text-sm text-gray-600">
          Manage and track all case-related tasks
        </p>
      </div>

      {/* Task Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white border rounded shadow p-4 relative"
          >
            <div className="absolute top-3 right-4 text-sm font-medium">
              <span className={statusColor[task.status]}>{task.status}</span>
            </div>
            <h3 className="font-semibold text-blue-700 mb-1">{task.title}</h3>
            <p className="text-sm">
              <strong>Case:</strong> {task.case}
            </p>
            <p className="text-sm mb-2">{task.description}</p>
            <p className="text-sm mb-1">
              <strong>Assigned to:</strong> {task.assignedTo}
            </p>
            <p className="text-sm mb-1">
              <strong className="text-red-600">Due:</strong> {task.dueDate}
              {task.status !== "Completed" &&
                task.dueDate === "Apr 1, 2023" && (
                  <span className="text-red-500 ml-1">(Overdue)</span>
                )}
            </p>
            {task.status === "Completed" && (
              <p className="text-sm mb-2 text-green-600">
                <strong>Completed:</strong> {task.completedDate}
              </p>
            )}
            <div className="mt-3 flex justify-between items-center">
              {task.status !== "Completed" && (
                <button className="bg-gray-100 text-sm px-3 py-1 rounded text-blue-700">
                  Mark Completed
                </button>
              )}
              <div className="flex gap-2">
                <button
                  className="text-blue-600"
                  onClick={() => openEditModal(task)}
                >
                  <Pencil size={16} />
                </button>
                <button
                  className="text-red-500"
                  onClick={() => {
                    setTaskToRemove(task);
                    setShowRemoveModal(true);
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Remove Modal */}
      {showRemoveModal && taskToRemove && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative text-black">
            <button
              onClick={() => setShowRemoveModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4 text-red-600">Remove Task</h2>
            <p className="mb-6">
              Are you sure you want to Remove{" "}
              <span className="font-semibold">{taskToRemove.title}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRemoveModal(false)}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setTasks(tasks.filter((t) => t.id !== taskToRemove.id));
                  setShowRemoveModal(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

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
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">All Cases</option>
                <option>Davis Incorporation</option>
                <option>Smith vs. Henderson</option>
                <option>Wilson Property Dispute</option>
              </select>
              <select
                value={selectedUploader}
                onChange={(e) => setSelectedUploader(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">All Users</option>
                <option>Lawyer</option>
                <option>Paralegal</option>
                <option>Admin</option>
              </select>
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

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative">
            <button
              onClick={toggleUploadModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <UploadCloud size={20} /> Add New Task
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Task Title"
                value={newDoc.title}
                onChange={(e) =>
                  setNewDoc({ ...newDoc, title: e.target.value })
                }
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
              <input
                type="text"
                placeholder="Case"
                value={newDoc.case}
                onChange={(e) =>
                  setNewDoc({ ...newDoc, case: e.target.value })
                }
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
              <input
                type="text"
                placeholder="Description"
                value={newDoc.description}
                onChange={(e) =>
                  setNewDoc({ ...newDoc, description: e.target.value })
                }
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
              <input
                type="text"
                placeholder="Assigned To"
                value={newDoc.assignedTo}
                onChange={(e) =>
                  setNewDoc({ ...newDoc, assignedTo: e.target.value })
                }
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleUpload}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              Edit Task
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                name="title"
                value={editDoc.title}
                onChange={handleEditChange}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
              <input
                type="text"
                name="case"
                value={editDoc.case}
                onChange={handleEditChange}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
              <input
                type="text"
                name="description"
                value={editDoc.description}
                onChange={handleEditChange}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
              <input
                type="text"
                name="assignedTo"
                value={editDoc.assignedTo}
                onChange={handleEditChange}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
              <select
                name="status"
                value={editDoc.status}
                onChange={handleEditChange}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
              <input
                type="text"
                name="dueDate"
                value={editDoc.dueDate}
                onChange={handleEditChange}
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
              <div className="flex justify-end">
                <button
                  onClick={updateTask}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Update Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
