const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Verify Google token and create/update user
// @route   POST /api/auth/google
const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Google token is required",
      });
    }

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, name, email, picture, email_verified } = payload;

    // Check if user exists
    let user = await User.findOne({
      $or: [{ googleId }, { email }],
    });

    if (user) {
      // Update existing user
      user.lastLogin = new Date();
      user.loginCount = (user.loginCount || 0) + 1;
      user.verified = email_verified;
      if (!user.googleId) {
        user.googleId = googleId;
      }
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        googleId,
        name,
        email,
        picture,
        verified: email_verified,
        lastLogin: new Date(),
        loginCount: 1,
      });
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        googleId: user.googleId,
      },
      process.env.JWT_SECRET || "your_jwt_secret_key",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Authentication successful",
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        verified: user.verified,
      },
    });
  } catch (error) {
    console.error("Google auth error:", error);

    if (error.message.includes("Invalid token")) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired Google token",
      });
    }

    res.status(500).json({
      success: false,
      message: "Authentication failed",
      error: error.message,
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
const getCurrentUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret_key"
    );

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        verified: user.verified,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
const logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    });
  }
};

module.exports = {
  googleAuth,
  getCurrentUser,
  logout,
};
