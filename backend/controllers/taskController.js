const mongoose = require("mongoose");
const Task = require("../models/Task");

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

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleTaskComplete,
  deleteTask,
};
