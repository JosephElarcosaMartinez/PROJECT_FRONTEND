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
      <div className="bg-white text-black p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
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

        <div className="mt-4 space-y-3">
          <div className="flex justify-end gap-2 mb-2">
            <button className="bg-gray-200 text-sm px-3 py-1 rounded hover:bg-gray-300">
              Mark all as read
            </button>
            <button className="bg-gray-200 text-sm px-3 py-1 rounded hover:bg-gray-300">
              Clear All
            </button>
          </div>
          {notifications.map((note, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 border rounded-lg p-3 bg-gray-50 hover:bg-gray-100"
            >
              <input type="checkbox" className="mt-1" />
              <p className="text-gray-800 text-sm">{note}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
          <span>Showing 5 of 42 notifications</span>
          <div className="flex gap-1">
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`w-6 h-6 rounded text-center ${
                  page === 1
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border"
                }`} >
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
