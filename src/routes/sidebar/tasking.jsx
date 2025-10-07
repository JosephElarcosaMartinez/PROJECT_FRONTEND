import React, { useState, useEffect } from "react";
import { COLUMNS } from "@/constants";
import Column from "@/components/tasking/column";
import { DndContext } from "@dnd-kit/core";
import toast from "react-hot-toast";

export const Tasking = () => {
    const [tasks, setTasks] = useState([]);

    // Fetch tasks from backend
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/documents", {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) throw new Error("Failed to fetch tasks");

                const data = await res.json();
                const taskData = data.filter((doc) => doc.doc_type === "Task");
                setTasks(taskData);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        fetchTasks();
    }, []);

    function handleDragEnd(event) {
        const { active, over } = event;
        if (!over) return;

        const taskId = active.id;
        const newStatus = over.id;

        const toastId = toast.loading("Updating task status...", { duration: 4000 });

        try {
            const updatedTasks = tasks.map((task) => {
                if (task.doc_id === taskId && task.doc_status !== newStatus) {
                    fetch(`http://localhost:3000/api/documents/${taskId}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({ doc_status: newStatus }),
                    })
                        .then((res) => {
                            if (!res.ok) throw new Error("Failed to update task status");
                            toast.success("Task status updated successfully!", { id: toastId });
                        })
                        .catch((error) => {
                            console.error("Error updating task status:", error);
                            toast.error("Failed to update task status", { id: toastId });
                        });

                    return { ...task, doc_status: newStatus };
                }
                return task;
            });
            setTasks(updatedTasks);
        } catch (error) {
            console.error("Error updating task status:", error);
            toast.error("Failed to update task status", { id: toastId });
        }
    }

    // helper for priority color
    const getPriorityStyle = (priority) => {
        switch (priority) {
            case "High":
                return "bg-red-500 text-white";
            case "Medium":
                return "bg-yellow-500 text-white";
            case "Low":
                return "bg-blue-500 text-white";
            default:
                return "bg-gray-400 text-white";
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Tasks</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Monitor and update tasks with our intuitive drag-and-drop interface.
                </p>
            </div>

            {/* Priority Legend */}
            <div>
                <h3 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Priority Levels:
                </h3>
                <div className="flex gap-4">
                    {[
                        { color: "bg-red-500", label: "High" },
                        { color: "bg-yellow-500", label: "Medium" },
                        { color: "bg-blue-500", label: "Low" },
                    ].map((p) => (
                        <div key={p.label} className="flex items-center gap-2">
                            <div className={`h-4 w-4 rounded-full ${p.color}`}></div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">{p.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Drag and Drop Columns */}
            <DndContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {COLUMNS.map((column) => (
                        <Column
                            key={column.id}
                            column={column}
                            tasks={tasks.filter((task) => task.doc_status === column.id)}
                            getPriorityStyle={getPriorityStyle}
                        />
                    ))}
                </div>
            </DndContext>

            {/* Table Section */}
            <div className="mt-10">
                <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
                    Task Overview
                </h2>

                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100 dark:bg-slate-900/40">
                            <tr>
                                <th className="px-5 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">
                                    Task Name
                                </th>
                                <th className="px-5 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">
                                    Description
                                </th>
                                <th className="px-5 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">
                                    Due Date
                                </th>
                                <th className="px-5 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">
                                    Priority Level
                                </th>
                                <th className="px-5 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                            {tasks.length > 0 ? (
                                tasks.map((task) => (
                                    <tr
                                        key={task.doc_id}
                                        className="transition-colors hover:bg-gray-50 dark:hover:bg-slate-700/60"
                                    >
                                        <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-100">
                                            {task.doc_name}
                                        </td>
                                        <td className="px-5 py-3 text-slate-600 dark:text-slate-300">
                                            {task.doc_description || "—"}
                                        </td>
                                        <td className="px-5 py-3 text-slate-700 dark:text-slate-200">
                                            {task.doc_due_date || "No date"}
                                        </td>
                                        <td className="px-5 py-3">
                                            <div
                                                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${getPriorityStyle(
                                                    task.doc_priority
                                                )}`}
                                            >
                                                <span className="h-2 w-2 rounded-full bg-white"></span>
                                                {task.doc_priority}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex flex-wrap gap-2">
                                                <button className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700/60">
                                                    To Do
                                                </button>
                                                <button className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700">
                                                    Progress
                                                </button>
                                                <button className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700">
                                                    Done
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-5 py-6 text-center text-slate-500 dark:text-slate-400"
                                    >
                                        No tasks found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Tasking;
