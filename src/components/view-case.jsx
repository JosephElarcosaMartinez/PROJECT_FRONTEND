import { useRef } from "react";
import { X } from "lucide-react";
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

    useClickOutside([modalRef], () => setSelectedCase(null));

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            alert(`You selected file: ${file.name}`);
        }
    };

    if (!selectedCase) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div
                ref={modalRef}
                className="text-black dark:text-white bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg w-full max-w-3xl overflow-y-auto max-h-[90vh]"
            >
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white"
                    onClick={() => setSelectedCase(null)}
                >
                    <X className="w-6 h-6" />
                </button>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-semibold">Case {selectedCase.id}</h2>
                        <div className="flex gap-4 mt-1 text-sm text-gray-600 dark:text-gray-300">
                            <span>Cabinet #: 001</span>
                            <span>Drawer #: 002</span>
                        </div>
                    </div>
                    <div className="text-slate-400 text-sm dark:text-white flex items-center gap-1">
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
                            <button className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded-lg">View Payment Record</button>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            <p><strong>Date Filed:</strong> April 25, 2025</p>
                            <p><strong>Status:</strong> <span className={getStatusColor(selectedCase.status)}>{selectedCase.status}</span></p>
                        </div>
                    </div>
                </div>

                <div className="border rounded-lg mt-6 overflow-x-auto">
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
    );
};

export default ViewModal;
