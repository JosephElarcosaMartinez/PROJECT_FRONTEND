import { useState, useRef } from "react";
import { X } from "lucide-react";

const documents = [
  {
    id: "D123",
    name: "Affidavit of Loss",
    status: "For Approval",
    file: "aff_dav_loss.pdf",
    uploadedBy: "Joshua Go",
  },
  {
    id: "D987",
    name: "Pleadings",
    status: "Approved",
    file: "pleadings.pdf",
    uploadedBy: "Noel Batoctoy",
  },
  {
    id: "D456",
    name: "Contract and Agreements",
    status: "Approved",
    file: "contract_agreement.pdf",
    uploadedBy: "Angelie Gecole",
  },
];

const ClientAndCase = () => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const fileInputRef = useRef(null);

  const handleDocClick = (doc) => setSelectedDoc(doc);
  const handleUploadClick = () => fileInputRef.current.click();
  const handleFileChange = (e) => setUploadedFile(e.target.files[0]);
  const handleClear = () => {
    setUploadedFile(null);
    fileInputRef.current.value = null;
  };

  const defaultInfo = {
    caseName: "Davis Incorporation",
    category: "Corporate",
    client: "Davis Corp",
    description:
      "A dispute between about Davis corporation over a denied claim for post-surgery rehabilitation expenses following a car accident",
    lawyer: "Atty. Julie Ann Uy",
    cabinet: "001",
    drawer: "002",
    location: "Dumanjug",
  };

  const caseInfo = selectedDoc
    ? {
        caseName: selectedDoc.name,
        category: "Litigation",
        client: selectedDoc.uploadedBy,
        description: `Document ID: ${selectedDoc.id}, File: ${selectedDoc.file}`,
        lawyer: "TBD",
        cabinet: "001",
        drawer: "002",
        location: "Dumanjug",
      }
    : defaultInfo;

  return (
    <div className="min-h-screen p-6 flex justify-center items-center">
      <div className="rounded-lg p-6 w-full max-w-6xl shadow-lg relative border">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Case: {caseInfo.caseName}</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Cabinet #: {caseInfo.cabinet}</span>
            <span>Drawer #: {caseInfo.drawer}</span>
            <span className="flex items-center gap-1">
              <span className="text-gray-400">📍</span> {caseInfo.location}
            </span>
            <X className="cursor-pointer" onClick={() => setSelectedDoc(null)} />
          </div>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Left Inputs */}
          <div className="col-span-2 grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Case Name</label>
              <input
                type="text"
                value={caseInfo.caseName}
                disabled
                className="w-full p-2 border rounded text-sm bg-gray-100"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Category</label>
              <input
                type="text"
                value={caseInfo.category}
                disabled
                className="w-full p-2 border rounded text-sm bg-gray-100"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Client</label>
              <input
                type="text"
                value={caseInfo.client}
                disabled
                className="w-full p-2 border rounded text-sm bg-gray-100"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Description</label>
              <textarea
                value={caseInfo.description}
                disabled
                rows={3}
                className="w-full p-2 border rounded text-sm bg-gray-100"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Lawyer</label>
              <input
                type="text"
                value={caseInfo.lawyer}
                disabled
                className="w-full p-2 border rounded text-sm bg-gray-100"
              />
            </div>
          </div>

          {/* Payment Box */}
          <div className="border rounded p-4">
            <h3 className="font-semibold mb-2">Payment</h3>
            <p className="text-sm">Total Fee: <strong>35,000.00</strong></p>
            <p className="text-sm">Total Amount Paid: <strong>- 10,500.00</strong></p>
            <p className="text-sm font-bold mt-2">Remaining Balance: <span className="text-green-600">25,000.00</span></p>
            <button
              className="mt-3 w-full bg-green-600 text-white py-1.5 rounded text-sm"
              onClick={() => setShowPaymentModal(true)}
            >
              View Payment Record
            </button>
          </div>
        </div>

        {/* Documents Section */}
        <div className="border rounded p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Documents</h3>
            <div className="flex gap-2">
              <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm" onClick={handleUploadClick}>
                Upload
              </button>
              <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm" onClick={handleClear}>
                Clear
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* File name preview */}
          {uploadedFile && (
            <p className="text-sm text-gray-600 mb-3">Selected File: {uploadedFile.name}</p>
          )}

          <table className="w-full text-sm border-t">
            <thead>
              <tr className="text-left text-gray-600 bg-gray-100">
                <th className="p-2">ID</th>
                <th className="p-2">NAME</th>
                <th className="p-2">STATUS</th>
                <th className="p-2">FILE</th>
                <th className="p-2">UPLOADED BY</th>
                <th className="p-2">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr
                  key={doc.id}
                  className="border-b cursor-pointer hover:bg-gray-50"
                  onClick={() => handleDocClick(doc)}
                >
                  <td className="p-2">{doc.id}</td>
                  <td className="p-2">{doc.name}</td>
                  <td className="p-2">{doc.status}</td>
                  <td className="p-2 text-blue-600 underline">{doc.file}</td>
                  <td className="p-2">{doc.uploadedBy}</td>
                  <td className="p-2">
                    <button className="text-blue-600 mr-2">Edit</button>
                    <button className="text-red-600">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Payment Record</h3>
                <X className="cursor-pointer" onClick={() => setShowPaymentModal(false)} />
              </div>
              <p className="text-sm mb-2">Case: {caseInfo.caseName}</p>
              <ul className="text-sm space-y-1">
                <li>Total Fee: <strong>35,000.00</strong></li>
                <li>Total Paid: <strong>10,500.00</strong></li>
                <li>Remaining Balance: <strong className="text-green-600">25,000.00</strong></li>
              </ul>
              <div className="mt-4 text-right">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={() => setShowPaymentModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientAndCase;
