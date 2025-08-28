import { useRef, useState } from "react";
import { X, ArrowLeft } from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";

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

const ViewModal = ({ selectedCase, setSelectedCase }) => {
    const modalRef = useRef(null);
    const fileInputRef = useRef(null);
    const viewDocRef = useRef(null);
    const editDocRef = useRef(null);

    const [viewDoc, setViewDoc] = useState(null);
    const [editDoc, setEditDoc] = useState(null);
    const [showPayment, setShowPayment] = useState(false);
    const [documents, setDocuments] = useState([
        { id: "D123", name: "Affidavit", status: "For Approval", file: "affidavit.pdf", uploader: "Joshua Go" },
        { id: "D124", name: "Pleadings", status: "Approved", file: "pleadings.pdf", uploader: "Noel Batcotoy" },
    ]);

    useClickOutside([modalRef], () => {
        if (!viewDoc && !editDoc) setSelectedCase(null);
    });
    useClickOutside([viewDocRef], () => viewDoc && setViewDoc(null));
    useClickOutside([editDocRef], () => editDoc && setEditDoc(null));

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const newDoc = {
                id: `D${Math.floor(Math.random() * 1000)}`,
                name: file.name.split(".")[0],
                status: "For Approval",
                file: file.name,
                uploader: "Current User",
            };
            setDocuments((prev) => [...prev, newDoc]);
        }
    };

    const handleClearDocuments = () => {
        if (window.confirm("Are you sure you want to clear all documents?")) {
            setDocuments([]);
        }
    };

    const handleRemoveDocument = (id) => {
        if (window.confirm("Are you sure you want to remove this document?")) {
            setDocuments((prev) => prev.filter((doc) => doc.id !== id));
        }
    };

    const handleEditSave = () => {
        setDocuments((prev) =>
            prev.map((doc) => (doc.id === editDoc.id ? editDoc : doc))
        );
        setEditDoc(null);
    };

    if (!selectedCase) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div
                ref={modalRef}
                className="relative text-black dark:text-white bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg w-full max-w-3xl overflow-y-auto max-h-[90vh]"
            >
                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white"
                    onClick={() => setSelectedCase(null)}
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Switch between normal view & payment view */}
                {!showPayment ? (
                    <>
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-semibold">Case {selectedCase.id}</h2>
                                <div className="flex gap-4 mt-1 text-sm text-gray-600 dark:text-gray-300">
                                    <span>Cabinet #: 001</span>
                                    <span>Drawer #: 002</span>
                                </div>
                            </div>
                            <div className="text-slate-400 text-sm dark:text-white">
                                <span>Dumanjug</span>
                            </div>
                        </div>

                        {/* Case Info */}
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
                                        onChange={(e) => setSelectedCase((prev) => ({ ...prev, description: e.target.value }))}
                                        className="w-full mt-1 rounded-lg border px-3 py-2 text-sm bg-white dark:bg-slate-800"
                                        rows={3}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="border rounded-lg p-4 bg-gray-50 dark:bg-slate-800">
                                    <h4 className="text-sm font-semibold mb-2">Payment</h4>
                                    <div className="text-sm space-y-1">
                                        <div className="flex justify-between"><span>Total Fee</span><span className="font-semibold">{selectedCase.fee}</span></div>
                                        <div className="flex justify-between"><span>Total Paid</span><span>- 10,000.00</span></div>
                                        <hr className="my-1 border-gray-300 dark:border-gray-600" />
                                        <div className="flex justify-between font-semibold"><span>Remaining</span><span>{selectedCase.balance}</span></div>
                                    </div>
                                    <button
                                        onClick={() => setShowPayment(true)}
                                        className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded-lg"
                                    >
                                        View Payment Record
                                    </button>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                    <p><strong>Date Filed:</strong> April 25, 2025</p>
                                    <p><strong>Status:</strong> <span className={getStatusColor(selectedCase.status)}>{selectedCase.status}</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Documents Table */}
                        <div className="border rounded-lg mt-6 overflow-x-auto">
                            <div className="flex justify-between items-center p-4 bg-gray-100 dark:bg-slate-800">
                                <h3 className="text-sm font-semibold">Documents</h3>
                                <div className="flex gap-2">
                                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                                    <button onClick={() => fileInputRef.current.click()} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded">Upload</button>
                                    <button onClick={handleClearDocuments} className="bg-blue-500 text-white text-sm px-4 py-1.5 rounded">Clear</button>
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
                                    {documents.length > 0 ? (
                                        documents.map((doc) => (
                                            <tr key={doc.id} className="border-t border-gray-200 dark:border-gray-700">
                                                <td className="px-4 py-2">{doc.id}</td>
                                                <td className="px-4 py-2">{doc.name}</td>
                                                <td className="px-4 py-2">{doc.status}</td>
                                                <td
                                                    className="px-4 py-2 text-blue-600 underline cursor-pointer"
                                                    onClick={() => setViewDoc(doc)}
                                                >
                                                    {doc.file}
                                                </td>
                                                <td className="px-4 py-2">{doc.uploader}</td>
                                                <td className="px-4 py-2 space-x-2">
                                                    <button
                                                        className="text-blue-600 hover:underline"
                                                        onClick={() => setEditDoc(doc)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="text-red-600 hover:underline"
                                                        onClick={() => handleRemoveDocument(doc.id)}
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-4 text-gray-500">
                                                No documents available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Payment record view */}
                        <div className="flex items-center gap-3 mb-6">
                            <button
                                onClick={() => setShowPayment(false)}
                                className="text-gray-500 hover:text-gray-800 dark:hover:text-white"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <h2 className="text-2xl font-semibold">Payment Record</h2>
                        </div>

                        {/* Payment Summary */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900 shadow border">
                                <p className="text-sm text-gray-500 dark:text-green-100">Total Paid</p>
                                <p className="text-lg font-semibold text-green-700 dark:text-green-300">₱10,000.00</p>
                            </div>
                            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900 shadow border">
                                <p className="text-sm text-gray-500 dark:text-red-100">Remaining Balance</p>
                                <p className="text-lg font-semibold text-red-700 dark:text-red-300">{selectedCase.balance}</p>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* View Document Modal */}
            {viewDoc && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div ref={viewDocRef} className="bg-white dark:bg-slate-800 p-6 rounded-lg w-[500px] relative">
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-white"
                            onClick={() => setViewDoc(null)}
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-lg font-semibold mb-4">Viewing Document</h3>
                        <p><strong>ID:</strong> {viewDoc.id}</p>
                        <p><strong>Name:</strong> {viewDoc.name}</p>
                        <p><strong>Status:</strong> {viewDoc.status}</p>
                        <p><strong>File:</strong> {viewDoc.file}</p>
                        <p><strong>Uploaded By:</strong> {viewDoc.uploader}</p>
                    </div>
                </div>
            )}

            {/* Edit Document Modal */}
            {editDoc && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div ref={editDocRef} className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg w-full max-w-3xl relative">
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white"
                            onClick={() => setEditDoc(null)}
                        >
                            <X className="w-5 h-4" />
                        </button>

                        {/* Editable Case Info */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 mb-5">
                            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-semibold">Case Name</label>
                                    <input
                                        type="text"
                                        value={selectedCase.name}
                                        onChange={(e) => setSelectedCase(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full mt-1 rounded-lg border px-3 py-2 text-sm bg-white dark:bg-slate-800"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold">Category</label>
                                    <input
                                        type="text"
                                        value={selectedCase.category}
                                        onChange={(e) => setSelectedCase(prev => ({ ...prev, category: e.target.value }))}
                                        className="w-full mt-1 rounded-lg border px-3 py-2 text-sm bg-white dark:bg-slate-800"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold">Client</label>
                                    <input
                                        type="text"
                                        value={selectedCase.client}
                                        onChange={(e) => setSelectedCase(prev => ({ ...prev, client: e.target.value }))}
                                        className="w-full mt-1 rounded-lg border px-3 py-2 text-sm bg-white dark:bg-slate-800"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold">Lawyer</label>
                                    <input
                                        type="text"
                                        value={selectedCase.lawyer}
                                        onChange={(e) => setSelectedCase(prev => ({ ...prev, lawyer: e.target.value }))}
                                        className="w-full mt-1 rounded-lg border px-3 py-2 text-sm bg-white dark:bg-slate-800"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-sm font-semibold">Description</label>
                                    <textarea
                                        value={selectedCase.description || ""}
                                        onChange={(e) => setSelectedCase(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full mt-1 rounded-lg border px-3 py-2 text-sm bg-white dark:bg-slate-800"
                                        rows={3}
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="border rounded-lg p-4 bg-gray-50 dark:bg-slate-800">
                                    <h4 className="text-sm font-semibold mb-2">Payment</h4>
                                    <div className="text-sm space-y-1">
                                        <div className="flex justify-between"><span>Total Fee</span><span className="font-semibold">{selectedCase.fee}</span></div>
                                        <div className="flex justify-between"><span>Total Paid</span><span>- 10,000.00</span></div>
                                        <hr className="my-1 border-gray-300 dark:border-gray-600" />
                                        <div className="flex justify-between font-semibold"><span>Remaining</span><span>{selectedCase.balance}</span></div>
                                    </div>
                                    <button className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded-lg">View Payment Record</button>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                    <p><strong>Date Filed:</strong> April 25, 2025</p>
                                    <p><strong>Status:</strong> <span className={getStatusColor(selectedCase.status)}>{selectedCase.status}</span></p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-8">
                            <button onClick={() => setEditDoc(null)} className="px-5 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-400">
                                Cancel
                            </button>
                            <button onClick={handleEditSave} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewModal;
