const Leave = require("../models/Leave");
const User = require("../models/User");

// @desc    Apply for leave
// @route   POST /api/leaves
// @access  Private (Employee only)
const applyLeave = async (req, res) => {
  const { fromDate, toDate, reason, days } = req.body;

  try {
    if (!fromDate || !toDate || !reason || !days) {
      return res.status(400).json({ message: "Please fill all details" });
    }

    const employee = await User.findById(req.user.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (employee.leaveBalance < days) {
      return res.status(400).json({ message: "Insufficient leave balance" });
    }

    const leave = await Leave.create({
      employee: req.user.id,
      employeeName: employee.name,
      fromDate,
      toDate,
      days,
      reason,
      status: "PENDING",
    });

    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get leave requests
// @route   GET /api/leaves
// @access  Private
const getLeaves = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const leaves = await Leave.find({}).sort({ createdAt: -1 });
      res.json(leaves);
    } else {
      const leaves = await Leave.find({ employee: req.user.id }).sort({ createdAt: -1 });
      res.json(leaves);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update leave request status
// @route   PUT /api/leaves/:id
// @access  Private (Admin only)
const updateLeaveStatus = async (req, res) => {
  const { status } = req.body;

  try {
    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    if (leave.status !== "PENDING") {
      return res.status(400).json({ message: "This request has already been processed" });
    }

    // Core logic: If approved, deduct leave balance
    if (status === "APPROVED") {
      const employee = await User.findById(leave.employee);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      if (employee.leaveBalance < leave.days) {
        return res.status(400).json({ message: "Employee has insufficient leave balance" });
      }

      employee.leaveBalance -= leave.days;
      await employee.save();
    }

    leave.status = status;
    const updatedLeave = await leave.save();

    res.json(updatedLeave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { applyLeave, getLeaves, updateLeaveStatus };
