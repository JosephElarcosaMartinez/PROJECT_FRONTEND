import { UserRoundMinus, FileCheck, ShieldUser, User, FileText, Archive, FolderKanban,  ListTodo } from "lucide-react";
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
    <div className="space-y-6 p-4 md:p-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
      <p className="text-sm text-gray-500">Manage all user roles and access levels</p>

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




// import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// import { useTheme } from "@/hooks/use-theme";

// import { overviewData, recentSalesData } from "@/constants";

// import { FileCheck, Users, ShieldUser, Archive, FolderOpen, FileMinus, UserRoundMinus, ListTodo } from "lucide-react";

// const DashboardPage = () => {
//     const { theme, setTheme } = useTheme();

//     return (
//         <>
//             <div className="flex flex-col gap-y-4">
//                 <h1 className="title">Dashboard</h1>
//                 <p className="dark:text-slate-100">Welcome back, here's your overview</p>

//                 {/* first row */}
//                 <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//                     {/* Total Cases */}
//                     <div className="card">
//                         <div className="card-header">
//                             <p className="card-title">Users</p>
//                             <div className="bg-glue-500/20 w-fit rounded-lg p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
//                                 <ShieldUser size={26} />
//                             </div>
//                         </div>
//                         <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
//                             <p className="text-2xl font-bold text-slate-900 transition-colors dark:text-slate-50">32</p>
//                         </div>
//                     </div>

//                     {/* Total Archived Cases */}
//                     <div className="card">
//                         <div className="card-header">
//                             <p className="card-title">Archived Cases</p>
//                             <div className="bg-glue-500/20 w-fit rounded-lg p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
//                                 <Archive size={26} />
//                             </div>
//                         </div>
//                         <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
//                             <p className="text-2xl font-bold text-slate-900 transition-colors dark:text-slate-50">407</p>
//                         </div>
//                     </div>

//                     {/* Total Processing Cases */}
//                     <div className="card">
//                         <div className="card-header">
//                             <p className="card-title">Processing Cases</p>
//                             <div className="bg-glue-500/20 w-fit rounded-lg p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
//                                 <FolderOpen size={26} />
//                             </div>
//                         </div>
//                         <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
//                             <p className="text-2xl font-bold text-slate-900 transition-colors dark:text-slate-50">5</p>
//                         </div>
//                     </div>

//                     {/* Total Processing Documents */}
//                     <div className="card">
//                         <div className="card-header">
//                             <p className="card-title">Processing Documents</p>
//                             <div className="bg-glue-500/20 w-fit rounded-lg p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
//                                 <FileMinus size={26} />
//                             </div>
//                         </div>
//                         <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
//                             <p className="text-2xl font-bold text-slate-900 transition-colors dark:text-slate-50">91</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* second row */}
//                 <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//                     {/* Total Clients */}
//                     <div className="card">
//                         <div className="card-header">
//                             <p className="card-title">Clients</p>
//                             <div className="bg-glue-500/20 w-fit rounded-lg p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
//                                 <Users size={26} />
//                             </div>
//                         </div>
//                         <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
//                             <p className="text-2xl font-bold text-slate-900 transition-colors dark:text-slate-50">21</p>
//                         </div>
//                     </div>

//                     {/* Total Archived Documents */}
//                     <div className="card">
//                         <div className="card-header">
//                             <p className="card-title">Archived Documents</p>
//                             <div className="bg-glue-500/20 w-fit rounded-lg p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
//                                 <FileCheck size={26} />
//                             </div>
//                         </div>
//                         <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
//                             <p className="text-2xl font-bold text-slate-900 transition-colors dark:text-slate-50">723</p>
//                         </div>
//                     </div>

//                     {/* Total Pending Approvals */}
//                     <div className="card">
//                         <div className="card-header">
//                             <p className="card-title">Pending Approvals</p>
//                             <div className="bg-glue-500/20 w-fit rounded-lg p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
//                                 <UserRoundMinus size={26} />
//                             </div>
//                         </div>
//                         <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
//                             <p className="text-2xl font-bold text-slate-900 transition-colors dark:text-slate-50">5</p>
//                         </div>
//                     </div>

//                     {/* Total Pending Tasks */}
//                     <div className="card">
//                         <div className="card-header">
//                             <p className="card-title">Pending Tasks</p>
//                             <div className="bg-glue-500/20 w-fit rounded-lg p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
//                                 <ListTodo size={26} />
//                             </div>
//                         </div>
//                         <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
//                             <p className="text-2xl font-bold text-slate-900 transition-colors dark:text-slate-50">91</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* charts and graphs */}
//                 <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
//                     <div className="card col-span-1 md:col-span-2 lg:col-span-4">
//                         <div className="card-header">
//                             <p className="card-title">Overview</p>
//                         </div>
//                         <div className="card-body p-0">
//                             <ResponsiveContainer
//                                 width="100%"
//                                 height={300}
//                             >
//                                 <AreaChart
//                                     data={overviewData}
//                                     margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
//                                 >
//                                     <defs>
//                                         <linearGradient
//                                             id="colorTotal"
//                                             x1="0"
//                                             y1="0"
//                                             x2="0"
//                                             y2="1"
//                                         >
//                                             <stop
//                                                 offset="5%"
//                                                 stopColor="#2563eb"
//                                                 stopOpacity={0.8}
//                                             />
//                                             <stop
//                                                 offset="95%"
//                                                 stopColor="#2563eb"
//                                                 stopOpacity={0}
//                                             />
//                                         </linearGradient>
//                                     </defs>
//                                     <Tooltip
//                                         cursor={false}
//                                         formatter={(value) => `₱${value}`}
//                                         active={true}
//                                     />
//                                     <XAxis
//                                         dataKey="name"
//                                         strokeWidth={0}
//                                         stroke={theme === "light" ? "#475569" : "#94a3b8"}
//                                     />
//                                     <YAxis
//                                         dataKey="total"
//                                         strokeWidth={0}
//                                         stroke={theme === "light" ? "#475569" : "#94a3b8"}
//                                         tickFormatter={(value) => `₱${value}`}
//                                         tickMargin={6}
//                                     />
//                                     <Area
//                                         type="monotone"
//                                         dataKey="total"
//                                         stroke="#2563eb"
//                                         fillOpacity={1}
//                                         fill="url(#colorTotal)"
//                                     />
//                                 </AreaChart>
//                             </ResponsiveContainer>
//                         </div>
//                     </div>

//                     <div className="card col-span-1 md:col-span-2 lg:col-span-3">
//                         <div className="card-header">
//                             <p className="card-title">Recent Activity</p>
//                         </div>
//                         <div className="card-body h-[300px] overflow-auto p-0">
//                             {recentSalesData.map((sale) => (
//                                 <div
//                                     key={sale.id}
//                                     className="flex items-center justify-between gap-x-4 py-2 pr-2"
//                                 >
//                                     <div className="flex items-center gap-x-4">
//                                         <img
//                                             src={sale.image}
//                                             alt={sale.name}
//                                             className="size-10 flex-shrink-0 rounded-full object-cover"
//                                         />
//                                         <div className="flex flex-col gap-y-2">
//                                             <p className="font-medium text-slate-900 dark:text-slate-50">{sale.name}</p>
//                                             <p className="text-sm text-slate-600 dark:text-slate-400">{sale.email}</p>
//                                         </div>
//                                     </div>
//                                     <p className="font-medium text-slate-900 dark:text-slate-50">${sale.total}</p>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default DashboardPage;
