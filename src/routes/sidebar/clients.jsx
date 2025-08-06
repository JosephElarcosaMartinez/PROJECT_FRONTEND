import { useState, useRef, useEffect } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";
import AddClient from "../../components/add-client";

const Client = () => {
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [clientContacts, setClientContacts] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [clientsRes, usersRes, contactsRes] = await Promise.all([
          fetch("http://localhost:3000/api/clients", { credentials: "include" }),
          fetch("http://localhost:3000/api/users", { credentials: "include" }),
          fetch("http://localhost:3000/api/client-contacts", { credentials: "include" }),
        ]);

        if (!clientsRes.ok || !usersRes.ok || !contactsRes.ok)
          throw new Error("Failed to fetch one or more resources");

        const [clients, users, contacts] = await Promise.all([
          clientsRes.json(),
          usersRes.json(),
          contactsRes.json(),
        ]);

        setTableData(clients);
        setUsers(users);
        setClientContacts(contacts);
      } catch (err) {
        console.error("Fetching error:", err);
        setError(err);
      }
    };

    fetchAll();
  }, []);

  const getUserFullName = (createdBy) => {
    const user = users.find((u) => u.user_id === createdBy);
    return user
      ? `${user.user_fname || ""} ${user.user_mname ? user.user_mname[0] + "." : ""} ${user.user_lname || ""}`
        .replace(/\s+/g, " ")
        .trim()
      : "Unknown";
  };

  const [AddClients, setAddClients] = useState(false);
  const [viewClient, setViewClient] = useState(null);
  const [editClient, setEditClient] = useState(null);
  const [userToRemove, setUserToRemove] = useState(null);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

  const viewModalRef = useRef();
  const editModalRef = useRef();
  const removeModalRef = useRef();

  useClickOutside([viewModalRef], () => setViewClient(null));
  useClickOutside([editModalRef], () => setEditClient(null));
  useClickOutside([removeModalRef], () => setIsRemoveModalOpen(false));

  const handleEditSave = () => {
    setTableData((prev) =>
      prev.map((item) => (item.id === editClient.id ? { ...item, ...editClient } : item))
    );
    setEditClient(null);
  };

  const filteredClients = tableData.filter((client) =>
    [client.client_fullname, client.client_email, client.client_phonenum, client.client_date_created]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClients.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openRemoveModal = (client) => {
    setUserToRemove(client);
    setIsRemoveModalOpen(true);
  };

  const closeRemoveModal = () => {
    setUserToRemove(null);
    setIsRemoveModalOpen(false);
  };

  const confirmRemoveUser = () => {
    // TODO: API logic to delete client
    closeRemoveModal();
  };

  return (
    <div className="bg-blue rounded-xl">
      {error && (
        <div className="alert alert-error mx-10 mb-5 mt-5 shadow-lg">
          <div><span>{error.message}</span></div>
        </div>
      )}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="title">Clients</h1>
          <p className="text-sm text-gray-500">Manage all client information here...</p>
        </div>
      </div>

      <div className="card mb-6 flex flex-col items-center gap-4 rounded-lg bg-white p-4 shadow-md dark:bg-slate-800 md:flex-row">
        <input
          type="text"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-gray-900 placeholder-gray-500 outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-gray-400 md:flex-1"
        />
        <button
          onClick={() => setAddClients(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
        >
          Add Client
        </button>
      </div>

      <div className="card shadow-lg">
        <table className="min-w-full table-auto text-left text-sm">
          <thead className="card-title text-xs uppercase">
            <tr>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Created by</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 dark:text-white">
            {currentItems.map((client) => (
              <tr key={client.id} className="border-t hover:bg-blue-50 dark:hover:bg-slate-800">
                <td className="px-4 py-3">{client.client_fullname}</td>
                <td className="px-4 py-3">{client.client_email}</td>
                <td className="px-4 py-3">{client.client_phonenum}</td>
                <td className="px-4 py-3">{client.client_date_created}</td>
                <td className="px-4 py-3">{getUserFullName(client.created_by)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setViewClient(client)} className="text-blue-600 hover:text-blue-800">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button onClick={() => setEditClient({ ...client })} className="text-yellow-500 hover:text-yellow-700">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => openRemoveModal(client)} className="text-red-600 hover:text-red-800">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-1 mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-blue-600 text-white" : "hover:bg-gray-200"}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Go to contact */}
      <div className="mt-6">
        <a href="/clients/contacts" className="text-blue-600 underline">Go to Client Contact</a>
      </div>

      {/* View Client Modal */}
      {viewClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div ref={viewModalRef} className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800">
            <h3 className="mb-4 text-xl font-bold">Client Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><strong>Name:</strong> {viewClient.client_fullname}</div>
              <div><strong>Email:</strong> {viewClient.client_email}</div>
              <div><strong>Phone:</strong> {viewClient.client_phonenum}</div>
              <div><strong>Created:</strong> {viewClient.client_date_created}</div>
            </div>
            <div className="mt-6">
              <p className="mb-2 font-semibold text-blue-700">Contact(s)</p>
              <table className="min-w-full table-auto text-left text-sm">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Phone</th>
                    <th className="px-4 py-2">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {clientContacts.filter(c => c.client_id === viewClient.client_id).map(contact => (
                    <tr key={contact.contact_id}>
                      <td className="px-4 py-2">{contact.contact_fullname}</td>
                      <td className="px-4 py-2">{contact.contact_email}</td>
                      <td className="px-4 py-2">{contact.contact_phone}</td>
                      <td className="px-4 py-2">{contact.contact_role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {clientContacts.filter(c => c.client_id === viewClient.client_id).length === 0 && (
                <p className="text-gray-500 mt-2">No contacts for this client.</p>
              )}
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={() => setViewClient(null)}
                className="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Client Modal */}
      {editClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg dark:bg-slate-800">
            <h3 className="mb-4 text-xl font-bold text-blue-900 dark:text-slate-200">Edit Client Info</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-blue-900 dark:text-blue-700">Full Name</label>
                <input
                  type="text"
                  value={editClient.client_fullname}
                  onChange={(e) => setEditClient({ ...editClient, client_fullname: e.target.value })}
                  className="w-full rounded-lg border px-3 py-2 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-blue-900 dark:text-blue-700">Email</label>
                <input
                  type="email"
                  value={editClient.client_email}
                  onChange={(e) => setEditClient({ ...editClient, client_email: e.target.value })}
                  className="w-full rounded-lg border px-3 py-2 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-blue-900 dark:text-blue-700">Phone</label>
                <input
                  type="text"
                  value={editClient.client_phonenum}
                  onChange={(e) => setEditClient({ ...editClient, client_phonenum: e.target.value })}
                  className="w-full rounded-lg border px-3 py-2 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setEditClient(null)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Modal */}
      {isRemoveModalOpen && userToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800">
            <h2 className="mb-4 text-lg font-semibold dark:text-white">Confirm Client Removal</h2>
            <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">Are you sure you want to remove this client?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeRemoveModal}
                className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveUser}
                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Remove
              </button>
            </div>
            <button
              onClick={closeRemoveModal}
              className="absolute right-2 top-2 text-xl text-gray-400 hover:text-gray-600"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {AddClients && (
        <AddClient AddClients={AddClients} setAddClients={setAddClients} />
      )}
    </div>
  );
};

export default Client;
