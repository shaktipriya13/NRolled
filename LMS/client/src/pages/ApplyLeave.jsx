import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import * as api from "../services/api";

const ApplyLeave = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [stats, setStats] = useState({ leaveBalance: 0 });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const statsData = await api.getUserStats();
        setStats(statsData);
      } catch (err) {
        console.error("Failed to load leave stats:", err);
      }
    };
    fetchBalance();
  }, []);

  const calculateDays = () => {
    if (!fromDate || !toDate) return 0;
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fromDate || !toDate || !reason.trim()) {
      setError("Please fill in all the details.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedStart = new Date(fromDate);
    selectedStart.setHours(0, 0, 0, 0);

    if (selectedStart < today) {
      setError("From Date cannot be in the past.");
      return;
    }

    if (new Date(toDate) < new Date(fromDate)) {
      setError("To Date cannot be before From Date.");
      return;
    }

    const totalDays = calculateDays();
    if (totalDays > stats.leaveBalance) {
      setError(`Insufficient leave balance. You have ${stats.leaveBalance} days remaining, but requested ${totalDays} days.`);
      return;
    }

    setLoading(true);
    try {
      await api.applyLeave({
        fromDate,
        toDate,
        reason,
        days: totalDays,
      });

      setSuccess("Leave request submitted successfully!");
      setFromDate("");
      setToDate("");
      setReason("");
      
      // Update balance locally
      const updatedStats = await api.getUserStats();
      setStats(updatedStats);

      setTimeout(() => {
        navigate("/employee");
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to submit leave request.");
    } finally {
      setLoading(false);
    }
  };

  const totalDaysRequested = calculateDays();

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 pt-8">
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Apply For Leave</h1>
            <p className="text-slate-400 text-xs">Request time off and monitor status approvals.</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-semibold flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {success}
            </div>
          )}

          <div className="mb-6 bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-center justify-between">
            <span className="text-sm font-semibold text-indigo-800">Your Leave Balance</span>
            <span className="text-lg font-black text-indigo-700 bg-white px-3 py-1 rounded-xl shadow-sm">
              {stats.leaveBalance} {stats.leaveBalance === 1 ? "Day" : "Days"}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold text-xs uppercase tracking-wider mb-1.5">
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full border border-slate-200 bg-white/65 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold text-xs uppercase tracking-wider mb-1.5">
                  To Date
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full border border-slate-200 bg-white/65 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {totalDaysRequested > 0 && (
              <div className="p-3 bg-slate-100 border border-slate-200/60 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Total requested duration:</span>
                <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded-lg shadow-sm">
                  {totalDaysRequested} {totalDaysRequested === 1 ? "day" : "days"}
                </span>
              </div>
            )}

            <div>
              <label className="block text-slate-700 font-semibold text-xs uppercase tracking-wider mb-1.5">
                Reason
              </label>
              <textarea
                rows="4"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Briefly state the reason for requesting leave..."
                className="w-full border border-slate-200 bg-white/65 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 active:scale-[0.99] transition-all shadow-md shadow-indigo-200/50 flex items-center justify-center cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Submit Leave Request"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;