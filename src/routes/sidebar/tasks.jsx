import { useState, useEffect, useMemo } from "react";
import { Paperclip } from "lucide-react";

// Constants
const ITEMS_PER_PAGE = 6;
const PRIORITY_TABS = ["All", "High", "Mid", "Low"];

const rawTasks = [
  {
    id: 1,
    title: "Draft incorporation documents",
    case: "Davis Incorporation",
    description: "Prepare articles of incorporation and bylaws",
    assignedTo: "John Cooper",
    dueDate: "Dec 1, 2025",
    completedDate: "Nov 25, 2022",
    attachment: null,
  },
  {
    id: 2,
    title: "Prepare deposition questions",
    case: "Smith vs. Henderson",
    description: "Draft questions for opposing party deposition",
    assignedTo: "Emma Thompson",
    dueDate: "Aug 8, 2025",
    completedDate: null,
    attachment: null,
  },
  {
    id: 3,
    title: "Site inspection",
    case: "Wilson Property Dispute",
    description: "Visit property to document current boundary markers",
    assignedTo: "Sarah Wilson",
    dueDate: "Aug 12, 2025",
    completedDate: null,
    attachment: null,
  },
  {
    id: 4,
    title: "Contract Review",
    case: "Anderson vs. Global Corp",
    description: "Review the contractual obligations",
    assignedTo: "Michael Brown",
    dueDate: "Aug 14, 2025",
    completedDate: null,
    attachment: null,
  },
  {
    id: 5,
    title: "Witness Interview",
    case: "Lopez vs. Metro Bank",
    description: "Interview main witnesses for testimony",
    assignedTo: "Sarah Wilson",
    dueDate: "Aug 20, 2025",
    completedDate: null,
    attachment: null,
  },
  {
    id: 6,
    title: "File Court Motion",
    case: "Davis Incorporation",
    description: "File motion for summary judgment",
    assignedTo: "Emma Thompson",
    dueDate: "Aug 5, 2025",
    completedDate: "Aug 4, 2025",
    attachment: null,
  },
  {
    id: 7,
    title: "Research Case Law",
    case: "Smith vs. Henderson",
    description: "Research precedents relevant to case",
    assignedTo: "John Cooper",
    dueDate: "Aug 15, 2025",
    completedDate: null,
    attachment: null,
  },
];

// Helpers
const getDaysRemaining = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getPriorityFromDueDate = (dueDate) => {
  const daysLeft = getDaysRemaining(dueDate);
  if (daysLeft <= 2) return "High";
  if (daysLeft <= 5) return "Mid";
  return "Low";
};

const priorityColor = {
  High: "text-red-500",
  Mid: "text-yellow-600",
  Low: "text-gray-700",
};

// Tab Color Logic
const getTabColor = (tab, isActive) => {
  const base = "px-12 py-2 rounded-full font-medium text-sm border";
  if (!isActive) {
    return `${base} bg-gray-200 text-gray-700 hover:bg-gray-300`;
  }

  switch (tab) {
    case "High":
      return `${base} bg-red-600 text-white`;
    case "Mid":
      return `${base} bg-yellow-500 text-white`;
    case "Low":
      return `${base} bg-gray-500 text-white"`;
    default:
      return `${base} bg-blue-500 text-white`;
  }
};

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Initialize tasks with computed fields
  useEffect(() => {
    const processed = rawTasks.map((task) => ({
      ...task,
      priority: getPriorityFromDueDate(task.dueDate),
    }));
    setTasks(processed);
  }, []);

  const filteredTasks = useMemo(() => {
    return priorityFilter === "All"
      ? tasks
      : tasks.filter((task) => task.priority === priorityFilter);
  }, [priorityFilter, tasks]);

  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
  const currentTasks = filteredTasks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFileChange = (e, taskId) => {
    const file = e.target.files[0];
    if (!file) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, attachment: file } : task
      )
    );
  };

  return (
    <div className="space-y-6 min-h-screen text-black dark:text-white">
      {/* Header */}
      <div>
        <h2 className="title">Tasks</h2>

        <p className="text-sm text-gray-500">
          Manage and track all case-related tasks
        </p>
      </div>

      {/* Priority Tabs */}
      <div className="flex gap-3 flex-wrap mb-4">
        {PRIORITY_TABS.map((tab) => {
          const isActive = priorityFilter === tab;
          return (
            <button
              key={tab}
              onClick={() => {
                setPriorityFilter(tab);
                setCurrentPage(1);
              }}
              className={getTabColor(tab, isActive)}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Task Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentTasks.map((task) => {
          const isOverdue =
            task.status !== "Completed" && new Date(task.dueDate) < new Date();

          return (
            <div
              key={task.id}
              className="relative bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-md p-5 flex flex-col justify-between hover:shadow-xl transition-shadow duration-200"
            >
              {/* Priority Badge */}
              <div className="absolute top-3 right-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${task.priority === "High"
                    ? "bg-red-100 text-red-600"
                    : task.priority === "Mid"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-gray-200 text-gray-700"
                    }`}
                >
                  {task.priority}
                </span>
              </div>

              {/* Task Title & Case */}
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400 leading-snug">
                  {task.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Case: <span className="font-medium">{task.case}</span>
                </p>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                {task.description}
              </p>

              {/* Assignee & Dates */}
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    Assigned to:
                  </span>{" "}
                  {task.assignedTo}
                </p>
                <p>
                  <span className="font-medium text-red-600">Due:</span> {task.dueDate}
                  {isOverdue && (
                    <span className="text-red-500 font-medium ml-1">(Overdue)</span>
                  )}
                </p>
                {task.status === "Completed" && (
                  <p className="text-green-600">
                    <span className="font-medium">Completed:</span>{" "}
                    {task.completedDate}
                  </p>
                )}
              </div>

              {/* File Upload */}
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between">
                {task.attachment && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate w-40">
                    📎 {task.attachment.name}
                  </p>
                )}
                <label className="inline-flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-800 text-sm font-medium">
                  <Paperclip size={16} />
                  {task.attachment ? "Change File" : "Attach File"}
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, task.id)}
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>


      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-3 mt-4">
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

          <span className="text-sm text-gray-700 dark:text-white">
            Page {currentPage} of {totalPages}
          </span>

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
      )}
    </div>
  );
}
