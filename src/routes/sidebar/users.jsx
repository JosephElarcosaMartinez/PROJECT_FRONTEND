import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import user1 from "@/assets/Joseph_prof.png";
import user2 from "@/assets/Joseph_prof.png";
import user3 from "@/assets/Joseph_prof.png";

const initialUsers = [
  { id: 1, name: "Sarah Wilson", username: "admin", email: "admin@example.com", role: "admin", image: user1 },
  { id: 2, name: "John Cooper", username: "john.cooper", email: "john@example.com", role: "paralegal", image: user2 },
  { id: 3, name: "Emma Thompson", username: "emma.thompson", email: "emma@example.com", role: "lawyer", image: user3 },
];

const roles = ["All", "Admin", "Lawyer", "Paralegal" ];

export default function Users() {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [userToRemove, setUserToRemove] = useState(null);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

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
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRole === "All" || user.role.toLowerCase() === selectedRole.toLowerCase();
    return matchesSearch && matchesRole;
  });

  return (
    <div className="bg-blue rounded-xl p-6 shadow-sm dark:bg-slate-900">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Users</h2>
          <p className="text-sm text-gray-500">Manage system users and their roles</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {roles.map(role => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            className={`px-4 py-1.5 rounded-full text-sm border ${
              selectedRole === role
                ? "bg-blue-600 text-white"
                : "border-gray-300 text-gray-700 hover:bg-blue-100"
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Add Admin Button */}
      <div className="flex justify-end">
        <button
          onClick={handleOpenModal}
          className="mt-2 md:mt-0 flex items-center gap-2 mb-6 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow"
        >
          Add Admin
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full table-auto text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="border-t border-gray-200 hover:bg-gray-50 transition">
                <td className="px-4 py-5 flex items-center gap-3">
                  <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                  <span className="font-medium text-gray-800">{user.name}</span>
                </td>
                <td className="px-4 py-3 text-gray-700">{user.username}</td>
                <td className="px-4 py-3 text-gray-700">{user.email}</td>
                <td className="px-4 py-3 capitalize text-gray-700">{user.role}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openRemoveModal(user)}
                      className="text-red-500 hover:text-red-700"
                    >
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

      {/* Remove Confirmation Modal */}
      {isRemoveModalOpen && userToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-sm shadow-lg relative">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Admin Removal
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Are you sure to remove this admin
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeRemoveModal}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveUser}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Remove
              </button>
            </div>
            <button
              onClick={closeRemoveModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
        <span>Showing 1 to {filteredUsers.length} of {users.length} entries</span>
        <div className="space-x-1">
          <button className="px-2 py-1 rounded border text-gray-600 hover:bg-gray-100">Previous</button>
          <button className="px-3 py-1 rounded bg-blue-600 text-white">1</button>
          <button className="px-2 py-1 rounded border text-gray-600 hover:bg-gray-100">2</button>
          <button className="px-2 py-1 rounded border text-gray-600 hover:bg-gray-100">Next</button>
        </div>
      </div>

      {/* Add Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-xl shadow-lg relative">
            <form className="space-y-0">
              <div>
                <label className="block text-sm font-medium text-blue-900 dark:text-white">Firstname</label>
                <input type="text" placeholder="Enter Firstname" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg dark:bg-slate-700 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-900 dark:text-white">Lastname</label>
                <input type="text" placeholder="Enter Lastname" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg dark:bg-slate-700 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-900 dark:text-white">Middlename</label>
                <input type="text" placeholder="Enter Middlename (optional)" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg dark:bg-slate-700 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-900 dark:text-white">Email</label>
                <input type="email" placeholder="admin@example.com" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg dark:bg-slate-700 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-900 dark:text-white">Password</label>
                <input type="password" placeholder="Password" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg dark:bg-slate-700 dark:text-white" />
              </div>
               <div>
                <label className="block text-sm font-medium text-blue-900 dark:text-white">PhoneNumber</label>
                <input type="password" placeholder="Phone Number" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg dark:bg-slate-700 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-900 dark:text-white">Confirm Password</label>
                <input type="password" placeholder="Confirm Password" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg dark:bg-slate-700 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-900 dark:text-white">Role</label>
                <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-blue-900 dark:bg-slate-700 dark:text-white">
                  <option>Admin</option>
                  <option>Lawyer</option>
                  <option>Paralegal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-900 dark:text-white">Select Branch</label>
                <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-blue-900 dark:bg-slate-700 dark:text-white">
                  <option>Select Branch</option>
                  <option>Dumanjug</option>
                  <option>Fuente</option>
                  <option>Camotes</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white">
                  Save
                </button>
              </div>
            </form>
            <button onClick={handleCloseModal} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl">
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
