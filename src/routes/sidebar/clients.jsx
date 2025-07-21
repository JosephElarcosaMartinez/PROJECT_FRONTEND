import { useState, useRef } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";

const InitialData = [
  {
    id: 1,
    name: "Davis Incorporation",
    client: "Davis Corp",
    category: "Corporate",
    status: "Pending",
    lawyer: "Sarah Wilson",
    balance: "P 35,000.00",
    email: "daviscorp@gmail.com",
    phone: "09392233450",
    emergency: "09323136701",
    role: "Client"
  },
  {
    id: 2,
    name: "Smith vs. Henderson",
    client: "John Smith",
    category: "Property",
    status: "Processing",
    lawyer: "John Cooper",
    balance: "P 7,000.00",
    email: "johnsmith@gmail.com",
    phone: "09228889999",
    emergency: "09112223333",
    role: "Client"
  },
  {
    id: 3,
    name: "Davis Incorporation",
    client: "Davis Corp",
    category: "Corporate",
    status: "Completed",
    lawyer: "Emma Thompson",
    balance: "P 12,500.00",
    email: "corp@email.com",
    phone: "09445556666",
    emergency: "09551112222",
    role: "Client"
  }
];

const Client = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState(InitialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewClient, setViewClient] = useState(null);
  const [editClient, setEditClient] = useState(null);
  const [userToRemove, setUserToRemove] = useState(null);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

  const [newClient, setNewClient] = useState({
    Fullname: "",
    ContactNumber: "",
    Email: "",
    Address: "",
    ContactPerson: "",
    ContactPersonNumber: ""
  });

  const modalRef = useRef(null);
  useClickOutside([modalRef], () => {
    if (isModalOpen) setIsModalOpen(false);
  });

  const handleAddClient = () => {
    const newId = data.length ? data[data.length - 1].id + 1 : 1;

    const newEntry = {
      id: newId,
      name: `${newClient.Fullname} Case`,
      client: newClient.Fullname,
      category: "General",
      status: "Pending",
      lawyer: "Assigned Soon",
      balance: "P 0.00",
      email: newClient.Email,
      phone: newClient.ContactNumber,
      emergency: newClient.ContactPersonNumber,
      role: "Client"
    };

    setData([...data, newEntry]);
    setNewClient({
      Fullname: "",
      ContactNumber: "",
      Email: "",
      Address: "",
      ContactPerson: "",
      ContactPersonNumber: ""
    });
    setIsModalOpen(false);
    alert("New client has been added successfully!");
  };

  const handleEditSave = () => {
    setData((prev) =>
      prev.map((item) =>
        item.id === editClient.id ? { ...item, ...editClient } : item
      )
    );
    setEditClient(null);
  };

  const filteredClients = data.filter((item) =>
    item.client.toLowerCase().includes(search.toLowerCase())
  );

  const openRemoveModal = (client) => {
    setUserToRemove(client);
    setIsRemoveModalOpen(true);
  };

  const closeRemoveModal = () => {
    setUserToRemove(null);
    setIsRemoveModalOpen(false);
  };

  const confirmRemoveUser = () => {
    setData((prev) => prev.filter((item) => item.id !== userToRemove.id));
    closeRemoveModal();
  };

  return (
    <div className="bg-blue rounded-xl ">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Clients</h2>
          <p className="text-sm text-gray-500">Manage all client information here...</p>
        </div>
      </div>

      <div className="card bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 mb-6 flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none"
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow"
        >
          Add Client
        </button>
      </div>

      <div className="w-full overflow-x-auto rounded-lg p-4  border-gray-200 shadow-lg bg-slate-50 dark:bg-slate-900">
        <table className="min-w-full text-sm text-left table-auto">
          <thead className="card-title uppercase text-xs">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">Client</th>
              <th className="px-4 py-3 whitespace-nowrap">Lawyer</th>
              <th className="px-4 py-3 whitespace-nowrap">Balance</th>
              <th className="px-4 py-3 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 dark:text-white">
            {filteredClients.map((item) => (
              <tr
                key={item.id}
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
              >
                <td className="px-4 py-3 whitespace-nowrap">{item.client}</td>
                <td className="px-4 py-3 whitespace-nowrap">{item.lawyer}</td>
                <td className="px-4 py-3 whitespace-nowrap">{item.balance}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      className="p-1.5 text-blue-600 hover:text-blue-800"
                      onClick={() => setViewClient(item)}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1.5 text-yellow-500 hover:text-yellow-700"
                      onClick={() => setEditClient({ ...item })}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1.5 text-red-600 hover:text-red-800"
                      onClick={() => openRemoveModal(item)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Client Modal */}
      {viewClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-blue-900">Client Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-blue-900">
              <div>
                <p className="font-semibold">Name</p>
                <p className="text-gray-600 dark:text-white">{viewClient.client}</p>
              </div>
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-gray-600 dark:text-white">{viewClient.email || "-"}</p>
              </div>
              <div>
                <p className="font-semibold">Phone</p>
                <p className="text-gray-600 dark:text-white">{viewClient.phone || "-"}</p>
              </div>
              <div>
                <p className="font-semibold">Emergency</p>
                <p className="text-gray-600 dark:text-white">{viewClient.emergency || "-"}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setViewClient(null)}
                className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
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
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-6 text-blue-900">Edit Client</h3>
            <div className="grid grid-cols-1 gap-4">
              {["client", "email", "phone", "emergency"].map((field) => (
                <div key={field}>
                  <label className="block mb-1 text-sm font-medium capitalize text-gray-700 dark:text-gray-300">
                    {field}
                  </label>
                  <input
                    type="text"
                    value={editClient[field]}
                    onChange={(e) =>
                      setEditClient({ ...editClient, [field]: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setEditClient(null)}
                className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-4 py-2 text-sm bg-blue-900 text-white rounded-lg hover:bg-blue-800"
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
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-sm shadow-lg relative">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">
              Are you sure?
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to remove this client?
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

export default Client;
