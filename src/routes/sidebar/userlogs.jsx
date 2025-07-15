import React, { useState } from "react";
import JosephAvatar from "@/assets/Joseph_prof.png";

const initialLogs = [
  {
    icon: "https://img.icons8.com/fluency/48/lock.png",
    user: "John Cooper",
    action: "User logged in successfully",
    tag: "Login",
    tagColor: "bg-blue-100 text-blue-700",
    time: "April 21, 2025 14:30"
  },
  {
    icon: "https://img.icons8.com/fluency/48/export.png",
    user: "Emma Thompson",
    action: "Exported monthly report",
    tag: "Action",
    tagColor: "bg-green-100 text-green-700",
    time: "April 21, 2025 14:25"
  },
  {
    icon: "https://img.icons8.com/fluency/48/error.png",
    user: "Sarah Wilson",
    action: "Failed login attempt",
    tag: "Error",
    tagColor: "bg-red-100 text-red-700",
    time: "April 21, 2025 14:15"
  }
];

const Userlogs = () => {
  const [logs] = useState(initialLogs);
  const [filteredLogs, setFilteredLogs] = useState(initialLogs);

  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState("All Users");
  const [selectedDate, setSelectedDate] = useState("");

  const handleApplyFilters = () => {
    const filtered = logs.filter((log) => {
      const matchUser =
        selectedUser === "All Users" || log.user === selectedUser;
      const matchSearch = log.action.toLowerCase().includes(search.toLowerCase());
      const matchDate =
        !selectedDate || log.time.startsWith(formatDate(selectedDate));

      return matchUser && matchSearch && matchDate;
    });

    setFilteredLogs(filtered);
  };

  const formatDate = (input) => {
    const date = new Date(input);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div className="min-h-screen p-6 text-white">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        User Activity Logs
      </h1>
      <p className="text-sm mb-6 text-gray-500">
        Track and monitor user activities across the platform.
      </p>

      {/* Filter Section */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-md flex flex-wrap gap-4 items-center mb-8">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="card w-full sm:w-64 px-3 py-2 border rounded text-black "
        />
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="card px-3 py-2 border rounded dark:text-white"
        >
          <option>All Users</option>
          <option>John Cooper</option>
          <option>Emma Thompson</option>
          <option>Sarah Wilson</option>
        </select>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="card px-3 py-2 border rounded dark:text-white"
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ml-auto"
          onClick={handleApplyFilters}
        >
          Apply Filters
        </button>
      </div>

      {/* Logs Section */}
      {filteredLogs.length > 0 ? (
        <div className="space-y-4">
          {filteredLogs.map((log, index) => (
            <div
              key={index}
              className="card bg-white text-black p-4 rounded-lg shadow-md flex items-start"
            >
              {/* Avatar */}
              <img
                src={JosephAvatar}
                alt={log.user}
                className="w-12 h-12 rounded-full border mr-4"
              />

              {/* Details */}
              <div className="dark:text-white flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-semibold ">{log.user}</span>
                </div>
                <div className="text-sm dark:text-white mb-1 flex items-center gap-2">
                  <img src={log.icon} alt="icon" className="w-5 h-5" />
                  {log.action}
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded ${log.tagColor}`}
                >
                  {log.tag}
                </span>
              </div>

              {/* Timestamp */}
              <div className="ml-auto text-sm dark:text-white whitespace-nowrap">
                {log.time}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-300">No logs available.</p>
      )}

      {/* Load More (Static for now) */}
      <div className="text-center mt-6">
        <button className="text-gray-800 dark:text-white underline hover:text-blue-300">
          Load More
        </button>
      </div>
    </div>
  );
};

export default Userlogs;
