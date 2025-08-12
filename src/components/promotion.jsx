import { Pencil, Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
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
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="title">Users {" > "} Promotions</h1>
                </div>
            </div>

            <div className="card overflow-x-auto rounded-xl border shadow-md dark:border-slate-700">
                <table className="w-full table-auto text-left text-sm">
                    <thead className="text-xs uppercase dark:text-slate-400">
                        <tr>
                            <th className="px-4 py-3">User</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Phone</th>
                            <th className="px-4 py-3">Role</th>
                            <th className="px-4 py-3">Date Created</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="dark:text-slate-50">
                        {allUsers.map((user) => (
                            <tr key={user.id} className="border-t border-gray-200 hover:bg-blue-50 dark:border-slate-700 dark:hover:bg-blue-950">
                                <td className="px-4 py-3 flex items-center gap-3 whitespace-nowrap">
                                    <img
                                        src={user.image}
                                        alt={user.name}
                                        className="w-10 h-10 rounded-full border-2 border-green-500 flex-shrink-0"
                                    />
                                    <span className="truncate max-w-[140px]">{user.name}</span>
                                </td>
                                <td className="px-4 py-3 truncate whitespace-nowrap max-w-[200px]">{user.email}</td>
                                <td className="px-4 py-3 whitespace-nowrap">{user.phone}</td>
                                <td className="px-4 py-3 whitespace-nowrap">{user.role}</td>
                                <td className="px-4 py-3 whitespace-nowrap">{user.dateCreated}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-3 py-2 rounded text-white text-sm ${user.status === "Active" ? "bg-green-500" : "bg-gray-500"}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 flex gap-2 justify-center">
                                    <button className="flex items-center gap-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                                        <ArrowUpCircle size={16} /> Promote
                                    </button>
                                    <button className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm">
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
                    className="text-blue-600 hover:underline"
                >
                    {" < Back "}
                </a>
            </div>

        </div>
    );
}
