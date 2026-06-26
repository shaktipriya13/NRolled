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
        // Sort leaves by date descending and take top 5
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
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "REJECTED":
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-amber-50 text-amber-700 border-amber-100";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 pt-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-8 rounded-3xl text-white shadow-xl shadow-slate-200">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-slate-300 text-sm mt-2 font-medium">
              You are running in standalone mode. All stats and requests are persisted locally.
            </p>
          </div>
          <Link
            to="/apply-leave"
            className="self-start md:self-center px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 active:scale-[0.99] transition-all flex items-center gap-2 text-sm cursor-pointer"
          >
            Apply for Leave
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
              <LeaveCard
                title="Leave Balance Available"
                value={`${stats.leaveBalance} Days`}
                color="indigo"
                icon={
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
              />
              <LeaveCard
                title="Pending Requests"
                value={stats.pendingLeaves}
                color="amber"
                icon={
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <LeaveCard
                title="Approved Leaves"
                value={stats.approvedLeaves}
                color="emerald"
                icon={
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
            </div>

            {/* Recent Leaves Section */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Recent Applications</h2>
                  <p className="text-slate-400 text-xs mt-1">Status updates are shown in real-time.</p>
                </div>
                <Link
                  to="/my-leaves"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1"
                >
                  View All
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {recentLeaves.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h4 className="text-slate-700 font-bold text-sm">No leave requests found</h4>
                  <p className="text-slate-400 text-xs mt-1">Get started by applying for your first leave request.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold text-xs uppercase tracking-wider text-left">
                        <th className="pb-3.5 font-semibold">Duration</th>
                        <th className="pb-3.5 font-semibold">Total Days</th>
                        <th className="pb-3.5 font-semibold">Reason</th>
                        <th className="pb-3.5 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentLeaves.map((leave) => (
                        <tr key={leave.id} className="text-slate-700 hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 font-semibold">
                            <div className="flex flex-col">
                              <span>{leave.fromDate}</span>
                              <span className="text-[10px] text-slate-400 font-medium">to {leave.toDate}</span>
                            </div>
                          </td>
                          <td className="py-4 font-semibold text-slate-900">
                            {leave.days} {leave.days === 1 ? "day" : "days"}
                          </td>
                          <td className="py-4 text-slate-500 max-w-[200px] truncate">{leave.reason}</td>
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
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;