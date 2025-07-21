import { useState, useRef } from "react";
import { Filter, X } from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";

const initialCases = [
  {
    id: "C54321",
    name: "Davis Incorporation",
    client: "Davis Corp",
    dateFiled: "11/5/2022",
    archivedDate: "11/5/2022",
    category: "Corporate",
    lawyer: "Mark Reyes",
    fee: "₱20,000.00",
    balance: "₱10,000.00",
    status: "Closed",
    description: "Corporate filing case from 2022.",
  },
  {
    id: "A12345",
    name: "Smith vs. Henderson",
    client: "John Smith",
    dateFiled: "1/15/2023",
    archivedDate: "N/A",
    category: "Civil",
    lawyer: "Anna Cruz",
    fee: "₱50,000.00",
    balance: "₱30,000.00",
    status: "For Review",
    description: "Civil case involving property dispute.",
  },
  {
    id: "B67890",
    name: "Wilson Property Dispute",
    client: "Emily Wilson",
    dateFiled: "2/28/2023",
    archivedDate: "N/A",
    category: "Real Estate",
    lawyer: "James Tan",
    fee: "₱35,000.00",
    balance: "₱5,000.00",
    status: "Pending",
    description: "Dispute over residential land ownership.",
  },
];

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "closed":
      return "text-green-600";
    case "pending":
      return "text-yellow-600";
    case "for review":
      return "text-blue-600";
    default:
      return "text-gray-600";
  }
};

