import React, { useState, useEffect, useRef } from "react";
import { useClickOutside } from "@/hooks/use-click-outside";

const EditCaseModal = ({ isOpen, onClose, caseData, onUpdate }) => {
    const modalRef = useRef();

    // Handle click outside
    useClickOutside(modalRef, () => {
        if (isOpen) onClose();
    });

    const [formData, setFormData] = useState({
        ct_name: "",
        cc_name: "",
        client_fullname: "",
        lawyer_fullname: "",
        case_remarks: "",
        case_cabinet: "",
        case_drawer: "",
    });

    const [errors, setErrors] = useState({});

    useClickOutside([modalRef], () => {
        if (isOpen) onClose();
    });

    useEffect(() => {
        if (caseData) {
            setFormData({
                ct_name: caseData.ct_name || "",
                cc_name: caseData.cc_name || "",
                client_fullname: caseData.client_fullname || "",
                lawyer_fullname: caseData.lawyer_fullname || "",
                case_remarks: caseData.case_remarks || "",
                case_cabinet: caseData.case_cabinet || "",
                case_drawer: caseData.case_drawer || "",
            });
        }
    }, [caseData]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Optional: restrict to numeric for cabinet and drawer
        if ((name === "case_cabinet" || name === "case_drawer") && value !== "" && !/^\d*$/.test(value)) {
            return;
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" })); // clear error when typing
    };

    const validate = () => {
        const newErrors = {};

        if (formData.case_cabinet && isNaN(formData.case_cabinet)) {
            newErrors.case_cabinet = "Cabinet must be a number";
        }
        if (formData.case_drawer && isNaN(formData.case_drawer)) {
            newErrors.case_drawer = "Drawer must be a number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        if (onUpdate) {
            onUpdate({ ...caseData, ...formData });
        }
        onClose();
    };

    if (!isOpen || !caseData) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
                ref={modalRef}
                className="w-full max-w-4xl rounded-lg bg-white p-8 dark:bg-slate-800"
            >
                <h3 className="mb-4 text-2xl font-bold">Edit Case {caseData.case_id}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Case Name */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-white">Case Name</label>
                        <input
                            type="text"
                            name="ct_name"
                            value={formData.ct_name}
                            onChange={handleChange}
                            className="w-full mt-1 rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-white">Category</label>
                        <input
                            type="text"
                            name="cc_name"
                            value={formData.cc_name}
                            onChange={handleChange}
                            className="w-full mt-1 rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                        />
                    </div>

                    {/* Client */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-white">Client</label>
                        <input
                            type="text"
                            name="client_fullname"
                            value={formData.client_fullname}
                            onChange={handleChange}
                            className="w-full mt-1 rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                        />
                    </div>

                    {/* Lawyer */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-white">Lawyer</label>
                        <input
                            type="text"
                            name="lawyer_fullname"
                            value={formData.lawyer_fullname}
                            onChange={handleChange}
                            className="w-full mt-1 rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                        />
                    </div>

                </div>

                {/* Remarks */}
                <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700 dark:text-white">Description / Remarks</label>
                    <textarea
                        name="case_remarks"
                        value={formData.case_remarks}
                        onChange={handleChange}
                        className="w-full mt-1 resize-none rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                        rows={3}
                    ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Cabinet */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-white">Cabinet</label>
                        <input
                            type="text"
                            name="case_cabinet"
                            value={formData.case_cabinet}
                            onChange={handleChange}
                            className="w-full mt-1 rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                        />
                        {errors.case_cabinet && <p className="text-sm text-red-500">{errors.case_cabinet}</p>}
                    </div>

                    {/* Drawer */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-white">Drawer </label>
                        <input
                            type="text"
                            name="case_drawer"
                            value={formData.case_drawer}
                            onChange={handleChange}
                            className="w-full mt-1 rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                        />
                        {errors.case_drawer && <p className="text-sm text-red-500">{errors.case_drawer}</p>}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={onClose}
                        className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditCaseModal;
