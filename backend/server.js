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

// Root route
app.get('/', (req, res) =>
  res.status(200).json({
    status: 'ok',
    message: 'Portfolio Backend API is running',
    health: '/api/health',
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// MongoDB connection — cached so serverless invocations reuse one connection.
// A failed connection is non-fatal: the function still boots and task endpoints
// return errors until the database is reachable. No local MongoDB is required.
let dbConnectionPromise = null;

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  if (!dbConnectionPromise) {
    dbConnectionPromise = mongoose
      .connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
      .then(() => {
        console.log('MongoDB connected');
        return mongoose.connection;
      })
      .catch((err) => {
        console.error('MongoDB connection failed:', err.message);
        console.error('Continuing without database — task endpoints will return errors until it is reachable.');
        dbConnectionPromise = null;
        throw err;
      });
  }
  return dbConnectionPromise;
}

if (process.env.NODE_ENV !== 'test') {
  connectDB().catch(() => {});
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

// Export the Express app for Vercel (api/index.js re-exports it).
// The port listener only runs during local/direct execution, never when
// the module is imported by the serverless runtime.
module.exports = app;

if (require.main === module) {
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
}