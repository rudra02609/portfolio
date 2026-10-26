const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_in_production';

function signToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}

function publicUser(user) {
  return { id: user._id, name: user.name || '', email: user.email, picture: user.picture || null };
}

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

// POST /api/auth/google — Google OAuth 2.0 sign-in.
// Verifies the Google ID token issued by the client, then finds or creates the
// user and returns a signed JWT for subsequent authenticated API requests.
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
    if (!payload || !payload.email) {
      return res.status(401).json({ message: 'Google authentication failed.' });
    }
    let user = await User.findOne({ email: payload.email.toLowerCase() });
    if (!user) {
      user = await User.create({
        googleId: payload.sub,
        name: payload.name,
        email: payload.email.toLowerCase(),
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
