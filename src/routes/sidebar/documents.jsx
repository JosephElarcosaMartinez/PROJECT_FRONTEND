import { useState } from "react";
import {Download, Trash2, FileText, Search, Filter, Plus, X, UploadCloud, Upload,} from "lucide-react";

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
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [selectedType, setSelectedType] = useState("");
  const [selectedUploader, setSelectedUploader] = useState("");

  const [newDoc, setNewDoc] = useState({
    name: "",
    case: "",
    type: "",
    size: "",
    uploadedBy: "",
    date: "",
  });

  const toggleFilterModal = () => setShowFilterModal(!showFilterModal);
  const toggleUploadModal = () => setShowUploadModal(!showUploadModal);

  const applyFilters = () => {
    toggleFilterModal();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const extension = file.name.split(".").pop().toUpperCase();
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2) + " MB";

      setNewDoc({
        ...newDoc,
        name: file.name,
        type: extension,
        size: sizeInMB,
      });
    }
  };

  const handleUpload = () => {
    if (
      newDoc.name &&
      newDoc.case &&
      newDoc.type &&
      newDoc.size &&
      newDoc.uploadedBy &&
      newDoc.date
    ) {
      setDocuments([...documents, { ...newDoc, id: Date.now() }]);
      setNewDoc({
        name: "",
        case: "",
        type: "",
        size: "",
        uploadedBy: "",
        date: "",
      });
      toggleUploadModal();
    }
  };

  return (
    <div className="p-6 space-y-6">
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
            className="flex items-center gap-2 border border-white/30 px-4 py-2 rounded-md text-white hover:bg-white/10"
            onClick={toggleFilterModal}
          >
            <Filter size={16} />
            Filters
          </button>
          <button
            className="flex items-center gap-2 bg-blue-600 text-white font-medium px-4 py-2 rounded-md hover:bg-white"
            onClick={toggleUploadModal}
          >
            <Plus size={16} />
            Upload Document
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-md p-3 shadow-md">
        <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search documents by name, type, or case..."
            className="w-full outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Document Table */}
      <div className="bg-white rounded-md shadow-md overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-gray-500 border-b">
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
                <tr key={doc.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 flex items-center gap-2 text-blue-800 font-medium">
                    <FileText size={18} />
                    {doc.name}
                  </td>
                  <td className="px-4 py-3">{doc.case}</td>
                  <td className="px-4 py-3">{doc.type}</td>
                  <td className="px-4 py-3">{doc.size}</td>
                  <td className="px-4 py-3">{doc.uploadedBy}</td>
                  <td className="px-4 py-3">{doc.date}</td>
                  <td className="px-4 py-3 flex justify-center gap-4">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Download size={16} />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
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
            <h2 className="text-lg font-semibold  mb-4">Filter Documents</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">All Cases</option>
                  <option value="Davis Incorporation">Davis Incorporation</option>
                  <option value="Noel vs. Julie Ann">Noel vs. Julie Ann</option>
                  <option value="Joseph Property">Joseph Property</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Uploaded By
                </label>
                <select
                  value={selectedUploader}
                  onChange={(e) => setSelectedUploader(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Admin</option>
                  <option value="Lawyer">Lawyer</option>
                  <option value="Paralegal">Paralegal</option>
                </select>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={applyFilters}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative">
            <button
              onClick={toggleUploadModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <UploadCloud size={20} /> Upload Document
            </h2>

            <div className="space-y-5">
              <input
                type="file"
                accept=".pdf,.docx,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="hidden"
                id="fileInput"
              />
              <label
                htmlFor="fileInput"
                className="w-full flex items-center justify-center gap-2 border border-dashed border-gray-400 p-20 rounded-md cursor-pointer text-gray-600 hover:border-blue-500 hover:text-blue-600"
              >
                <Upload size={20} />
                {newDoc.name ? newDoc.name : "Click to choose a file"}
              </label>

              <input
                type="text"
                placeholder="Document Name"
                value={newDoc.case}
                onChange={(e) =>
                  setNewDoc({ ...newDoc, case: e.target.value })
                }
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />  
              <div className="flex justify-end">
                <button
                  onClick={handleUpload}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                Upload Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
