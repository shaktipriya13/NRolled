import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import LeaveCard from "../components/LeaveCard";
import * as api from "../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const statsData = await api.getUserStats();
        setStats(statsData);
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#030712] bg-glow-mesh pb-16">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-10">
        {/* Welcome Section */}
        <div className="relative overflow-hidden bg-gradient-to-tr from-slate-900 via-indigo-950/40 to-slate-900 border border-white/10 p-8 md:p-10 rounded-3xl text-white shadow-2xl mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute inset-0 bg-gradient-to-br from-white/3 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <span className="text-[10px] font-black tracking-widest text-indigo-400 uppercase bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              Admin Portal
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-3">Admin Overview 🛠️</h1>
            <p className="text-slate-400 text-xs md:text-sm mt-2 font-medium max-w-xl">
              Monitor leave activity, approve or reject pending requests, and manage global metrics.
            </p>
          </div>
          <Link
            to="/all-requests"
            className="relative z-10 self-start md:self-center px-6 py-4 bg-gradient-to-tr from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/10 active:scale-[0.99] hover:scale-[1.01] transition-all duration-300 flex items-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
          >
            Review Leave Requests
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              <LeaveCard
                title="Total Requests"
                value={stats.totalRequests}
                color="indigo"
                icon={
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                }
              />
              <LeaveCard
                title="Pending Review"
                value={stats.pendingRequests}
                color="amber"
                icon={
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <LeaveCard
                title="Approved Leaves"
                value={stats.approvedRequests}
                color="emerald"
                icon={
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <LeaveCard
                title="Rejected Leaves"
                value={stats.rejectedRequests}
                color="rose"
                icon={
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
            </div>

            {/* Quick Summary Panel */}
            <div className="relative overflow-hidden bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-8 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/2 to-transparent pointer-events-none"></div>
              <h2 className="text-xl font-bold text-white tracking-tight mb-6 relative z-10">Leave Distribution</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                  <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase block mb-1">Needs Attention</span>
                  <span className="text-3xl font-extrabold text-white">{stats.pendingRequests}</span>
                  <p className="text-slate-400 text-xs mt-3 leading-relaxed">Pending applications currently awaiting admin resolution.</p>
                </div>
                <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                  <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase block mb-1">Approval Ratio</span>
                  <span className="text-3xl font-extrabold text-white">
                    {stats.totalRequests > 0 ? Math.round((stats.approvedRequests / stats.totalRequests) * 100) : 0}%
                  </span>
                  <p className="text-slate-400 text-xs mt-3 leading-relaxed">Percentage of total requests approved by administration.</p>
                </div>
                <div className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
                  <span className="text-[10px] font-black tracking-widest text-indigo-400 uppercase block mb-1">Total Processed</span>
                  <span className="text-3xl font-extrabold text-white">{stats.approvedRequests + stats.rejectedRequests}</span>
                  <p className="text-slate-400 text-xs mt-3 leading-relaxed">Absence decisions successfully finalized by this node.</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;