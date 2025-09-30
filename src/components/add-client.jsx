import { useState, useRef } from "react";
import { X, Trash2 } from "lucide-react";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useAuth } from "@/context/auth-context";
import toast from "react-hot-toast";

const AddClient = ({ AddClients, setAddClients }) => {
    const { user } = useAuth();
    const modalRef = useRef(null);

    useClickOutside([modalRef], () => setAddClients(null));

    // Toggle between single person client and company client
    const [clientType, setClientType] = useState("person"); // 'person' | 'company'

    const [clientData, setClientData] = useState({
        // Person fields
        client_firstname: "",
        client_lastname: "",
        // Company field
        company_name: "",
        // Shared fields
        client_email: "",
        client_phonenum: "",
        client_address: "",
        client_password: "",
        created_by: user?.user_id,
    });

    const [contact, setContact] = useState({
        contact_firstname: "",
        contact_lastname: "",
        contact_email: "",
        contact_phone: "",
        contact_address: "",
        contact_role: "",
    });

    const [contacts, setContacts] = useState([]);

    const handleAddContact = () => {
        const { contact_firstname, contact_lastname, contact_email, contact_phone, contact_role } = contact;
        if (!contact_firstname || !contact_lastname || !contact_email || !contact_phone || !contact_role) return;

        const contact_fullname = `${contact_firstname} ${contact_lastname}`.replace(/\s+/g, " ").trim();
        setContacts([
            ...contacts,
            {
                contact_fullname,
                contact_email: contact.contact_email,
                contact_phone: contact.contact_phone,
                contact_role: contact.contact_role,
                contact_address: contact.contact_address,
            },
        ]);

        setContact({
            contact_firstname: "",
            contact_lastname: "",
            contact_email: "",
            contact_phone: "",
            contact_address: "",
            contact_role: "",
        });
    };

    const handleRemoveContact = (index) => {
        setContacts(contacts.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Prepare payload depending on client type
            const client_fullname =
                clientType === "person"
                    ? `${clientData.client_firstname || ""} ${clientData.client_lastname || ""}`.replace(/\s+/g, " ").trim()
                    : clientData.company_name;

            const payload = {
                client_fullname,
                client_email: clientData.client_email,
                client_phonenum: clientData.client_phonenum,
                client_address: clientData.client_address,
                created_by: user?.user_id,
            };

            // 1. Create client
            const resClient = await fetch("http://localhost:3000/api/clients", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            if (!resClient.ok) throw new Error("Failed to add client");

            const newClient = await resClient.json(); // assuming it returns the newly created client with `client_id`

            // 2. Create contacts
            for (const c of contacts) {
                const resContact = await fetch("http://localhost:3000/api/client-contacts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        ...c,
                        client_id: newClient.client_id,
                    }),
                });

                if (!resContact.ok) throw new Error("Failed to add one or more contacts");
            }

            toast.success("Client added successfully!");
            setAddClients(null); // Close modal
        } catch (err) {
            console.error(err);
            alert("Error adding client and contacts: ", err);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div
                ref={modalRef}
                className="relative max-h[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-8 shadow-lg dark:bg-slate-800"
            >
                <button
                    onClick={() => setAddClients(null)}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-800 dark:hover:text-white"
                >
                    <X className="h-6 w-6" />
                </button>

                <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Add New Client</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <h3 className="font-semibold text-blue-700 dark:text-blue-300">Client Information</h3>
                            {/* Toggle: Person vs Company */}
                            <div className="inline-flex overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600">
                                <button
                                    type="button"
                                    onClick={() => setClientType("person")}
                                    className={`px-3 py-1 text-sm ${clientType === "person"
                                            ? "bg-blue-600 text-white"
                                            : "bg-transparent text-gray-700 dark:text-gray-200"
                                        }`}
                                >
                                    Person
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setClientType("company")}
                                    className={`px-3 py-1 text-sm ${clientType === "company"
                                            ? "bg-blue-600 text-white"
                                            : "bg-transparent text-gray-700 dark:text-gray-200"
                                        }`}
                                >
                                    Company
                                </button>
                            </div>
                        </div>

                        {/* Client fields */}
                        {clientType === "person" ? (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    value={clientData.client_firstname}
                                    onChange={(e) => setClientData({ ...clientData, client_firstname: e.target.value })}
                                    className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    value={clientData.client_lastname}
                                    onChange={(e) => setClientData({ ...clientData, client_lastname: e.target.value })}
                                    className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={clientData.client_email}
                                    onChange={(e) => setClientData({ ...clientData, client_email: e.target.value })}
                                    className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                                    required
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={clientData.client_phonenum}
                                    onChange={(e) => setClientData({ ...clientData, client_phonenum: e.target.value })}
                                    className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                                />
                                <input
                                    type="text"
                                    placeholder="Address"
                                    value={clientData.client_address}
                                    onChange={(e) => setClientData({ ...clientData, client_address: e.target.value })}
                                    className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white md:col-span-4"
                                    required
                                />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                <input
                                    type="text"
                                    placeholder="Company Name"
                                    value={clientData.company_name}
                                    onChange={(e) => setClientData({ ...clientData, company_name: e.target.value })}
                                    className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={clientData.client_email}
                                    onChange={(e) => setClientData({ ...clientData, client_email: e.target.value })}
                                    className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                                    required
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={clientData.client_phonenum}
                                    onChange={(e) => setClientData({ ...clientData, client_phonenum: e.target.value })}
                                    className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                                />
                                {/* The grid will automatically move the next item to a new row since this spans all columns */}
                                <input
                                    type="text"
                                    placeholder="Address"
                                    value={clientData.client_address}
                                    onChange={(e) => setClientData({ ...clientData, client_address: e.target.value })}
                                    className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white md:col-span-4"
                                    required
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <h3 className="mb-2 font-semibold text-blue-700 dark:text-blue-300">Contact Person</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 ">
                            <input
                                type="text"
                                placeholder="First Name"
                                value={contact.contact_firstname}
                                onChange={(e) => setContact({ ...contact, contact_firstname: e.target.value })}
                                className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={contact.contact_lastname}
                                onChange={(e) => setContact({ ...contact, contact_lastname: e.target.value })}
                                className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={contact.contact_email}
                                onChange={(e) => setContact({ ...contact, contact_email: e.target.value })}
                                className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                            />
                            <input
                                type="tel"
                                placeholder="Phone"
                                value={contact.contact_phone}
                                onChange={(e) => setContact({ ...contact, contact_phone: e.target.value })}
                                className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white"
                            />
                            <input
                                type="text"
                                placeholder="Address"
                                value={contact.contact_address}
                                onChange={(e) => setContact({ ...contact, contact_address: e.target.value })}
                                className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white md:col-span-4"
                            />
                            <input
                                type="text"
                                placeholder="Relation / Role"
                                value={contact.contact_role}
                                onChange={(e) => setContact({ ...contact, contact_role: e.target.value })}
                                className="w-full rounded-lg border px-3 py-2 dark:bg-slate-700 dark:text-white md:col-span-3"
                            />
                            <button
                                type="button"
                                onClick={handleAddContact}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 md:col-span-1"
                            >
                                +
                            </button>
                        </div>

                        {contacts.length > 0 && (
                            <div className="mt-4 overflow-x-auto">
                                <table className="w-full table-auto text-sm dark:text-slate-100">
                                    <thead className="dark:text-slate-500">
                                        <tr className="text-left uppercase">
                                            <th className="px-2 py-1">Name</th>
                                            <th className="px-2 py-1">Email</th>
                                            <th className="px-2 py-1">Phone</th>
                                            <th className="px-2 py-1">Role</th>
                                            <th className="px-2 py-1">Remove</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contacts.map((c, idx) => (
                                            <tr key={idx} className="border-t">
                                                <td className="px-2 py-1">{c.contact_fullname}</td>
                                                <td className="px-2 py-1">{c.contact_email}</td>
                                                <td className="px-2 py-1">{c.contact_phone}</td>
                                                <td className="px-2 py-1">{c.contact_role}</td>
                                                <td className="px-2 py-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveContact(idx)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-2">
                        <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddClient;