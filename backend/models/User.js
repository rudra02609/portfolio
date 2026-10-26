const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // Google profile fields (auth is Google OAuth 2.0 only).
    googleId: { type: String, unique: true, sparse: true },
    picture: { type: String },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
