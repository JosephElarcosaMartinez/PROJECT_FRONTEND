// Notification Settings

import React, { useState } from "react";

const NotificationSettings = () => {
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
    <div>
      <div className="bg-white text-black p-6 rounded-xl shadow-md space-y-6 max-w-xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold">Notification Settings</h1>
          <p className="text-sm text-gray-500">
            Manage how you receive notifications and updates.
          </p>
        </div>

        {/* Push Notifications */}
        <div>
          <h2 className="font-semibold mb-2">Push Notifications</h2>
          <Toggle label="New Activity" checked={pushSettings.activity} onChange={() => setPushSettings(prev => ({...prev, activity: !prev.activity}))} />
          <Toggle label="Updates" checked={pushSettings.updates} onChange={() => setPushSettings(prev => ({...prev, updates: !prev.updates}))} />
          <Toggle label="Reminders" checked={pushSettings.reminders} onChange={() => setPushSettings(prev => ({...prev, reminders: !prev.reminders}))} />
        </div>

        {/* System Notifications */}
        <div>
          <h2 className="font-semibold mb-2">System Notifications</h2>
          <Toggle label="Report" checked={systemSettings.report} onChange={() => setSystemSettings(prev => ({...prev, report: !prev.report}))} />
        </div>

        <div>
          <h2 className="font-semibold mb-2">Email Frequency</h2>
          {["Real-time", "Daily digest", "Weekly digest"].map((opt) => (
            <label key={opt} className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="radio"
                value={opt}
                checked={emailFreq === opt}
                onChange={(e) => setEmailFreq(e.target.value)}
              />
              {opt}
            </label>
          ))}
        </div>

        {/* Save Button */}
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Save Changes
        </button>
      </div>
    </div>
  );
};

const Toggle = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between py-1 text-sm text-gray-800">
    <span>{label}</span>
    <label className="relative inline-block w-10 h-5">
      <input
        type="checkbox"
        className="opacity-0 w-0 h-0"
        checked={checked}
        onChange={onChange}
      />
      <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full before:absolute before:left-1 before:top-1 before:bg-white before:h-3 before:w-3 before:rounded-full before:transition-transform checked:before:translate-x-5 checked:bg-blue-500"></span>
    </label>
  </div>
);

export default NotificationSettings;
