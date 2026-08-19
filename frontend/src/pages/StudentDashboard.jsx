import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { analyzeResume } from "../api/student";
import { useEstimatedProgress } from "../hooks/useEstimatedProgress";

import { motion, AnimatePresence } from "framer-motion";

import {
  Sparkles,
  LogOut,
  Upload,
  FileText,
  BriefcaseBusiness,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Target,
  Zap,
  Brain,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Lightbulb,
  CircleCheck,
  CircleX,
} from "lucide-react";

export default function StudentDashboard() {
  const { user, logout } = useAuth();

  const [resumeFile, setResumeFile] = useState(null);
  const [jdFile, setJdFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const {
    progress,
    start,
    finish,
    stop,
  } = useEstimatedProgress();

  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (!resumeFile || !jdFile) {
      setError(
        "Please upload both your resume and job description."
      );
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    start(12);

    try {
      const data = await analyzeResume(
        resumeFile,
        jdFile
      );

      setResult(data);
      finish();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Analysis failed. Please try again."
      );

      stop();
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setResumeFile(null);
    setJdFile(null);
    setResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">

      {/* =====================================================
          TOP NAVIGATION
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0f]/80 backdrop-blur-xl">

        <div className="max-w-7xl mx-auto px-5 sm:px-8">

          <div className="h-16 flex items-center justify-between">

            {/* Logo */}

            <div className="flex items-center gap-2.5">

              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/10">

                <Sparkles className="w-4 h-4" />

              </div>

              <div>

                <p className="font-bold tracking-tight leading-none">
                  PlacementAI
                </p>

                <p className="text-[10px] text-gray-600 mt-1">
                  Student Portal
                </p>

              </div>

            </div>


            {/* Right */}

            <div className="flex items-center gap-4">

              <div className="hidden sm:block text-right">

                <p className="text-sm font-medium text-gray-200">
                  {user?.name || "Student"}
                </p>

                <p className="text-[11px] text-gray-600">
                  Student
                </p>

              </div>

              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500/30 to-violet-500/30 border border-white/10 flex items-center justify-center">

                <span className="text-sm font-semibold text-indigo-300">
                  {user?.name?.charAt(0)?.toUpperCase() ||
                    "S"}
                </span>

              </div>

              <button
                onClick={logout}
                className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>

            </div>

          </div>

        </div>

      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-8 sm:py-10">

        <AnimatePresence mode="wait">

          {!result ? (

            <motion.div
              key="upload"
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -15,
              }}
              transition={{
                duration: 0.35,
              }}
            >

              {/* =================================================
                  HERO
              ================================================= */}

              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/[0.09] via-white/[0.025] to-violet-500/[0.06] p-7 sm:p-10 mb-7">

                <div className="absolute -top-32 -right-32 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />

                <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />

                <div className="relative">

                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-medium mb-5">

                    <Sparkles className="w-3.5 h-3.5" />

                    AI Resume Intelligence

                  </div>


                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">

                    Build a stronger
                    <br />

                    <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                      placement profile.
                    </span>

                  </h1>


                  <p className="text-gray-400 max-w-xl mt-4 text-sm sm:text-base leading-relaxed">

                    Upload your resume and a job description.
                    PlacementAI will analyze your profile,
                    identify skill matches, and show exactly
                    where you stand for the role.

                  </p>


                  {/* Quick stats */}

                  <div className="flex flex-wrap gap-6 mt-7">

                    <HeroFeature
                      icon={<Zap />}
                      text="AI-powered matching"
                    />

                    <HeroFeature
                      icon={<Target />}
                      text="Skill gap analysis"
                    />

                    <HeroFeature
                      icon={<ShieldCheck />}
                      text="Eligibility check"
                    />

                  </div>

                </div>

              </div>


              {/* =================================================
                  ERROR
              ================================================= */}

              <AnimatePresence>

                {error && (

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -8,
                    }}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/[0.06] border border-red-500/15 mb-6"
                  >

                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />

                    <div>

                      <p className="text-sm font-medium text-red-300">
                        Analysis couldn't start
                      </p>

                      <p className="text-xs text-red-400/70 mt-1">
                        {error}
                      </p>

                    </div>

                  </motion.div>

                )}

              </AnimatePresence>


              {/* =================================================
                  UPLOAD SECTION
              ================================================= */}

              <form
                onSubmit={handleAnalyze}
                className="grid lg:grid-cols-[1fr_1fr_280px] gap-5"
              >

                {/* Resume */}

                <FileUploadCard
                  type="Resume"
                  icon={<FileText />}
                  file={resumeFile}
                  setFile={setResumeFile}
                  description="Your latest resume"
                  accent="indigo"
                />


                {/* JD */}

                <FileUploadCard
                  type="Job Description"
                  icon={<BriefcaseBusiness />}
                  file={jdFile}
                  setFile={setJdFile}
                  description="Target role description"
                  accent="violet"
                />


                {/* Analyze card */}

                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 flex flex-col justify-between">

                  <div>

                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4">

                      <Brain className="w-5 h-5" />

                    </div>

                    <h3 className="font-semibold text-white">
                      Ready to analyze?
                    </h3>

                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                      We'll compare your resume against
                      the requirements in the job description.
                    </p>

                  </div>


                  {loading ? (

                    <div className="mt-6">

                      <div className="flex items-center justify-between mb-2">

                        <span className="text-xs text-gray-500">
                          Analyzing profile...
                        </span>

                        <span className="text-xs text-indigo-300">
                          {progress}%
                        </span>

                      </div>

                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">

                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                          initial={{
                            width: 0,
                          }}
                          animate={{
                            width: `${progress}%`,
                          }}
                          transition={{
                            duration: 0.2,
                          }}
                        />

                      </div>

                      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">

                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />

                        Processing your documents

                      </div>

                    </div>

                  ) : (

                    <button
                      type="submit"
                      disabled={
                        !resumeFile ||
                        !jdFile
                      }
                      className="w-full mt-6 flex items-center justify-center gap-2 bg-white text-gray-900 py-3 rounded-xl text-sm font-semibold hover:bg-gray-200 transition disabled:opacity-30 disabled:cursor-not-allowed group"
                    >

                      Analyze my profile

                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />

                    </button>

                  )}

                </div>

              </form>


              {/* =================================================
                  HOW IT WORKS
              ================================================= */}

              <div className="mt-8">

                <p className="text-[10px] uppercase tracking-[0.18em] text-gray-600 font-semibold mb-4">
                  How it works
                </p>

                <div className="grid sm:grid-cols-3 gap-3">

                  <StepCard
                    number="01"
                    title="Upload"
                    text="Add your resume and target job description."
                  />

                  <StepCard
                    number="02"
                    title="Analyze"
                    text="AI compares your experience with role requirements."
                  />

                  <StepCard
                    number="03"
                    title="Improve"
                    text="See your score, skill gaps and recommendations."
                  />

                </div>

              </div>

            </motion.div>

          ) : (

            <ResultDashboard
              result={result}
              onReset={resetAnalysis}
            />

          )}

        </AnimatePresence>

      </main>

    </div>
  );
}


