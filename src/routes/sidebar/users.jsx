import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import user1 from "@/assets/Joseph_prof.png";
import user2 from "@/assets/Joseph_prof.png";
import user3 from "@/assets/Joseph_prof.png";
import AddUserModal from "@/components/add-users";

const initialUsers = [
  { id: 1, name: "Sarah Wilson", username: "admin", email: "admin@example.com", role: "admin", image: user1 },
  { id: 2, name: "John Cooper", username: "john.cooper", email: "john@example.com", role: "paralegal", image: user2 },
  { id: 3, name: "Emma Thompson", username: "emma.thompson", email: "emma@example.com", role: "lawyer", image: user3 },
];

const roles = ["All", "Admin", "Lawyer", "Paralegal", "Staff"];

const Users = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState(initialUsers);
  const [selectedRole, setSelectedRole] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [userToRemove, setUserToRemove] = useState(null);

  const openRemoveModal = (user) => {
    setUserToRemove(user);
    setIsRemoveModalOpen(true);
  };

  const closeRemoveModal = () => {
    setIsRemoveModalOpen(false);
    setUserToRemove(null);
  };

  const confirmRemoveUser = () => {
    setUsers(prev => prev.filter(u => u.id !== userToRemove.id));
    closeRemoveModal();
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = selectedRole === "All" || user.role.toLowerCase() === selectedRole.toLowerCase();
    return matchesSearch && matchesRole;
  });

  return (
    <div className="bg-blue rounded-xl p-6 shadow-sm dark:bg-slate-900">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Users</h2>
          <p className="text-sm text-gray-500">Manage system users and their roles</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {roles.map(role => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            className={`px-4 py-1.5 rounded-full text-sm border ${selectedRole === role
              ? "bg-blue-600 text-white"
              : "border-gray-300 text-gray-800 dark:text-white"
              }`}
          >
            {role}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white"
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Add User
        </button>
      </div>

      <div className="overflow-x-auto border rounded-xl shadow">
        <table className="w-full table-auto text-sm text-left">
          <thead className="uppercase text-xs">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="dark:text-slate-50">
            {filteredUsers.map(user => (
              <tr key={user.id} className="border-t hover:bg-blue-50 dark:hover:bg-blue-950">
                <td className="px-4 py-5 flex items-center gap-3">
                  <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                  <span className="font-medium">{user.name}</span>
                </td>
                <td className="px-4 py-3">{user.username}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3 capitalize">{user.role}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => openRemoveModal(user)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && <AddUserModal onClose={() => setIsModalOpen(false)} />}

      {/* Remove Modal */}
      {isRemoveModalOpen && userToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-sm shadow-lg relative">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Admin Removal</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to remove this admin?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={closeRemoveModal} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700">
                Cancel
              </button>
              <button onClick={confirmRemoveUser} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
                Remove
              </button>
            </div>
            <button onClick={closeRemoveModal} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl">
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
