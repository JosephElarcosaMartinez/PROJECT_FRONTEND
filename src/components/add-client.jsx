import { useRef, useState } from "react";
import { X } from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";

const AddClient = ({ AddClients, setAddClients }) => {
    const modalRef = useRef(null);
    const [contacts, setContacts] = useState([
        { fullName: "", email: "", contactNumber: "", relation: "" }
    ]);

    useClickOutside([modalRef], () => setAddClients(null));

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Client added");
        console.log("Contact Persons:", contacts);
        setAddClients(null);
    };

    const handleContactChange = (index, field, value) => {
        const updatedContacts = [...contacts];
        updatedContacts[index][field] = value;
        setContacts(updatedContacts);
    };

    const addContactRow = () => {
        setContacts([
            ...contacts,
            { fullName: "", email: "", contactNumber: "", relation: "" }
        ]);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div
                ref={modalRef}
                className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-8 shadow-lg dark:bg-slate-800"
            >
                <button
                    onClick={() => setAddClients(null)}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-800 dark:hover:text-white"
                >
                    <X className="h-6 w-6" />
                </button>

                <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                    Add New Client
                </h2>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Information Section */}
                    <h2 className="font-semibold text-lg">Information</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                        />
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                        />
                    </div>

                    {/* Contact Person Section */}
                    <h2 className="font-semibold text-lg">Contact Person</h2>
                    <div className="space-y-5">
                        {contacts.map((contact, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-1 gap-4 md:grid-cols-5"
                            >
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={contact.fullName}
                                    onChange={(e) =>
                                        handleContactChange(
                                            index,
                                            "fullName",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={contact.email}
                                    onChange={(e) =>
                                        handleContactChange(
                                            index,
                                            "email",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                                />
                                <input
                                    type="tel"
                                    placeholder="Contact Number"
                                    value={contact.contactNumber}
                                    onChange={(e) =>
                                        handleContactChange(
                                            index,
                                            "contactNumber",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                                />
                                <input
                                    type="text"
                                    placeholder="Relation / Role"
                                    value={contact.relation}
                                    onChange={(e) =>
                                        handleContactChange(
                                            index,
                                            "relation",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                                />
                                {/* Only show plus button for the last row */}
                                {index === contacts.length - 1 && (
                                    <div className="flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={addContactRow}
                                            className="h-10 w-10 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                                        >
                                            +
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            Add Client
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddClient;
