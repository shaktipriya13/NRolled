import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import * as api from "../services/api";

const MyLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    const loadLeaves = async () => {
      try {
        const data = await api.getLeaves();
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
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/25";
      case "REJECTED":
        return "bg-rose-500/10 text-rose-400 border-rose-500/25";
      default:
        return "bg-amber-500/10 text-amber-400 border-amber-500/25";
    }
  };

  const filteredLeaves = leaves.filter((leave) => {
    if (filter === "ALL") return true;
    return leave.status === filter;
  });

  return (
    <div className="min-h-screen bg-[#030712] bg-glow-mesh pb-16">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-10">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">My Leaves</h1>
            <p className="text-slate-400 text-xs mt-1">Track history of your leave applications.</p>
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

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-12 h-12 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-8 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-white/2 to-transparent pointer-events-none"></div>

            {filteredLeaves.length === 0 ? (
              <div className="text-center py-16 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/5">
                  <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h4 className="text-slate-300 font-bold text-sm">No leaves found</h4>
                <p className="text-slate-500 text-xs mt-1">There are no leave applications matching this filter.</p>
              </div>
            ) : (
              <div className="overflow-x-auto relative z-10">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 font-bold text-xs uppercase tracking-wider text-left">
                      <th className="pb-4 font-bold tracking-widest text-[10px]">From</th>
                      <th className="pb-4 font-bold tracking-widest text-[10px]">To</th>
                      <th className="pb-4 font-bold tracking-widest text-[10px]">Total Days</th>
                      <th className="pb-4 font-bold tracking-widest text-[10px]">Reason</th>
                      <th className="pb-4 font-bold tracking-widest text-[10px]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredLeaves.map((leave) => (
                      <tr key={leave.id} className="text-slate-300 hover:bg-white/3 transition-colors duration-200">
                        <td className="py-4.5 font-bold text-white">{leave.fromDate}</td>
                        <td className="py-4.5 font-bold text-white">{leave.toDate}</td>
                        <td className="py-4.5 font-bold text-white">
                          {leave.days} {leave.days === 1 ? "day" : "days"}
                        </td>
                        <td className="py-4.5 text-slate-400 max-w-xs break-words">{leave.reason}</td>
                        <td className="py-4.5">
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