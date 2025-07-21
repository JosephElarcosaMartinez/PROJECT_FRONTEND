import { useState } from "react";
import {
  Download,
  Trash2,
  FileText,
  Search,
  Filter,
  X,
} from "lucide-react";

const initialDocuments = [
  {
    id: 1,
    name: "Cases.jpg",
    case: "Davis Incorporation",
    type: "JPG",
    size: "1.4 MB",
    uploadedBy: "Admin",
    date: "2025-04-26",
  },
];

const Documents = () => {
  const [documents, setDocuments] = useState(initialDocuments);
  const [search, setSearch] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);

  const toggleFilterModal = () => setShowFilterModal(!showFilterModal);

  const confirmDelete = (doc) => {
    setDocToDelete(doc);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (docToDelete) {
      setDocuments(documents.filter((doc) => doc.id !== docToDelete.id));
      setDocToDelete(null);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Documents</h1>
          <p className="text-sm text-gray-500">
            Manage and organize case-related documents
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <button
            className="flex items-center gap-2 border border-slate-300 px-4 py-2 rounded-md text-gray-800 dark:text-white"
            onClick={toggleFilterModal}
          >
            <Filter size={16} /> Filters
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="card p-3 shadow-md">
        <div className="flex items-center gap-2 border border-gray-300 dark:border-slate-600 rounded-md px-3 py-2 bg-gray-100 dark:bg-slate-800">
          <Search size={18} className="text-gray-600 dark:text-gray-400" />
          <input
            type="text"
            placeholder="Search documents by name, type, or case..."
            className="w-full outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Document Table */}
      <div className="flex-col gap-y-2 shadow-lg border-slate-300 rounded-lg bg-white p-4 transition-colors dark:border-slate-700 dark:bg-slate-900 ">
        <table className="text-gray-800 dark:text-white w-full text-sm text-left">
          <thead className="text-gray-800 dark:text-white border-b">
            <tr>
              <th className="px-4 py-3 font-medium">Document</th>
              <th className="px-4 py-3 font-medium">Case</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Size</th>
              <th className="px-4 py-3 font-medium">Uploaded By</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents
              .filter((doc) =>
                doc.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((doc) => (
                <tr key={doc.id} className="border-t hover:bg-blue-100 dark:hover:bg-blue-950">
                  <td className="px-4 py-4 flex items-center gap-2 text-blue-800 font-medium">
                    <FileText size={18} /> {doc.name}
                  </td>
                  <td className="px-4 py-3">{doc.case}</td>
                  <td className="px-4 py-3">{doc.type}</td>
                  <td className="px-4 py-3">{doc.size}</td>
                  <td className="px-4 py-3">{doc.uploadedBy}</td>
                  <td className="px-4 py-3">{doc.date}</td>
                  <td className="px-4 py-3 flex justify-center gap-4">
                    <a
                      href={`/files/${doc.name}`}
                      download
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Download size={16} />
                    </a>

                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => confirmDelete(doc)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
            <button
              onClick={toggleFilterModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Filter Options
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Document Type
                </label>
                <input
                  type="text"
                  placeholder="e.g. PDF, JPG"
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Uploaded By
                </label>
                <input
                  type="text"
                  placeholder="e.g. Admin, Staff"
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={toggleFilterModal}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={toggleFilterModal}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Are you sure you want to remove this document?
            </h2>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
