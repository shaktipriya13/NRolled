const mongoose = require("mongoose");

const LeaveSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    employeeName: {
      type: String,
      required: true,
    },
    fromDate: {
      type: String, // Stored as YYYY-MM-DD
      required: [true, "Please add a start date"],
    },
    toDate: {
      type: String, // Stored as YYYY-MM-DD
      required: [true, "Please add an end date"],
    },
    days: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: [true, "Please add a reason for the leave"],
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Leave", LeaveSchema);
