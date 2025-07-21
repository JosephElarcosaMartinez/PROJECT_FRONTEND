import { useRef } from "react";
import { X } from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";

const AddClient = ({ AddClients, setAddClients }) => {
    const modalRef = useRef(null);

    useClickOutside([modalRef], () => setAddClients(null));

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Client added");
        setAddClients(null); 
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div
                ref={modalRef}
                className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg w-full max-w-3xl overflow-y-auto max-h-[90vh]"
            >
                <button
                    onClick={() => setAddClients(null)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white"
                >
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Add New Client</h2>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Full Name" className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white" />
                        <input type="email" placeholder="Email" className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white" />
                        <input type="tel" placeholder="Phone Number" className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white" />
                        <input type="text" placeholder="Contact Person Name" className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white" />
                        <input type="tel" placeholder="Contact Person Number" className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white" />
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
            </div>
        </div>
    );
};

export default AddClient;
