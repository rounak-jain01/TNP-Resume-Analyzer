import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { uploadJD, uploadBatch, getBatches, getBatchResults, getBatchInsights } from "../api/faculty";
import { useEstimatedProgress } from "../hooks/useEstimatedProgress";
import {
  Sparkles, LogOut, Plus, FileText, Users, Clock, ArrowRight,
  ArrowLeft, ChevronDown, CheckCircle2, XCircle, HelpCircle,
} from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import { addResumesToBatch } from "../api/faculty";
import { Upload } from "lucide-react";

const COLORS = { strong: "#34d399", medium: "#fbbf24", weak: "#f87171" };

export default function FacultyDashboard() {
  const { user, logout } = useAuth();
  const [view, setView] = useState("home"); // home | upload-jd | upload-resumes | results

  const [batches, setBatches] = useState([]);
  const [batchesLoading, setBatchesLoading] = useState(true);

  const [jdFile, setJdFile] = useState(null);
  const [jdData, setJdData] = useState(null);
  const [jdLoading, setJdLoading] = useState(false);
  const [jdError, setJdError] = useState("");
  const jdProgress = useEstimatedProgress();

  const [resumeFiles, setResumeFiles] = useState([]);
  const [batchName, setBatchName] = useState("");
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchError, setBatchError] = useState("");
  const batchProgress = useEstimatedProgress();

  const [results, setResults] = useState(null);
  const [insights, setInsights] = useState(null);
  const [resultLoading, setResultLoading] = useState(false);

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    setBatchesLoading(true);
    try {
      const data = await getBatches();
      setBatches(data);
    } catch (err) {
      console.error(err);
    } finally {
      setBatchesLoading(false);
    }
  };

  const startNewAnalysis = () => {
    setJdFile(null);
    setJdData(null);
    setResumeFiles([]);
    setBatchName("");
    setResults(null);
    setInsights(null);
    setView("upload-jd");
  };

  const handleJdUpload = async (e) => {
    e.preventDefault();
    if (!jdFile) return setJdError("Please select a JD file.");
    setJdError("");
    setJdLoading(true);
    jdProgress.start(10);
    try {
      const data = await uploadJD(jdFile);
      setJdData(data);
      jdProgress.finish();
      setView("upload-resumes");
    } catch (err) {
      setJdError(err.response?.data?.detail || "JD upload failed.");
      jdProgress.stop();
    } finally {
      setJdLoading(false);
    }
  };

  const handleBatchUpload = async (e) => {
    e.preventDefault();
    if (resumeFiles.length === 0) return setBatchError("Please select at least 1 resume.");
    if (resumeFiles.length > 30) return setBatchError("Maximum 30 resumes allowed.");
    setBatchError("");
    setBatchLoading(true);
    batchProgress.start(resumeFiles.length * 6);
    try {
      const data = await uploadBatch(jdData.id, batchName || "Untitled Batch", resumeFiles);
      batchProgress.finish();
      await loadResults(data.id);
      await loadBatches();
      setView("results");
    } catch (err) {
      setBatchError(err.response?.data?.detail || "Batch upload failed.");
      batchProgress.stop();
    } finally {
      setBatchLoading(false);
    }
  };

  const loadResults = async (batchId) => {
    setResultLoading(true);
    try {
      const [resultsData, insightsData] = await Promise.all([
        getBatchResults(batchId),
        getBatchInsights(batchId),
      ]);
      setResults(resultsData);
      setInsights(insightsData);
    } catch (err) {
      console.error(err);
    } finally {
      setResultLoading(false);
    }
  };

  const openPastBatch = async (batchId) => {
    setView("results");
    await loadResults(batchId);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Top bar */}
      <header className="border-b border-white/10 sticky top-0 bg-[#0a0a0f]/80 backdrop-blur-md z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold tracking-tight">PlacementAI</span>
            <span className="text-gray-500 text-sm ml-2">/ Faculty</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{user?.name}</span>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {view === "home" && (
          <HomeView
            batches={batches}
            loading={batchesLoading}
            onNew={startNewAnalysis}
            onOpen={openPastBatch}
          />
        )}

        {view === "upload-jd" && (
          <UploadJDView
            jdFile={jdFile}
            setJdFile={setJdFile}
            onSubmit={handleJdUpload}
            loading={jdLoading}
            error={jdError}
            progress={jdProgress.progress}
            onBack={() => setView("home")}
          />
        )}

        {view === "upload-resumes" && (
          <UploadResumesView
            jdData={jdData}
            batchName={batchName}
            setBatchName={setBatchName}
            resumeFiles={resumeFiles}
            setResumeFiles={setResumeFiles}
            onSubmit={handleBatchUpload}
            loading={batchLoading}
            error={batchError}
            progress={batchProgress.progress}
            onBack={() => setView("upload-jd")}
          />
        )}

        {view === "results" && (
  <ResultsView
    results={results}
    insights={insights}
    loading={resultLoading}
    onBack={() => setView("home")}
    onRefresh={loadResults}
  />
)}
      </main>
    </div>
  );
}

