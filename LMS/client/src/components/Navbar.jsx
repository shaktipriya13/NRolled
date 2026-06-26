import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useState, useEffect, useRef } from "react";
import * as api from "../services/api";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await api.getNotifications();
        setNotifications(data);
      } catch (err) {
        console.error("Failed to load notifications:", err);
      }
    };
    fetchNotifications();

    // Poll notifications every 8 seconds for a real-time feel
    const interval = setInterval(fetchNotifications, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleNotifClick = async () => {
    setShowNotifDropdown(!showNotifDropdown);
    if (!showNotifDropdown) {
      try {
        await api.markNotificationsAsRead();
        // Reset local read state instantly for smoothness
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      } catch (err) {
        console.error("Failed to mark notifications as read:", err);
      }
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-3.5 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-8">
        <Link to={user?.role === "admin" ? "/admin" : "/employee"} className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-all">
            <span className="font-bold text-lg">L</span>
          </div>
          <h1 className="font-bold text-xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Leave<span className="text-indigo-600 font-semibold">Sync</span>
          </h1>
        </Link>

        {user && (
          <div className="hidden md:flex gap-1.5 bg-slate-100 p-1 rounded-xl">
            {user.role === "employee" ? (
              <>
                <Link
                  to="/employee"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive("/employee")
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/apply-leave"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive("/apply-leave")
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  Apply Leave
                </Link>
                <Link
                  to="/my-leaves"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive("/my-leaves")
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  My Leaves
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/admin"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive("/admin")
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  Overview
                </Link>
                <Link
                  to="/all-requests"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive("/all-requests")
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  Manage Requests
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications Icon Button */}
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={handleNotifClick}
              className="relative p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Menu */}
            {showNotifDropdown && (
              <div className="absolute right-0 mt-2.5 w-80 bg-white rounded-2xl border border-slate-200/90 shadow-xl py-2 z-50 overflow-hidden">
                <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-slate-800 text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[11px] font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-xs text-slate-400">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`px-4 py-3 border-b border-slate-50 last:border-b-0 text-xs transition-all hover:bg-slate-50 ${
                          !notif.read ? "bg-indigo-50/40 font-medium" : "text-slate-600"
                        }`}
                      >
                        <p className="leading-normal text-slate-800">{notif.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* User Info & Action Panel */}
        {user && (
          <div className="flex items-center gap-3.5 pl-3 border-l border-slate-200">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-semibold text-slate-800">{user.name}</span>
              <span className="text-[10px] font-bold tracking-wider text-indigo-500 uppercase">
                {user.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-xl border border-rose-200/80 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 font-semibold text-xs transition-all cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;