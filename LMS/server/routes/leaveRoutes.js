const express = require("express");
const router = express.Router();
const { applyLeave, getLeaves, updateLeaveStatus } = require("../controllers/leaveController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.route("/")
  .post(protect, applyLeave)
  .get(protect, getLeaves);

router.route("/:id")
  .put(protect, adminOnly, updateLeaveStatus);

module.exports = router;
