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
  },
  {
    id: 2,
    name: "Smith vs. Henderson",
    client: "John Smith",
    category: "Property",
    status: "Processing",
    filedDate: "2025-04-17",
    lawyer: "John Cooper",
    balance: "P 5,000.00",
  },
  {
    id: 3,
    name: "Davis Incorporation",
    client: "Davis Corp",
    category: "Corporate",
    status: "Completed",
    filedDate: "2025-04-18",
    lawyer: "Emma Thompson",
    balance: "P 0.00",
  },
];

//  Status text colors
const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "bg-red-200 text-red-700 border border-red-300";    
    case "Processing":
      return "bg-yellow-200 text-yellow-700 border border-yellow-300"; 
    case "Completed":
      return "bg-green-200 text-green-700 border border-green-300";  
    default:
      return "bg-gray-200 text-gray-700 border border-gray-300";
  }
};

//  Tab colors
const getTabColor = (status, selectedStatus) => {
  const isActive = selectedStatus === status;

  switch (status) {
    case "Pending":
      return isActive ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300";
    case "Processing":
      return isActive ? "bg-yellow-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300";
    case "Completed":
      return isActive ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300";
    default:
      return isActive ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300";
  }
};

const Cases = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState(InitialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [caseToEdit, setCaseToEdit] = useState(null);
  const [caseToDelete, setCaseToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState("All");
  const statusTabs = ["All", "Pending", "Processing", "Completed"];

  const viewModalRef = useRef();
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

  //  Click outside modals
  useClickOutside([viewModalRef], () => setIsModalOpen(false));
  useClickOutside([addCaseModalRef], () => setIsModalOpen(false));
  useClickOutside([editCaseModalRef], () => setCaseToEdit(null));
  useClickOutside([deleteCaseModalRef], () => setIsDeleteModalOpen(false));

  // Close modals on Esc
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
    setData([...data, { ...newCase, id: parseInt(newCase.id), fee: formattedFee }]);
    setNewCase({
      id: "",
      name: "",
      category: "",
      client: "",
      branch: "",
      description: "",
      fileDate: "",
      status: "Pending",
      lawyer: "Unassigned",
      balance: "P 0.00",
    });
    setIsModalOpen(false);
    alert("New case has been added successfully!");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { day: "numeric", month: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const openEditModal = (item) => setCaseToEdit({ ...item });
  const handleEditSave = () => {
    setData((prev) => prev.map((c) => (c.id === caseToEdit.id ? caseToEdit : c)));
    setCaseToEdit(null);
    alert("Case updated successfully!");
  };

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

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.client.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === "All" || item.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => setCurrentPage(1), [search, selectedStatus]);

  return (
    <div className="bg-blue rounded-xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 ">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Cases</h2>
          <p className="text-sm text-gray-500 dark:text-gray-300">Manage all case details here...</p>
        </div>
      </div>

      {/*  Tabs with colors */}
      <div className="flex gap-3 mb-4">
        {statusTabs.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${getTabColor(status, selectedStatus)}`}
          >
            {status}
          </button>
        ))}
      </div>

      {/*  Search & Buttons */}
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
          New Case
        </button>
        <button
          onClick={() => navigate("/clients")}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow"
        >
          View Clients
        </button>
      </div>

      {/*  Table */}
      <div className="card overflow-x-auto shadow-lg">
        <table className="min-w-full text-sm text-left table-auto border-separate border-spacing-y-4">
          <thead className="uppercase text-xs dark:text-white border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-4 py-3">Case ID</th>
              <th className="px-2 py-3">Name</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Lawyer</th>
              <th className="px-2 py-3">Date</th>
              <th className="px-4 py-3">Balance</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 dark:text-white divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-800 transition">
                <td className="px-4 py-3">C{item.id}</td>
                <td className="px-2 py-3">{item.name}</td>
                <td className="px-4 py-3">{item.client}</td>
                <td className="px-4 py-3">{item.category}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3">{item.lawyer}</td>
                <td className="px-2 py-3">{item.filedDate}</td>
                <td className="px-4 py-3">{item.balance}</td>
                <td className="px-4 py-3 flex gap-1">
                  <button className="p-1 text-blue-600 hover:text-blue-800" onClick={() => setSelectedCase(item)}><Eye className="w-3 h-3" /></button>
                  <button className="p-1 text-yellow-500 hover:text-yellow-700" onClick={() => openEditModal(item)}><Pencil className="w-3 h-3" /></button>
                  <button className="p-1 text-red-600 hover:text-red-800" onClick={() => openDeleteModal(item)}><Trash2 className="w-3 h-3" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
      <div className="flex justify-end items-center gap-3 mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 border rounded ${
            currentPage === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700"
          }`}
        >
          &lt;
        </button>

        <span className="text-sm text-gray-700 dark:text-white">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 border rounded ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700"
          }`}
        >
          &gt;
        </button>
      </div> 
            )}



      {/* Add Case Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            ref={addCaseModalRef}
            className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg w-full max-w-3xl overflow-y-auto max-h-[90vh]"
          >
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white"> New Case</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[["Cabinet Number", "id"], ["Case Name", "name"], ["Folder Number", "id"], ["Category", "category"], ["Client", "client"], ["Branch", "branch"], ["Filed Date", "date"], ["Fee", "fee"]].map(([label, name, type = "text"]) => (
                <div key={name}>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                  </label>
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
                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
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

      {/* Edit Case Modal */}
      {caseToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            ref={editCaseModalRef}
            className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg w-full max-w-3xl overflow-y-auto max-h-[90vh]"
          >
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Edit Case</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[["Case Name", "name"], ["Category", "category"], ["Client", "client"], ["Branch", "branch"], ["Fee", "fee"], ["Status", "status"], ["Lawyer", "lawyer"]].map(([label, name]) => (
                <div key={name}>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                  </label>
                  <input
                    type="text"
                    name={name}
                    value={caseToEdit?.[name] || ""}
                    onChange={(e) => setCaseToEdit({ ...caseToEdit, [name]: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setCaseToEdit(null)}
                className="px-4 py-2 text-sm font-medium text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300 dark:text-white dark:bg-gray-600 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            ref={deleteCaseModalRef}
            className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg w-full max-w-lg"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Confirm Delete</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete case{" "}
              <span className="font-semibold">{caseToDelete?.name}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300 dark:text-white dark:bg-gray-600 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCase}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}


      {/* View Modal */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div ref={viewModalRef}>
            <ViewModal selectedCase={selectedCase} setSelectedCase={setSelectedCase} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Cases;






