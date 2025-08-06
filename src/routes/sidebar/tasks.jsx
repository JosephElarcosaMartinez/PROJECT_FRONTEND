import { useState } from "react";
import { Filter, Plus, Trash2, Pencil, X, UploadCloud, Paperclip, } from "lucide-react";

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
    attachment: null,
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
    attachment: null,
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
    attachment: null,
  },
  {
    id: 4,
    title: "Contract Review",
    case: "Anderson vs. Global Corp",
    description: "Review the contractual obligations",
    assignedTo: "Michael Brown",
    status: "Pending",
    dueDate: "May 5, 2023",
    completedDate: null,
    attachment: null,
  },
  {
    id: 5,
    title: "Witness Interview",
    case: "Lopez vs. Metro Bank",
    description: "Interview main witnesses for testimony",
    assignedTo: "Sarah Wilson",
    status: "In Progress",
    dueDate: "May 10, 2023",
    completedDate: null,
    attachment: null,
  },
  {
    id: 6,
    title: "File Court Motion",
    case: "Davis Incorporation",
    description: "File motion for summary judgment",
    assignedTo: "Emma Thompson",
    status: "Completed",
    dueDate: "May 15, 2023",
    completedDate: "May 12, 2023",
    attachment: null,
  },
  {
    id: 7,
    title: "Research Case Law",
    case: "Smith vs. Henderson",
    description: "Research precedents relevant to case",
    assignedTo: "John Cooper",
    status: "Pending",
    dueDate: "May 20, 2023",
    completedDate: null,
    attachment: null,
  },
];

const statusColor = {
  Completed: "text-green-600",
  Pending: "text-yellow-600",
  "In Progress": "text-blue-500",
};

export default function Tasks() {
  const [tasks, setTasks] = useState(initialTasks);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(tasks.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTasks = tasks.slice(indexOfFirstItem, indexOfLastItem);

  const handleFileChange = (e, taskId) => {
    const file = e.target.files[0];
    if (file) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, attachment: file } : t))
      );
    }
  };

  return (
    <div className="space-y-6 min-h-screen text-black dark:text-white">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
          Tasks
        </h2>
        <p className="text-sm text-gray-500">
          Manage and track all case-related tasks
        </p>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-4 rounded-lg shadow-lg relative"
          >
            <div className="absolute top-3 right-4 text-sm font-medium">
              <span className={statusColor[task.status]}>{task.status}</span>
            </div>

            <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-1">
              {task.title}
            </h3>
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

            {/* Attach File */}
            <div className="mt-4 flex justify-end">
              <div className="text-right">
                <label className="inline-flex items-center gap-2 cursor-pointer text-blue-600 hover:underline text-sm">
                  <Paperclip size={16} />
                  {task.attachment ? "Change File" : "Attach File"}
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, task.id)}
                  />
                </label>
                {task.attachment && (
                  <p className="text-xs text-gray-600 mt-1 truncate w-48 text-right">
                    {task.attachment.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-1 mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 border rounded ${currentPage === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700"
            }`}
        >
          &lt;
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${currentPage === i + 1
              ? "bg-blue-600 text-white"
              : "bg-white hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700"
              }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 border rounded ${currentPage === totalPages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700"
            }`}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
