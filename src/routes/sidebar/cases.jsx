import { useState, useRef, useEffect } from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useClickOutside } from "@/hooks/use-click-outside";
import ViewModal from "../../components/view-case";

const InitialData = [
  {
    id: 1,
    name: "Davis Incorporation",
    client: "Davis Corp",
    category: "Corporate",
    status: "Pending",
    filedDate: "2025-04-16",
    lawyer: "Sarah Wilson",
    balance: "P 40,000.00",
    fee: "P 50,000.00",
  },
  {
    id: 2,
    name: "Smith vs. Henderson",
    client: "John Smith",
    category: "Property",
    status: "Processing",
    filedDate: "2025-04-17",
    lawyer: "John Cooper",
    balance: "P 0,000.00",
    fee: "P 10,000.00",
  },
  {
    id: 3,
    name: "Davis Incorporation",
    client: "Davis Corp",
    category: "Corporate",
    status: "Completed",
    filedDate: "2025-04-18",
    lawyer: "Emma Thompson",
    balance: "P 2,500.00",
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
  const [search, setSearch] = useState("");
  const [data, setData] = useState(InitialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  // Edit state
  const [caseToEdit, setCaseToEdit] = useState(null);

  // Delete state
  const [caseToDelete, setCaseToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const addCaseModalRef = useRef();
  const editCaseModalRef = useRef();
  const deleteCaseModalRef = useRef();

  const navigate = useNavigate();

  const [newCase, setNewCase] = useState({
    id: "",
    name: "",
    category: "",
    client: "",
    branch: "",
    description: "",
    fileDate: "",
    fee: "",
    status: "Pending",
    lawyer: "Unassigned",
    balance: "P 0.00",
  });

  // Click outside for modals
  useClickOutside([addCaseModalRef], () => setIsModalOpen(false));
  useClickOutside([editCaseModalRef], () => setCaseToEdit(null));
  useClickOutside([deleteCaseModalRef], () => setIsDeleteModalOpen(false));

  // Close modals with Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
        setSelectedCase(null);
        setCaseToEdit(null);
        setIsDeleteModalOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleAddCase = () => {
    const formattedFee = newCase.fee.startsWith("P") ? newCase.fee : `P ${newCase.fee}`;
    setData([...data, { ...newCase, id: parseInt(newCase.id), fee: formattedFee }]);
    setNewCase({
      id: "",
      name: "",
      category: "",
      client: "",
      branch: "",
      description: "",
      fileDate: "",
      fee: "",
      status: "Pending",
      lawyer: "Unassigned",
      balance: "P 0.00",
    });
    setIsModalOpen(false);
    alert("New case has been added successfully!");
  };

  //filed Date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { day: "numeric", month: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Open edit modal
  const openEditModal = (item) => {
    setCaseToEdit({ ...item });
  };

  const handleEditSave = () => {
    setData((prev) => prev.map((c) => (c.id === caseToEdit.id ? caseToEdit : c)));
    setCaseToEdit(null);
    alert("Case updated successfully!");
  };

  // Open delete modal
  const openDeleteModal = (item) => {
    setCaseToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCase = () => {
    setData((prev) => prev.filter((c) => c.id !== caseToDelete.id));
    setIsDeleteModalOpen(false);
    setCaseToDelete(null);
    alert("Case deleted successfully!");
  };

  return (
    <div className="bg-blue rounded-xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 ">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Cases</h2>
          <p className="text-sm text-gray-500 dark:text-gray-300">Manage all case details here...</p>
        </div>
      </div>

      {/* Search and Buttons */}
      <div className="card bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 mb-6 flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Search case..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none"
        />
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

      {/* Case Table */}
      <div className="card overflow-x-auto shadow-lg">
        <table className=" min-w-full text-sm text-left table-auto border-separate border-spacing-y-4">
          <thead className="uppercase text-xs dark:text-white border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-4 py-3 w-20 truncate max-w-xs">Case ID</th>
              <th className="px-2 py-3 w-48">Name</th>
              <th className="px-4 py-3 w-48">Client</th>
              <th className="px-4 py-3 w-32">Category</th>
              <th className="px-4 py-3 w-24">Status</th>
              <th className="px-4 py-3 w-32">Lawyer</th>
              <th className="px-2 py-3 w-28">Date</th>
              <th className="px-4 py-3 w-24">Fee</th>
              <th className="px-4 py-3 w-24">Balance</th>
              <th className="px-4 py-3 w-32">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 dark:text-white divide-y divide-gray-200 dark:divide-gray-700">
            {data.map((item) => (
              <tr key={item.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition">
                <td className="px-4 py-3">C{item.id}</td>
                <td className="px-2 py-3 truncate max-w-xs" title={item.name}>{item.name}</td>
                <td className="px-4 py-3 truncate max-w-xs" title={item.client}>{item.client}</td>
                <td className="px-4 py-3">{item.category}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3 truncate max-w-xs">{item.lawyer}</td>
                <td className="px-2 py-3 truncate max-w-xs">{item.filedDate}</td>
                <td className="px-4 py-3 truncate max-w-xs">{item.fee}</td>
                <td className="px-4 py-3 truncate max-w-xs">{item.balance}</td>
                <td className="px-4 py-3 max-w-[60px]">
                  <div className="flex items-center gap-1">
                    <button
                      className="p-1 text-blue-600 hover:text-blue-800"
                      onClick={() => setSelectedCase(item)}
                      title="View"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                    <button
                      className="p-1 text-yellow-500 hover:text-yellow-700"
                      onClick={() => openEditModal(item)}
                      title="Edit"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      className="p-1 text-red-600 hover:text-red-800"
                      onClick={() => openDeleteModal(item)}
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Case Modal */}
      {
        isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div ref={addCaseModalRef} className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg w-full max-w-3xl overflow-y-auto max-h-[90vh]">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Add New Case</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[["Cabinet Number", "id"], ["Case Name", "name"], ["Folder Number", "id"], ["Category", "category"], ["Client", "client"], ["Branch", "branch"], ["Filed Date", "date"], ["Fee", "fee"]].map(([label, name, type = "text"]) => (
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
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300 dark:text-white dark:bg-gray-600 dark:hover:bg-gray-500">
                  Cancel
                </button>
                <button onClick={handleAddCase} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  Add Case
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Edit Case Modal */}
      {
        caseToEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
              ref={editCaseModalRef}
              className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg w-full max-w-3xl overflow-y-auto max-h-[90vh]"
            >
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Edit Case</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[["Case Name", "name"], ["Category", "category"], ["Client", "client"], ["Branch", "branch"], ["Fee", "fee"], ["Status", "status"], ["Lawyer", "lawyer"]].map(([label, name]) => (
                  <div key={name}>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
                    <input
                      type="text"
                      name={name}
                      value={caseToEdit?.[name] || ""}
                      onChange={(e) => setCaseToEdit({ ...caseToEdit, [name]: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                ))}

                {/* Filed Date */}
                <div>
                  <label className="block mb-1 py-1 text-sm font-medium text-gray-700 dark:text-gray-300">Filed Date</label>
                  <p className="w-full py-1 dark:border-gray-600 dark:text-white">
                    {formatDate(caseToEdit?.filedDate)}
                  </p>
                </div>

                {/* Description Field */}
                <div className="md:col-span-2">
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                  <textarea
                    name="description"
                    value={caseToEdit?.description || ""}
                    onChange={(e) => setCaseToEdit({ ...caseToEdit, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg resize-none dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                    rows={4}
                  ></textarea>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setCaseToEdit(null)} className="px-4 py-2 text-sm font-medium text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300 dark:text-white dark:bg-gray-600 dark:hover:bg-gray-500">
                  Cancel
                </button>
                <button onClick={handleEditSave} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Delete Case Modal */}
      {
        isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div ref={deleteCaseModalRef} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg w-full max-w-sm">
              <h3 className="text-lg font-semibold mb-4">Confirm Remove</h3>
              <p className="mb-6">Are you sure you want to remove case <strong>{caseToDelete?.name}</strong>?</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                  Cancel
                </button>
                <button onClick={handleDeleteCase} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                  remove
                </button>
              </div>
            </div>
          </div>
        )
      }

      <ViewModal selectedCase={selectedCase} setSelectedCase={setSelectedCase} />
    </div >
  );
};

export default Cases;
