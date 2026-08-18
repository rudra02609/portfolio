const mongoose = require("mongoose");
const Task = require("../models/Task");
const XLSX = require("xlsx");
const PDFDocument = require("pdfkit");

const VALID_PRIORITIES = ["Low", "Medium", "High"];

const normalizePriority = (priority) => {
  if (!priority) return "Medium";
  const normalized =
    priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();
  return VALID_PRIORITIES.includes(normalized) ? normalized : null;
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Get all tasks
// @route   GET /api/tasks
const getTasks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 5,
      search = "",
      completed,
      priority,
      sort = "newest",
    } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (completed !== undefined && completed !== "all") {
      filter.completed = completed === "true";
    }

    if (priority && priority !== "all") {
      const normalizedPriority = normalizePriority(priority);
      if (normalizedPriority) {
        filter.priority = normalizedPriority;
      }
    }

    let sortOption = { createdAt: -1 };
    switch (sort) {
      case "oldest":
        sortOption = { createdAt: 1 };
        break;
      case "priority":
        sortOption = { priority: -1, createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 5, 1), 100);
    const skip = (pageNum - 1) * limitNum;

    const totalTasks = await Task.countDocuments(filter);
    const totalPages = Math.max(Math.ceil(totalTasks / limitNum), 1);

    const tasks = await Task.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .select("-__v");

    res.status(200).json({
      success: true,
      message: "Tasks fetched successfully",
      tasks,
      currentPage: pageNum,
      totalPages,
      totalTasks,
      limit: limitNum,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findById(id).select("-__v");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task fetched successfully",
      task,
    });
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch task",
      error: error.message,
    });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, priority, completed = false } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    const normalizedPriority = normalizePriority(priority);
    if (priority && !normalizedPriority) {
      return res.status(400).json({
        success: false,
        message: "Priority must be Low, Medium, or High",
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : "",
      priority: normalizedPriority || "Medium",
      completed: completed === true || completed === "true",
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error("Error creating task:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create task",
      error: error.message,
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed, priority } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Task title is required",
        });
      }
      task.title = title.trim();
    }

    if (description !== undefined) {
      task.description = description.trim();
    }

    if (completed !== undefined) {
      task.completed = completed === true || completed === "true";
    }

    if (priority !== undefined) {
      const normalizedPriority = normalizePriority(priority);
      if (!normalizedPriority) {
        return res.status(400).json({
          success: false,
          message: "Priority must be Low, Medium, or High",
        });
      }
      task.priority = normalizedPriority;
    }

    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update task",
      error: error.message,
    });
  }
};

// @desc    Toggle task completion
// @route   PATCH /api/tasks/:id/complete
const toggleTaskComplete = async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (completed !== undefined) {
      task.completed = completed === true || completed === "true";
    } else {
      task.completed = !task.completed;
    }

    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      message: updatedTask.completed
        ? "Task marked as completed"
        : "Task marked as pending",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error toggling task completion:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update task status",
      error: error.message,
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      task,
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete task",
      error: error.message,
    });
  }
};

// @desc    Export tasks to Excel
// @route   GET /api/tasks/export/excel
const exportTasksToExcel = async (req, res) => {
  try {
    const { completed, priority } = req.query;

    const filter = {};

    if (completed !== undefined && completed !== "all") {
      filter.completed = completed === "true";
    }

    if (priority && priority !== "all") {
      const normalizedPriority = normalizePriority(priority);
      if (normalizedPriority) {
        filter.priority = normalizedPriority;
      }
    }

    const tasks = await Task.find(filter).select("-__v");

    // Format data for Excel
    const data = tasks.map((task) => ({
      "Task ID": task._id.toString(),
      Title: task.title,
      Description: task.description,
      Priority: task.priority,
      Status: task.completed ? "Completed" : "Pending",
      "Created At": new Date(task.createdAt).toLocaleString(),
      "Updated At": new Date(task.updatedAt).toLocaleString(),
    }));

    // Create workbook and sheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Add column widths for better formatting
    const colWidths = [25, 20, 30, 12, 12, 20, 20];
    worksheet["!cols"] = colWidths.map((width) => ({ wch: width }));

    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");

    // Generate buffer
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    // Set headers and send
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").split("T")[0];
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="tasks_export_${timestamp}.xlsx"`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    console.error("Error exporting tasks to Excel:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export tasks to Excel",
      error: error.message,
    });
  }
};

// @desc    Export tasks to PDF
// @route   GET /api/tasks/export/pdf
const exportTasksToPDF = async (req, res) => {
  try {
    const { completed, priority } = req.query;

    const filter = {};

    if (completed !== undefined && completed !== "all") {
      filter.completed = completed === "true";
    }

    if (priority && priority !== "all") {
      const normalizedPriority = normalizePriority(priority);
      if (normalizedPriority) {
        filter.priority = normalizedPriority;
      }
    }

    const tasks = await Task.find(filter).select("-__v");

    // Create PDF document
    const doc = new PDFDocument({ margin: 50 });

    // Set response headers
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").split("T")[0];
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="tasks_export_${timestamp}.pdf"`
    );
    res.setHeader("Content-Type", "application/pdf");

    // Pipe to response
    doc.pipe(res);

    // Add title
    doc.fontSize(20).font("Helvetica-Bold").text("Task Management Export", { align: "center" });

    // Add timestamp
    doc.fontSize(10).font("Helvetica").text(
      `Export Date: ${new Date().toLocaleString()}`,
      { align: "center" }
    );

    doc.moveDown();

    // Add summary
    const completedCount = tasks.filter((t) => t.completed).length;
    doc.fontSize(11).font("Helvetica-Bold").text(`Total Tasks: ${tasks.length}`);
    doc.fontSize(11).text(`Completed: ${completedCount}`);
    doc.fontSize(11).text(`Pending: ${tasks.length - completedCount}`);

    doc.moveDown();

    // Add tasks table
    if (tasks.length > 0) {
      doc.fontSize(12).font("Helvetica-Bold").text("Tasks List", { underline: true });
      doc.moveDown(0.5);

      tasks.forEach((task, index) => {
        doc.fontSize(10).font("Helvetica-Bold").text(`${index + 1}. ${task.title}`);
        doc.fontSize(9).font("Helvetica").text(`   Description: ${task.description || "N/A"}`);
        doc.fontSize(9).text(`   Priority: ${task.priority}`);
        doc.fontSize(9).text(`   Status: ${task.completed ? "✓ Completed" : "○ Pending"}`);
        doc.fontSize(8).text(`   Created: ${new Date(task.createdAt).toLocaleString()}`, {
          color: "#666666",
        });
        doc.moveDown(0.5);
      });
    } else {
      doc.fontSize(11).text("No tasks found.", { color: "#999999" });
    }

    // Finalize PDF
    doc.end();
  } catch (error) {
    console.error("Error exporting tasks to PDF:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export tasks to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleTaskComplete,
  deleteTask,
  exportTasksToExcel,
  exportTasksToPDF,
};
