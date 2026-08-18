import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaTasks, FaSearch, FaChevronLeft, FaChevronRight, FaSpinner, FaFileDownload, FaFileExcel, FaFilePdf } from "react-icons/fa";
import * as taskService from "../services/taskService";
import Toast from "../components/ui/Toast";

const PRIORITY_OPTIONS = [
  { value: "Low", label: "Low Priority" },
  { value: "Medium", label: "Medium Priority" },
  { value: "High", label: "High Priority" },
];

const getTaskId = (task) => task._id || task.id;

const getPriorityClass = (priority = "Medium") => {
  const normalized = priority.toLowerCase();
  if (normalized === "high") {
    return "bg-rose-500/20 text-rose-400 border border-rose-500/30";
  }
  if (normalized === "medium") {
    return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
  }
  return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
};

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [limit] = useState(5);

  // Filter and search state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCompleted, setFilterCompleted] = useState("all"); // all, true, false
  const [filterPriority, setFilterPriority] = useState("all"); // all, low, medium, high
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, priority

  // Fetch tasks from backend
  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        page: currentPage,
        limit,
        sort: sortBy
      };

      if (searchQuery) params.search = searchQuery;
      if (filterCompleted !== "all") params.completed = filterCompleted;
      if (filterPriority !== "all") params.priority = filterPriority;

      const response = await taskService.getTasks(params);
      setTasks(response.tasks);
      setTotalPages(response.totalPages);
      setTotalTasks(response.totalTasks);
    } catch (err) {
      setError(err.message || "Unable to connect to task server.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load tasks on mount and when filters change
  useEffect(() => {
    fetchTasks();
  }, [currentPage, searchQuery, filterCompleted, filterPriority, sortBy]);

  // Reset to page 1 when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchQuery, filterCompleted, filterPriority, sortBy]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    setSubmitting(true);

    try {
      if (editingId) {
        await taskService.updateTask(editingId, {
          title: title.trim(),
          description: description.trim(),
          priority,
        });
        setEditingId(null);
        setToast({ show: true, message: "Task updated successfully.", type: "success" });
      } else {
        await taskService.createTask({
          title: title.trim(),
          description: description.trim(),
          priority,
          completed: false,
        });
        setToast({ show: true, message: "Task added successfully.", type: "success" });
      }

      setTitle("");
      setDescription("");
      setPriority("Medium");

      await fetchTasks();
    } catch (err) {
      setError(err.message || "Failed to save task");
      console.error("Submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (task) => {
    setEditingId(getTaskId(task));
    setTitle(task.title);
    setDescription(task.description || "");
    setPriority(task.priority || "Medium");
    setError("");
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      await taskService.deleteTask(id);

      if (tasks.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        await fetchTasks();
      }

      if (editingId === id) {
        handleCancel();
      }

      setToast({ show: true, message: "Task deleted successfully.", type: "success" });
    } catch (err) {
      setError(err.message || "Failed to delete task");
      console.error("Delete error:", err);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await taskService.toggleTaskComplete(getTaskId(task), !task.completed);
      await fetchTasks();
      setToast({
        show: true,
        message: task.completed ? "Task marked as pending." : "Task marked as completed.",
        type: "success",
      });
    } catch (err) {
      setError(err.message || "Failed to update task status");
      console.error("Toggle complete error:", err);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setError("");
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      setToast({ show: true, message: "Preparing Excel export...", type: "success" });
      await taskService.exportTasksToExcel({
        completed: filterCompleted,
        priority: filterPriority,
      });
    } catch (err) {
      setToast({ show: true, message: "Failed to export to Excel", type: "error" });
      console.error("Export error:", err);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setToast({ show: true, message: "Preparing PDF export...", type: "success" });
      await taskService.exportTasksToPDF({
        completed: filterCompleted,
        priority: filterPriority,
      });
    } catch (err) {
      setToast({ show: true, message: "Failed to export to PDF", type: "error" });
      console.error("Export error:", err);
    }
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
                  disabled={submitting}
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
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl glass border border-white/5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20 transition-all duration-300 resize-none"
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl glass border border-white/5 text-sm text-slate-200 focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20 transition-all duration-300"
                  disabled={submitting}
                >
                  {PRIORITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
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
                    disabled={submitting}
                    className="flex-1 py-2.5 rounded-xl font-bold text-xs tracking-wider glass border border-white/5 hover:border-slate-450 hover:bg-white/5 text-slate-350 transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl font-bold text-xs tracking-wider bg-gradient-to-r from-brand-purple to-brand-magenta text-white text-center flex items-center justify-center gap-1.5 transition-all hover:opacity-95 shadow-lg shadow-brand-magenta/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="animate-spin" /> Saving...
                    </>
                  ) : editingId ? (
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
            {/* Header with Search and Filters */}
            <div className="p-5 border-b border-white/5 bg-white/[0.01] space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h3 className="font-bold text-slate-200">Active Task Queue</h3>
                <span className="text-xs font-bold text-slate-450 bg-slate-900 border border-white/5 px-2.5 py-0.5 rounded-full">
                  {totalTasks} {totalTasks === 1 ? "Task" : "Tasks"}
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks by title or description..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass border border-white/5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20 transition-all duration-300"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                {/* Status Filter */}
                <div className="flex-1 min-w-[140px]">
                  <select
                    value={filterCompleted}
                    onChange={(e) => setFilterCompleted(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg glass border border-white/5 text-xs text-slate-300 focus:outline-none focus:border-brand-cyan/50 transition-all"
                  >
                    <option value="all">All Status</option>
                    <option value="false">Pending</option>
                    <option value="true">Completed</option>
                  </select>
                </div>

                {/* Priority Filter */}
                <div className="flex-1 min-w-[140px]">
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg glass border border-white/5 text-xs text-slate-300 focus:outline-none focus:border-brand-purple/50 transition-all"
                  >
                    <option value="all">All Priorities</option>
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>

                {/* Sort */}
                <div className="flex-1 min-w-[140px]">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg glass border border-white/5 text-xs text-slate-300 focus:outline-none focus:border-brand-blue/50 transition-all"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="priority">By Priority</option>
                  </select>
                </div>
              </div>

              {/* Download Buttons */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={handleDownloadExcel}
                  disabled={loading || tasks.length === 0}
                  className="flex-1 min-w-[120px] px-3 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold hover:bg-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                  title="Download tasks as Excel file with timestamp"
                >
                  <FaFileExcel /> Export Excel
                </button>
                <button
                  onClick={handleDownloadPDF}
                  disabled={loading || tasks.length === 0}
                  className="flex-1 min-w-[120px] px-3 py-2 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-bold hover:bg-rose-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                  title="Download tasks as PDF file with timestamp"
                >
                  <FaFilePdf /> Export PDF
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="p-12 text-center">
                <FaSpinner className="animate-spin text-brand-cyan text-3xl mx-auto mb-3" />
                <p className="text-sm text-slate-400 font-semibold">Loading tasks...</p>
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div className="p-8 text-center">
                <div className="text-rose-400 bg-rose-500/10 border border-rose-500/20 px-4 py-3 rounded-xl inline-block">
                  <p className="font-bold mb-1">⚠️ Error Loading Tasks</p>
                  <p className="text-xs">{error}</p>
                </div>
              </div>
            )}

            {/* Tasks Table */}
            {!loading && !error && (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.02]">
                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400 w-20">Status</th>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400 w-48">Title</th>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Description</th>
                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400 w-24">Priority</th>
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
                            <td colSpan="5" className="p-8 text-center text-sm">
                              {searchQuery || filterCompleted !== "all" || filterPriority !== "all"
                                ? "No tasks match your search or filters."
                                : "No tasks yet."}
                            </td>
                          </motion.tr>
                        ) : (
                          tasks.map((task) => {
                            const taskId = getTaskId(task);
                            return (
                            <motion.tr
                              key={taskId}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                              className="border-b border-white/5 hover:bg-white/[0.01] transition-colors"
                            >
                              <td className="p-4">
                                <button
                                  onClick={() => handleToggleComplete(task)}
                                  className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                                    task.completed
                                      ? "bg-brand-cyan border-brand-cyan text-white"
                                      : "border-slate-600 hover:border-brand-cyan"
                                  }`}
                                  title={task.completed ? "Mark as pending" : "Mark as completed"}
                                >
                                  {task.completed && <FaCheck size={10} />}
                                </button>
                              </td>
                              <td className={`p-4 text-sm font-extrabold break-words max-w-[12rem] ${
                                task.completed ? "text-slate-500 line-through" : "text-slate-200"
                              }`}>
                                {task.title}
                              </td>
                              <td className={`p-4 text-xs leading-relaxed break-words max-w-sm ${
                                task.completed ? "text-slate-600" : "text-slate-400"
                              }`}>
                                {task.description || "No description"}
                              </td>
                              <td className="p-4">
                                <span className={`inline-block px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getPriorityClass(task.priority)}`}>
                                  {task.priority || "Medium"}
                                </span>
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
                                    onClick={() => handleDelete(taskId)}
                                    title="Delete Task"
                                    className="p-2 rounded-lg bg-slate-900 border border-white/5 hover:border-rose-500/50 text-slate-400 hover:text-rose-500 transition-all text-xs cursor-pointer flex items-center justify-center"
                                  >
                                    <FaTrash size={12} />
                                  </button>
                                </div>
                              </td>
                            </motion.tr>
                          );
                          })
                        )}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="p-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between flex-wrap gap-3">
                    <div className="text-xs text-slate-400">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 rounded-lg glass border border-white/5 hover:border-brand-cyan/50 text-slate-400 hover:text-brand-cyan transition-all text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-white/5 disabled:hover:text-slate-400"
                      >
                        <FaChevronLeft size={10} />
                      </button>
                      {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        // Show first, last, current, and neighbors
                        if (
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          Math.abs(pageNum - currentPage) <= 1
                        ) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                currentPage === pageNum
                                  ? "bg-gradient-to-r from-brand-cyan to-brand-blue text-white"
                                  : "glass border border-white/5 hover:border-brand-cyan/50 text-slate-400 hover:text-brand-cyan"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        } else if (Math.abs(pageNum - currentPage) === 2) {
                          return <span key={pageNum} className="text-slate-600">...</span>;
                        }
                        return null;
                      })}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 rounded-lg glass border border-white/5 hover:border-brand-cyan/50 text-slate-400 hover:text-brand-cyan transition-all text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-white/5 disabled:hover:text-slate-400"
                      >
                        <FaChevronRight size={10} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
    </section>
  );
}
