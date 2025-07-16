import React from "react";
import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";

const Notifications = () => {
  const navigate = useNavigate();

  const notifications = [
    "Case #2024-098 has been moved to the archive folder.",
    "New evidence file ‘CCTV Footage.zip’ has been shared with you under Case #2025-016.",
    "Emma Thompson updated their profile.",
    "Your document has already been approved.",
    "Your document upload has been received and logged by the system.",
  ];

  return (
    <div>
      <div className="bg-blue rounded-xl p-4 sm:p-6 shadow-sm dark:bg-slate-900">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Notifications</h1>
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

        <div className="flex justify-end gap-2 mb-4">
          <button className="text-sm px-3 py-1 rounded bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-slate-600">
            Mark all as read
          </button>
          <button className="text-sm px-3 py-1 rounded bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-slate-600">
            Clear All
          </button>
        </div>


        {notifications.map((note, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 mb-3 w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4"
          >
            <input type="checkbox" className="mt-1" />
            <p className="text-sm text-gray-600 dark:text-slate-300">{note}</p>
          </div>
        ))}

        <div className="flex justify-between items-center mt-6 text-xs text-gray-500 dark:text-gray-400">
          <span>Showing 5 of 42 notifications</span>
          <div className="flex gap-1">
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`w-6 h-6 rounded text-center ${page === 1
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-slate-800 text-gray-700 dark:text-white border dark:border-slate-600"
                  }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Notifications;
