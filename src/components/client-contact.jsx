import React, { useState, useRef, useEffect } from "react";
import { useClickOutside } from "@/hooks/use-click-outside";

const ClientContact = () => {
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  return (
    <div className="bg-blue rounded-xl">
      {error && (
        <div className="alert alert-error mx-10 mb-5 mt-5 shadow-lg">
          <div>
            <span>{error.message}</span>
          </div>
        </div>
      )}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="title">Clients</h1>
          <p className="text-sm text-gray-500">Manage all client information here...</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card mb-6 flex flex-col items-center gap-4 rounded-lg bg-white p-4 shadow-md dark:bg-slate-800 md:flex-row">
        <input
          type="text"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-gray-900 placeholder-gray-500 outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-gray-400 md:flex-1"
        />
      </div>

      {/* Table Placeholder */}
      <div className="card bg-white dark:bg-slate-800 rounded-lg shadow-md p-4">
        <p className="text-gray-500 dark:text-gray-300">No client data available yet.</p>
      </div>
    </div>
  );
};

export default ClientContact;
