// CaseActionModal.jsx
import React from "react";
import { X } from "lucide-react";

const CaseActionModal = ({ caseData, type, onClose, onConfirm }) => {
    if (!caseData) return null;

    const isClose = type === "close";
    const title = isClose ? "Close Case" : "Dismiss Case";
    const btnColor = isClose ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700";
    const actionText = isClose ? "close" : "dismiss";

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
            onClick={onClose} // closes modal when clicking outside
        >
            <div
                className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900 dark:text-white"
                onClick={(e) => e.stopPropagation()} // prevent click from closing when clicking inside
            >
                <button
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-800 dark:hover:text-white"
                    onClick={onClose}
                >
                    <X className="h-6 w-6" />
                </button>

                <h2 className="text-xl font-semibold mb-4">{title}</h2>
                <p className="mb-6">
                    Are you sure you want to <strong>{actionText}</strong> Case {caseData.case_id}? This action cannot be undone.
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(caseData)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${btnColor}`}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CaseActionModal;
