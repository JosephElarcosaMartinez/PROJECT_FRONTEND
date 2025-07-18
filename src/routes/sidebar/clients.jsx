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
    balance: "P 35,000.00"
  },
  {
    id: 2,
    name: "Smith vs. Henderson",
    client: "John Smith",
    category: "Property",
    status: "Processing",
    lawyer: "John Cooper",
    balance: "P 7,000.00"
  },
  {
    id: 3,
    name: "Davis Incorporation",
    client: "Davis Corp",
    category: "Corporate",
    status: "Completed",
    lawyer: "Emma Thompson",
    balance: "P 12,500.00"
  }
];

const Client = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState(InitialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

    setData([
      ...data,
      {
        id: newId,
        name: `${newClient.Fullname} Case`,
        client: newClient.Fullname,
        category: "General",
        status: "Pending",
        lawyer: "Assigned Soon",
        balance: "P 0.00"
      }
    ]);

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

  const filteredClients = data.filter((item) =>
    item.client.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-blue rounded-xl p-4 sm:p-6 shadow-lg bg-slate-50 dark:bg-slate-900">
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

      <div className="w-full overflow-x-auto rounded-xl border border-gray-200">
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
                      onClick={() => alert(`Viewing ${item.name}`)}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1.5 text-yellow-500 hover:text-yellow-700"
                      onClick={() => alert(`Editing ${item.name}`)}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1.5 text-red-600 hover:text-red-800"
                      onClick={() => alert(`Deleting ${item.name}`)}
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            ref={modalRef}
            className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg w-full max-w-3xl overflow-y-auto max-h-[90vh]"
          >
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Add New Client</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                ["Fullname", "Fullname"],
                ["Contact Number", "ContactNumber"],
                ["Email", "Email"],
                ["Address", "Address"],
                ["Contact Person", "ContactPerson"],
                ["Contact Person Number", "ContactPersonNumber"]
              ].map(([label, key]) => (
                <div key={key}>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                  </label>
                  <input
                    type="text"
                    name={key}
                    value={newClient[key]}
                    onChange={(e) =>
                      setNewClient({ ...newClient, [key]: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300 dark:text-white dark:bg-gray-600 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAddClient}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Add Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Client;