const Archives = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef();
  const fileInputRef = useRef();
  const [search, setSearch] = useState("");
  const [cases, setCases] = useState(initialCases);
  const [viewCaseData, setViewCaseData] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [clientFilter, setClientFilter] = useState("");
  const [archivedDateFilter, setArchivedDateFilter] = useState("");

  const viewModalRef = useRef();
  const filterModalRef = useRef();

  useClickOutside([viewModalRef, filterModalRef], () => {
    if (viewCaseData) setViewCaseData(null);
    if (isFilterOpen) setIsFilterOpen(false);
  });

  const handleUnarchive = (id) => {
    setCases((prev) => prev.filter((item) => item.id !== id));
  };

  const handleFileUpload = (e) => {
    console.log("File uploaded:", e.target.files[0]);
  };

  const filteredCases = cases.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesClient = clientFilter
      ? item.client.toLowerCase().includes(clientFilter.toLowerCase())
      : true;
    const matchesArchivedDate = archivedDateFilter
      ? item.archivedDate.toLowerCase().includes(archivedDateFilter.toLowerCase())
      : true;
    return matchesSearch && matchesClient && matchesArchivedDate;
  });

  return (
    <div className="p-1 text-gray-800 min-h-screen">
      <h1 className="text-2xl font-bold mb-1 dark:text-white">Archives</h1>
      <p className="text-sm mb-6 text-gray-600">Browse and search completed and archived cases</p>

      <div className="card bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 mb-6 flex flex-col md:flex-row gap-4 items-center">
        <input
          type="text"
          placeholder="Search archives..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none"
        />

        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Filter size={18} />
          Filter
        </button>
      </div>

      <div className="card bg-white rounded-lg shadow-lg p-4 overflow-x-auto">
        <h2 className="dark:text-white text-xl font-semibold text-gray-800 mb-4">Archived Cases</h2>
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs uppercase border-b dark:text-white">
            <tr>
              <th className="py-3 px-4">Case Number</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Client</th>
              <th className="py-3 px-4">Date Filed</th>
              <th className="py-3 px-4">Archived Date</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.map((item) => (
              <tr key={item.id} className="dark:text-white border-b hover:bg-blue-100 dark:hover:bg-blue-950">
                <td className="py-2 px-4">{item.id}</td>
                <td className="py-2 px-4">{item.name}</td>
                <td className="py-2 px-4">{item.client}</td>
                <td className="py-2 px-4">{item.dateFiled}</td>
                <td className="py-2 px-4">{item.archivedDate}</td>
                <td className="py-2 px-4 text-blue-600 font-medium space-x-2">
                  <button onClick={() => setViewCaseData(item)} className="hover:underline">View</button>
                  <button onClick={() => handleUnarchive(item.id)} className="hover:underline text-red-600">Unarchive</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {viewCaseData && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div ref={viewModalRef} className="bg-white dark:bg-slate-900 text-black dark:text-white rounded-xl w-[90%] max-w-6xl p-6 relative shadow-xl overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white"
              onClick={() => setViewCaseData(null)}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Case {viewCaseData.id}</h2>
                <div className="flex gap-4 mt-1 text-sm text-gray-600 dark:text-gray-300">
                  <span>Cabinet #: 001</span>
                  <span>Drawer #: 002</span>
                </div>
              </div>
              <div className="text-sm text-gray-700 dark:text-white flex items-center gap-1">
                <span>Dumanjug</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold">Case Name</label>
                  <input type="text" readOnly value={viewCaseData.name} className="w-full mt-1 rounded-lg border px-3 py-2 text-sm bg-white dark:bg-slate-800" />
                </div>
                <div>
                  <label className="text-sm font-semibold">Category</label>
                  <input type="text" readOnly value={viewCaseData.category} className="w-full mt-1 rounded-lg border px-3 py-2 text-sm bg-white dark:bg-slate-800" />
                </div>
                <div>
                  <label className="text-sm font-semibold">Client</label>
                  <input type="text" readOnly value={viewCaseData.client} className="w-full mt-1 rounded-lg border px-3 py-2 text-sm bg-white dark:bg-slate-800" />
                </div>
                <div>
                  <label className="text-sm font-semibold">Lawyer</label>
                  <input type="text" readOnly value={`Atty. ${viewCaseData.lawyer}`} className="w-full mt-1 rounded-lg border px-3 py-2 text-sm bg-white dark:bg-slate-800" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-semibold">Description</label>
                  <textarea
                    value={viewCaseData.description || ""}
                    readOnly
                    className="w-full mt-1 rounded-lg border px-3 py-2 text-sm bg-white dark:bg-slate-800"
                    rows={3}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-gray-50 dark:bg-slate-800">
                  <h4 className="text-sm font-semibold mb-2">Payment</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between"><span>Total Fee</span><span className="font-semibold">{viewCaseData.fee}</span></div>
                    <div className="flex justify-between"><span>Total Paid</span><span>- 10,000.00</span></div>
                    <hr className="my-1 border-gray-300 dark:border-gray-600" />
                    <div className="flex justify-between font-semibold"><span>Remaining</span><span>{viewCaseData.balance}</span></div>
                  </div>
                  <button className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded-lg">View Payment Record</button>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <p><strong>Date Filed:</strong> {viewCaseData.dateFiled}</p>
                  <p><strong>Status:</strong> <span className={getStatusColor(viewCaseData.status)}>{viewCaseData.status}</span></p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg mt-6">
              <div className="flex justify-between items-center p-4 bg-gray-100 dark:bg-slate-800">
                <h3 className="text-sm font-semibold">Documents</h3>
                <div className="flex gap-2">
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                  <button onClick={() => fileInputRef.current.click()} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded">Upload</button>
                  <button className="bg-blue-500 text-white text-sm px-4 py-1.5 rounded">Clear</button>
                </div>
              </div>
              <table className="w-full text-sm">
                <thead className="text-left bg-gray-200 dark:bg-slate-700">
                  <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">File</th>
                    <th className="px-4 py-2">Uploaded By</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-white">
                  {[
                    { id: "D123", name: "Affidavit", status: "For Approval", file: "affidavit.pdf", uploader: "Joshua Go" },
                    { id: "D124", name: "Pleadings", status: "Approved", file: "pleadings.pdf", uploader: "Noel Batcotoy" },
                  ].map((doc) => (
                    <tr key={doc.id} className="border-t border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-2">{doc.id}</td>
                      <td className="px-4 py-2">{doc.name}</td>
                      <td className="px-4 py-2">{doc.status}</td>
                      <td className="px-4 py-2 text-blue-600 underline cursor-pointer">{doc.file}</td>
                      <td className="px-4 py-2">{doc.uploader}</td>
                      <td className="px-4 py-2 space-x-2">
                        <button className="text-blue-600 hover:underline">Edit</button>
                        <button className="text-red-600 hover:underline">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div ref={filterModalRef} className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filter Archives</h2>
              <X className="cursor-pointer" onClick={() => setIsFilterOpen(false)} />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                <input
                  type="text"
                  value={clientFilter}
                  onChange={(e) => setClientFilter(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm"
                  placeholder="Enter client name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Archived Date</label>
                <input
                  type="text"
                  value={archivedDateFilter}
                  onChange={(e) => setArchivedDateFilter(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm"
                  placeholder="e.g. 11/5/2022 or N/A"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  onClick={() => {
                    setClientFilter("");
                    setArchivedDateFilter("");
                    setIsFilterOpen(false);
                  }}
                >
                  Clear
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => setIsFilterOpen(false)}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

  );
};

export default Archives;
