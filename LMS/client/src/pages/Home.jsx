import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#020617] bg-glow-mesh flex flex-col selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Ambient backgrounds */}
      <div className="absolute top-1/6 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-glow"></div>
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse-glow delay-3000"></div>

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 bg-slate-950/60 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex justify-between items-center shadow-lg shadow-black/20">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <span className="font-extrabold text-lg">L</span>
          </div>
          <span className="font-black text-xl bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent tracking-tight">
            Leave<span className="text-indigo-400 font-bold">Sync</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <Link
              to={user.role === "admin" ? "/admin" : "/employee"}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-500/10 active:scale-[0.98] transition-all cursor-pointer uppercase tracking-wider"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-500/10 active:scale-[0.98] transition-all cursor-pointer uppercase tracking-wider"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow relative z-10">
        <section className="relative px-6 pt-20 pb-24 md:pt-28 md:pb-32 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          {/* Hero text */}
          <div className="md:col-span-6 space-y-6 text-center md:text-left">
            <span className="inline-flex px-3.5 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest">
              Absence Management Redefined
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
              Time-off tracking,{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                automated.
              </span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-lg mx-auto md:mx-0 font-medium">
              An elegant, full-stack leave portal. Effortless applications, real-time balance calculations, and instant manager approvals in one unified space.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-4">
              {user ? (
                <Link
                  to={user.role === "admin" ? "/admin" : "/employee"}
                  className="w-full sm:w-auto px-7 py-4 bg-gradient-to-tr from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/15 active:scale-[0.99] transition-all text-center cursor-pointer"
                >
                  Enter Portal
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="w-full sm:w-auto px-7 py-4 bg-gradient-to-tr from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/15 active:scale-[0.99] transition-all text-center cursor-pointer"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    to="/login"
                    className="w-full sm:w-auto px-7 py-4 bg-slate-900/60 border border-white/10 hover:border-white/20 text-slate-300 font-bold rounded-2xl text-xs uppercase tracking-wider hover:bg-slate-900 active:scale-[0.99] transition-all text-center cursor-pointer"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Hero image decoration */}
          <div className="md:col-span-6 relative flex justify-center">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-20 blur-lg"></div>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/65 shadow-2xl p-4 max-w-md w-full animate-float">
              <img
                src="/images/e1.jpg"
                alt="LeaveSync Dashboard"
                className="w-full h-auto object-cover rounded-2xl border border-white/5 opacity-90"
              />

            </div>
          </div>
        </section>

        {/* Feature section */}
        <section className="bg-slate-950/40 border-y border-white/10 py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-extrabold tracking-tight text-white">
                Engineered for simple logistics
              </h2>
              <p className="text-slate-500 text-xs mt-2.5 font-bold uppercase tracking-wider">
                Full lifecycle leave sync without the clutter.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-7 bg-slate-900/30 rounded-3xl border border-white/5 hover:border-indigo-500/30 hover:bg-slate-900/50 transition-all duration-300">
                <div className="w-11 h-11 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mb-5">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-white mb-2.5">Apply Instantly</h3>
                <p className="text-slate-400 text-xs leading-relaxed font-medium">
                  Select dates, calculate days automatically, verify limits, and apply under 10 seconds.
                </p>
              </div>

              <div className="p-7 bg-slate-900/30 rounded-3xl border border-white/5 hover:border-indigo-500/30 hover:bg-slate-900/50 transition-all duration-300">
                <div className="w-11 h-11 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mb-5">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-white mb-2.5">Leave Balances</h3>
                <p className="text-slate-400 text-xs leading-relaxed font-medium">
                  State validations protect against overdrafts. Balances update immediately upon administrative approvals.
                </p>
              </div>

              <div className="p-7 bg-slate-900/30 rounded-3xl border border-white/5 hover:border-indigo-500/30 hover:bg-slate-900/50 transition-all duration-300">
                <div className="w-11 h-11 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mb-5">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <h3 className="font-bold text-white mb-2.5">Live Notifications</h3>
                <p className="text-slate-400 text-xs leading-relaxed font-medium">
                  Stay updated. Live notification drop-down alerts you of state changes instantly.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 py-10 px-6 border-t border-white/10 text-center text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              L
            </div>
            <span className="font-bold text-slate-300">LeaveSync © 2026</span>
          </div>
          <p className="font-medium">Designed for modern HR logistics and productive engineering teams.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
