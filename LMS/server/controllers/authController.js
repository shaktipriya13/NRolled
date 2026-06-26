const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "mysecret", {
    expiresIn: "30d",
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Determine leave balance
    const leaveBalance = role === "admin" ? 0 : 15;

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || "employee",
      leaveBalance,
    });

    if (user) {
      res.status(201).json({
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          leaveBalance: user.leaveBalance,
        },
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          leaveBalance: user.leaveBalance,
        },
      });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile stats
// @route   GET /api/users/stats
// @access  Private
const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const Leave = require("../models/Leave");
    if (user.role === "admin") {
      const leaves = await Leave.find({});
      const pending = leaves.filter((l) => l.status === "PENDING").length;
      const approved = leaves.filter((l) => l.status === "APPROVED").length;
      const rejected = leaves.filter((l) => l.status === "REJECTED").length;
      res.json({
        totalRequests: leaves.length,
        pendingRequests: pending,
        approvedRequests: approved,
        rejectedRequests: rejected,
      });
    } else {
      const leaves = await Leave.find({ employee: user._id });
      const pending = leaves.filter((l) => l.status === "PENDING").length;
      const approved = leaves.filter((l) => l.status === "APPROVED").length;
      res.json({
        leaveBalance: user.leaveBalance,
        pendingLeaves: pending,
        approvedLeaves: approved,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserStats };
