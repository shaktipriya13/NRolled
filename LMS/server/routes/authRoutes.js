const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUserStats } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/stats", protect, getUserStats);

module.exports = router;
