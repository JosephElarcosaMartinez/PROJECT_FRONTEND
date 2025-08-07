import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";

const Notifications = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Case #2024-098 has been moved to the archive folder.",
      dateCreated: "2025-08-07 13:45",
      createdBy: "System",
      createdEarlier: "2 hours ago",
      isRead: false,
    },
    {
      id: 2,
      message:
        "New evidence file ‘CCTV Footage.zip’ has been shared with you under Case #2025-016.",
      dateCreated: "2025-08-06 17:30",
      createdBy: "Atty. John Cruz",
      createdEarlier: "1 day ago",
      isRead: false,
    },
    {
      id: 3,
      message: "Emma Thompson updated their profile.",
      dateCreated: "2025-08-06 09:12",
      createdBy: "Emma Thompson",
      createdEarlier: "1 day ago",
      isRead: true,
    },
    {
      id: 4,
      message: "Your document has already been approved.",
      dateCreated: "2025-08-05 14:20",
      createdBy: "Admin",
      createdEarlier: "2 days ago",
      isRead: true,
    },
    {
      id: 5,
      message:
        "Your document upload has been received and logged by the system.",
      dateCreated: "2025-08-05 08:00",
      createdBy: "System",
      createdEarlier: "2 days ago",
      isRead: false,
    },
    {
      id: 6,
      message: "Reminder: Court hearing for Case #2025-019 is tomorrow.",
      dateCreated: "2025-08-04 11:00",
      createdBy: "Paralegal Support",
      createdEarlier: "3 days ago",
      isRead: false,
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const toggleReadStatus = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n))
    );
  };

  const totalPages = Math.ceil(notifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = notifications.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1); // Reset page if the data ever changes
  }, [notifications]);

  return (
    <div>
      <div className="bg-blue rounded-xl p-4 sm:p-6 shadow-sm dark:bg-slate-900">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
              Notifications
            </h1>
            <p className="text-sm text-gray-500">
              Manage how you receive notifications and updates
            </p>
          </div>
          <button
            onClick={() => navigate("/notifications/notif-settings")}
            className="text-blue-700 hover:text-blue-900"
          >
            <Settings size={24} />
          </button>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 my-4">
          <button
            onClick={markAllAsRead}
            className="text-sm px-3 py-1 rounded bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-slate-600"
          >
            Mark all as read
          </button>
          <button
            onClick={clearAll}
            className="text-sm px-3 py-1 rounded bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-slate-600"
          >
            Clear All
          </button>
        </div>

        {/* Notifications */}
        {paginatedData.map((note) => (
          <div
            key={note.id}
            onClick={() => toggleReadStatus(note.id)}
            className={`cursor-pointer flex items-start gap-3 mb-3 w-full rounded-xl border 
              ${note.isRead
                ? "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700"
                : "bg-blue-200 dark:bg-slate-700 border-blue-200 dark:border-slate-600"
              } p-4 transition hover:shadow-sm`}
          >
            <div className="flex flex-col w-full">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-800 dark:text-white font-medium">
                  {note.message}
                </p>
                {!note.isRead && (
                  <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 mr-1"></span>
                )}
              </div>
              <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                <span>Created by: {note.createdBy}</span> &middot;{" "}
                <span>{note.dateCreated}</span> &middot;{" "}
                <span>{note.createdEarlier}</span>
              </div>
            </div>
          </div>
        ))}

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
    </div>
  );
};

export default Notifications;
