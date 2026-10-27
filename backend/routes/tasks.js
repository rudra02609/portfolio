const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const cache = require('../utils/cache');
const geminiService = require('../services/geminiService');

const router = express.Router();
router.use(auth);

// Scoped query for the authenticated user (or guest id)
function scopeFor(req) {
  if (req.user && req.user.id) return { user: req.user.id };
  return { guestId: req.body.guestId || req.query.guestId || 'default' };
}

// Validate that an id is a real MongoDB ObjectId before it reaches a query,
// so malformed values like "undefined" never hit Task.findOne etc.
function validId(req, res) {
  if (!req.params.id || !mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json({ message: 'Invalid task id.' });
    return false;
  }
  return true;
}

// GET /api/tasks — list with search, filters, pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const search = (req.query.search || '').trim();
    const { completed, priority } = req.query;

    // Cache key must include every query dimension, otherwise a cached
    // unfiltered page is returned for filtered/searched/paginated requests.
    const cacheKey = `tasks_${req.user.id}_${page}_${limit}_${search}_${completed || 'all'}_${priority || 'all'}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log('[CACHE HIT]', cacheKey);
      return res.json(cached);
    }

    console.log('[CACHE MISS]', cacheKey);

    const query = scopeFor(req);
    if (completed !== undefined && completed !== 'all') query.completed = completed === 'true';
    if (priority && priority !== 'all') query.priority = priority;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Task.countDocuments(query);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const response = { tasks, total, page, totalPages };

    // Store in cache (only the essential data, not pagination metadata from DB)
    const cacheData = { tasks, total, page, totalPages };
    cache.set(cacheKey, cacheData);

    res.json(response);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/tasks/:id
router.get('/:id', async (req, res) => {
  try {
    if (!validId(req, res)) return;
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
    // Invalidate every cached list variant for this user after creation
    cache.delPrefix(`tasks_${req.user.id}`);

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

    if (!validId(req, res)) return;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, ...scopeFor(req) },
      update,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found.' });

    // Invalidate every cached list variant for this user after update
    cache.delPrefix(`tasks_${req.user.id}`);

    res.json({ task });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH /api/tasks/:id/complete
router.patch('/:id/complete', async (req, res) => {
  try {
    if (!validId(req, res)) return;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, ...scopeFor(req) },
      { completed: req.body.completed },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found.' });

    // Completion changes must invalidate cached lists too, otherwise the
    // stale response is served and the toggle appears to have no effect.
    cache.delPrefix(`tasks_${req.user.id}`);

    res.json({ task });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
  try {
    if (!validId(req, res)) return;
    const task = await Task.findOneAndDelete({ _id: req.params.id, ...scopeFor(req) });
    if (!task) return res.status(404).json({ message: 'Task not found.' });

    // Invalidate every cached list variant for this user after deletion
    cache.delPrefix(`tasks_${req.user.id}`);

    res.json({ message: 'Task deleted.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/tasks/:id/ai-insight
router.post('/:id/ai-insight', async (req, res) => {
  try {
    // Authentication is already enforced by router.use(auth)

    // Validate task ID
    if (!validId(req, res)) return;

    // Find task belonging to the authenticated user
    const task = await Task.findOne({
      _id: req.params.id,
      ...scopeFor(req),
    });

    if (!task) {
      // Task not found or doesn't belong to this user
      return res.status(404).json({ message: 'Task not found.' });
    }

    // Get AI insight
    const insight = await geminiService.getAIInsight({
      title: task.title,
      description: task.description,
      completed: task.completed,
      priority: task.priority,
    });

    res.json({
      success: true,
      insight,
    });
  } catch (err) {
    console.error('[ai-insight] Error:', err.message);
    const status = err.status || 500;
    res.status(status).json({
      success: false,
      message: err.message || 'AI insight is temporarily unavailable. Please try again.',
    });
  }
});

// POST /api/tasks/generate-description
router.post('/generate-description', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Task title is required.' });
    }

    if (title.trim().length > 100) {
      return res.status(400).json({ success: false, message: 'Task title is too long.' });
    }

    // Generate description using Gemini AI
    const description = await geminiService.generateDescription(title.trim());

    res.json({
      success: true,
      description,
    });
  } catch (err) {
    console.error('[generate-description] Error:', err.message);
    const status = err.status || 500;
    res.status(status).json({
      success: false,
      message: err.message || 'Failed to generate description. Please try again.',
    });
  }
});

module.exports = router;