import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import * as api from "../services/api";

const MyLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const navigate = useNavigate();

  useEffect(() => {
    const loadLeaves = async () => {
      try {
        const data = await api.getLeaves();
        // Sort by created date descending
        setLeaves(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (err) {
        console.error("Failed to load leaves:", err);
      } finally {
        setLoading(false);
      }
    };
    loadLeaves();
  }, []);

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

  const filteredLeaves = leaves.filter((leave) => {
    if (filter === "ALL") return true;
    return leave.status === filter;
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 pt-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">My Leaves</h1>
            <p className="text-slate-400 text-xs">Track history and status of all your leave applications.</p>
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

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm">
            {filteredLeaves.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h4 className="text-slate-700 font-bold text-sm">No leaves found</h4>
                <p className="text-slate-400 text-xs mt-1">There are no leave requests matching this filter.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold text-xs uppercase tracking-wider text-left">
                      <th className="pb-3.5 font-semibold">From</th>
                      <th className="pb-3.5 font-semibold">To</th>
                      <th className="pb-3.5 font-semibold">Total Days</th>
                      <th className="pb-3.5 font-semibold">Reason</th>
                      <th className="pb-3.5 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLeaves.map((leave) => (
                      <tr key={leave.id} className="text-slate-700 hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 font-semibold text-slate-800">{leave.fromDate}</td>
                        <td className="py-4 font-semibold text-slate-800">{leave.toDate}</td>
                        <td className="py-4 font-semibold text-slate-900">
                          {leave.days} {leave.days === 1 ? "day" : "days"}
                        </td>
                        <td className="py-4 text-slate-500 max-w-xs break-words">{leave.reason}</td>
                        <td className="py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(leave.status)}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {leave.status}
                          </span>
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

export default MyLeaves;