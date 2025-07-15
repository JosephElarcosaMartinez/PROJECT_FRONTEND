import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotificationSettings = () => {
  const navigate = useNavigate();

  const [pushSettings, setPushSettings] = useState({
    activity: true,
    updates: false,
    reminders: false,
  });

  const [systemSettings, setSystemSettings] = useState({
    report: true,
    productUpdates: true,
    account: false,
  });

  const [emailFreq, setEmailFreq] = useState("Real-time");

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-6 shadow-sm space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
            Notification Settings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage how you receive notifications and updates.
          </p>
        </div>

        {/* Push Notifications */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Push Notifications
          </h2>
          <Toggle
            label="New Activity"
            checked={pushSettings.activity}
            onChange={() =>
              setPushSettings((prev) => ({
                ...prev,
                activity: !prev.activity,
              }))
            }
          />
          <Toggle
            label="Updates"
            checked={pushSettings.updates}
            onChange={() =>
              setPushSettings((prev) => ({
                ...prev,
                updates: !prev.updates,
              }))
            }
          />
          <Toggle
            label="Reminders"
            checked={pushSettings.reminders}
            onChange={() =>
              setPushSettings((prev) => ({
                ...prev,
                reminders: !prev.reminders,
              }))
            }
          />
        </div>

        {/* System Notifications */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            System Notifications
          </h2>
          <Toggle
            label="Report"
            checked={systemSettings.report}
            onChange={() =>
              setSystemSettings((prev) => ({
                ...prev,
                report: !prev.report,
              }))
            }
          />
          {/* Add more toggles if needed */}
        </div>

        {/* Email Frequency */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            Email Frequency
          </h2>
          <div className="space-y-2">
            {["Real-time", "Daily digest", "Weekly digest"].map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <input
                  type="radio"
                  value={opt}
                  checked={emailFreq === opt}
                  onChange={(e) => setEmailFreq(e.target.value)}
                  className="accent-blue-600"
                />
                {opt}
              </label>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={() => alert("Save Changes...")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const Toggle = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between py-2 text-sm text-gray-800 dark:text-gray-200">
    <span>{label}</span>
    <label className="relative inline-block w-10 h-5">
      <input
        type="checkbox"
        className="opacity-0 w-0 h-0 peer"
        checked={checked}
        onChange={onChange}
      />
      <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 peer-checked:bg-blue-500 rounded-full before:absolute before:left-1 before:top-1 before:bg-white before:h-3 before:w-3 before:rounded-full before:transition-transform peer-checked:before:translate-x-5"></span>
    </label>
  </div>
);

export default NotificationSettings;
