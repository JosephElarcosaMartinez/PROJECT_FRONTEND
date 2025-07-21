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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

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

  const openEditModal = (user) => {
    setUserToEdit(user);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setUserToEdit(null);
  };

  const saveEditedUser = (updatedUser) => {
    setUsers(prev =>
      prev.map(u => (u.id === updatedUser.id ? updatedUser : u))
    );
    closeEditModal();
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole =
      selectedRole === "All" || user.role.toLowerCase() === selectedRole.toLowerCase();
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

      <div className="overflow-x-auto border rounded-xl shadow ">
        <table className="w-full table-auto text-slate-900 text-sm text-left">
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
                    <button onClick={() => openEditModal(user)} className="text-blue-600 hover:text-blue-800">
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

      {/* Edit Modal */}
      {isEditModalOpen && userToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl w-full max-w-md shadow-lg relative">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Edit User</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveEditedUser(userToEdit);
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-sm font-medium dark:text-white">Name</label>
                <input
                  type="text"
                  value={userToEdit.name}
                  onChange={(e) => setUserToEdit({ ...userToEdit, name: e.target.value })}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium dark:text-white">Username</label>
                <input
                  type="text"
                  value={userToEdit.username}
                  onChange={(e) => setUserToEdit({ ...userToEdit, username: e.target.value })}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium dark:text-white">Email</label>
                <input
                  type="email"
                  value={userToEdit.email}
                  onChange={(e) => setUserToEdit({ ...userToEdit, email: e.target.value })}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium dark:text-white">Role</label>
                <select
                  value={userToEdit.role}
                  onChange={(e) => setUserToEdit({ ...userToEdit, role: e.target.value })}
                  className="w-full mt-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  <option value="admin">Admin</option>
                  <option value="lawyer">Lawyer</option>
                  <option value="paralegal">Paralegal</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={closeEditModal} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg text-gray-800">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white">Save Changes</button>
              </div>
            </form>
            <button onClick={closeEditModal} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl">
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Remove Modal */}
      {isRemoveModalOpen && userToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-sm shadow-lg relative">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">
              {userToRemove.role.charAt(0).toUpperCase() + userToRemove.role.slice(1)} Removal
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to remove this {userToRemove.role.toLowerCase()}?
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
