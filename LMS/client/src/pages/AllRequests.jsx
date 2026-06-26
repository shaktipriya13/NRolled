import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import * as api from "../services/api";

const AllRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING");
  const [actionLoading, setActionLoading] = useState({});
  const [message, setMessage] = useState({ text: "", type: "" });

  const loadRequests = async () => {
    try {
      const data = await api.getLeaves();
      setRequests(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error("Failed to load requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAction = async (requestId, status) => {
    setActionLoading((prev) => ({ ...prev, [requestId]: true }));
    setMessage({ text: "", type: "" });
    try {
      await api.updateLeaveStatus(requestId, status);
      setMessage({
        text: `Leave request has been successfully ${status.toLowerCase()}!`,
        type: "success",
      });
      await loadRequests();
    } catch (err) {
      setMessage({
        text: err.message || `Failed to ${status.toLowerCase()} request.`,
        type: "error",
      });
    } finally {
      setActionLoading((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/25";
      case "REJECTED":
        return "bg-rose-500/10 text-rose-400 border-rose-500/25";
      default:
        return "bg-amber-500/10 text-amber-400 border-amber-500/25";
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (filter === "ALL") return true;
    return req.status === filter;
  });

  return (
    <div className="min-h-screen bg-[#030712] bg-glow-mesh pb-16">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-10">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Leave Applications</h1>
            <p className="text-slate-400 text-xs mt-1">Review and manage absence requests from employees.</p>
          </div>

          <div className="flex gap-1.5 bg-slate-900/60 p-1.5 rounded-2xl border border-white/5 self-start">
            {["ALL", "PENDING", "APPROVED", "REJECTED"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer duration-300 ${
                  filter === status
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2 ${
              message.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-rose-500/10 border-rose-500/20 text-rose-400"
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {message.type === "success" ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              )}
            </svg>
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-12 h-12 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-8 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/2 to-transparent pointer-events-none"></div>

            {filteredRequests.length === 0 ? (
              <div className="text-center py-16 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/5">
                  <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h4 className="text-slate-300 font-bold text-sm">No applications found</h4>
                <p className="text-slate-500 text-xs mt-1">There are no leave requests matching this filter.</p>
              </div>
            ) : (
              <div className="overflow-x-auto relative z-10">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 font-bold text-xs uppercase tracking-wider text-left">
                      <th className="pb-4 font-bold tracking-widest text-[10px]">Employee</th>
                      <th className="pb-4 font-bold tracking-widest text-[10px]">Duration</th>
                      <th className="pb-4 font-bold tracking-widest text-[10px]">Days</th>
                      <th className="pb-4 font-bold tracking-widest text-[10px]">Reason</th>
                      <th className="pb-4 font-bold tracking-widest text-[10px]">Status</th>
                      <th className="pb-4 font-bold tracking-widest text-[10px] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredRequests.map((req) => (
                      <tr key={req.id} className="text-slate-300 hover:bg-white/3 transition-colors duration-200">
                        <td className="py-4.5">
                          <span className="font-bold text-white text-sm">{req.employeeName}</span>
                        </td>
                        <td className="py-4.5">
                          <div className="flex flex-col">
                            <span className="font-bold text-white text-sm">{req.fromDate}</span>
                            <span className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">to {req.toDate}</span>
                          </div>
                        </td>
                        <td className="py-4.5 font-bold text-white">
                          {req.days} {req.days === 1 ? "day" : "days"}
                        </td>
                        <td className="py-4.5 text-slate-400 max-w-[240px] truncate" title={req.reason}>
                          {req.reason}
                        </td>
                        <td className="py-4.5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(req.status)}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {req.status}
                          </span>
                        </td>
                        <td className="py-4.5 text-right">
                          {req.status === "PENDING" ? (
                            <div className="inline-flex gap-2">
                              <button
                                onClick={() => handleAction(req.id, "APPROVED")}
                                disabled={actionLoading[req.id]}
                                className="px-4 py-2 bg-gradient-to-tr from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-500/10 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center min-w-[80px]"
                              >
                                {actionLoading[req.id] ? (
                                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  "Approve"
                                )}
                              </button>
                              <button
                                onClick={() => handleAction(req.id, "REJECTED")}
                                disabled={actionLoading[req.id]}
                                className="px-4 py-2 bg-gradient-to-tr from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold rounded-xl text-xs shadow-md shadow-rose-500/10 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center min-w-[75px]"
                              >
                                {actionLoading[req.id] ? (
                                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  "Reject"
                                )}
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Processed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllRequests;