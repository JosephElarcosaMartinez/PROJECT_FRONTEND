import { useState, useEffect, useMemo } from "react";
import { Paperclip, Download, Loader2 } from "lucide-react";
import { useAuth } from "../../context/auth-context";

// Constants
const ITEMS_PER_PAGE = 6;
const PRIORITY_TABS = ["All", "High", "Mid", "Low"];

// Raw tasks now come from backend; placeholder kept for shape reference only.
const rawTasks = [];

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

// Priority ordering for sorting (smaller number = higher precedence)
const PRIORITY_ORDER = { High: 1, Mid: 2, Low: 3 };

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
  const [loading, setLoading] = useState(false);
  const [uploadingTaskId, setUploadingTaskId] = useState(null);
  const [error, setError] = useState(null);

  const API_BASE = 'http://localhost:3000';

  // Fetch tasks from backend
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/tasks`, { credentials: 'include' });
      if (!res.ok) throw new Error(`Failed to fetch tasks (${res.status})`);
      const data = await res.json();
      // Map backend rows to UI fields
      const mapped = data.map(row => {
        const due = row.td_due_date || row.td_due_date?.substring?.(0,10) || '';
        return {
          id: row.td_id,
          title: row.td_name || 'Untitled Task',
          case: row.td_case_id || row.td_case || '-',
            description: row.td_description || '',
            assignedTo: row.td_to || '-',
            dueDate: due,
            completedDate: row.td_date_completed || null,
            status: row.td_status || 'Pending',
            attachmentPath: row.td_doc_path || null,
            priority: row.td_due_date ? getPriorityFromDueDate(row.td_due_date) : 'Low'
        };
      });
      setTasks(mapped);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const filteredTasks = useMemo(() => {
    const base = priorityFilter === "All"
      ? tasks
      : tasks.filter((task) => task.priority === priorityFilter);
    // Sort by priority: High -> Mid -> Low; then optional dueDate ascending
    return [...base].sort((a, b) => {
      const pa = PRIORITY_ORDER[a.priority] || 99;
      const pb = PRIORITY_ORDER[b.priority] || 99;
      if (pa !== pb) return pa - pb;
      // Secondary: earlier due date first (if valid dates)
      const da = Date.parse(a.dueDate) || Infinity;
      const db = Date.parse(b.dueDate) || Infinity;
      return da - db;
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
    setUploadingTaskId(taskId);
    setError(null);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('taskId', taskId);
      const res = await fetch(`${API_BASE}/api/tasks/upload`, {
        method: 'POST',
        body: form,
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Upload failed');
      await fetchTasks();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingTaskId(null);
    }
  };

  const handleDownload = async (taskId, filename='document.pdf') => {
    try {
      const res = await fetch(`${API_BASE}/api/tasks/${taskId}/attachment`, { credentials: 'include' });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="space-y-6 min-h-screen text-black dark:text-white">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
          Tasks
        </h2>
        <p className="text-sm text-gray-500">
          Manage and track all case-related tasks
        </p>
      </div>

      {error && (
        <div className="p-3 rounded bg-red-100 text-red-700 text-sm">{error}</div>
      )}

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
      {loading ? (
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <Loader2 className="animate-spin" size={18} /> Loading tasks...
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentTasks.map((task) => {
          const isOverdue =
            task.status !== "Completed" &&
            new Date(task.dueDate) < new Date();

          return (
            <div
              key={task.id}
              className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-4 rounded-lg shadow-lg relative"
            >
              <div className="absolute top-3 right-4 text-sm font-medium">
                <span className={priorityColor[task.priority]}>
                  {task.priority}
                </span>
              </div>

              <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-1 truncate">
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
                {isOverdue && (
                  <span className="text-red-500 ml-1">(Overdue)</span>
                )}
              </p>
              {task.status === "Completed" && (
                <p className="text-sm mb-2 text-green-600">
                  <strong>Completed:</strong> {task.completedDate}
                </p>
              )}

              {/* File Upload */}
              <div className="mt-4 flex items-center justify-between gap-2">
                <label className="inline-flex items-center gap-2 cursor-pointer text-blue-600 hover:underline text-xs">
                  <Paperclip size={14} />
                  {uploadingTaskId === task.id ? 'Uploading...' : (task.attachmentPath ? 'Replace File' : 'Attach File')}
                  <input
                    type="file"
                    className="hidden"
                    disabled={uploadingTaskId === task.id}
                    onChange={(e) => handleFileChange(e, task.id)}
                  />
                </label>
                {task.attachmentPath && (
                  <button
                    onClick={() => handleDownload(task.id, task.title + '.pdf')}
                    className="text-green-600 hover:text-green-800 text-xs inline-flex items-center gap-1"
                  >
                    <Download size={14} /> Download
                  </button>
                )}
              </div>
              {task.attachmentPath && (
                <p className="text-[10px] text-gray-500 mt-1 truncate w-full text-right">Encrypted file stored</p>
              )}
            </div>
          );
        })}
      </div>
      )}

      {/* Pagination */}
  {!loading && totalPages > 1 && (
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
