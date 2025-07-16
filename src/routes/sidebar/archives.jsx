import { useState, useRef } from "react";
import { Filter, X } from "lucide-react";
import Cases from "./cases";
import { useClickOutside } from "@/hooks/use-click-outside";

const initialCases = [
  {
    id: "C54321",
    name: "Davis Incorporation",
    client: "Davis Corp",
    dateFiled: "11/5/2022",
    archivedDate: "11/5/2022",
  },
  {
    id: "A12345",
    name: "Smith vs. Henderson",
    client: "John Smith",
    dateFiled: "1/15/2023",
    archivedDate: "N/A",
  },
  {
    id: "B67890",
    name: "Wilson Property Dispute",
    client: "Emily Wilson",
    dateFiled: "2/28/2023",
    archivedDate: "N/A",
  },
];

const Archives = () => {
  const [search, setSearch] = useState("");
  const [cases, setCases] = useState(initialCases);
  const [viewCaseData, setViewCaseData] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [clientFilter, setClientFilter] = useState("");
  const [archivedDateFilter, setArchivedDateFilter] = useState("");

  const viewModalRef = useRef();
  const filterModalRef = useRef();

  // Handle clicks outside both modals
  useClickOutside([viewModalRef, filterModalRef], () => {
    if (viewCaseData) setViewCaseData(null);
    if (isFilterOpen) setIsFilterOpen(false);
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
    <div className="p-6 text-gray-800 min-h-screen">
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
              <tr key={item.id} className="dark:text-white border-b hover:bg-blue-500">
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

      {viewCaseData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 overflow-y-auto">
          <div ref={viewModalRef}>
            <Cases />
          </div>
        </div>
      )}

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
