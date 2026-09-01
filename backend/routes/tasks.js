const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);

// Build a scoped query for the authenticated user (or guest id)
function scopeFor(req) {
  if (req.user && req.user.id) return { user: req.user.id };
  return { guestId: req.body.guestId || req.query.guestId || 'default' };
}

// GET /api/tasks — list with search, filters, pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const search = (req.query.search || '').trim();
    const { completed, priority } = req.query;

    const query = scopeFor(req);
    if (completed !== undefined && completed !== 'all') query.completed = completed === 'true';
    if (priority && priority !== 'all') query.priority = priority;
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const total = await Task.countDocuments(query);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ tasks, total, page, totalPages });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/tasks/:id
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, ...scopeFor(req) });
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json({ task });
  } catch {
    res.status(400).json({ message: 'Invalid task id.' });
  }
});

// POST /api/tasks
router.post('/', async (req, res) => {
  try {
    const { title, description, priority, guestId } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Task title is required.' });
    }
    const task = await Task.create({
      user: req.user && req.user.id ? req.user.id : undefined,
      guestId: req.user && req.user.id ? undefined : guestId || 'default',
      title: title.trim(),
      description,
      priority,
    });
    res.status(201).json({ task });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/tasks/:id
router.put('/:id', async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    if (title !== undefined && !title.trim()) {
      return res.status(400).json({ message: 'Task title cannot be empty.' });
    }
    const update = { ...(title !== undefined ? { title: title.trim() } : {}) };
    if (description !== undefined) update.description = description;
    if (priority !== undefined) update.priority = priority;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, ...scopeFor(req) },
      update,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json({ task });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH /api/tasks/:id/complete
router.patch('/:id/complete', async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, ...scopeFor(req) },
      { completed: req.body.completed },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json({ task });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, ...scopeFor(req) });
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json({ message: 'Task deleted.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
