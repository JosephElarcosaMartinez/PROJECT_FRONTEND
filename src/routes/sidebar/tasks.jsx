import { useState, useEffect } from "react";
import { Filter, Plus, Trash2, Pencil, X, UploadCloud, Paperclip } from "lucide-react";

// Will be removed once backend is integrated
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
  {
    id: 4,
    title: "Contract Review",
    case: "Anderson vs. Global Corp",
    description: "Review the contractual obligations",
    assignedTo: "Michael Brown",
    status: "Pending",
    dueDate: "May 5, 2023",
    completedDate: null,
    attachment: null,
  },
  {
    id: 5,
    title: "Witness Interview",
    case: "Lopez vs. Metro Bank",
    description: "Interview main witnesses for testimony",
    assignedTo: "Sarah Wilson",
    status: "In Progress",
    dueDate: "May 10, 2023",
    completedDate: null,
    attachment: null,
  },
  {
    id: 6,
    title: "File Court Motion",
    case: "Davis Incorporation",
    description: "File motion for summary judgment",
    assignedTo: "Emma Thompson",
    status: "Completed",
    dueDate: "May 15, 2023",
    completedDate: "May 12, 2023",
    attachment: null,
  },
  {
    id: 7,
    title: "Research Case Law",
    case: "Smith vs. Henderson",
    description: "Research precedents relevant to case",
    assignedTo: "John Cooper",
    status: "Pending",
    dueDate: "May 20, 2023",
    completedDate: null,
    attachment: null,
  },
];



const statusColor = {
  Completed: "text-green-600",
  Pending: "text-red-600",
  "In Progress": "text-yellow-600",
};

//  Tab colors
const getTabColor = (status, selectedStatus) => {
  const isActive = selectedStatus === status;

  switch (status) {
    case "Pending":
      return isActive ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300";
    case "In Progress":
      return isActive ? "bg-yellow-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300";
    case "Completed":
      return isActive ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300";
    default:
      return isActive ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300";
  }
};

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(tasks.length / itemsPerPage);

  // Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks');
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        const formattedTasks = data.map(task => ({
          id: task.td_id,
          title: task.td_name,
          description: task.td_description,
          assignedTo: task.td_to, // You'll need to fetch user details separately
          status: task.td_status,
          dueDate: new Date(task.td_due_date).toLocaleDateString(),
          completedDate: task.td_date_completed ? new Date(task.td_date_completed).toLocaleDateString() : null,
          attachment: task.td_doc_path
        }));
        setTasks(formattedTasks);
      } catch (err) {
        setError('Failed to fetch tasks');
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTasks = tasks.slice(indexOfFirstItem, indexOfLastItem);

  const handleFileChange = async (e, taskId) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`/api/tasks/${taskId}/upload`, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Failed to upload file');
        }

        const data = await response.json();
        // Update the local state with the new file path
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, attachment: data.filePath } : t))
        );
      } catch (error) {
        console.error('Error uploading file:', error);
        // Handle error appropriately
      }
    }
  };

  // Function to update task status
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus,
          completedDate: newStatus === 'Completed' ? new Date().toISOString() : null
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update task status');
      }
      
      // Update local state
      setTasks(prev =>
        prev.map(task =>
          task.id === taskId
            ? {
                ...task,
                status: newStatus,
                completedDate: newStatus === 'Completed' ? new Date().toLocaleDateString() : null
              }
            : task
        )
      );
    } catch (error) {
      console.error('Error updating task status:', error);
      // Handle error appropriately
    }
  };

  return (
    <div className="space-y-6 min-h-screen text-black dark:text-white">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">
          Tasks
        </h2>
        <p className="text-sm text-gray-500">
          Manage and track all case-related tasks
        </p>
      </div>

      {/* Tasks Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center p-4">{error}</div>
      ) : tasks.length === 0 ? (
        <div className="text-center p-4">No tasks found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-4 rounded-lg shadow-lg relative"
          >
            <div className="absolute top-3 right-4 text-sm font-medium">
              <span className={statusColor[task.status]}>{task.status}</span>
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
      )}

      {/* Pagination */}
      <div className="flex justify-end items-center gap-3 mt-4">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 border rounded ${
            currentPage === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700"
          }`}
        >
          &lt;
        </button>

        <span className="text-sm text-gray-700 dark:text-white">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 border rounded ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700"
          }`}
        >
          &gt;
        </button>
      </div>    
    </div>
  );
}
