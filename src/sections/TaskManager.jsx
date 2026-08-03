import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaTasks } from "react-icons/fa";

export default function TaskManager() {
  const [tasks, setTasks] = useState([
    {
      id: "TASK-1001",
      title: "Initialize Express Server",
      description: "Setup base directory structure, install Express, configure request logging and cors middleware."
    },
    {
      id: "TASK-1002",
      title: "Design REST API Endpoints",
      description: "Define router routes for CRUD operations on tasks with proper HTTP responses and status codes."
    },
    {
      id: "TASK-1003",
      title: "Implement Validation Middleware",
      description: "Write custom Express middleware to validate content-type header and verify Task ID format."
    },
    {
      id: "TASK-1004",
      title: "Centralized Error Handling",
      description: "Add a global error-handling middleware to catch server failures and return standard JSON outputs."
    }
  ]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    if (!description.trim()) {
      setError("Task description is required.");
      return;
    }

    if (editingId) {
      // Update task
      setTasks(
        tasks.map((task) =>
          task.id === editingId
            ? { ...task, title: title.trim(), description: description.trim() }
            : task
        )
      );
      setEditingId(null);
    } else {
      // Create new task
      const nextNum = tasks.length > 0 
        ? Math.max(...tasks.map(t => parseInt(t.id.split("-")[1]))) + 1 
        : 1001;
      const newTask = {
        id: `TASK-${nextNum}`,
        title: title.trim(),
        description: description.trim()
      };
      setTasks([...tasks, newTask]);
    }

    setTitle("");
    setDescription("");
  };

  const handleEdit = (task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setError("");
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setTitle("");
      setDescription("");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setError("");
  };

  return (
    <section id="tasks" className="relative py-24 px-6 overflow-hidden border-t border-white/5 bg-bg-black">
      {/* Dynamic Background Gradients */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-brand-cyan/5 blur-[120px] top-[10%] right-[-100px] pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-brand-purple/5 blur-[100px] bottom-[10%] left-[-150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Page Title Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs font-bold mb-4"
          >
            <FaTasks /> Developer Tool
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold mb-4 tracking-wide"
          >
            Task <span className="text-gradient text-gradient-purple-pink">Management</span>
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "80px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="h-[3px] bg-gradient-to-r from-brand-purple to-brand-magenta mx-auto rounded-full"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Add / Edit Task Form Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-4 glass rounded-2xl p-6 border border-white/5 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-brand-cyan via-brand-purple to-brand-magenta" />
            <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
              {editingId ? "Edit Task" : "Create New Task"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Task Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Setup database connection"
                  className="w-full px-4 py-3 rounded-xl glass border border-white/5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the objective and requirements of this task..."
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl glass border border-white/5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20 transition-all duration-300 resize-none"
                />
              </div>

              {error && (
                <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg font-semibold flex items-center gap-1.5">
                  <FaTimes /> {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 py-2.5 rounded-xl font-bold text-xs tracking-wider glass border border-white/5 hover:border-slate-450 hover:bg-white/5 text-slate-350 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl font-bold text-xs tracking-wider bg-gradient-to-r from-brand-purple to-brand-magenta text-white text-center flex items-center justify-center gap-1.5 transition-all hover:opacity-95 shadow-lg shadow-brand-magenta/10 cursor-pointer"
                >
                  {editingId ? (
                    <>
                      <FaCheck /> Update Task
                    </>
                  ) : (
                    <>
                      <FaPlus /> Add Task
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Tasks List Table Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-8 glass rounded-2xl border border-white/5 overflow-hidden shadow-xl"
          >
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <h3 className="font-bold text-slate-200">Active Task Queue</h3>
              <span className="text-xs font-bold text-slate-450 bg-slate-900 border border-white/5 px-2.5 py-0.5 rounded-full">
                {tasks.length} {tasks.length === 1 ? "Task" : "Tasks"}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400 w-24">ID</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400 w-48">Title</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Description</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-center w-28">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence initial={false}>
                    {tasks.length === 0 ? (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-white/5 text-slate-500 font-semibold"
                      >
                        <td colSpan="4" className="p-8 text-center text-sm">
                          No active tasks in queue. Create one using the side panel!
                        </td>
                      </motion.tr>
                    ) : (
                      tasks.map((task) => (
                        <motion.tr
                          key={task.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="border-b border-white/5 hover:bg-white/[0.01] transition-colors"
                        >
                          <td className="p-4 text-xs font-mono font-bold text-brand-cyan tracking-wide">
                            {task.id}
                          </td>
                          <td className="p-4 text-sm font-extrabold text-slate-200 break-words max-w-[12rem]">
                            {task.title}
                          </td>
                          <td className="p-4 text-xs text-slate-400 leading-relaxed break-words max-w-sm">
                            {task.description}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEdit(task)}
                                title="Edit Task"
                                className="p-2 rounded-lg bg-slate-900 border border-white/5 hover:border-brand-purple/50 text-slate-400 hover:text-brand-purple transition-all text-xs cursor-pointer flex items-center justify-center"
                              >
                                <FaEdit size={12} />
                              </button>
                              <button
                                onClick={() => handleDelete(task.id)}
                                title="Delete Task"
                                className="p-2 rounded-lg bg-slate-900 border border-white/5 hover:border-rose-500/50 text-slate-400 hover:text-rose-500 transition-all text-xs cursor-pointer flex items-center justify-center"
                              >
                                <FaTrash size={12} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
