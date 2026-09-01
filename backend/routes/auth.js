const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { hashPassword, verifyPassword } = require('../utils/password');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_in_production';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function signToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}

function publicUser(user) {
  return { id: user._id, name: user.name || '', email: user.email, picture: user.picture || null };
}

// POST /api/auth/register — create an email + password account
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body || {};

  if (!email || !EMAIL_RE.test(String(email).trim())) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }
  if (!password || String(password).length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }

  try {
    const existing = await User.findOne({ email: String(email).trim().toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const passwordHash = await hashPassword(String(password));
    const user = await User.create({
      name: (name || '').trim(),
      email: String(email).trim().toLowerCase(),
      passwordHash,
      verified: false,
    });

    res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: 'Unable to create account.' });
  }
});

// POST /api/auth/login — sign in with email + password
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email: String(email).trim().toLowerCase() }).select(
      '+passwordHash'
    );
    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const ok = await verifyPassword(String(password), user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Avoid sending the hash back to the client.
    user.passwordHash = undefined;
    res.json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Unable to sign in.' });
  }
});

// GET /api/auth/me — fetch the current user from a valid token
router.get('/me', async (req, res) => {
  const token = (req.headers.authorization || '').split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authenticated.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ user: publicUser(user) });
  } catch {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
});

// Optional legacy Google sign-in (kept for compatibility, not required for normal login).
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
  const { token } = req.body || {};
  if (!token) return res.status(400).json({ message: 'Missing credential token.' });
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(500).json({ message: 'Google OAuth is not configured on the server.' });
  }
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = await User.create({
        googleId: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        verified: payload.email_verified,
      });
    }
    res.json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    console.error('Google auth error:', err.message);
    res.status(401).json({ message: 'Google authentication failed.' });
  }
});

module.exports = router;
