import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  FileText,
  CheckCircle2,
  Loader2,
  Building2,
  BriefcaseBusiness,
  RotateCcw,
  Sparkles,
  GraduationCap,
  Code2,
  Users,
  Award,
  ShieldCheck,
  Clock3,
  X,
} from "lucide-react";

export default function UploadJDView({
  jdFile,
  setJdFile,
  jdData,
  onSubmit,
  onContinue,
  loading,
  error,
  progress,
  onBack,
}) {
  const [dragActive, setDragActive] = useState(false);

  const isParsed = Boolean(jdData);

  const handleFile = (file) => {
    if (!file) return;

    const validExtension =
      file.name.toLowerCase().endsWith(".pdf") ||
      file.name.toLowerCase().endsWith(".docx");

    if (!validExtension) {
      return;
    }

    setJdFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];

    handleFile(file);
  };

  return (
    <div className="min-h-[calc(100vh-120px)]">

      {/* =====================================================
          TOP NAVIGATION
      ===================================================== */}

      <div className="flex items-center justify-between mb-8">

        <button
          onClick={onBack}
          className="group flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition" />
          Back
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs">

          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[11px] font-semibold">
              1
            </span>

            <span className="text-white font-medium">
              Job Description
            </span>
          </div>

          <div className="w-8 h-px bg-white/10" />

          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-white/10 text-gray-500 flex items-center justify-center text-[11px] font-semibold">
              2
            </span>

            <span className="text-gray-600">
              Candidates
            </span>
          </div>

        </div>

      </div>

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div
        className={`${
          isParsed
            ? "max-w-4xl"
            : "max-w-2xl mx-auto text-center"
        } mb-7`}
      >

        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/15 text-indigo-300 text-xs font-medium mb-4 ${
            !isParsed ? "mx-auto" : ""
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          AI Placement Workspace
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          {isParsed
            ? "Review Job Description"
            : "Create Placement Drive"}
        </h1>

        <p className="text-sm text-gray-500 mt-2 max-w-2xl leading-relaxed">
          {isParsed
            ? "Review the information extracted from your job description and make corrections if required."
            : "Upload a job description and let AI automatically extract the role, skills and eligibility requirements."}
        </p>

      </div>

      {/* =====================================================
          INITIAL UPLOAD STATE
      ===================================================== */}

      {!isParsed && (
        <div className="max-w-2xl mx-auto">

          <div
            onDragEnter={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragActive(false);
            }}
            onDrop={handleDrop}
            className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
              dragActive
                ? "border-indigo-400/50 bg-indigo-500/[0.06]"
                : "border-white/10 bg-white/[0.02] hover:border-white/15"
            }`}
          >

            {/* Background Glow */}

            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/[0.05] blur-3xl rounded-full pointer-events-none" />

            <div className="relative p-5 sm:p-6">

              {/* Drop Zone */}

              <div className="border border-dashed border-white/10 rounded-xl p-8 sm:p-9 text-center">

                <div
                  className={`w-12 h-12 rounded-xl mx-auto flex items-center justify-center border ${
                    dragActive
                      ? "bg-indigo-500/15 border-indigo-500/20"
                      : "bg-white/[0.04] border-white/10"
                  }`}
                >
                  <Upload
                    className={`w-5 h-5 ${
                      dragActive
                        ? "text-indigo-300"
                        : "text-gray-400"
                    }`}
                  />
                </div>

                <h2 className="text-base font-semibold text-white mt-4">
                  Drop your job description here
                </h2>

                <p className="text-xs text-gray-600 mt-1.5">
                  PDF or DOCX
                </p>

                <label className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-white text-gray-900 text-xs font-semibold hover:bg-gray-200 cursor-pointer transition">
                  <FileText className="w-3.5 h-3.5" />
                  Browse File

                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={(e) =>
                      handleFile(
                        e.target.files?.[0]
                      )
                    }
                    className="hidden"
                  />
                </label>

              </div>

              {/* Selected File */}

              {jdFile && (
                <div className="mt-4 flex items-center justify-between gap-3 p-3 rounded-xl bg-white/[0.025] border border-white/10">

                  <div className="flex items-center gap-3 min-w-0">

                    <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-indigo-400" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium text-white truncate">
                        {jdFile.name}
                      </p>

                      <p className="text-[11px] text-gray-600 mt-0.5">
                        Ready to analyze
                      </p>
                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={() => setJdFile(null)}
                    className="p-1.5 rounded-lg text-gray-600 hover:text-white hover:bg-white/5 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>

                </div>
              )}

              {/* Error */}

              {error && (
                <div className="mt-4 p-3 rounded-xl bg-red-500/[0.06] border border-red-500/15">
                  <p className="text-xs text-red-400">
                    {error}
                  </p>
                </div>
              )}

              {/* Analyze Button */}

              <div className="mt-4">

                {loading ? (
                  <ParsingState
                    progress={progress}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={onSubmit}
                    disabled={!jdFile}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-400 disabled:bg-white/10 disabled:text-gray-600 disabled:cursor-not-allowed transition"
                  >
                    <Sparkles className="w-4 h-4" />
                    Analyze Job Description
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

              </div>

            </div>

          </div>

          {/* AI Capabilities */}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3">

            <Capability
              icon={
                <Building2 className="w-3.5 h-3.5" />
              }
              text="Company"
            />

            <Capability
              icon={
                <BriefcaseBusiness className="w-3.5 h-3.5" />
              }
              text="Role"
            />

            <Capability
              icon={
                <Code2 className="w-3.5 h-3.5" />
              }
              text="Skills"
            />

            <Capability
              icon={
                <ShieldCheck className="w-3.5 h-3.5" />
              }
              text="Eligibility"
            />

          </div>

        </div>
      )}

      {/* =====================================================
          PARSED STATE
      ===================================================== */}

      {isParsed && (
        <div className="space-y-6">

          {/* =================================================
              PARSED STATUS
          ================================================= */}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/10">

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>

              <div>
                <p className="text-sm font-medium text-white">
                  Job description analyzed
                </p>

                <p className="text-xs text-gray-600 mt-0.5">
                  AI successfully extracted the job requirements.
                </p>
              </div>

            </div>

            <label className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/[0.06] cursor-pointer transition">

              <RotateCcw className="w-3.5 h-3.5" />

              Replace JD

              <input
                type="file"
                accept=".pdf,.docx"
                onChange={(e) =>
                  handleFile(
                    e.target.files?.[0]
                  )
                }
                className="hidden"
              />

            </label>

          </div>

          {/* =================================================
              JOB DETAILS — HORIZONTAL
          ================================================= */}

          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5">

            <div className="flex items-start justify-between gap-4">

              <div>
                <p className="text-[10px] font-semibold tracking-[0.16em] text-indigo-400">
                  JOB DETAILS
                </p>

                <h2 className="text-lg font-semibold text-white mt-1">
                  Role information
                </h2>

                <p className="text-xs text-gray-600 mt-1">
                  Review and correct the information extracted from the JD.
                </p>
              </div>

              <CheckCircle2 className="w-5 h-5 text-emerald-400 hidden sm:block" />

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">

              {/* Company */}

              <EditableField
                label="Company Name"
                icon={
                  <Building2 className="w-3.5 h-3.5" />
                }
                value={
                  jdData.company_name || ""
                }
                onChange={(value) => {
                  if (
                    jdData.onCompanyChange
                  ) {
                    jdData.onCompanyChange(
                      value
                    );
                  }
                }}
                placeholder="Company name"
              />

              {/* Role */}

              <EditableField
                label="Role"
                icon={
                  <BriefcaseBusiness className="w-3.5 h-3.5" />
                }
                value={
                  jdData.role_title || ""
                }
                onChange={(value) => {
                  if (jdData.onRoleChange) {
                    jdData.onRoleChange(
                      value
                    );
                  }
                }}
                placeholder="Job role"
              />

              {/* Source File */}

              <div>

                <label className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-2">
                  <FileText className="w-3.5 h-3.5 text-gray-600" />
                  Source Document
                </label>

                <div className="h-[46px] px-3 rounded-xl bg-white/[0.025] border border-white/10 flex items-center gap-3">

                  <FileText className="w-4 h-4 text-indigo-400 flex-shrink-0" />

                  <p className="text-xs text-gray-400 truncate flex-1">
                    {jdFile?.name ||
                      "Job Description"}
                  </p>

                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />

                </div>

              </div>

            </div>

            {/* Summary */}

            {jdData.summary && (
              <div className="mt-4 pt-4 border-t border-white/5">

                <label className="text-xs font-medium text-gray-500">
                  Role Summary
                </label>

                <p className="text-sm text-gray-400 mt-2 leading-relaxed max-w-5xl">
                  {jdData.summary}
                </p>

              </div>
            )}

          </div>

          {/* =================================================
              AI INSIGHTS
          ================================================= */}

          <div>

            <div className="mb-5">

              <p className="text-[10px] font-semibold tracking-[0.16em] text-indigo-400">
                AI INSIGHTS
              </p>

              <h2 className="text-xl font-semibold text-white mt-1.5">
                Requirements & criteria
              </h2>

              <p className="text-sm text-gray-600 mt-1">
                Information automatically extracted from the job description.
              </p>

            </div>

            {/* Main Insight Row */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

              {/* Required Skills */}

              <InsightCard
                icon={
                  <Code2 className="w-4 h-4" />
                }
                title="Required Skills"
                subtitle="Must-have"
                accent="indigo"
              >
                <SkillList
                  skills={
                    jdData.must_have_skills
                  }
                  color="indigo"
                  emptyText="No required skills detected."
                />
              </InsightCard>

              {/* Preferred Skills */}

              <InsightCard
                icon={
                  <Award className="w-4 h-4" />
                }
                title="Preferred Skills"
                subtitle="Nice-to-have"
                accent="violet"
              >
                <SkillList
                  skills={
                    jdData.nice_to_have_skills
                  }
                  color="violet"
                  emptyText="No preferred skills detected."
                />
              </InsightCard>

              {/* Eligibility */}

              <InsightCard
                icon={
                  <GraduationCap className="w-4 h-4" />
                }
                title="Eligibility"
                subtitle="Candidate requirements"
                accent="emerald"
              >
                <Eligibility
                  criteria={
                    jdData.eligibility_criteria
                  }
                />
              </InsightCard>

            </div>

            {/* =================================================
                ADDITIONAL INFORMATION
            ================================================= */}

            {(jdData.soft_skills_mentioned?.length >
              0 ||
              jdData.experience_required) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

                {/* Soft Skills */}

                {jdData.soft_skills_mentioned
                  ?.length > 0 && (
                  <InsightCard
                    icon={
                      <Users className="w-4 h-4" />
                    }
                    title="Soft Skills"
                    subtitle="Behavioral expectations"
                    accent="amber"
                  >
                    <SkillList
                      skills={
                        jdData.soft_skills_mentioned
                      }
                      color="emerald"
                      emptyText="No soft skills detected."
                    />
                  </InsightCard>
                )}

                {/* Experience */}

                {jdData.experience_required && (
                  <InsightCard
                    icon={
                      <Clock3 className="w-4 h-4" />
                    }
                    title="Experience"
                    subtitle="Experience requirement"
                    accent="amber"
                  >
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {jdData.experience_required}
                    </p>
                  </InsightCard>
                )}

              </div>
            )}

          </div>

          {/* =================================================
              BOTTOM ACTIONS
          ================================================= */}

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-5 border-t border-white/10">

            <button
              onClick={onBack}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              onClick={onContinue}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-gray-900 text-sm font-semibold hover:bg-gray-200 active:scale-[0.99] transition"
            >
              Continue to Candidates
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>

        </div>
      )}

    </div>
  );
}


/* ============================================================
   PARSING STATE
============================================================ */

function ParsingState({ progress = 0 }) {
  return (
    <div className="rounded-xl bg-white/[0.025] border border-white/10 p-4">

      <div className="flex items-center gap-3">

        <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center">
          <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
        </div>

        <div className="flex-1">

          <div className="flex items-center justify-between gap-4">

            <p className="text-xs font-medium text-white">
              Understanding your JD
            </p>

            <span className="text-[11px] text-indigo-300">
              {progress}%
            </span>

          </div>

          <p className="text-[11px] text-gray-600 mt-1">
            Extracting company, role, skills and eligibility.
          </p>

        </div>

      </div>

      <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-300"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

    </div>
  );
}


/* ============================================================
   CAPABILITY
============================================================ */

function Capability({ icon, text }) {
  return (
    <div className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
      <span className="text-indigo-400">
        {icon}
      </span>

      <span className="text-[11px] text-gray-600">
        {text}
      </span>
    </div>
  );
}


/* ============================================================
   EDITABLE FIELD
============================================================ */

function EditableField({
  label,
  icon,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div>

      <label className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-2">
        <span className="text-gray-600">
          {icon}
        </span>

        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="w-full h-[46px] bg-white/[0.025] border border-white/10 rounded-xl px-4 text-sm text-white placeholder:text-gray-700 outline-none focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/10 transition"
      />

    </div>
  );
}


/* ============================================================
   INSIGHT CARD
============================================================ */

function InsightCard({
  icon,
  title,
  subtitle,
  accent = "indigo",
  children,
}) {
  const accentMap = {
    indigo:
      "bg-indigo-500/10 text-indigo-400 border-indigo-500/10",

    violet:
      "bg-violet-500/10 text-violet-400 border-violet-500/10",

    emerald:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/10",

    amber:
      "bg-amber-500/10 text-amber-400 border-amber-500/10",
  };

  return (
    <div className="group bg-white/[0.02] border border-white/10 rounded-2xl p-5 min-h-[190px] hover:bg-white/[0.035] hover:border-white/15 transition-all">

      <div className="flex items-center gap-3 mb-5">

        <div
          className={`w-9 h-9 rounded-xl border flex items-center justify-center ${accentMap[accent]}`}
        >
          {icon}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">
            {title}
          </h3>

          <p className="text-[11px] text-gray-600 mt-0.5">
            {subtitle}
          </p>
        </div>

      </div>

      {children}

    </div>
  );
}


/* ============================================================
   SKILL LIST
============================================================ */

function SkillList({
  skills,
  color = "indigo",
  emptyText,
}) {
  if (!skills || skills.length === 0) {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-600">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-700" />
        {emptyText}
      </div>
    );
  }

  const colors = {
    indigo:
      "bg-indigo-500/[0.08] border-indigo-500/15 text-indigo-300",

    violet:
      "bg-violet-500/[0.08] border-violet-500/15 text-violet-300",

    emerald:
      "bg-emerald-500/[0.08] border-emerald-500/15 text-emerald-300",
  };

  return (
    <div className="flex flex-wrap gap-2">

      {skills.map((skill, index) => (
        <span
          key={`${skill}-${index}`}
          className={`px-2.5 py-1.5 rounded-lg border text-xs ${colors[color]}`}
        >
          {skill}
        </span>
      ))}

    </div>
  );
}


/* ============================================================
   ELIGIBILITY
============================================================ */

function Eligibility({ criteria }) {
  if (!criteria) {
    return (
      <EmptyInfo text="No eligibility criteria detected." />
    );
  }

  const minCgpa =
    criteria.min_cgpa ??
    criteria.minimum_cgpa ??
    criteria.cgpa;

  const branches =
    criteria.allowed_branches ||
    criteria.branches ||
    [];

  const experience =
    criteria.experience ||
    criteria.experience_required;

  const hasAny =
    minCgpa !== undefined ||
    branches.length > 0 ||
    Boolean(experience);

  if (!hasAny) {
    return (
      <EmptyInfo text="No specific eligibility criteria detected." />
    );
  }

  return (
    <div className="space-y-3">

      {minCgpa !== undefined && (
        <InfoItem
          label="Minimum CGPA"
          value={minCgpa}
        />
      )}

      {branches.length > 0 && (
        <div className="p-3 rounded-xl bg-white/[0.025] border border-white/5">

          <p className="text-[10px] uppercase tracking-wider text-gray-600">
            Allowed Branches
          </p>

          <div className="flex flex-wrap gap-1.5 mt-2">

            {branches.map(
              (branch, index) => (
                <span
                  key={`${branch}-${index}`}
                  className="px-2 py-1 rounded-md bg-white/5 text-xs text-gray-400"
                >
                  {branch}
                </span>
              )
            )}

          </div>

        </div>
      )}

      {experience && (
        <InfoItem
          label="Experience"
          value={experience}
        />
      )}

    </div>
  );
}


/* ============================================================
   INFO ITEM
============================================================ */

function InfoItem({ label, value }) {
  return (
    <div className="p-3 rounded-xl bg-white/[0.025] border border-white/5">

      <p className="text-[10px] uppercase tracking-wider text-gray-600">
        {label}
      </p>

      <p className="text-sm text-gray-300 font-medium mt-1.5">
        {value}
      </p>

    </div>
  );
}


/* ============================================================
   EMPTY INFO
============================================================ */

function EmptyInfo({ text }) {
  return (
    <div className="flex items-center gap-2 text-xs text-gray-600">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-700" />
      {text}
    </div>
  );
}