/* ================================================================
   RESULT DASHBOARD
================================================================ */

function ResultDashboard({
  result,
  onReset,
}) {
  const score = Number(
    result?.overall_score || 0
  );

  const eligibility =
    String(
      result?.eligibility_status || "unknown"
    ).toLowerCase();

  const scoreLabel =
    score >= 80
      ? "Excellent Match"
      : score >= 60
      ? "Good Match"
      : score >= 40
      ? "Moderate Match"
      : "Needs Improvement";

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="space-y-6"
    >

      {/* Header */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>

          <button
            onClick={onReset}
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-white transition mb-4"
          >
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            Analyze another role
          </button>

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center">

              <Sparkles className="w-5 h-5 text-indigo-400" />

            </div>

            <div>

              <p className="text-[10px] uppercase tracking-[0.18em] text-indigo-400 font-semibold">
                Analysis complete
              </p>

              <h1 className="text-2xl font-bold mt-1">
                {result?.jd_company || "Job Match"}
              </h1>

            </div>

          </div>

        </div>


        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] text-sm text-gray-300 hover:bg-white/[0.07] transition"
        >

          <RefreshCw className="w-4 h-4" />

          New Analysis

        </button>

      </div>


      {/* =====================================================
          SCORE HERO
      ===================================================== */}

      <div className="grid lg:grid-cols-[280px_1fr] gap-5">

        {/* Score */}

        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/[0.08] to-violet-500/[0.04] p-7 flex flex-col items-center justify-center">

          <ScoreRing score={score} />

          <p className="text-lg font-semibold mt-5">
            {scoreLabel}
          </p>

          <p className="text-xs text-gray-600 mt-1">
            Overall resume match
          </p>

        </div>


        {/* Role info */}

        <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">

          <div className="flex items-start justify-between gap-5">

            <div>

              <p className="text-[10px] uppercase tracking-[0.18em] text-gray-600 font-semibold">
                Target Role
              </p>

              <h2 className="text-2xl font-bold mt-2">
                {result?.jd_role || "Job Description"}
              </h2>

              {result?.jd_company && (
                <p className="text-sm text-gray-500 mt-1">
                  {result.jd_company}
                </p>
              )}

            </div>


            <EligibilityBadge
              status={eligibility}
            />

          </div>


          {result?.resume_summary && (

            <div className="mt-7 pt-5 border-t border-white/10">

              <p className="text-[10px] uppercase tracking-[0.18em] text-gray-600 font-semibold mb-2">
                Resume Summary
              </p>

              <p className="text-sm text-gray-400 leading-relaxed">
                {result.resume_summary}
              </p>

            </div>

          )}

        </div>

      </div>


      {/* =====================================================
          MATCH METRICS
      ===================================================== */}

      <div className="grid sm:grid-cols-3 gap-4">

        <MatchCard
          title="Overall Match"
          value={score}
          icon={<Target />}
          description="Combined role compatibility"
        />

        <MatchCard
          title="Must-Have"
          value={
            result?.must_have_match_pct || 0
          }
          icon={<ShieldCheck />}
          description="Critical requirements matched"
        />

        <MatchCard
          title="Nice-to-Have"
          value={
            result?.nice_to_have_match_pct || 0
          }
          icon={<TrendingUp />}
          description="Additional skills matched"
        />

      </div>


      {/* =====================================================
          SKILLS
      ===================================================== */}

      <div className="grid lg:grid-cols-2 gap-5">

        {/* Matched */}

        <SkillPanel
          title="Skills you match"
          subtitle="Strengths detected in your resume"
          icon={<CheckCircle2 />}
          skills={result?.matched_skills}
          variant="success"
        />


        {/* Missing */}

        <SkillPanel
          title="Skills to improve"
          subtitle="Important skills missing from your resume"
          icon={<CircleX />}
          skills={
            result?.missing_must_have_skills
          }
          variant="danger"
        />

      </div>


      {/* =====================================================
          ELIGIBILITY + AI SUGGESTIONS
      ===================================================== */}

      <div className="grid lg:grid-cols-2 gap-5">

        {/* Eligibility */}

        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">

          <SectionHeading
            icon={<ShieldCheck />}
            title="Eligibility Check"
            subtitle="Academic and role eligibility"
          />

          <div className="mt-5">

            <EligibilityLarge
              status={eligibility}
            />

          </div>


          {result?.eligibility_reasons?.length > 0 && (

            <div className="mt-5 space-y-2">

              {result.eligibility_reasons.map(
                (reason, index) => (

                  <div
                    key={index}
                    className="flex items-start gap-2.5 text-xs text-gray-500"
                  >

                    {eligibility === "pass" ? (
                      <CircleCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <CircleX className="w-4 h-4 text-red-400 flex-shrink-0" />
                    )}

                    <span>
                      {reason}
                    </span>

                  </div>

                )
              )}

            </div>

          )}

        </div>


        {/* AI recommendation */}

        <div className="rounded-2xl border border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.07] to-violet-500/[0.03] p-6">

          <SectionHeading
            icon={<Lightbulb />}
            title="Placement Recommendation"
            subtitle="What you should focus on next"
          />

          <div className="mt-5">

            <div className="rounded-xl bg-black/10 border border-white/5 p-4">

              <div className="flex items-start gap-3">

                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">

                  <Sparkles className="w-4 h-4 text-indigo-400" />

                </div>

                <p className="text-sm text-gray-400 leading-relaxed">
                  {result?.suggestions ||
                    "Your profile has been analyzed. Focus on strengthening the skills required by this role."}
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

        <div>

          <p className="font-semibold">
            Want to check another opportunity?
          </p>

          <p className="text-xs text-gray-600 mt-1">
            Upload another resume and job description to
            compare your fit.
          </p>

        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-2 bg-white text-gray-900 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition"
        >

          Start New Analysis

          <ArrowRight className="w-4 h-4" />

        </button>

      </div>

    </motion.div>
  );
}


