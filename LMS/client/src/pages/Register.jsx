import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill out all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await register(name, email, password, role);
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/employee");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#020617] bg-glow-mesh p-4 relative overflow-hidden">
      {/* Home Button Link */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-10 flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900/60 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all duration-300 shadow-lg"
        title="Go to Home"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      </Link>

      {/* Ambient backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-glow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse-glow delay-3000"></div>

      <div className="relative w-full max-w-md">
        <div className="absolute -inset-0.5 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl opacity-20 blur-sm"></div>
        <div className="relative bg-slate-950/70 backdrop-blur-2xl p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl">
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 items-center justify-center text-white font-black text-2xl mb-4 shadow-lg shadow-indigo-500/20">
              L
            </Link>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              Get started
            </h2>
            <p className="text-slate-400 text-xs mt-2 font-medium">
              Create your account to manage leaves Sync.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-400 font-bold text-[10px] uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rahul Sharma"
                className="w-full border border-white/10 bg-slate-900/40 rounded-2xl px-4.5 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold text-[10px] uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@company.com"
                className="w-full border border-white/10 bg-slate-900/40 rounded-2xl px-4.5 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold text-[10px] uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full border border-white/10 bg-slate-900/40 rounded-2xl px-4.5 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold text-[10px] uppercase tracking-wider mb-2.5">
                Register As
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-900/60 p-1 rounded-2xl border border-white/5">
                <button
                  type="button"
                  onClick={() => setRole("employee")}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                    role === "employee"
                      ? "bg-indigo-600 text-white shadow"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Employee
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                    role === "admin"
                      ? "bg-indigo-600 text-white shadow"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-gradient-to-tr from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold py-4 rounded-2xl active:scale-[0.99] transition-all duration-300 shadow-lg shadow-indigo-500/10 flex items-center justify-center cursor-pointer text-sm"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-white/5 pt-4">
            <p className="text-slate-400 text-xs">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-400 font-bold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;