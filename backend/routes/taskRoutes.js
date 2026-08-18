const express = require("express");
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleTaskComplete,
  deleteTask,
  exportTasksToExcel,
  exportTasksToPDF,
} = require("../controllers/taskController");

router.get("/", getTasks);
router.post("/", createTask);
router.patch("/:id/complete", toggleTaskComplete);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

// Export routes
router.get("/export/excel", exportTasksToExcel);
router.get("/export/pdf", exportTasksToPDF);

module.exports = router;
