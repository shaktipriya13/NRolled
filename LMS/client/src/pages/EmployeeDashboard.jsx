import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import LeaveCard from "../components/LeaveCard";
import * as api from "../services/api";
import { useAuth } from "../context/authContext";

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ leaveBalance: 0, pendingLeaves: 0, approvedLeaves: 0 });
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const statsData = await api.getUserStats();
        const leavesData = await api.getLeaves();
        setStats(statsData);
        setRecentLeaves(leavesData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5));
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
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

  return (
    <div className="min-h-screen bg-[#030712] bg-glow-mesh pb-16">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-10">
        {/* Welcome Section */}
        <div className="relative overflow-hidden bg-gradient-to-tr from-slate-900 via-indigo-950/40 to-slate-900 border border-white/10 p-8 md:p-10 rounded-3xl text-white shadow-2xl mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute inset-0 bg-gradient-to-br from-white/3 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <span className="text-[10px] font-black tracking-widest text-indigo-400 uppercase bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              Employee Portal
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-3">
              Welcome back, {user?.name}
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-2 font-medium max-w-xl">
              Track your balances, submit new requests, and receive notifications instantly.
            </p>
          </div>
          <Link
            to="/apply-leave"
            className="relative z-10 self-start md:self-center px-6 py-4 bg-gradient-to-tr from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/10 active:scale-[0.99] hover:scale-[1.01] transition-all duration-300 flex items-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
          >
            Apply for Leave
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-12 h-12 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
              <LeaveCard
                title="Leave Balance"
                value={`${stats.leaveBalance} Days`}
                color="indigo"
                icon={
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
              />
              <LeaveCard
                title="Pending Requests"
                value={stats.pendingLeaves}
                color="amber"
                icon={
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <LeaveCard
                title="Approved Leaves"
                value={stats.approvedLeaves}
                color="emerald"
                icon={
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
            </div>

            {/* Recent Leaves Section */}
            <div className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-8 shadow-xl shadow-black/10">
              <div className="absolute inset-0 bg-gradient-to-br from-white/2 to-transparent pointer-events-none"></div>
              <div className="relative z-10 flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Recent Absences</h2>
                  <p className="text-slate-400 text-xs mt-1">Absence history and status reviews.</p>
                </div>
                <Link
                  to="/my-leaves"
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 hover:border-white/10 transition-all"
                >
                  View All
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {recentLeaves.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-slate-950/20 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/5">
                    <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h4 className="text-slate-300 font-bold text-sm">No leave requests found</h4>
                  <p className="text-slate-500 text-xs mt-1">Submit your first leave request to start tracking.</p>
                </div>
              ) : (
                <div className="overflow-x-auto relative z-10">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 font-bold text-xs uppercase tracking-wider text-left">
                        <th className="pb-4 font-bold tracking-widest text-[10px]">Duration</th>
                        <th className="pb-4 font-bold tracking-widest text-[10px]">Total Days</th>
                        <th className="pb-4 font-bold tracking-widest text-[10px]">Reason</th>
                        <th className="pb-4 font-bold tracking-widest text-[10px]">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {recentLeaves.map((leave) => (
                        <tr key={leave.id} className="text-slate-300 hover:bg-white/3 transition-colors duration-200">
                          <td className="py-4.5">
                            <div className="flex flex-col">
                              <span className="font-bold text-white text-sm">{leave.fromDate}</span>
                              <span className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">to {leave.toDate}</span>
                            </div>
                          </td>
                          <td className="py-4.5 font-bold text-white">
                            {leave.days} {leave.days === 1 ? "day" : "days"}
                          </td>
                          <td className="py-4.5 text-slate-400 max-w-[200px] truncate">{leave.reason}</td>
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
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;