const Leave = require("../models/Leave");
const User = require("../models/User");
const Notification = require("../models/Notification");

// Helper to format Date ranges (e.g. "2026-07-10" to "10 Jul")
const formatDateRange = (fromStr, toStr) => {
  try {
    const options = { day: 'numeric', month: 'short' };
    
    // Replace hyphens with slashes or append timezone offset to prevent off-by-one day issues in local timezone conversion
    const fromDateObj = new Date(fromStr + "T00:00:00");
    const toDateObj = new Date(toStr + "T00:00:00");
    
    const fromFormatted = fromDateObj.toLocaleDateString('en-US', options);
    const toFormatted = toDateObj.toLocaleDateString('en-US', options);
    
    if (fromStr === toStr) {
      return fromFormatted;
    }
    return `${fromFormatted} - ${toFormatted}`;
  } catch (err) {
    return `${fromStr} - ${toStr}`;
  }
};

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

    // Notify all admins about the new leave request
    try {
      const admins = await User.find({ role: "admin" });
      const notifications = admins.map((admin) => ({
        userId: admin._id,
        message: `New leave request submitted by ${employee.name}.`,
        read: false,
      }));
      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    } catch (err) {
      console.error("Failed to create admin notification:", err);
    }

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

    // Notify the employee about their status update
    try {
      const dateText = formatDateRange(leave.fromDate, leave.toDate);
      const message = `Your leave request for ${dateText} has been ${status.toLowerCase()}.`;
      await Notification.create({
        userId: leave.employee,
        message,
        read: false,
      });
    } catch (err) {
      console.error("Failed to create employee status notification:", err);
    }

    res.json(updatedLeave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { applyLeave, getLeaves, updateLeaveStatus };
