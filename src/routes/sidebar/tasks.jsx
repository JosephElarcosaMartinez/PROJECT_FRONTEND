import { useState } from "react";
import { Filter, Plus, Trash2, Pencil, X, UploadCloud, Paperclip, } from "lucide-react";

const initialTasks = [
  {
    id: 1,
    title: "Draft incorporation documents",
    case: "Davis Incorporation",
    description: "Prepare articles of incorporation and bylaws",
    assignedTo: "John Cooper",
    status: "Completed",
    dueDate: "Dec 1, 2022",
    completedDate: "Nov 25, 2022",
    attachment: null,
  },
  {
    id: 2,
    title: "Prepare deposition questions",
    case: "Smith vs. Henderson",
    description: "Draft questions for opposing party deposition",
    assignedTo: "Emma Thompson",
    status: "Pending",
    dueDate: "Apr 1, 2023",
    completedDate: null,
    attachment: null,
  },
  {
    id: 3,
    title: "Site inspection",
    case: "Wilson Property Dispute",
    description: "Visit property to document current boundary markers",
    assignedTo: "Sarah Wilson",
    status: "In Progress",
    dueDate: "Apr 1, 2023",
    completedDate: null,
    attachment: null,
  },
];

const statusColor = {
  Completed: "text-green-600",
  Pending: "text-yellow-600",
  "In Progress": "text-blue-500",
};

export default function Tasks() {
  const [tasks, setTasks] = useState(initialTasks);

  const handleFileChange = (e, taskId) => {
    const file = e.target.files[0];
    if (file) {
      setTasks(prev =>
        prev.map(t =>
          t.id === taskId ? { ...t, attachment: file } : t
        )
      );
    }
  };

  return (
    <div className="min-h-screen p-6 text-black dark:text-white">
      <h2 className="text-2xl font-bold mb-4">Tasks</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map(task => (
          <div
            key={task.id}
            className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-4 rounded shadow relative"
          >
            <div className="absolute top-3 right-4 text-sm font-medium">
              <span className={statusColor[task.status]}>
                {task.status}
              </span>
            </div>

            <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-1">
              {task.title}
            </h3>
            <p className="text-sm">
              <strong>Case:</strong> {task.case}
            </p>
            <p className="text-sm mb-2">{task.description}</p>
            <p className="text-sm mb-1">
              <strong>Assigned to:</strong> {task.assignedTo}
            </p>
            <p className="text-sm mb-1">
              <strong className="text-red-600">Due:</strong> {task.dueDate}
              {task.status !== "Completed" &&
                task.dueDate === "Apr 1, 2023" && (
                  <span className="text-red-500 ml-1">(Overdue)</span>
                )}
            </p>
            {task.status === "Completed" && (
              <p className="text-sm mb-2 text-green-600">
                <strong>Completed:</strong> {task.completedDate}
              </p>
            )}

            {/* Attach File */}
            <div className="mt-4 flex justify-end">
              <div className="text-right">
                <label className="inline-flex items-center gap-2 cursor-pointer text-blue-600 hover:underline text-sm">
                  <Paperclip size={16} />
                  {task.attachment ? "Change File" : "Attach File"}
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, task.id)}
                  />
                </label>
                {task.attachment && (
                  <p className="text-xs text-gray-600 mt-1 truncate w-48 text-right">
                    {task.attachment.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
