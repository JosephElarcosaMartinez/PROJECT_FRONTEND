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
  // Add more for testing pagination
  { id: 4, name: "Michael Brown", username: "michael.brown", email: "michael@example.com", role: "staff", image: user1 },
  { id: 5, name: "Olivia Green", username: "olivia.green", email: "olivia@example.com", role: "lawyer", image: user2 },
  { id: 6, name: "David White", username: "david.white", email: "david@example.com", role: "admin", image: user3 },
  { id: 7, name: "Sophia Miller", username: "sophia.miller", email: "sophia@example.com", role: "paralegal", image: user1 },
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="bg-blue rounded-xl shadow-sm ">
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
            onClick={() => {
              setSelectedRole(role);
              setCurrentPage(1); // reset page when filtering
            }}
            className={`px-4 py-1.5 rounded-full text-sm border ${selectedRole === role
              ? "bg-blue-600 text-white"
              : "border-gray-300 text-gray-800 dark:text-white"
              }`}
          >
            {role}
          </button>
        ))}
      </div>

      <div className="card bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 mb-6 flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // reset page when searching
          }}
          className="w-full md:flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white"
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Add User
        </button>
      </div>

      <div className="card shadow-lg">
        <table className="w-full table-auto text-slate-900 text-sm text-left dark:text-white">
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
            {currentUsers.map(user => (
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
            {currentUsers.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex justify-end items-center gap-1 mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 border rounded ${currentPage === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700"}`}
        >
          &lt;
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${currentPage === i + 1
              ? "bg-blue-600 text-white"
              : "bg-white hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700"}`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 border rounded ${currentPage === totalPages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700"}`}
        >
          &gt;
        </button>
      </div>

      {isModalOpen && <AddUserModal onClose={() => setIsModalOpen(false)} />}

      {/* Edit Modal */}
      {isEditModalOpen && userToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          {/* ... your edit modal code (unchanged) */}
        </div>
      )}

      {/* Remove Modal */}
      {isRemoveModalOpen && userToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          {/* ... your remove modal code (unchanged) */}
        </div>
      )}
    </div>
  );
};

export default Users;
