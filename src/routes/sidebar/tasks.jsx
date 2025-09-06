import { useState, useEffect, useMemo, useCallback } from "react";
import { Paperclip, Download, Loader2, X, Lock } from "lucide-react";
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
  const [showModal, setShowModal] = useState(false);
  const [modalTaskId, setModalTaskId] = useState(null);
  const [droppedFile, setDroppedFile] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [downloadTaskId, setDownloadTaskId] = useState(null);
  const [downloadPassword, setDownloadPassword] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

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
        const due = row.td_due_date || row.td_due_date?.substring?.(0, 10) || '';
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
          passwordProtected: row.password_protected || false,
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

  const estimateStrength = useCallback((pwd) => {
    if (!pwd) return null;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (pwd.length >= 14) score++;
    if (score <= 2) return 'Weak';
    if (score <= 4) return 'Medium';
    return 'Strong';
  }, []);

  const openModal = (taskId) => {
    setModalTaskId(taskId);
    setDroppedFile(null);
    setPassword("");
    setPasswordStrength(null);
    setShowModal(true);
  };
  const closeModal = () => { if (uploadingTaskId) return; setShowModal(false); };

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) setDroppedFile(file);
  };
  const onDragOver = (e) => e.preventDefault();
  const onFileInput = (e) => {
    const file = e.target.files[0];
    if (file) setDroppedFile(file);
  };

  useEffect(() => { setPasswordStrength(estimateStrength(password)); }, [password, estimateStrength]);

  const submitUpload = async () => {
    if (!droppedFile || !modalTaskId) return;
    setUploadingTaskId(modalTaskId);
    setError(null);
    try {
      const form = new FormData();
      form.append('file', droppedFile);
      form.append('taskId', modalTaskId);
      if (password) form.append('password', password);
      const res = await fetch(`${API_BASE}/api/tasks/upload`, {
        method: 'POST',
        body: form,
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Upload failed');
      await fetchTasks();
      closeModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingTaskId(null);
    }
  };

  const triggerDownload = (task) => {
    if (task.passwordProtected) {
      setDownloadTaskId(task.id);
      setDownloadPassword("");
      setDownloadError(null);
      setShowPasswordPrompt(true);
    } else {
      performDownload(task.id, task.title + '.pdf');
    }
  };

  const performDownload = async (taskId, filename = 'document.pdf', pwd = null) => {
    setDownloading(true);
    setDownloadError(null);
    try {
      const url = new URL(`${API_BASE}/api/tasks/${taskId}/attachment`);
      if (pwd) url.searchParams.set('password', pwd);
      const res = await fetch(url.toString(), { credentials: 'include' });
      if (res.status === 401) { setDownloadError('Password required'); return; }
      if (res.status === 403) { setDownloadError('Invalid password'); return; }
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
      setShowPasswordPrompt(false);
    } catch (e) {
      setDownloadError(e.message);
    } finally {
      setDownloading(false);
    }
  };

  // Format any date-like value to a concise date string (YYYY-MM-DD fallback)
  const formatDate = (value) => {
    if (!value) return '-';
    const d = new Date(value);
    if (isNaN(d.getTime())) {
      // Fallback: attempt simple slice (covers already-truncated ISO strings)
      return value.toString().slice(0, 10);
    }
    // Use locale for better readability while keeping only date parts
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
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

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeModal}>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-white" onClick={closeModal} disabled={!!uploadingTaskId}>
              <X size={18} />
            </button>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Attach Document</h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">Password (optional)</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter a password to protect this file"
                  className="w-full border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-slate-700 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!!uploadingTaskId}
                />
                {passwordStrength && (
                  <p className="mt-1 text-xs">Password Strength: {passwordStrength === 'Strong' ? <span className="text-green-600">Strong</span> : passwordStrength === 'Medium' ? <span className="text-yellow-600">Medium</span> : <span className="text-red-600">Weak</span>}</p>
                )}
              </div>
              <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center h-44 cursor-pointer text-sm select-none bg-gray-50 dark:bg-slate-700 border-gray-300 dark:border-slate-500 hover:border-blue-500 transition"
                onClick={() => document.getElementById('fileInputHidden')?.click()}
              >
                {!droppedFile && <span className="text-gray-500">Drag & Drop file here or click to browse</span>}
                {droppedFile && (
                  <div className="relative text-center px-4">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); if (!uploadingTaskId) setDroppedFile(null); }}
                      className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow"
                      title="Remove file"
                      disabled={!!uploadingTaskId}
                    >
                      ×
                    </button>
                    <p className="font-medium text-gray-800 dark:text-white truncate max-w-[200px]">{droppedFile.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{(droppedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    <p className="text-[10px] mt-1 text-gray-400">Click area to choose a different file</p>
                  </div>
                )}
                <input id="fileInputHidden" type="file" className="hidden" onChange={onFileInput} disabled={!!uploadingTaskId} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={closeModal} className="px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700" disabled={!!uploadingTaskId}>Cancel</button>
                <button
                  onClick={submitUpload}
                  disabled={!droppedFile || !!uploadingTaskId}
                  className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {uploadingTaskId === modalTaskId && <Loader2 size={16} className="animate-spin" />} Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showPasswordPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => !downloading && setShowPasswordPrompt(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg w-full max-w-sm p-5 relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-white" onClick={() => !downloading && setShowPasswordPrompt(false)} disabled={downloading}>
              <X size={16} />
            </button>
            <h4 className="text-md font-semibold mb-3 text-gray-800 dark:text-white">Enter Password</h4>
            <p className="text-xs mb-3 text-gray-500">This document is protected. Provide the password to download.</p>
            <input
              type="password"
              value={downloadPassword}
              onChange={e => setDownloadPassword(e.target.value)}
              className="w-full border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 bg-white dark:bg-slate-700 text-sm outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              placeholder="Password"
              disabled={downloading}
            />
            {downloadError && <div className="text-xs text-red-600 mb-2">{downloadError}</div>}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => !downloading && setShowPasswordPrompt(false)}
                className="px-3 py-2 text-xs rounded-md border border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700"
                disabled={downloading}
              >Cancel</button>
              <button
                onClick={() => performDownload(downloadTaskId, 'document.pdf', downloadPassword)}
                className="px-3 py-2 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                disabled={downloading || !downloadPassword}
              >
                {downloading && <Loader2 size={14} className="animate-spin" />} Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
