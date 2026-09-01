const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // Hashed password for email/password accounts (never plain-text).
    passwordHash: { type: String, select: false },
    // Optional Google profile fields (kept for optional OAuth, not required).
    googleId: { type: String, unique: true, sparse: true },
    picture: { type: String },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
