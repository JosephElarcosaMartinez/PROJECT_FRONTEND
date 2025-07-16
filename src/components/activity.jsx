import { useState } from "react";
import user1 from "@/assets/Joseph_prof.png";
import user2 from "@/assets/Joseph_prof.png";
import user3 from "@/assets/Joseph_prof.png";

const initialUsers = [
  { user: "Sarah Wilson", action: "Logged out 2 minutes ago", status: "Inactive", date: "April 21, 2025", image: user1 },
  { user: "Bryan Wilson", action: "Logged in 5 minutes ago", status: "Active", date: "April 21, 2025", image: user2 },
  { user: "John Wilson", action: "Logged in 10 minutes ago", status: "Active", date: "April 21, 2025", image: user3 },
];

export const Activity = () => {
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("Last 7 days");

  return (
    <div className="space-y-6 p-4 md:p-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports & Analytics / User Activity</h1>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border rounded text-black"
          />
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border rounded text-black"
          >
            <option>Last 7 days</option>
            <option>Last 14 days</option>
            <option>Last 21 days</option>
            <option>Last 1 month</option>
          </select>
        </div>
      </div>

      {/* ✅ Table */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-sm border-t">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600">
              <th className="p-2">USER</th>
              <th className="p-2">ACTION</th>
              <th className="p-2">STATUS</th>
              <th className="p-2">DATE</th>
            </tr>
          </thead>
          <tbody>
            {initialUsers.map((item, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="flex items-center gap-2 p-2">
                  <img
                    src={item.image}
                    alt={item.user}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <span className="text-slate-900 dark:text-white">{item.user}</span>
                </td>
                <td className="p-2 text-slate-700 dark:text-slate-300">{item.action}</td>
                <td
                  className={`p-2 font-medium ${item.status.toLowerCase() === "active" ? "text-green-600" : "text-red-600"
                    }`}
                >
                  {item.status}
                </td>
                <td className="p-2 text-slate-700 dark:text-slate-300">{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Activity;
