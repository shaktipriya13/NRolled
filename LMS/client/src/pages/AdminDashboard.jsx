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
    <div className="min-h-screen bg-slate-50 pb-12">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 pt-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-8 rounded-3xl text-white shadow-xl shadow-slate-200">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Admin Overview 🛠️</h1>
            <p className="text-slate-300 text-sm mt-2 font-medium">
              Monitor leave activity, approve or reject requests, and manage global settings.
            </p>
          </div>
          <Link
            to="/all-requests"
            className="self-start md:self-center px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 active:scale-[0.99] transition-all flex items-center gap-2 text-sm cursor-pointer"
          >
            Review Leave Requests
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              <LeaveCard
                title="Total Requests"
                value={stats.totalRequests}
                color="indigo"
                icon={
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                }
              />
              <LeaveCard
                title="Pending Review"
                value={stats.pendingRequests}
                color="amber"
                icon={
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <LeaveCard
                title="Approved Requests"
                value={stats.approvedRequests}
                color="emerald"
                icon={
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <LeaveCard
                title="Rejected Requests"
                value={stats.rejectedRequests}
                color="rose"
                icon={
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
            </div>

            {/* Quick Summary Panel */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Leave Distribution Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 bg-amber-50/50 border border-amber-100 rounded-2xl">
                  <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block mb-1">Needs Attention</span>
                  <span className="text-3xl font-black text-amber-900">{stats.pendingRequests}</span>
                  <p className="text-slate-500 text-xs mt-2 font-medium">Pending requests waiting for admin decision.</p>
                </div>
                <div className="p-5 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                  <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block mb-1">Approved Ratio</span>
                  <span className="text-3xl font-black text-emerald-900">
                    {stats.totalRequests > 0 ? Math.round((stats.approvedRequests / stats.totalRequests) * 100) : 0}%
                  </span>
                  <p className="text-slate-500 text-xs mt-2 font-medium">Percentage of total requests that were approved.</p>
                </div>
                <div className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                  <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider block mb-1">Total Processed</span>
                  <span className="text-3xl font-black text-indigo-900">{stats.approvedRequests + stats.rejectedRequests}</span>
                  <p className="text-slate-500 text-xs mt-2 font-medium">Decisions made on leaves so far.</p>
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