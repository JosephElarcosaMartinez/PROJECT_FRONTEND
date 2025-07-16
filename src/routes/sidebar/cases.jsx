import { useState } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const InitialData = [
  { id: 1, name: "Davis Incorporation", client: "Davis Corp", category: "Corporate", status: "Pending", lawyer: "Sarah Wilson", balance: "P 35, 000.00" },
  { id: 2, name: "Smith vs. Henderson", client: "John Smith", category: "Property", status: "Processing", lawyer: "John Cooper", balance: "P 7, 000.00" },
  { id: 3, name: "Davis Incorporation", client: "Davis Corp", category: "Corporate", status: "Completed", lawyer: "Emma Thompson", balance: "P 12, 500.00" },
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
  const navigate = useNavigate();


  return (
    <div className="bg-blue rounded-xl p-4 sm:p-6 shadow-sm bg-slate-50 dark:bg-slate-900">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Cases</h2>
          <p className="text-sm text-gray-500">Manage all case details here...</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => navigate("/clients")}
          className="mt-2 md:mt-0 flex items-center gap-2 mb-6 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow"
        >
          View Clients
        </button>
      </div>
      <div className="w-full overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full text-sm text-left table-auto">
          <thead className="card-title uppercase text-xs">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">Case ID</th>
              <th className="px-4 py-3 whitespace-nowrap">Name</th>
              <th className="px-4 py-3 whitespace-nowrap">Client</th>
              <th className="px-4 py-3 whitespace-nowrap">Category</th>
              <th className="px-4 py-3 whitespace-nowrap">Status</th>
              <th className="px-4 py-3 whitespace-nowrap">Lawyer</th>
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
    </div>
  );
}

export default Cases;
