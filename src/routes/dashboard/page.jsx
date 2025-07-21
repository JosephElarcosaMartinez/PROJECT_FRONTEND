import { UserRoundMinus, FileCheck, ShieldUser, User, FileText, Archive, FolderKanban, ListTodo } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const data = [
  { name: "Mon", users: 400, analytics: 240 },
  { name: "Tue", users: 300, analytics: 139 },
  { name: "Wed", users: 200, analytics: 980 },
  { name: "Thu", users: 278, analytics: 390 },
  { name: "Fri", users: 189, analytics: 480 },
  { name: "Sat", users: 239, analytics: 380 },
  { name: "Sun", users: 349, analytics: 430 },
];

const StatCard = ({ title, value, icon }) => (
  <div className="flex flex-col justify-between gap-2 rounded-lg bg-white p-4 shadow dark:bg-slate-900">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
      {icon}
    </div>
    <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">{value}</h3>
  </div>
);

const ChartPlaceholder = ({ title, dataKey }) => (
  <div className="flex flex-col gap-3 rounded-lg bg-white p-4 shadow dark:bg-slate-900">
    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
          <Area type="monotone" dataKey={dataKey} stroke="#3b82f6" fillOpacity={1} fill="url(#colorData)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export const DashboardPage = () => {
  return (
    <div className="space-y-6 ">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
      <p className="text-sm text-gray-500 ">Manage all user roles and access levels</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Users" value="1,482" icon={<ShieldUser size={20} className="text-blue-500" />} />
        <StatCard title="Archived Cases" value="267" icon={<Archive size={20} className="text-green-500" />} />
        <StatCard title="Processing Cases" value="24" icon={<FolderKanban size={20} className="text-orange-500" />} />
        <StatCard title="Processing Documents" value="3,642" icon={<FileText size={20} className="text-purple-500" />} />

        <StatCard title="Clients" value="982" icon={<User size={20} className="text-blue-500" />} />
        <StatCard title="Archived Documents" value="183" icon={<FileCheck size={20} className="text-green-500" />} />
        <StatCard title="Pending Approvals" value="19" icon={<UserRoundMinus size={20} className="text-orange-500" />} />
        <StatCard title="Pending Tasks" value="421" icon={< ListTodo size={20} className="text-purple-500" />} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartPlaceholder title="User Activity" dataKey="users" />
        <ChartPlaceholder title="User Analytics" dataKey="analytics" />
      </div>
    </div>
  );
};

export default DashboardPage;


