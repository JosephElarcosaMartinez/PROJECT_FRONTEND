import { useRef, useState } from "react";
import { Image, User } from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";

const AddUserModal = ({ isOpen, onClose }) => {
    const [profileImage, setProfileImage] = useState(null);
    const modalRef = useRef(null);

    useClickOutside([modalRef], () => {
        if (isOpen) onClose();
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
                ref={modalRef}
                className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-3xl shadow-lg relative"
            >
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    Add New User
                </h2>
                <form className="space-y-6">
                    <div className="flex justify-center">
                        <div className="flex flex-col items-center gap-2">
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt="Preview"
                                    className="w-24 h-24 object-cover rounded-full border border-gray-300 dark:border-slate-700"
                                />
                            ) : (
                                <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gray-100 border text-gray-400 text-sm dark:bg-slate-700 dark:border-slate-600">
                                    <User className="w-10 h-10" />
                                </div>
                            )}

                            <label className="flex items-center gap-2 cursor-pointer text-blue-600 hover:underline text-sm">
                                <Image className="w-4 h-4" />
                                <span>Upload Profile Picture</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setProfileImage(reader.result);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    className="hidden"
                                />
                            </label>

                            {profileImage && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    File uploaded
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="First Name"
                            className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white"
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white"
                        />
                        <input
                            type="text"
                            placeholder="Middle Name"
                            className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white"
                        />
                        <input
                            type="email"
                            placeholder="Enter Email"
                            className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white"
                        />
                        <input
                            type="text"
                            placeholder="Phone Number"
                            className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white"
                        />
                        <select className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white">
                            <option>Role</option>
                            <option>Admin</option>
                            <option>Lawyer</option>
                            <option>Paralegal</option>
                        </select>
                        <select className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white">
                            <option>Select Branch</option>
                            <option>Dumanjug</option>
                            <option>Fuente</option>
                            <option>Camotes</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
                        >
                            Save
                        </button>
                    </div>
                </form>

                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
                >
                    &times;
                </button>
            </div>
        </div>
    );
};

export default AddUserModal;