/* ================================================================
   FILE UPLOAD CARD
================================================================ */

function FileUploadCard({
  type,
  icon,
  file,
  setFile,
  description,
  accent,
}) {
  const inputId =
    type === "Resume"
      ? "student-resume-upload"
      : "student-jd-upload";

  const isIndigo = accent === "indigo";

  return (
    <div
      className={`relative rounded-2xl border transition-all duration-200 ${
        file
          ? isIndigo
            ? "border-indigo-500/30 bg-indigo-500/[0.05]"
            : "border-violet-500/30 bg-violet-500/[0.05]"
          : "border-white/10 bg-white/[0.025] hover:border-white/20"
      } p-5`}
    >

      <input
        id={inputId}
        type="file"
        accept=".pdf,.docx"
        className="hidden"
        onChange={(e) =>
          setFile(
            e.target.files?.[0] || null
          )
        }
      />

      <label
        htmlFor={inputId}
        className="cursor-pointer block"
      >

        <div className="flex items-start justify-between">

          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isIndigo
                ? "bg-indigo-500/10 text-indigo-400"
                : "bg-violet-500/10 text-violet-400"
            }`}
          >
            {icon}
          </div>


          {file && (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          )}

        </div>


        <p className="font-semibold text-white mt-5">
          {type}
        </p>

        <p className="text-xs text-gray-600 mt-1">
          {description}
        </p>


        <div
          className={`mt-5 rounded-xl border border-dashed ${
            file
              ? "border-white/10"
              : "border-white/10"
          } bg-black/10 p-4`}
        >

          {file ? (

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">

                <FileText className="w-4 h-4 text-gray-400" />

              </div>

              <div className="min-w-0">

                <p className="text-xs font-medium text-gray-300 truncate">
                  {file.name}
                </p>

                <p className="text-[10px] text-gray-600 mt-0.5">
                  {formatFileSize(file.size)}
                </p>

              </div>

            </div>

          ) : (

            <div className="text-center py-2">

              <Upload className="w-5 h-5 text-gray-600 mx-auto mb-2" />

              <p className="text-xs text-gray-500">
                Click to upload
              </p>

              <p className="text-[10px] text-gray-700 mt-1">
                PDF or DOCX
              </p>

            </div>

          )}

        </div>

      </label>

    </div>
  );
}


/* ================================================================
   SCORE RING
================================================================ */

function ScoreRing({
  score,
}) {
  const radius = 74;
  const circumference =
    2 * Math.PI * radius;

  const offset =
    circumference -
    (score / 100) *
      circumference;

  const scoreColor =
    score >= 80
      ? "#34d399"
      : score >= 60
      ? "#818cf8"
      : score >= 40
      ? "#fbbf24"
      : "#f87171";

  return (
    <div className="relative w-44 h-44">

      <svg
        className="w-full h-full -rotate-90"
        viewBox="0 0 180 180"
      >

        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="10"
        />

        <motion.circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke={scoreColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{
            strokeDashoffset: circumference,
          }}
          animate={{
            strokeDashoffset: offset,
          }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
        />

      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">

        <span
          className="text-4xl font-bold"
          style={{
            color: scoreColor,
          }}
        >
          {score}
        </span>

        <span className="text-[10px] text-gray-600 uppercase tracking-widest mt-1">
          Match
        </span>

      </div>

    </div>
  );
}


/* ================================================================
   MATCH CARD
================================================================ */

function MatchCard({
  title,
  value,
  icon,
  description,
}) {
  const numericValue = Number(value || 0);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">

      <div className="flex items-center justify-between">

        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
          {icon}
        </div>

        <span className="text-2xl font-bold text-white">
          {numericValue}%
        </span>

      </div>

      <p className="font-medium text-sm mt-4">
        {title}
      </p>

      <p className="text-[11px] text-gray-600 mt-1">
        {description}
      </p>

      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mt-4">

        <motion.div
          initial={{
            width: 0,
          }}
          animate={{
            width: `${Math.min(
              100,
              Math.max(
                0,
                numericValue
              )
            )}%`,
          }}
          transition={{
            duration: 0.8,
          }}
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
        />

      </div>

    </div>
  );
}


/* ================================================================
   SKILL PANEL
================================================================ */

function SkillPanel({
  title,
  subtitle,
  icon,
  skills,
  variant,
}) {
  const isSuccess =
    variant === "success";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">

      <div className="flex items-center gap-3">

        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            isSuccess
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {icon}
        </div>

        <div>

          <h3 className="font-semibold text-sm">
            {title}
          </h3>

          <p className="text-[11px] text-gray-600 mt-0.5">
            {subtitle}
          </p>

        </div>

      </div>


      <div className="mt-5">

        {skills?.length > 0 ? (

          <div className="flex flex-wrap gap-2">

            {skills.map(
              (skill, index) => (

                <span
                  key={`${skill}-${index}`}
                  className={`text-xs px-3 py-1.5 rounded-lg border ${
                    isSuccess
                      ? "bg-emerald-500/[0.07] border-emerald-500/10 text-emerald-300"
                      : "bg-red-500/[0.07] border-red-500/10 text-red-300"
                  }`}
                >
                  {skill}
                </span>

              )
            )}

          </div>

        ) : (

          <div className="flex items-center gap-2 text-xs text-gray-600 py-3">

            <CheckCircle2 className="w-4 h-4 text-emerald-400" />

            No significant gaps detected.

          </div>

        )}

      </div>

    </div>
  );
}


/* ================================================================
   ELIGIBILITY
================================================================ */

function EligibilityBadge({
  status,
}) {
  const pass = status === "pass";
  const fail = status === "fail";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium ${
        pass
          ? "bg-emerald-500/10 border-emerald-500/15 text-emerald-300"
          : fail
          ? "bg-red-500/10 border-red-500/15 text-red-300"
          : "bg-white/5 border-white/10 text-gray-400"
      }`}
    >

      {pass ? (
        <CheckCircle2 className="w-3.5 h-3.5" />
      ) : fail ? (
        <XCircle className="w-3.5 h-3.5" />
      ) : (
        <AlertCircle className="w-3.5 h-3.5" />
      )}

      {pass
        ? "Eligible"
        : fail
        ? "Not Eligible"
        : "Unknown"}

    </span>
  );
}


