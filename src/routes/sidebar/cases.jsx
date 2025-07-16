import { useState, useRef } from "react";
import { Pencil, Trash2, Eye, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useClickOutside } from "@/hooks/use-click-outside";

const InitialData = [
  { id: 1, name: "Davis Incorporation", client: "Davis Corp", category: "Corporate", status: "Pending", lawyer: "Julie Ann Uy", balance: "P 25,000.00" },
  { id: 2, name: "Smith vs. Henderson", client: "John Smith", category: "Property", status: "Processing", lawyer: "John Cooper", balance: "P 7,000.00" },
  { id: 3, name: "Doe Corporation", client: "Doe Ltd.", category: "Civil", status: "Completed", lawyer: "Emma Thompson", balance: "P 0.00" },
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
  const [data] = useState(InitialData);
  const [selectedCase, setSelectedCase] = useState(null);
  const modalRef = useRef();
  const fileInputRef = useRef();

  const navigate = useNavigate();

  useClickOutside([modalRef], () => setSelectedCase(null));

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      alert(`You selected file: ${file.name}`);
      // file upload here
    }
  };

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

      <div className="w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
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
                <td className="px-4 py-3 whitespace-nowrap">C{item.id}</td>
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
                    <button className="p-1.5 text-blue-600 hover:text-blue-800" onClick={() => setSelectedCase(item)}>
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-yellow-500 hover:text-yellow-700" onClick={() => alert(`Editing ${item.name}`)}>
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-red-600 hover:text-red-800" onClick={() => alert(`Deleting ${item.name}`)}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCase && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div ref={modalRef} className="bg-white dark:bg-slate-900 text-black dark:text-white rounded-xl w-[90%] max-w-6xl p-6 relative shadow-xl overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white"
              onClick={() => setSelectedCase(null)}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Case C{selectedCase.id}</h2>
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
                  <input type="text" readOnly value={selectedCase.name} className="w-full mt-1 rounded-lg border px-3 py-2 text-sm bg-white dark:bg-slate-800" />
                </div>
                <div>
                  <label className="text-sm font-semibold">Category</label>
                  <input type="text" readOnly value={selectedCase.category} className="w-full mt-1 rounded-lg border px-3 py-2 text-sm bg-white dark:bg-slate-800" />
                </div>
                <div>
                  <label className="text-sm font-semibold">Client</label>
                  <input type="text" readOnly value={selectedCase.client} className="w-full mt-1 rounded-lg border px-3 py-2 text-sm bg-white dark:bg-slate-800" />
                </div>
                <div>
                  <label className="text-sm font-semibold">Lawyer</label>
                  <input type="text" readOnly value={`Atty. ${selectedCase.lawyer}`} className="w-full mt-1 rounded-lg border px-3 py-2 text-sm bg-white dark:bg-slate-800" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-semibold">Description</label>
                  <textarea
                    value={selectedCase.description || ""}
                    onChange={(e) =>
                      setSelectedCase((prev) => ({ ...prev, description: e.target.value }))
                    }
                    className="w-full mt-1 rounded-lg border px-3 py-2 text-sm bg-white dark:bg-slate-800"
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-gray-50 dark:bg-slate-800">
                  <h4 className="text-sm font-semibold mb-2">Payment</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Total Fee</span>
                      <span className="font-semibold">35,000.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Amount Paid</span>
                      <span>- 10,500.00</span>
                    </div>
                    <hr className="my-1 border-gray-300 dark:border-gray-600" />
                    <div className="flex justify-between font-semibold">
                      <span>Remaining Balance</span>
                      <span>25,000.00</span>
                    </div>
                  </div>
                  <button className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded-lg">
                    View Payment Record
                  </button>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <p><strong>Date Filed:</strong> April 25, 2025</p>
                  <p><strong>Last Update:</strong> April 25, 2025</p>
                  <p><strong>Status:</strong> <span className={getStatusColor(selectedCase.status)}>{selectedCase.status}</span></p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg mt-6">
              <div className="flex justify-between items-center p-4 bg-gray-100 dark:bg-slate-800">
                <h3 className="text-sm font-semibold">Documents</h3>
                <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded"
                  >
                    Upload
                  </button>
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
                    <th className="px-4 py-2">Assigned To / Uploaded By</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-white">
                  {[
                    { id: "D123", name: "Affidavit of Loss", status: "For Approval", file: "aff_dav_loss.pdf", uploader: "Joshua Go" },
                    { id: "D987", name: "Pleadings", status: "Approved", file: "pleadings.pdf", uploader: "Noel Batcotoy" },
                    { id: "D456", name: "Contract and Agreements", status: "Approved", file: "contract_agreement.pdf", uploader: "Angelie Gecole" },
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
    </div>
  );
};

export default Cases;
