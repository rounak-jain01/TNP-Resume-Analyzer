// frontend/src/pages/Signup.jsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  BookOpen,
  ShieldCheck,
  Zap,
  BarChart3,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    branch: "",
    cgpa: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup(form);
      navigate("/student");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex">

      {/* =========================================================
          LEFT — BRANDING PANEL
      ========================================================= */}

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden border-r border-white/10">

        {/* Animated background glow */}

        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl"
        />

        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-3xl"
        />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">

          {/* Logo */}

          <Link
            to="/"
            className="flex items-center gap-2 w-fit"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>

            <span className="text-lg font-bold tracking-tight">
              PlacementAI
            </span>
          </Link>


          {/* Main content */}

          <div>

            <motion.h1
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
              }}
              className="text-4xl font-bold tracking-tight leading-tight mb-4"
            >
              Start your placement
              <br />

              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                journey with AI
              </span>
            </motion.h1>


            <motion.p
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                delay: 0.1,
              }}
              className="text-gray-400 max-w-sm"
            >
              Create your student profile and use AI-powered
              resume analysis to understand your strengths,
              skill gaps, and placement readiness.
            </motion.p>

          </div>


          {/* Features */}

          <div className="space-y-4">

            {[
              {
                icon: Zap,
                text: "AI-powered resume analysis",
              },
              {
                icon: BarChart3,
                text: "Track your placement readiness",
              },
              {
                icon: ShieldCheck,
                text: "Secure student profile",
              },
            ].map((feature, index) => {

              const Icon = feature.icon;

              return (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    x: -10,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 0.2 + index * 0.1,
                  }}
                  className="flex items-center gap-3 text-sm text-gray-400"
                >

                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-indigo-400" />
                  </div>

                  {feature.text}

                </motion.div>
              );
            })}

          </div>

        </div>
      </div>


      {/* =========================================================
          RIGHT — SIGNUP FORM
      ========================================================= */}

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10 relative">

        {/* Mobile glow */}

        <div className="lg:hidden absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-gradient-to-br from-indigo-900/40 via-violet-900/20 to-transparent rounded-full blur-3xl -z-10" />


        {/* Mobile logo */}

        <Link
          to="/"
          className="lg:hidden absolute top-6 left-6 flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>

          <span className="text-lg font-bold tracking-tight">
            PlacementAI
          </span>
        </Link>


        {/* Form container */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
          className="w-full max-w-sm"
        >

          {/* Heading */}

          <div className="mb-7">

            <h1 className="text-2xl font-bold tracking-tight mb-1">
              Create your account
            </h1>

            <p className="text-sm text-gray-400">
              Set up your student profile to get started
            </p>

          </div>


          {/* Error */}

          <AnimatePresence>

            {error && (
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                  marginBottom: 0,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                  marginBottom: 16,
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                  marginBottom: 0,
                }}
                className="flex items-start gap-2 text-sm text-red-300 bg-red-500/10 border border-red-500/20 px-3 py-2.5 rounded-lg overflow-hidden"
              >

                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />

                <span>{error}</span>

              </motion.div>
            )}

          </AnimatePresence>


          {/* =====================================================
              FORM
          ===================================================== */}

          <form
            onSubmit={handleSubmit}
            className="space-y-3.5"
          >

            {/* NAME */}

            <div>

              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Full Name
              </label>

              <div className="relative group">

                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  placeholder="Your full name"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg pl-10 pr-3 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition"
                />

              </div>

            </div>


            {/* EMAIL */}

            <div>

              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Email
              </label>

              <div className="relative group">

                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  placeholder="you@sistec.ac.in"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg pl-10 pr-3 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition"
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div>

              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Password
              </label>

              <div className="relative group">

                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg pl-10 pr-10 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>

              </div>

            </div>


            {/* TWO COLUMN — BRANCH + CGPA */}

            <div className="grid grid-cols-2 gap-3">

              {/* BRANCH */}

              <div>

                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Branch
                </label>

                <div className="relative group">

                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />

                  <input
                    type="text"
                    name="branch"
                    value={form.branch}
                    onChange={handleChange}
                    placeholder="AI & DS"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-lg pl-10 pr-3 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition"
                  />

                </div>

              </div>


              {/* CGPA */}

              <div>

                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  CGPA
                </label>

                <div className="relative group">

                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />

                  <input
                    type="number"
                    name="cgpa"
                    value={form.cgpa}
                    onChange={handleChange}
                    min="0"
                    max="10"
                    step="0.01"
                    placeholder="8.50"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-lg pl-10 pr-3 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition"
                  />

                </div>

              </div>

            </div>


            {/* PROFILE NOTE */}

            <div className="flex items-start gap-2 pt-1">

              <CheckCircle2 className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />

              <p className="text-[11px] leading-relaxed text-gray-500">
                Your academic details help us provide more
                relevant placement insights and eligibility
                analysis.
              </p>

            </div>


            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="w-full group flex items-center justify-center gap-2 bg-white text-gray-900 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >

              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account

                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}

            </button>

          </form>


          {/* Divider */}

          <div className="flex items-center gap-3 my-6">

            <div className="flex-1 h-px bg-white/10" />

            <span className="text-xs text-gray-600">
              or
            </span>

            <div className="flex-1 h-px bg-white/10" />

          </div>


          {/* Login */}

          <p className="text-sm text-center text-gray-400">

            Already have an account?{" "}

            <Link
              to="/login"
              className="text-indigo-400 hover:text-indigo-300 font-medium transition"
            >
              Login
            </Link>

          </p>

        </motion.div>

      </div>

    </div>
  );
}