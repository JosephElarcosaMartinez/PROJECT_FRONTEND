import React, { useState } from "react";
import {
    Settings as SettingsIcon,
    Layers,
    Lock,
    User,
    CreditCard,
    List,
    Archive,
    Trash2,
    Edit,
} from "lucide-react";

// Reusable container for each settings section
const SettingsCard = ({ title, children }) => (
    <section>
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 space-y-6">
            {children}
        </div>
    </section>
);

const Settings = () => {
    const [activeTab, setActiveTab] = useState("categories"); // ✅ Default = categories

    // Categories
    const [categories, setCategories] = useState([
        "Criminal Case",
        "Civil Case",
        "Family Case",
    ]);
    const [newCategory, setNewCategory] = useState("");
    const [editIndex, setEditIndex] = useState(null);

    // Access
    const [accessRoles, setAccessRoles] = useState([
        { role: "Admin", access: "Full Access" },
        { role: "Lawyer", access: "Restricted" },
        { role: "Client", access: "View Only" },
    ]);

    // Users
    const [users, setUsers] = useState([
        { role: "Admin", description: "Full Control" },
        { role: "Lawyer", description: "Limited Access" },
        { role: "Client", description: "Read Only" },
    ]);

    // Payments
    const [currency, setCurrency] = useState("USD");
    const [tax, setTax] = useState(12);
    const [invoicePrefix, setInvoicePrefix] = useState("INV-");

    // Logs
    const [logs, setLogs] = useState([
        "User Admin logged in",
        "Case #123 updated",
        "Payment INV-1001 processed",
    ]);

    // Archive
    const [archiveMonths, setArchiveMonths] = useState(12);

    const tabs = [
        { key: "categories", label: "Case Categories & Types", icon: Layers },
        { key: "access", label: "Case Access", icon: Lock },
        { key: "users", label: "User Management", icon: User },
        { key: "payments", label: "Payments & Billing", icon: CreditCard },
        { key: "logs", label: "Logs & Audit Trail", icon: List },
        { key: "archive", label: "Archive Settings", icon: Archive },
    ];

    // --- Handlers ---

    // Categories
    const handleAddCategory = (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        if (editIndex !== null) {
            const updated = [...categories];
            updated[editIndex] = newCategory;
            setCategories(updated);
            setEditIndex(null);
        } else {
            setCategories([...categories, newCategory]);
        }
        setNewCategory("");
    };

    const handleEditCategory = (index) => {
        setNewCategory(categories[index]);
        setEditIndex(index);
    };

    const handleRemoveCategory = (index) => {
        setCategories(categories.filter((_, i) => i !== index));
    };

    // Access
    const handleEditAccess = (index) => {
        const newAccess = prompt(
            "Enter new access level:",
            accessRoles[index].access
        );
        if (newAccess) {
            const updated = [...accessRoles];
            updated[index].access = newAccess;
            setAccessRoles(updated);
        }
    };

    // Users
    const handleManageUser = (index) => {
        const newDescription = prompt(
            `Update role: ${users[index].role}`,
            users[index].description
        );
        if (newDescription) {
            const updated = [...users];
            updated[index].description = newDescription;
            setUsers(updated);
        }
    };

    // Logs
    const handleClearLogs = () => setLogs([]);

    // Payments
    const handleSavePayments = () => {
        alert(
            `Saved:\nCurrency: ${currency}\nTax: ${tax}%\nInvoice Prefix: ${invoicePrefix}`
        );
    };

    // Archive
    const handleSaveArchive = () => {
        alert(`Archive policy saved: Auto-archive after ${archiveMonths} months`);
    };

    return (
        <div className="flex h-full">
            {/* Sidebar */}
            <aside className="w-72 bg-white dark:bg-gray-900 border-r dark:border-gray-700 shadow-md">
                <div className="p-4 font-semibold text-lg border-b dark:border-gray-700 flex items-center gap-2">
                    <SettingsIcon size={22} />
                    <span>Settings</span>
                </div>
                <nav className="flex flex-col p-2 space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm font-medium
                ${activeTab === tab.key
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "hover:bg-blue-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Content */}
            <main className="flex-1 p-6 overflow-y-auto space-y-8">
                {/* Categories */}
                {activeTab === "categories" && (
                    <SettingsCard title="Case Categories & Types">
                        <form onSubmit={handleAddCategory} className="flex gap-3 mb-4">
                            <input
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="Add new category"
                                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                {editIndex !== null ? "Update" : "Add"}
                            </button>
                        </form>
                        <ul className="space-y-2">
                            {categories.map((category, i) => (
                                <li
                                    key={i}
                                    className="flex justify-between items-center px-3 py-2 border rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                >
                                    <span>{category}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditCategory(i)}
                                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                                        >
                                            <Edit size={14} /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleRemoveCategory(i)}
                                            className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                                        >
                                            <Trash2 size={14} /> Remove
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </SettingsCard>
                )}

                {/* Access */}
                {activeTab === "access" && (
                    <SettingsCard title="Case Access">
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr className="text-left border-b dark:border-gray-700">
                                    <th className="py-2">Role</th>
                                    <th className="py-2">Access Level</th>
                                    <th className="py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {accessRoles.map((row, i) => (
                                    <tr
                                        key={i}
                                        className="border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        <td className="py-2">{row.role}</td>
                                        <td className="py-2">{row.access}</td>
                                        <td className="py-2">
                                            <button
                                                onClick={() => handleEditAccess(i)}
                                                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </SettingsCard>
                )}

                {/* Users */}
                {activeTab === "users" && (
                    <SettingsCard title="User Management">
                        <ul className="space-y-2">
                            {users.map((user, i) => (
                                <li
                                    key={i}
                                    className="flex justify-between items-center px-3 py-2 border rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                >
                                    <span>
                                        {user.role} – {user.description}
                                    </span>
                                    <button
                                        onClick={() => handleManageUser(i)}
                                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                    >
                                        Manage
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </SettingsCard>
                )}

                {/* Payments */}
                {activeTab === "payments" && (
                    <SettingsCard title="Payments & Billing">
                        <div>
                            <label className="block mb-2 font-medium">Currency</label>
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700"
                            >
                                <option>USD</option>
                                <option>EUR</option>
                                <option>PHP</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 font-medium">Tax Rate (%)</label>
                            <input
                                type="number"
                                value={tax}
                                onChange={(e) => setTax(e.target.value)}
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-medium">Invoice Prefix</label>
                            <input
                                type="text"
                                value={invoicePrefix}
                                onChange={(e) => setInvoicePrefix(e.target.value)}
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700"
                            />
                        </div>
                        <button
                            onClick={handleSavePayments}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            Save Settings
                        </button>
                    </SettingsCard>
                )}

                {/* Logs */}
                {activeTab === "logs" && (
                    <SettingsCard title="Logs & Audit Trail">
                        {logs.length > 0 ? (
                            <ul className="mb-4 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                {logs.map((log, i) => (
                                    <li key={i}>• {log}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No logs available.</p>
                        )}
                        <button
                            onClick={handleClearLogs}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                        >
                            Clear All Logs
                        </button>
                    </SettingsCard>
                )}

                {/* Archive */}
                {activeTab === "archive" && (
                    <SettingsCard title="Archive Settings">
                        <div>
                            <label className="block mb-2 font-medium">
                                Auto-archive cases after (months)
                            </label>
                            <input
                                type="number"
                                value={archiveMonths}
                                onChange={(e) => setArchiveMonths(e.target.value)}
                                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700"
                            />
                        </div>
                        <button
                            onClick={handleSaveArchive}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            Save Settings
                        </button>
                    </SettingsCard>
                )}
            </main>
        </div>
    );
};

export default Settings;
