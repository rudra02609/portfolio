const express = require("express");
const router = express.Router();
const { googleAuth, getCurrentUser, logout } = require("../controllers/authController");

// Authentication routes
router.post("/google", googleAuth);
router.get("/me", getCurrentUser);
router.post("/logout", logout);

module.exports = router;
