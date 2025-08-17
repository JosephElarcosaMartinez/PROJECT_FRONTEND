import { useState, useEffect, useMemo } from "react";
import { Paperclip } from "lucide-react";
import { useAuth } from "../../context/auth-context";

// Constants
const ITEMS_PER_PAGE = 6;
const PRIORITY_TABS = ["All", "High", "Mid", "Low"];


// Helpers
const getDaysRemaining = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getPriorityFromDueDate = (dueDate, status) => {
  if (status === "Completed") return null;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize tasks with computed fields
  const { user } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/tasks", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 401) {
          setError("You are not authorized to view tasks. Please log in.");
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const processed = data.map((task) => ({
          ...task,
          priority: getPriorityFromDueDate(task.td_due_date, task.td_status),
        }));
        setTasks(processed);
      } catch (e) {
        setError("Failed to fetch tasks: " + e.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTasks();
    } else {
      setError("Please log in to view tasks");
      setLoading(false);
    }
  }, [user]);

  const filteredTasks = useMemo(() => {
    // First filter by priority if needed
    const filtered = priorityFilter === "All"
      ? tasks
      : tasks.filter((task) => task.priority === priorityFilter);
    
    // Then sort tasks by priority and status
    return filtered.sort((a, b) => {
      // Put completed tasks last
      if (a.td_status === "Completed" && b.td_status !== "Completed") return 1;
      if (a.td_status !== "Completed" && b.td_status === "Completed") return -1;
      
      // For pending tasks, sort by priority
      if (a.td_status !== "Completed" && b.td_status !== "Completed") {
        const priorityOrder = { High: 1, Mid: 2, Low: 3 };
        return (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4);
      }
      
      return 0;
    });
  }, [priorityFilter, tasks]);

  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
  const currentTasks = filteredTasks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFileChange = async (e, taskId) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create FormData to send the file
    const formData = new FormData();
    formData.append('file', file);
    formData.append('taskId', taskId);
    formData.append('status', 'Completed');
    formData.append('completionDate', new Date().toISOString());

    try {
      const response = await fetch('http://localhost:3000/api/tasks/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();

      // Update the tasks state with the new attachment info and completion status
      setTasks((prev) =>
        prev.map((task) =>
          task.td_id === taskId
            ? {
              ...task,
              td_status: 'Completed',
              td_date_completed: data.td_date_completed,
              attachment: {
                name: file.name,
                path: data.filePath
              }
            }
            : task
        )
      );

      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6 min-h-screen text-black dark:text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
            Tasks
          </h2>
          <p className="text-sm text-gray-500">
            Manage and track all case-related tasks
          </p>
        </div>

        {/* Add Task Button */}
        <div className="mt-4 md:mt-0 flex gap-2">
          <button
            className="flex items-center gap-2 border border-blue-600 bg-blue-600 px-3 py-1 rounded-md text-white hover:bg-blue-700"
          // onClick={}
          >
            Add Task
          </button>
        </div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentTasks.map((task) => {
          const isOverdue =
            task.td_status !== "Completed" &&
            new Date(task.td_due_date) < new Date();

          return (
            <div
              key={task.td_id}
              className="relative rounded-lg border border-gray-200 bg-white p-4 shadow hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:shadow-xl transition-shadow duration-200"
            >
              {task.td_status !== "Completed" && task.priority && (
                  <span className={`absolute right-1 top-3 rounded-full px-3 py-1 text-xs font-medium ${priorityColor[task.priority]}`}>
                    {task.priority}
                  </span>
              )}

              <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-1 mt-2">
                {task.td_name}
              </h3>
              <p className="text-sm">
                <strong>Case:</strong> {task.td_case}
              </p>
              <p className="text-sm mb-2">{task.td_description}</p>
              <p className="text-sm mb-1">
                <strong>Assigned to:</strong> {task.td_to}
              </p>
              <p className="text-sm mb-1">
                <strong className="text-red-600">Due:</strong> {task.td_due_date ? task.td_due_date.substring(0, 10) : ''}
                {isOverdue && (
                  <span className="text-red-500 ml-1">(Overdue)</span>
                )}
              </p>
              {task.td_status === "Completed" ? (
                <p className="text-sm mb-2 text-green-600">
                  <strong>Completed:</strong> {task.td_date_completed ? task.td_date_completed.substring(0, 10) : ''}
                </p>
              ) : (
                <p className="text-sm mb-2 text-red-600">
                  <strong>Pending</strong>
                </p>
              )}

              {/* File Upload */}
              <div className="mt-4 flex justify-end">
                <label className="inline-flex items-center gap-2 cursor-pointer text-blue-600 hover:underline text-sm">
                  <Paperclip size={16} />
                  {task.attachment ? "Change File" : "Attach File"}
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, task.td_id)}
                  />
                </label>
              </div>

              {task.attachment && (
                <p className="text-xs text-gray-600 mt-1 truncate w-48 text-right">
                  {task.attachment.name}
                </p>
              )}
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
