import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Bell } from "lucide-react";

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
    <div className="w-full">
      <div className="rounded-xl bg-white dark:bg-slate-900 shadow-sm p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Bell className="text-blue-600 dark:text-blue-400" size={35} />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
                Notifications
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage your recent updates and system alerts
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/notifications/notif-settings")}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            <Settings className="text-gray-600 dark:text-gray-300" size={22} />
          </button>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mb-5">
          <button
            onClick={markAllAsRead}
            className="text-sm px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-slate-800 dark:text-blue-400 dark:hover:bg-slate-700 transition"
          >
            Mark all as read
          </button>
          <button
            onClick={clearAll}
            className="text-sm px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-slate-700 transition"
          >
            Clear All
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-4 ">
          {paginatedData.map((note) => (
            <div
              key={note.id}
              onClick={() => toggleReadStatus(note.id)}
              className={`cursor-pointer flex items-start gap-3 rounded-xl border p-4 transition 
                ${note.isRead
                  ? "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:shadow-md"
                  : "bg-blue-50 dark:bg-slate-700 border-blue-200 dark:border-slate-600 shadow-md hover:shadow-lg"
                }`}
            >
              <div className="flex flex-col w-full">
                <div className="flex justify-between items-start">
                  <p
                    className={`text-sm leading-relaxed ${note.isRead
                      ? "text-gray-700 dark:text-gray-200"
                      : "text-gray-900 dark:text-white font-medium"
                      }`}
                  >
                    {note.message}
                  </p>
                  {!note.isRead && (
                    <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 ml-2 flex-shrink-0"></span>
                  )}
                </div>
                <div className="text-xs mt-2 text-gray-500 dark:text-gray-400">
                  <span className="font-medium">{note.createdBy}</span> ·{" "}
                  <span>{note.dateCreated}</span> · <span>{note.createdEarlier}</span>
                </div>
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm">
              No notifications found
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Showing {startIndex + 1} -{" "}
              {Math.min(startIndex + itemsPerPage, notifications.length)} of{" "}
              {notifications.length}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 border rounded-lg text-sm transition ${currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-slate-800"
                  : "bg-white hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                  }`}
              >
                &lt;
              </button>

              <span className="text-sm text-gray-700 dark:text-gray-200">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 border rounded-lg text-sm transition ${currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-slate-800"
                  : "bg-white hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                  }`}
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
