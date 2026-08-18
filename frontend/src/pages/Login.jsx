import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, ArrowRight, Mail, Lock, Eye, EyeOff,
  ShieldCheck, Zap, BarChart3, AlertCircle, Loader2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(email, password);
      if (data.role === "admin") navigate("/admin");
      else if (data.role === "faculty") navigate("/faculty");
      else navigate("/student");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex">
      {/* LEFT — Branding panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden border-r border-white/10">
        {/* Animated gradient blobs */}
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-3xl"
        />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-2 w-fit">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">PlacementAI</span>
          </Link>

          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-bold tracking-tight leading-tight mb-4"
            >
              Where resumes meet
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                real opportunity
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-gray-400 max-w-sm"
            >
              Sign in to analyze, match, and track placement readiness — for
              students and faculty alike.
            </motion.p>
          </div>

          <div className="space-y-4">
            {[
              { icon: Zap, text: "Instant AI-powered resume matching" },
              { icon: BarChart3, text: "Batch insights & skill-gap analytics" },
              { icon: ShieldCheck, text: "Secure, role-based access" },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3 text-sm text-gray-400"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-4 h-4 text-indigo-400" />
                </div>
                {f.text}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — Form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 relative">
        {/* Mobile-only glow */}
        <div className="lg:hidden absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-gradient-to-br from-indigo-900/40 via-violet-900/20 to-transparent rounded-full blur-3xl -z-10" />

        {/* Mobile logo */}
        <Link to="/" className="lg:hidden absolute top-6 left-6 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">PlacementAI</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          <h1 className="text-2xl font-bold tracking-tight mb-1">Welcome back</h1>
          <p className="text-sm text-gray-400 mb-8">Log in to continue to your dashboard</p>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="flex items-start gap-2 text-sm text-red-300 bg-red-500/10 border border-red-500/20 px-3 py-2.5 rounded-lg overflow-hidden"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@sistec.ac.in"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg pl-10 pr-3 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-medium text-gray-400">Password</label>
                <button
                  type="button"
                  onClick={() => setError("Password reset isn't available yet — contact your placement cell admin.")}
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg pl-10 pr-10 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none w-fit">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-white/5 border-white/20 accent-indigo-500"
              />
              <span className="text-xs text-gray-400">Keep me signed in</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full group flex items-center justify-center gap-2 bg-white text-gray-900 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Logging in...
                </>
              ) : (
                <>
                  Login
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-600">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <p className="text-sm text-center text-gray-400">
            New student?{" "}
            <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}