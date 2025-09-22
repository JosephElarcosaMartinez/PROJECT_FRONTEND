import { useEffect, useState } from "react";
import { ShieldUser, FileText, Archive, FolderKanban } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../../assets/default-avatar.png";

const data = [
  { name: "Mon", Cases: 400, analytics: 240 },
  { name: "Tue", Cases: 300, analytics: 139 },
  { name: "Wed", Cases: 200, analytics: 980 },
  { name: "Thu", Cases: 278, analytics: 390 },
  { name: "Fri", Cases: 189, analytics: 480 },
  { name: "Sat", Cases: 239, analytics: 380 },
  { name: "Sun", Cases: 349, analytics: 430 },
];

const StatCard = ({ title, value, icon }) => (
  <div className="flex flex-col justify-between gap-2 rounded-lg bg-white p-4 shadow dark:bg-slate-900">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {title}
      </p>
      {icon}
    </div>
    <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
      {value}
    </h3>
  </div>
);

const ChartPlaceholder = ({ title, dataKey }) => (
  <div className="flex flex-col gap-3 rounded-lg bg-white p-4 shadow dark:bg-slate-900">
    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
      {title}
    </h3>
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorData" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorData)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

// format time compactly
const formatDistanceToNow = (date) => {
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
};

export const Reports = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/user-logs", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error("Error fetching logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="title">Reports & Analytics</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Users"
          value="1,482"
          icon={<ShieldUser size={20} className="text-blue-500" />}
        />
        <StatCard
          title="Archived Cases"
          value="267"
          icon={<Archive size={20} className="text-green-500" />}
        />
        <StatCard
          title="Processing Cases"
          value="24"
          icon={<FolderKanban size={20} className="text-orange-500" />}
        />
        <StatCard
          title="Processing Documents"
          value="3,642"
          icon={<FileText size={20} className="text-purple-500" />}
        />
      </div>

      {/* Chart */}
      <div className="relative rounded-xl bg-white dark:bg-gray-800 p-6 shadow-md">
        <span className="absolute top-4 right-4 z-10 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
          Last 7 Days
        </span>

        <div className="grid grid-cols-4 gap-6 lg:grid-cols-1">
          <ChartPlaceholder title="Completed Cases" dataKey="Cases" />
        </div>
      </div>

      {/* User Activity Logs */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            User Activity
          </h2>
          <button
            onClick={() => navigate("/user-logs")}
            className="text-blue-800 font-bold hover:underline text-xl"
          >
            View all
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading logs...</p>
        ) : (
          <table className="w-full text-sm border-t">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-600">
                <th className="p-2">USER</th>
                <th className="p-2">ACTION</th>
                <th className="p-2">DATE</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.user_log_id}
                  className="border-b hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {/* USER */}
                  <td className="flex items-center gap-2 p-2">
                    <img
                      src={
                        log.user_profile
                          ? `http://localhost:3000${log.user_profile}`
                          : defaultAvatar
                      }
                      alt={log.user_fullname}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <span className="text-slate-900 dark:text-white">
                      {log.user_fullname}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-600 dark:text-gray-400">
                        {log.user_log_action}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(log.user_log_time))}
                      </span>
                    </div>
                  </td>


                  {/* DATE */}
                  <td className="p-2 text-slate-700 dark:text-slate-300">
                    {log.user_log_time
                      ? new Date(log.user_log_time).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                      : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Reports;
