import { useState, useRef } from "react";
import { Filter, X } from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";
import ViewModal from "../../components/view-case";

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

const Archives = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef();
  const fileInputRef = useRef();
  const [search, setSearch] = useState("");
  const [cases, setCases] = useState(initialCases);
  const [selectedCase, setSelectedCase] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [clientFilter, setClientFilter] = useState("");
  const [archivedDateFilter, setArchivedDateFilter] = useState("");

  const viewModalRef = useRef();
  const filterModalRef = useRef();

  useClickOutside([viewModalRef, filterModalRef], () => {
    setSelectedCase(null);
    setIsFilterOpen(false);
  });

  const handleUnarchive = (id) => {
    setCases((prev) => prev.filter((item) => item.id !== id));
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
    <div className=" text-gray-800 dark:text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-2">Archives</h1>
      <p className="text-sm mb-6 text-gray-600 dark:text-gray-400">Browse and search completed and archived cases.</p>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 mb-6 flex flex-col md:flex-row items-center gap-4">
        <input
          type="text"
          placeholder="Search archives..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Filter size={18} />
          Filter
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Archived Cases</h2>
        <div className="w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="min-w-full text-sm text-left table-auto">
            <thead className="uppercase text-xs dark:text-white border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-700">
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
                <tr
                  key={item.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <td className="py-3 px-4">{item.id}</td>
                  <td className="py-3 px-4">{item.name}</td>
                  <td className="py-3 px-4">{item.client}</td>
                  <td className="py-3 px-4">{item.dateFiled}</td>
                  <td className="py-3 px-4">{item.archivedDate}</td>
                  <td className="py-3 px-4 space-x-2">
                    <button
                      onClick={() => setSelectedCase(item)}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleUnarchive(item.id)}
                      className="text-red-600 hover:underline"
                    >
                      Unarchive
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCases.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-4 text-center text-gray-500 dark:text-gray-400">
                    No archived cases found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div ref={filterModalRef} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold dark:text-white">Filter Archives</h2>
              <X className="cursor-pointer text-gray-600 dark:text-gray-300" onClick={() => setIsFilterOpen(false)} />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Client</label>
                <input
                  type="text"
                  value={clientFilter}
                  onChange={(e) => setClientFilter(e.target.value)}
                  className="w-full border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-700 rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
                  placeholder="Enter client name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Archived Date</label>
                <input
                  type="text"
                  value={archivedDateFilter}
                  onChange={(e) => setArchivedDateFilter(e.target.value)}
                  className="w-full border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-700 rounded px-3 py-2 text-sm text-gray-900 dark:text-white"
                  placeholder="e.g. 11/5/2022 or N/A"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  className="px-4 py-2 bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-slate-500"
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

      <ViewModal selectedCase={selectedCase} setSelectedCase={setSelectedCase} />
    </div>
  );
};

export default Archives;
