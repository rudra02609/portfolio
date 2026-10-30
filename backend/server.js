require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolioDB';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Middleware
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());

// Health check (used by the frontend to detect backend availability)
app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// MongoDB connection
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {});
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    console.error('Starting server without database — task endpoints will return errors.');
  }
}

if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Startup diagnostic — never expose the API key
const apiKey = process.env.GEMINI_API_KEY || '';
console.log('[gemini] GEMINI_API_KEY configured:', !!apiKey);
console.log('[gemini] GEMINI_MODEL:', process.env.GEMINI_MODEL || 'gemini-3.8-flash');

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Another process is listening on this port.`);
    process.exit(1);
  } else {
    throw error;
  }
});