import { useState } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const InitialData = [
  {
    id: 1,
    name: "Davis Incorporation",
    client: "Davis Corp",
    category: "Corporate",
    status: "Pending",
    lawyer: "Sarah Wilson",
    balance: "P 35,000.00",
    fee: "P 50,000.00",
  },
  {
    id: 2,
    name: "Smith vs. Henderson",
    client: "John Smith",
    category: "Property",
    status: "Processing",
    lawyer: "John Cooper",
    balance: "P 7,000.00",
    fee: "P 10,000.00",
  },
  {
    id: 3,
    name: "Davis Incorporation",
    client: "Davis Corp",
    category: "Corporate",
    status: "Completed",
    lawyer: "Emma Thompson",
    balance: "P 12,500.00",
    fee: "P 12,500.00",
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "text-red-600 font-semibold";
    case "Processing":
      return "text-yellow-500 font-semibold";
    case "Completed":
      return "text-green-600 font-semibold";
    default:
      return "text-gray-500 font-semibold";
  }
};

const Cases = () => {
  const [data, setData] = useState(InitialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCase, setNewCase] = useState({
    id: "",
    name: "",
    category: "",
    client: "",
    branch: "",
    filedDate: "",
    description: "",
    fee: "",
    status: "Pending",
    lawyer: "Unassigned",
    balance: "P 0.00",
  });
  const navigate = useNavigate();

  const handleAddCase = () => {
    const formattedFee = newCase.fee.startsWith("P") ? newCase.fee : `P ${newCase.fee}`;
    setData([...data, { ...newCase, id: parseInt(newCase.id), fee: formattedFee }]);
    setNewCase({
      id: "",
      name: "",
      category: "",
      client: "",
      branch: "",
      filedDate: "",
      description: "",
      fee: "",
      status: "Pending",
      lawyer: "Unassigned",
      balance: "P 0.00",
    });
    setIsModalOpen(false);
    alert("New case has been added successfully!");
  };

  return (
    <div className="bg-blue rounded-xl p-4 sm:p-6 shadow-sm bg-slate-50 dark:bg-slate-900">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Cases</h2>
          <p className="text-sm text-gray-500 dark:text-gray-300">Manage all case details here...</p>
        </div>
      </div>

      <div className="flex justify-end gap-3 mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow"
        >
          + Add New Case
        </button>
        <button
          onClick={() => navigate("/clients")}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow"
        >
          View Clients
        </button>
      </div>

      <div className="w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="min-w-full text-sm text-left table-auto">
          <thead className="uppercase text-xs dark:text-white">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">Case ID</th>
              <th className="px-4 py-3 whitespace-nowrap">Name</th>
              <th className="px-4 py-3 whitespace-nowrap">Client</th>
              <th className="px-4 py-3 whitespace-nowrap">Category</th>
              <th className="px-4 py-3 whitespace-nowrap">Status</th>
              <th className="px-4 py-3 whitespace-nowrap">Lawyer</th>
              <th className="px-4 py-3 whitespace-nowrap">Fee</th>
              <th className="px-4 py-3 whitespace-nowrap">Balance</th>
              <th className="px-4 py-3 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 dark:text-white">
            {data.map((item) => (
              <tr
                key={item.id}
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
              >
                <td className="px-4 py-3 whitespace-nowrap">{item.id}</td>
                <td className="px-4 py-3 whitespace-nowrap">{item.name}</td>
                <td className="px-4 py-3 whitespace-nowrap">{item.client}</td>
                <td className="px-4 py-3 whitespace-nowrap">{item.category}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{item.lawyer}</td>
                <td className="px-4 py-3 whitespace-nowrap">{item.fee}</td>
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg w-full max-w-3xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Add New Case</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                ["Cabinet Number", "CabinetNum"],
                ["Drawer Number", "DrawerNum"],
                ["Folder Number", "FolderNum"],
                ["Case Name", "name"],
                ["Case Category", "category"],
                ["Client", "client"],
                ["Branch", "branch"],
                ["Filed Date", "filedDate", "date"],
                ["Fee", "fee"],
              ].map(([label, name, type = "text"]) => (
                <div key={name}>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={newCase[name]}
                    onChange={(e) => setNewCase({ ...newCase, [name]: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              ))}

              <div className="md:col-span-2">
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea
                  name="description"
                  value={newCase.description}
                  onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg resize-none dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                  rows={4}
                ></textarea>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300 dark:text-white dark:bg-gray-600 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCase}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Add Case
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cases;