function EligibilityLarge({
  status,
}) {
  const pass = status === "pass";
  const fail = status === "fail";

  return (
    <div
      className={`rounded-xl border p-4 ${
        pass
          ? "bg-emerald-500/[0.05] border-emerald-500/10"
          : fail
          ? "bg-red-500/[0.05] border-red-500/10"
          : "bg-white/[0.03] border-white/10"
      }`}
    >

      <div className="flex items-center gap-3">

        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            pass
              ? "bg-emerald-500/10 text-emerald-400"
              : fail
              ? "bg-red-500/10 text-red-400"
              : "bg-white/5 text-gray-400"
          }`}
        >

          {pass ? (
            <CheckCircle2 />
          ) : fail ? (
            <XCircle />
          ) : (
            <AlertCircle />
          )}

        </div>

        <div>

          <p className="text-sm font-semibold">
            {pass
              ? "You meet the eligibility criteria"
              : fail
              ? "Some eligibility criteria are not met"
              : "Eligibility could not be determined"}
          </p>

          <p className="text-xs text-gray-600 mt-1">
            Based on the available academic and role requirements.
          </p>

        </div>

      </div>

    </div>
  );
}


/* ================================================================
   SECTION HEADING
================================================================ */

function SectionHeading({
  icon,
  title,
  subtitle,
}) {
  return (
    <div className="flex items-center gap-3">

      <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
        {icon}
      </div>

      <div>

        <h3 className="font-semibold text-sm">
          {title}
        </h3>

        <p className="text-[11px] text-gray-600 mt-0.5">
          {subtitle}
        </p>

      </div>

    </div>
  );
}


/* ================================================================
   HERO FEATURE
================================================================ */

function HeroFeature({
  icon,
  text,
}) {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-500">

      <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400">

        {icon}

      </div>

      {text}

    </div>
  );
}


/* ================================================================
   STEP CARD
================================================================ */

function StepCard({
  number,
  title,
  text,
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">

      <span className="text-[10px] font-bold text-indigo-400 tracking-widest">
        {number}
      </span>

      <p className="text-sm font-semibold mt-2">
        {title}
      </p>

      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
        {text}
      </p>

    </div>
  );
}


/* ================================================================
   FILE SIZE
================================================================ */

function formatFileSize(bytes) {
  if (!bytes) return "0 KB";

  const units = [
    "B",
    "KB",
    "MB",
    "GB",
  ];

  const index = Math.floor(
    Math.log(bytes) /
      Math.log(1024)
  );

  return `${(
    bytes /
    Math.pow(1024, index)
  ).toFixed(index === 0 ? 0 : 1)} ${
    units[index]
  }`;
}