/* ---------------- HOME VIEW ---------------- */
function HomeView({ batches, loading, onNew, onOpen }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your Batches</h1>
          <p className="text-gray-400 text-sm mt-1">Past resume analysis drives</p>
        </div>
        <button
          onClick={onNew}
          className="flex items-center gap-2 bg-white text-gray-900 px-5 py-2.5 rounded-full font-medium hover:bg-gray-200 transition"
        >
          <Plus className="w-4 h-4" /> New Analysis
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading batches...</p>
      ) : batches.length === 0 ? (
        <div className="border border-dashed border-white/15 rounded-2xl py-20 text-center">
          <FileText className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No batches yet — start your first analysis.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {batches.map((b) => (
            <button
              key={b.id}
              onClick={() => onOpen(b.id)}
              className="text-left bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-white/20 hover:bg-white/[0.05] transition"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs bg-indigo-500/10 text-indigo-300 px-2 py-1 rounded-full">
                  {b.status}
                </span>
                <Users className="w-4 h-4 text-gray-500" />
              </div>
              <h3 className="font-semibold mb-1">{b.batch_name || "Untitled Batch"}</h3>
              <p className="text-sm text-gray-500 mb-3">{b.total_resumes} resumes</p>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                {new Date(b.created_at).toLocaleDateString()}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- STEP 1: JD UPLOAD ---------------- */
function UploadJDView({ jdFile, setJdFile, onSubmit, loading, error, progress, onBack }) {
  return (
    <div className="max-w-lg mx-auto">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white mb-6 transition">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <StepIndicator step={1} />

      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 mt-6">
        <h2 className="text-xl font-bold mb-1">Upload Job Description</h2>
        <p className="text-sm text-gray-400 mb-6">We'll extract company, role, and required skills automatically.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <FileInput file={jdFile} onChange={setJdFile} label="JD File (PDF/DOCX)" />

          {error && <p className="text-sm text-red-400">{error}</p>}

          {loading ? (
            <ProgressBar progress={progress} label="Parsing job description..." />
          ) : (
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition"
            >
              Upload & Parse <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

/* ---------------- STEP 2: RESUME UPLOAD ---------------- */
function UploadResumesView({
  jdData, batchName, setBatchName, resumeFiles, setResumeFiles,
  onSubmit, loading, error, progress, onBack,
}) {
  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white mb-6 transition">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <StepIndicator step={2} />

      {/* Parsed JD preview */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mt-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-bold">{jdData.company_name || "Company"}</h2>
            <p className="text-gray-400 text-sm">{jdData.role_title}</p>
          </div>
          <span className="flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-300 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" /> Parsed
          </span>
        </div>

        <SkillGroup label="Must-Have Skills" skills={jdData.must_have_skills} color="indigo" />
        <SkillGroup label="Nice-to-Have Skills" skills={jdData.nice_to_have_skills} color="violet" />

        {jdData.eligibility_criteria?.min_cgpa && (
          <p className="text-sm text-gray-400 mt-3">
            Min CGPA: <span className="text-white">{jdData.eligibility_criteria.min_cgpa}</span>
          </p>
        )}
      </div>

      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8">
        <h2 className="text-xl font-bold mb-1">Upload Resumes</h2>
        <p className="text-sm text-gray-400 mb-6">Up to 30 resumes, PDF or DOCX.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Batch Name</label>
            <input
              type="text"
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
              placeholder="e.g. IBM Drive - AIDS Batch"
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Resumes</label>
            <input
              type="file"
              accept=".pdf,.docx"
              multiple
              onChange={(e) => setResumeFiles(Array.from(e.target.files))}
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2.5 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-indigo-500/20 file:text-indigo-300 file:text-xs"
            />
            {resumeFiles.length > 0 && (
              <p className="text-xs text-gray-500 mt-1.5">{resumeFiles.length} file(s) selected</p>
            )}
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          {loading ? (
            <ProgressBar progress={progress} label={`Analyzing ${resumeFiles.length} resume(s)...`} />
          ) : (
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition"
            >
              Upload & Analyze Batch <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

/* ---------------- STEP 3: RESULTS DASHBOARD ---------------- */
function ResultsView({ results, insights, loading, onBack, onRefresh }) {
  const [showAddResumes, setShowAddResumes] = useState(false);
  const [addFiles, setAddFiles] = useState([]);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");
  const addProgress = useEstimatedProgress();

  if (loading || !insights || !results) {
    return <p className="text-gray-500 text-sm">Loading results...</p>;
  }

  const pieData = [
    { name: "Strong Fit", value: insights.score_distribution.strong_fit, color: COLORS.strong },
    { name: "Medium Fit", value: insights.score_distribution.medium_fit, color: COLORS.medium },
    { name: "Weak Fit", value: insights.score_distribution.weak_fit, color: COLORS.weak },
  ].filter((d) => d.value > 0);

  const skillGapData = insights.skill_gap.slice(0, 8).map((s) => ({
    name: s.skill.length > 16 ? s.skill.slice(0, 16) + "…" : s.skill,
    pct: s.missing_pct,
  }));

  const handleAddResumes = async (e) => {
    e.preventDefault();
    if (addFiles.length === 0) return setAddError("Please select at least 1 resume.");
    setAddError("");
    setAddLoading(true);
    addProgress.start(addFiles.length * 6);
    try {
      await addResumesToBatch(insights.batch_id, addFiles);
      addProgress.finish();
      setShowAddResumes(false);
      setAddFiles([]);
      await onRefresh(insights.batch_id);
    } catch (err) {
      setAddError(err.response?.data?.detail || "Failed to add resumes.");
      addProgress.stop();
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" /> Back to Batches
        </button>
        <button
          onClick={() => setShowAddResumes(!showAddResumes)}
          className="flex items-center gap-2 bg-white/5 border border-white/15 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/10 transition"
        >
          <Upload className="w-4 h-4" /> Upload More Resumes
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-1">{insights.batch_name}</h1>
      <p className="text-gray-400 text-sm mb-6">Batch analysis dashboard</p>

      {/* Add resumes panel */}
      {showAddResumes && (
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8">
          <h3 className="font-semibold mb-1">Add Resumes to This Batch</h3>
          <p className="text-xs text-gray-500 mb-4">
            Currently {insights.total_resumes} resumes — max 30 per batch.
          </p>
          <form onSubmit={handleAddResumes} className="space-y-4">
            <input
              type="file"
              accept=".pdf,.docx"
              multiple
              onChange={(e) => setAddFiles(Array.from(e.target.files))}
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2.5 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-indigo-500/20 file:text-indigo-300 file:text-xs"
            />
            {addFiles.length > 0 && (
              <p className="text-xs text-gray-500">{addFiles.length} file(s) selected</p>
            )}
            {addError && <p className="text-sm text-red-400">{addError}</p>}

            {addLoading ? (
              <ProgressBar progress={addProgress.progress} label={`Analyzing ${addFiles.length} resume(s)...`} />
            ) : (
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                Add & Analyze <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Resumes" value={insights.total_resumes} />
        <StatCard label="Average Score" value={`${insights.average_score}%`} />
        <StatCard label="Eligible" value={insights.eligibility_funnel.eligible} accent="emerald" />
        <StatCard label="Ineligible" value={insights.eligibility_funnel.ineligible} accent="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Score Distribution</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#18181f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-sm">No data</p>
          )}
          <div className="flex justify-center gap-4 mt-2 text-xs">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5 text-gray-400">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                {d.name} ({d.value})
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Top Skill Gaps</h3>
          {skillGapData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={skillGapData} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: "#888", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={100} tick={{ fill: "#aaa", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#18181f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
                  formatter={(v) => [`${v}%`, "Missing"]}
                />
                <Bar dataKey="pct" fill="#f87171" radius={[0, 6, 6, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-sm">No skill gaps found — strong batch!</p>
          )}
        </div>
      </div>

      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Individual Results</h3>
        <div className="space-y-2">
          {results.results.map((r) => (
            <ResultRow key={r.resume_id} result={r} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- SHARED PIECES ---------------- */
function StepIndicator({ step }) {
  const steps = ["Upload JD", "Upload Resumes"];
  return (
    <div className="flex items-center gap-2 text-sm">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
              step === i + 1 ? "bg-indigo-500 text-white" : step > i + 1 ? "bg-emerald-500 text-white" : "bg-white/10 text-gray-500"
            }`}
          >
            {i + 1}
          </div>
          <span className={step === i + 1 ? "text-white font-medium" : "text-gray-500"}>{label}</span>
          {i < steps.length - 1 && <div className="w-8 h-px bg-white/10 mx-1" />}
        </div>
      ))}
    </div>
  );
}

function FileInput({ file, onChange, label }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
      <input
        type="file"
        accept=".pdf,.docx"
        onChange={(e) => onChange(e.target.files[0])}
        className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2.5 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-indigo-500/20 file:text-indigo-300 file:text-xs"
      />
    </div>
  );
}

function ProgressBar({ progress, label }) {
  return (
    <div>
      <div className="w-full bg-white/10 rounded-full h-1.5 mb-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-indigo-500 to-violet-500 h-1.5 rounded-full transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-center text-gray-500">{label} {progress}%</p>
    </div>
  );
}

function SkillGroup({ label, skills, color }) {
  if (!skills || skills.length === 0) return null;
  const colorMap = {
    indigo: "bg-indigo-500/10 text-indigo-300",
    violet: "bg-violet-500/10 text-violet-300",
  };
  return (
    <div className="mb-3">
      <p className="text-xs font-medium text-gray-500 mb-1.5">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {skills.map((s, i) => (
          <span key={i} className={`text-xs px-2 py-1 rounded-full ${colorMap[color]}`}>
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }) {
  const accentMap = {
    emerald: "text-emerald-400",
    red: "text-red-400",
  };
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
      <p className={`text-2xl font-bold ${accent ? accentMap[accent] : "text-white"}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  );
}

function ResultRow({ result }) {
  const [expanded, setExpanded] = useState(false);
  const statusIcon = {
    pass: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
    fail: <XCircle className="w-3.5 h-3.5 text-red-400" />,
    unknown: <HelpCircle className="w-3.5 h-3.5 text-gray-400" />,
  };
  const statusColor = {
    pass: "bg-emerald-500/10 text-emerald-300",
    fail: "bg-red-500/10 text-red-300",
    unknown: "bg-white/10 text-gray-400",
  };

  return (
    <div className="border border-white/10 rounded-xl p-4 hover:bg-white/[0.02] transition">
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex-1 pr-4 min-w-0">
          <p className="font-medium text-sm truncate">{result.candidate_name || "Unnamed Candidate"}</p>
          <p className="text-xs text-gray-500 truncate">{result.resume_summary}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${statusColor[result.eligibility_status]}`}>
            {statusIcon[result.eligibility_status]} {result.eligibility_status}
          </span>
          <span className="text-lg font-bold text-indigo-400 w-14 text-right">{result.overall_score}%</span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
          <p className="text-sm text-gray-400">{result.resume_summary}</p>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
            <div>Must-Have: <span className="text-white">{result.must_have_match_pct}%</span></div>
            <div>Nice-to-Have: <span className="text-white">{result.nice_to_have_match_pct}%</span></div>
          </div>

          <SkillGroup label="Matched Skills" skills={result.matched_skills} color="indigo" />
          <div className="mb-3">
            <p className="text-xs font-medium text-gray-500 mb-1.5">Missing Must-Have</p>
            <div className="flex flex-wrap gap-1.5">
              {result.missing_must_have_skills?.map((s, i) => (
                <span key={i} className="text-xs bg-red-500/10 text-red-300 px-2 py-1 rounded-full">{s}</span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 mb-1.5">Eligibility Details</p>
            <ul className="text-xs text-gray-500 list-disc list-inside">
              {result.eligibility_reasons?.map((reason, i) => <li key={i}>{reason}</li>)}
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 mb-1.5">Suggestions</p>
            <p className="text-sm text-gray-400">{result.suggestions}</p>
          </div>
        </div>
      )}
    </div>
  );
}