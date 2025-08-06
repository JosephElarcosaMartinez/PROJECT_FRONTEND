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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch clients, users, contacts
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

  const [AddClients, setAddClients] = useState(null);
  const [viewClient, setViewClient] = useState(null);
  const [editClient, setEditClient] = useState(null);
  const [userToRemove, setUserToRemove] = useState(null);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

  // Click outside refs
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

  const filteredClients = tableData.filter(
    (client) =>
      client.client_fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.client_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.client_phonenum.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.client_date_created.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.created_by.toString().includes(searchTerm)
  );

  // Pagination logic
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
    // Logic to remove the user
    closeRemoveModal();
  };

  return (
    <div className="bg-blue rounded-xl">
      {error && (
        <div className="alert alert-error mx-10 mb-5 mt-5 shadow-lg">
          <div>
            <span>{error.message}</span>
          </div>
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
              <th className="whitespace-nowrap px-4 py-3">Client</th>
              <th className="whitespace-nowrap px-4 py-3">Email</th>
              <th className="whitespace-nowrap px-4 py-3">Phone</th>
              <th className="whitespace-rowrap px-4 py-3">Date</th>
              <th className="whitespace-nowrap px-4 py-3">Created by</th>
              <th className="whitespace-nowrap px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 dark:text-white">
            {currentItems.map((client) => (
              <tr
                key={client.id}
                className="border-t border-gray-200 transition hover:bg-blue-50 dark:border-gray-700 dark:hover:bg-slate-800"
              >
                <td className="whitespace-nowrap px-4 py-3">{client.client_fullname}</td>
                <td className="whitespace-nowrap px-4 py-3">{client.client_email}</td>
                <td className="whitespace-nowrap px-4 py-3">{client.client_phonenum}</td>
                <td className="whitespace-nowrap px-4 py-3">{client.client_date_created}</td>
                <td className="whitespace-nowrap px-4 py-3">{getUserFullName(client.created_by)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button className="p-1.5 text-blue-600 hover:text-blue-800" onClick={() => setViewClient(client)}>
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 text-yellow-500 hover:text-yellow-700" onClick={() => setEditClient({ ...client })}>
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 text-red-600 hover:text-red-800" onClick={() => openRemoveModal(client)}>
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
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 border rounded ${currentPage === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700"
            }`}
        >
          &lt;
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${currentPage === i + 1
              ? "bg-blue-600 text-white"
              : "bg-white hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700"
              }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 border rounded ${currentPage === totalPages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700"
            }`}
        >
          &gt;
        </button>
      </div>


      {/* View, Edit, Remove Modals - unchanged */}
      {/* ... rest of your modals here ... */}

      {AddClients && <AddClient AddClients={AddClients} setAddClients={setAddClients} />}
    </div>
  );
};

export default Client;
