import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  FileText,
  Users,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Zap,
  Target,
  ShieldCheck,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0a0a0f]/70 border-b border-white/10">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">PlacementAI</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white transition">
              Login
            </Link>
            <Link
              to="/signup"
              className="text-sm font-medium bg-white text-gray-900 px-4 py-2 rounded-full hover:bg-gray-200 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-32 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-br from-indigo-900/40 via-violet-900/20 to-transparent rounded-full blur-3xl -z-10" />
        <div className="absolute top-40 left-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl -z-10" />
        <div className="absolute top-60 right-10 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl -z-10" />

        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6 border border-indigo-500/20"
          >
            <Zap className="w-3.5 h-3.5" />
            Built for SISTec Placement Cell
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            Placements, decoded by{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              AI insight
            </span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
            className="text-lg text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Match resumes to job descriptions in seconds. Get explainable
            scores, skill gaps, and cohort-wide insights — built for students
            and placement cells alike.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/signup"
              className="group flex items-center gap-2 bg-white text-gray-900 px-6 py-3.5 rounded-full font-medium hover:bg-gray-200 transition"
            >
              I'm a Student
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 bg-white/5 text-white border border-white/15 px-6 py-3.5 rounded-full font-medium hover:bg-white/10 transition"
            >
              Faculty Login
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto grid grid-cols-3 divide-x divide-white/10 py-10 px-6">
          {[
            { value: "30s", label: "Avg. analysis time" },
            { value: "30", label: "Resumes per batch" },
            { value: "100%", label: "Explainable scoring" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="text-center px-4"
            >
              <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto py-28 px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-indigo-400 mb-2">Why it works</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            One platform, two perspectives
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: FileText,
              title: "Instant Resume Analysis",
              desc: "Upload your resume and any JD to see your match score, skill gaps, and personalized suggestions — instantly, no waiting.",
              color: "from-indigo-500 to-blue-500",
            },
            {
              icon: Users,
              title: "Batch Insights for Faculty",
              desc: "Upload up to 30 resumes against a JD and get cohort-wide skill gaps, score distribution, and eligibility breakdowns.",
              color: "from-violet-500 to-purple-500",
            },
            {
              icon: BarChart3,
              title: "Explainable Scoring",
              desc: "No black-box scores — see exactly which skills matched, which are missing, and why a candidate passed or failed.",
              color: "from-fuchsia-500 to-pink-500",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="group p-8 rounded-2xl border border-white/10 hover:border-white/20 hover:bg-white/[0.03] transition-all bg-white/[0.02]"
            >
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5`}
              >
                <f.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white/[0.02] border-y border-white/10 py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <p className="text-sm font-medium text-indigo-400 mb-2">Simple by design</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Three steps to clarity
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              { step: "01", title: "Upload", desc: "Drop in a resume and a job description — any format, any layout." },
              { step: "02", title: "Analyze", desc: "Our engine parses, normalizes, and matches skills against requirements." },
              { step: "03", title: "Decide", desc: "Get a clear score, matched & missing skills, and next-step suggestions." },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="relative"
              >
                <span className="text-5xl font-bold text-white/10">{s.step}</span>
                <h3 className="font-semibold text-lg mt-3 mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust row */}
      <section className="max-w-5xl mx-auto py-20 px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-gray-400 text-sm"
        >
          {[
            { icon: CheckCircle2, text: "PDF & DOCX support" },
            { icon: Target, text: "Weighted, fair scoring" },
            { icon: ShieldCheck, text: "Role-based access control" },
          ].map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <t.icon className="w-4 h-4 text-indigo-400" />
              {t.text}
            </div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="relative rounded-3xl bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-white/10 px-10 py-16 text-center overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl" />

          <h2 className="text-3xl md:text-4xl font-bold mb-4 relative">
            Ready to see where you stand?
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto relative">
            Join your placement cell's AI-powered analysis platform today.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3.5 rounded-full font-medium hover:bg-gray-200 transition relative"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <span>© 2026 PlacementAI · SISTec Bhopal</span>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Built with AI, for placements</span>
          </div>
        </div>
      </footer>
    </div>
  );
}