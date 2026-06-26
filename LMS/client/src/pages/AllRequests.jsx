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
      // Sort by date descending
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
      // Reload to get updated balance state and list
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
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "REJECTED":
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-amber-50 text-amber-700 border-amber-100";
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (filter === "ALL") return true;
    return req.status === filter;
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Leave Applications</h1>
            <p className="text-slate-400 text-xs">Approve or reject leave requests submitted by employees.</p>
          </div>

          <div className="flex gap-1.5 bg-slate-200/60 p-1 rounded-xl self-start">
            {["ALL", "PENDING", "APPROVED", "REJECTED"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filter === status
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {message.text && (
          <div
            className={`mb-5 p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
              message.type === "success"
                ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                : "bg-rose-50 border-rose-100 text-rose-600"
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
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h4 className="text-slate-700 font-bold text-sm">No requests found</h4>
                <p className="text-slate-400 text-xs mt-1">There are no leave applications matching this filter.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold text-xs uppercase tracking-wider text-left">
                      <th className="pb-3.5 font-semibold">Employee</th>
                      <th className="pb-3.5 font-semibold">Duration</th>
                      <th className="pb-3.5 font-semibold">Days</th>
                      <th className="pb-3.5 font-semibold">Reason</th>
                      <th className="pb-3.5 font-semibold">Status</th>
                      <th className="pb-3.5 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRequests.map((req) => (
                      <tr key={req.id} className="text-slate-700 hover:bg-slate-50/50 transition-colors">
                        <td className="py-4">
                          <span className="font-semibold text-slate-800">{req.employeeName}</span>
                        </td>
                        <td className="py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-800">{req.fromDate}</span>
                            <span className="text-[10px] text-slate-400 font-medium">to {req.toDate}</span>
                          </div>
                        </td>
                        <td className="py-4 font-semibold text-slate-900">
                          {req.days} {req.days === 1 ? "day" : "days"}
                        </td>
                        <td className="py-4 text-slate-500 max-w-[240px] truncate" title={req.reason}>
                          {req.reason}
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(req.status)}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {req.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          {req.status === "PENDING" ? (
                            <div className="inline-flex gap-2">
                              <button
                                onClick={() => handleAction(req.id, "APPROVED")}
                                disabled={actionLoading[req.id]}
                                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold rounded-xl text-xs shadow-sm hover:shadow active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center min-w-[70px]"
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
                                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white font-bold rounded-xl text-xs shadow-sm hover:shadow active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center min-w-[65px]"
                              >
                                {actionLoading[req.id] ? (
                                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  "Reject"
                                )}
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">No actions pending</span>
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