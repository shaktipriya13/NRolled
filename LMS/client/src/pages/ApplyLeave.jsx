import { useState } from "react";
import Navbar from "../components/Navbar";

const ApplyLeave = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");

  const calculateDays = () => {
    if (!fromDate || !toDate) return 0;

    const start = new Date(fromDate);
    const end = new Date(toDate);

    const diffTime = end - start;

    const diffDays =
      Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return diffDays > 0 ? diffDays : 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!fromDate || !toDate || !reason.trim()) {
      alert("Please fill all fields");
      return;
    }

    if (new Date(toDate) < new Date(fromDate)) {
      alert("To Date cannot be before From Date");
      return;
    }

    const leaveRequest = {
      fromDate,
      toDate,
      reason,
      days: calculateDays(),
      status: "PENDING",
    };

    console.log(leaveRequest);

    alert("Leave request submitted successfully!");

    setFromDate("");
    setToDate("");
    setReason("");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">
          Apply For Leave
        </h1>

        <p className="text-gray-600 mb-6">
          Fill in the details below to submit a leave
          request.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          {/* From Date */}
          <div className="mb-5">
            <label className="block mb-2 font-medium">
              From Date
            </label>

            <input
              type="date"
              value={fromDate}
              onChange={(e) =>
                setFromDate(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* To Date */}
          <div className="mb-5">
            <label className="block mb-2 font-medium">
              To Date
            </label>

            <input
              type="date"
              value={toDate}
              onChange={(e) =>
                setToDate(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Leave Days */}
          {fromDate && toDate && calculateDays() > 0 && (
            <div className="mb-5 bg-blue-50 border border-blue-200 p-3 rounded-lg">
              <p className="text-blue-700 font-medium">
                Total Leave Days: {calculateDays()}
              </p>
            </div>
          )}

          {/* Reason */}
          <div className="mb-6">
            <label className="block mb-2 font-medium">
              Reason
            </label>

            <textarea
              rows="4"
              value={reason}
              onChange={(e) =>
                setReason(e.target.value)
              }
              placeholder="Enter reason for leave..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
          >
            Submit Leave Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeave;