import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import default_avatar from "@/assets/default-avatar.png";

const allUsers = [
    {
        id: 1,
        name: "Joseph Elarcosa Martinez",
        email: "josephelarcosamartinez@gmail.com",
        phone: "0994 852 5061",
        role: "Admin",
        dateCreated: "July 15, 2025 At 7:13 PM",
        status: "Active",
        image: default_avatar,
    },
    {
        id: 2,
        name: "Joseph Martinez",
        email: "joseph@gmail.com",
        phone: "09363858621",
        role: "Paralegal",
        dateCreated: "July 18, 2025 At 11:42 PM",
        status: "Active",
        image: default_avatar,
    },
    {
        id: 3,
        name: "Angelie Gecole",
        email: "angelie@gmail.com",
        phone: "09363858621",
        role: "Lawyer",
        dateCreated: "July 19, 2025 At 12:20 AM",
        status: "Active",
        image: default_avatar,
    },
];

export default function Users() {
    return (
        <div className="dark:bg-slate-950">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    Users <span className="text-blue-600">{">"} Promotions</span>
                </h1>
            </div>

            {/* Users Table */}
            <div className="card overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
                <table className="w-full text-sm">
                    {/* Table Head */}
                    <thead className="bg-gray-100 dark:bg-slate-800 text-xs uppercase text-gray-600 dark:text-slate-300">
                        <tr>
                            <th className="px-4 py-3 text-left">User</th>
                            <th className="px-4 py-3 text-left">Email</th>
                            <th className="px-4 py-3 text-left">Phone</th>
                            <th className="px-4 py-3 text-left">Role</th>
                            <th className="px-4 py-3 text-left">Date Created</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                        {allUsers.map((user, idx) => (
                            <tr
                                key={user.id}
                                className={`${idx % 2 === 0
                                    ? "bg-white dark:bg-slate-900"
                                    : "bg-gray-50 dark:bg-slate-800"
                                    } border-t border-gray-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950 transition`}
                            >
                                {/* User Info */}
                                <td className="px-4 py-3 flex items-center gap-3 whitespace-nowrap">
                                    <img
                                        src={user.image}
                                        alt={user.name}
                                        className="w-10 h-10 rounded-full border border-gray-300 dark:border-slate-600"
                                    />
                                    <span className="truncate max-w-[160px] font-medium">
                                        {user.name}
                                    </span>
                                </td>

                                {/* Email */}
                                <td className="px-4 py-3 truncate max-w-[220px]">
                                    {user.email}
                                </td>

                                {/* Phone */}
                                <td className="px-4 py-3 whitespace-nowrap">
                                    {user.phone}
                                </td>

                                {/* Role */}
                                <td className="px-4 py-3 whitespace-nowrap font-medium">
                                    {user.role}
                                </td>

                                {/* Date Created */}
                                <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-slate-400">
                                    {user.dateCreated}
                                </td>

                                {/* Status */}
                                <td className="px-4 py-3">
                                    <span
                                        className={`px-3 py-1.5 rounded-full text-xs font-semibold ${user.status === "Active"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-200 text-gray-600"
                                            }`}
                                    >
                                        {user.status}
                                    </span>
                                </td>

                                {/* Actions */}
                                <td className="px-4 py-3 flex gap-2 justify-center">
                                    <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-xs transition">
                                        <ArrowUpCircle size={16} /> Promote
                                    </button>
                                    <button className="flex items-center gap-1 px-3 py-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-xs transition">
                                        <ArrowDownCircle size={16} /> Demote
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Back Link */}
            <div className="mt-6">
                <a
                    href="/users"
                    className="inline-block text-blue-600 hover:underline font-medium"
                >
                    {"< Back"}
                </a>
            </div>
        </div>
    );
}
