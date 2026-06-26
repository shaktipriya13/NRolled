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
      
      const updatedStats = await api.getUserStats();
      setStats(updatedStats);

      setTimeout(() => {
        navigate("/employee");
      }, 1500);
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const totalDaysRequested = calculateDays();

  return (
    <div className="min-h-screen bg-[#030712] bg-glow-mesh pb-16">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 pt-10">
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-slate-900/50 hover:bg-slate-900 border border-white/10 rounded-2xl transition-all cursor-pointer text-slate-300"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Apply For Leave</h1>
            <p className="text-slate-400 text-xs mt-1">Submit new leave requests and verify dates.</p>
          </div>
        </div>

        <div className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-8 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/3 to-transparent pointer-events-none"></div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {success}
            </div>
          )}

          <div className="mb-8 bg-indigo-500/10 border border-indigo-500/20 p-5 rounded-2xl flex items-center justify-between shadow-inner">
            <span className="text-xs font-black tracking-wider text-indigo-400 uppercase">Available Leave Balance</span>
            <span className="text-base font-black text-white bg-indigo-600 px-3.5 py-1.5 rounded-xl shadow-md shadow-indigo-500/10 border border-indigo-500/25">
              {stats.leaveBalance} {stats.leaveBalance === 1 ? "Day" : "Days"}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-bold text-[10px] uppercase tracking-wider mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full border border-white/10 bg-slate-900/40 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold text-[10px] uppercase tracking-wider mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full border border-white/10 bg-slate-900/40 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all duration-300"
                  required
                />
              </div>
            </div>

            {totalDaysRequested > 0 && (
              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Requested Duration:</span>
                <span className="font-extrabold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-xl">
                  {totalDaysRequested} {totalDaysRequested === 1 ? "day" : "days"}
                </span>
              </div>
            )}

            <div>
              <label className="block text-slate-400 font-bold text-[10px] uppercase tracking-wider mb-2">
                Reason
              </label>
              <textarea
                rows="4"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason for requesting time off..."
                className="w-full border border-white/10 bg-slate-900/40 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all duration-300"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-tr from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold py-4 rounded-2xl active:scale-[0.99] transition-all duration-300 shadow-lg shadow-indigo-500/15 flex items-center justify-center cursor-pointer text-sm"
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