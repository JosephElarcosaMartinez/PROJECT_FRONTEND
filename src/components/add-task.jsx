import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/auth-context.jsx";

export default function AddTask({ caseId, onClose, onAdded }) {
    const { user } = useAuth() || {};

    const [docs, setDocs] = useState([]);
    const [users, setUsers] = useState([]);
    const [loadingDocs, setLoadingDocs] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Form state
    const [form, setForm] = useState({
        doc_name: "",
        doc_description: "",
        doc_task: "",
        doc_prio_level: "",
        doc_due_date: "",
        doc_tag: "",
        doc_password: "",
        doc_tasked_to: "",
        doc_type: "Task",
    });

    const [file, setFile] = useState(null);

    const prioToDays = useMemo(() => ({ Low: 14, Mid: 5, High: 2 }), []);

    const formatDate = (d) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    };

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const onPriorityChange = (e) => {
        const value = e.target.value;
        const days = prioToDays[value];
        let due = "";
        if (days) {
            const dt = new Date();
            dt.setDate(dt.getDate() + days);
            due = formatDate(dt);
        }
        setForm((prev) => ({ ...prev, doc_prio_level: value, doc_due_date: due }));
    };

    // Fetch existing documents
    const fetchDocuments = async () => {
        if (!caseId) return;
        setLoadingDocs(true);
        setError("");
        try {
            const res = await fetch(`http://localhost:3000/api/case/documents/${caseId}`, {
                credentials: "include",
            });
            if (!res.ok) throw new Error(`Failed to load documents (${res.status})`);
            const data = await res.json();
            setDocs(Array.isArray(data) ? data : []);
        } catch (e) {
            setError(e.message || "Failed to load documents");
        } finally {
            setLoadingDocs(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [caseId]);

    // Fetch users for dropdown
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/users", {
                    method: "GET",
                    credentials: "include",
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to fetch users.");
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!caseId) return;
        setSubmitting(true);
        setError("");
        setSuccess("");
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => {
                if (v !== undefined && v !== null) fd.append(k, v);
            });
            if (file) fd.append("doc_file", file);
            if (user?.user_id) fd.append("doc_tasked_by", user.user_id);
            fd.append("case_id", caseId);

            const res = await fetch("http://localhost:3000/api/documents", {
                method: "POST",
                body: fd,
                credentials: "include",
            });

            if (!res.ok) {
                const t = await res.text();
                throw new Error(t || "Failed to create task document");
            }

            setSuccess("Task document created.");
            setForm({
                doc_name: "",
                doc_description: "",
                doc_task: "",
                doc_prio_level: "",
                doc_due_date: "",
                doc_tag: "",
                doc_password: "",
                doc_tasked_to: "",
                doc_type: "Task",
            });
            setFile(null);
            fetchDocuments();
            if (onAdded) onAdded();
        } catch (e) {
            setError(e.message || "Submission failed");
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Add Task Document</h2>

            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Tasked To</label>
                    <select
                        name="doc_tasked_to"
                        value={form.doc_tasked_to}
                        onChange={onChange}
                        className="border rounded px-3 py-2"
                        required
                    >
                        <option value="" disabled>
                            Select user
                        </option>
                        {users
                            .filter((u) => u.user_role === "Paralegal" || u.user_role === "Staff")
                            .map((u) => (
                                <option key={u.user_id} value={u.user_id}>
                                    {u.user_fname} {u.user_mname ? u.user_mname[0] + ". " : ""}{u.user_lname}
                                </option>
                            ))}
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Document Name</label>
                    <input
                        name="doc_name"
                        value={form.doc_name}
                        onChange={onChange}
                        type="text"
                        required
                        placeholder="e.g. Evidence Summary"
                        className="border rounded px-3 py-2"
                    />
                </div>

                <div className="md:col-span-1 flex flex-col">
                    <label className="text-sm font-medium mb-1">Description</label>
                    <textarea
                        name="doc_description"
                        value={form.doc_description}
                        onChange={onChange}
                        rows={3}
                        placeholder="Short description"
                        className="border rounded px-3 py-2"
                    />
                </div>

                <div className="md:col-span-1 flex flex-col">
                    <label className="text-sm font-medium mb-1">Task</label>
                    <textarea
                        name="doc_task"
                        value={form.doc_task}
                        onChange={onChange}
                        rows={3}
                        placeholder="Detailed task instructions"
                        className="border rounded px-3 py-2"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">File Reference (PDF)</label>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="border rounded px-3 py-2"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Priority Level</label>
                    <select
                        name="doc_prio_level"
                        value={form.doc_prio_level}
                        onChange={onPriorityChange}
                        className="border rounded px-3 py-2"
                        required
                    >
                        <option value="" disabled>Select priority</option>
                        <option value="Low">Low</option>
                        <option value="Mid">Mid</option>
                        <option value="High">High</option>
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Due Date (auto)</label>
                    <input
                        name="doc_due_date"
                        value={form.doc_due_date}
                        onChange={onChange}
                        type="date"
                        className="border rounded px-3 py-2"
                        required
                        readOnly
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Tag</label>
                    <input
                        name="doc_tag"
                        value={form.doc_tag}
                        onChange={onChange}
                        type="text"
                        placeholder="e.g. urgent, review"
                        className="border rounded px-3 py-2"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Password</label>
                    <input
                        name="doc_password"
                        value={form.doc_password}
                        onChange={onChange}
                        type="password"
                        placeholder="Optional password"
                        className="border rounded px-3 py-2"
                    />
                </div>

                <div className="md:col-span-2 flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-60"
                    >
                        {submitting ? "Submitting..." : "Create Task Document"}
                    </button>
                </div>
            </form>

            <div className="mt-4 overflow-x-auto">
                <h3 className="font-medium mb-2">Existing Documents for this Case</h3>
                {loadingDocs ? (
                    <p className="text-sm text-gray-500">Loading...</p>
                ) : docs.length === 0 ? (
                    <p className="text-sm text-gray-500">No documents found.</p>
                ) : (
                    <table className="min-w-full text-sm border">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left p-2 border">Name</th>
                                <th className="text-left p-2 border">Type</th>
                                <th className="text-left p-2 border">Priority</th>
                                <th className="text-left p-2 border">Due</th>
                                <th className="text-left p-2 border">Tag</th>
                                <th className="text-left p-2 border">File</th>
                            </tr>
                        </thead>
                        <tbody>
                            {docs.map((d) => (
                                <tr key={d.doc_id} className="odd:bg-white even:bg-gray-50">
                                    <td className="p-2 border">{d.doc_name}</td>
                                    <td className="p-2 border">{d.doc_type}</td>
                                    <td className="p-2 border">{d.doc_prio_level || "-"}</td>
                                    <td className="p-2 border">{d.doc_due_date ? new Date(d.doc_due_date).toLocaleDateString() : "-"}</td>
                                    <td className="p-2 border">{d.doc_tag || "-"}</td>
                                    <td className="p-2 border">
                                        {d.doc_file ? (
                                            <a
                                                className="text-blue-600 hover:underline"
                                                href={`http://localhost:3000${d.doc_file}`}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                View
                                            </a>
                                        ) : "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
