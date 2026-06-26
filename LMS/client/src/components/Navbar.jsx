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
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      } catch (err) {
        console.error("Failed to mark notifications as read:", err);
      }
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-slate-950/60 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex justify-between items-center shadow-lg shadow-black/20">
      <div className="flex items-center gap-8">
        <Link to={user?.role === "admin" ? "/admin" : "/employee"} className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-all duration-300">
            <span className="font-extrabold text-xl tracking-tight">L</span>
          </div>
          <h1 className="font-black text-2xl bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent tracking-tight">
            Leave<span className="text-indigo-400 font-bold">Sync</span>
          </h1>
        </Link>

        {user && (
          <div className="hidden md:flex gap-1 bg-white/5 p-1 rounded-2xl border border-white/5">
            {user.role === "employee" ? (
              <>
                <Link
                  to="/employee"
                  className={`px-4.5 py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-300 ${
                    isActive("/employee")
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/apply-leave"
                  className={`px-4.5 py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-300 ${
                    isActive("/apply-leave")
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  Apply Leave
                </Link>
                <Link
                  to="/my-leaves"
                  className={`px-4.5 py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-300 ${
                    isActive("/my-leaves")
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  My Leaves
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/admin"
                  className={`px-4.5 py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-300 ${
                    isActive("/admin")
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                  }`}
                >
                  Overview
                </Link>
                <Link
                  to="/all-requests"
                  className={`px-4.5 py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-300 ${
                    isActive("/all-requests")
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
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
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={handleNotifClick}
              className="relative p-2.5 rounded-2xl border border-white/10 bg-slate-900/50 hover:bg-slate-900 hover:border-white/20 transition-all duration-300 cursor-pointer"
            >
              <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5.5 h-5.5 px-1 rounded-full bg-rose-500 text-[10px] font-black text-white flex items-center justify-center shadow-lg shadow-rose-500/30 animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center">
                  <span className="font-extrabold text-white text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-black text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-xs text-slate-500">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`px-4 py-3.5 border-b border-white/5 last:border-b-0 text-xs transition-all hover:bg-white/5 ${
                          !notif.read ? "bg-indigo-500/5 font-semibold" : "text-slate-400 font-medium"
                        }`}
                      >
                        <p className="leading-relaxed text-slate-200">{notif.message}</p>
                        <span className="text-[9px] text-slate-500 mt-1 block uppercase font-bold tracking-wider">
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

        {user && (
          <div className="flex items-center gap-4 pl-4 border-l border-white/10">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-bold text-white tracking-wide">{user.name}</span>
              <span className="text-[9px] font-black tracking-widest text-indigo-400 uppercase">
                {user.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white font-bold text-xs transition-all duration-300 cursor-pointer shadow-lg shadow-rose-500/5"
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