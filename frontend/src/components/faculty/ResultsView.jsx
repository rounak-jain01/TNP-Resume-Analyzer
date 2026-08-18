// frontend/src/components/faculty/ResultsView.jsx

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Upload,
  RefreshCw,
  Users,
  Target,
  TrendingUp,
  AlertTriangle,
  Award,
  Brain,
  Sparkles,
  Search,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
  Legend,
} from "recharts";

import { addResumesToBatch } from "../../api/faculty";
import { useEstimatedProgress } from "../../hooks/useEstimatedProgress";

const COLORS = {
  strong: "#34d399",
  medium: "#fbbf24",
  weak: "#f87171",
  primary: "#818cf8",
  secondary: "#a78bfa",
  cyan: "#22d3ee",
};

const tooltipStyle = {
  background: "#18181f",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  fontSize: 12,
  color: "#fff",
};

export default function ResultsView({
  results,
  insights,
  loading,
  onBack,
  onRefresh,
}) {
  const [showAddResumes, setShowAddResumes] = useState(false);
  const [addFiles, setAddFiles] = useState([]);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const addProgress = useEstimatedProgress();

  /*
   * ============================================================
   * SAFE DATA NORMALIZATION
   * ============================================================
   *
   * Backend may return:
   *
   * 1. [ ... ]
   *
   * OR
   *
   * 2. { results: [ ... ] }
   *
   * Never allow the UI to crash because of response shape.
   */

  const resultRows = useMemo(() => {
    if (Array.isArray(results)) {
      return results;
    }

    if (Array.isArray(results?.results)) {
      return results.results;
    }

    if (Array.isArray(results?.data)) {
      return results.data;
    }

    return [];
  }, [results]);

  /*
   * ============================================================
   * NORMALIZED INSIGHTS
   * ============================================================
   */

  const safeInsights = insights || {};

  const scoreDistribution = safeInsights.score_distribution || {};

  const eligibilityFunnel =
    safeInsights.eligibility_funnel || {};

  const skillGap = Array.isArray(safeInsights.skill_gap)
    ? safeInsights.skill_gap
    : [];

  /*
   * ============================================================
   * FILTERED RESULTS
   * ============================================================
   */

  const filteredResults = useMemo(() => {
    let data = resultRows;

    if (filter !== "all") {
      data = data.filter(
        (item) =>
          String(item?.eligibility_status || "").toLowerCase() ===
          filter
      );
    }

    if (search.trim()) {
      const query = search.toLowerCase();

      data = data.filter((item) => {
        const name = String(
          item?.candidate_name || ""
        ).toLowerCase();

        const summary = String(
          item?.resume_summary || ""
        ).toLowerCase();

        return (
          name.includes(query) ||
          summary.includes(query)
        );
      });
    }

    return data;
  }, [resultRows, filter, search]);

  /*
   * ============================================================
   * SCORE DISTRIBUTION
   * ============================================================
   */

  const pieData = useMemo(() => {
    return [
      {
        name: "Strong Fit",
        value: Number(scoreDistribution.strong_fit || 0),
        color: COLORS.strong,
      },
      {
        name: "Medium Fit",
        value: Number(scoreDistribution.medium_fit || 0),
        color: COLORS.medium,
      },
      {
        name: "Weak Fit",
        value: Number(scoreDistribution.weak_fit || 0),
        color: COLORS.weak,
      },
    ].filter((item) => item.value > 0);
  }, [scoreDistribution]);

  /*
   * ============================================================
   * SKILL GAP CHART
   * ============================================================
   */

  const skillGapData = useMemo(() => {
    return skillGap.slice(0, 10).map((skill) => ({
      name:
        String(skill?.skill || "Unknown").length > 18
          ? String(skill.skill).slice(0, 18) + "…"
          : String(skill?.skill || "Unknown"),
      missing: Number(skill?.missing_pct || 0),
      matched: Math.max(
        0,
        100 - Number(skill?.missing_pct || 0)
      ),
    }));
  }, [skillGap]);

  /*
   * ============================================================
   * SCORE TREND
   * ============================================================
   *
   * Derived from current candidate results.
   * Whenever results change, this chart changes automatically.
   */

  const scoreTrendData = useMemo(() => {
    return resultRows
      .map((item, index) => ({
        candidate: index + 1,
        score: Number(item?.overall_score || 0),
      }))
      .sort((a, b) => a.candidate - b.candidate);
  }, [resultRows]);

  /*
   * ============================================================
   * LIVE SUMMARY
   * ============================================================
   */

  const calculatedStats = useMemo(() => {
    const total = resultRows.length;

    const scores = resultRows
      .map((item) => Number(item?.overall_score))
      .filter((score) => !Number.isNaN(score));

    const average =
      scores.length > 0
        ? Math.round(
            scores.reduce((sum, score) => sum + score, 0) /
              scores.length
          )
        : Number(
            safeInsights.average_score || 0
          );

    const eligible = resultRows.filter(
      (item) =>
        String(
          item?.eligibility_status || ""
        ).toLowerCase() === "pass"
    ).length;

    const ineligible = resultRows.filter(
      (item) =>
        String(
          item?.eligibility_status || ""
        ).toLowerCase() === "fail"
    ).length;

    return {
      total:
        total ||
        Number(safeInsights.total_resumes || 0),

      average,

      eligible:
        eligible ||
        Number(eligibilityFunnel.eligible || 0),

      ineligible:
        ineligible ||
        Number(eligibilityFunnel.ineligible || 0),
    };
  }, [
    resultRows,
    safeInsights.average_score,
    safeInsights.total_resumes,
    eligibilityFunnel,
  ]);

  /*
   * ============================================================
   * ADD RESUMES
   * ============================================================
   */

  const handleAddResumes = async (e) => {
    e.preventDefault();

    if (addFiles.length === 0) {
      setAddError("Please select at least 1 resume.");
      return;
    }

    if (
      calculatedStats.total + addFiles.length >
      30
    ) {
      setAddError(
        `You can add only ${
          30 - calculatedStats.total
        } more resume(s).`
      );
      return;
    }

    setAddError("");
    setAddLoading(true);

    addProgress.start(addFiles.length * 6);

    try {
      await addResumesToBatch(
        safeInsights.batch_id,
        addFiles
      );

      addProgress.finish();

      setShowAddResumes(false);
      setAddFiles([]);

      if (onRefresh) {
        await onRefresh(safeInsights.batch_id);
      }
    } catch (err) {
      console.error(err);

      setAddError(
        err?.response?.data?.detail ||
          "Failed to add resumes."
      );

      addProgress.stop();
    } finally {
      setAddLoading(false);
    }
  };

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (loading) {
    return <ResultsLoading />;
  }

  /*
   * ============================================================
   * EMPTY STATE
   * ============================================================
   */

  if (!insights && !results) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
          </div>

          <h2 className="text-lg font-semibold text-white">
            No results available
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Upload resumes to generate analysis.
          </p>

          <button
            onClick={onBack}
            className="mt-5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 transition"
          >
            Back to Batches
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Batches
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-white">
                {safeInsights.batch_name ||
                  "Batch Analysis"}
              </h1>

              <p className="text-sm text-gray-500 mt-0.5">
                AI-powered candidate screening
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">

          <button
            onClick={() =>
              onRefresh?.(safeInsights.batch_id)
            }
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] text-sm text-gray-300 hover:bg-white/[0.07] transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>

          <button
            onClick={() =>
              setShowAddResumes(!showAddResumes)
            }
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-gray-900 text-sm font-semibold hover:bg-gray-200 transition"
          >
            <Upload className="w-4 h-4" />
            Upload More
          </button>

        </div>
      </div>

      {/* ======================================================
          ADD RESUMES
      ====================================================== */}

      {showAddResumes && (
        <div className="rounded-2xl bg-white/[0.025] border border-white/10 p-5">

          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="font-semibold text-white">
                Add Resumes to This Batch
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                {calculatedStats.total} / 30 resumes
              </p>
            </div>

            <button
              onClick={() => {
                setShowAddResumes(false);
                setAddFiles([]);
                setAddError("");
              }}
              className="text-gray-500 hover:text-white"
            >
              ×
            </button>
          </div>

          <form
            onSubmit={handleAddResumes}
            className="space-y-4"
          >

            <input
              type="file"
              accept=".pdf,.docx"
              multiple
              onChange={(e) =>
                setAddFiles(
                  Array.from(e.target.files || [])
                )
              }
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-3 text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-500/20 file:text-indigo-300"
            />

            {addFiles.length > 0 && (
              <p className="text-xs text-gray-500">
                {addFiles.length} file(s) selected
              </p>
            )}

            {addError && (
              <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                <p className="text-xs text-red-400">
                  {addError}
                </p>
              </div>
            )}

            {addLoading ? (
              <ProgressBar
                progress={addProgress.progress}
                label={`Analyzing ${addFiles.length} resume(s)...`}
              />
            ) : (
              <button
                type="submit"
                disabled={addFiles.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-indigo-500 text-white py-3 rounded-xl font-semibold hover:bg-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Add & Analyze
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

          </form>
        </div>
      )}

      {/* ======================================================
          KPI CARDS
      ====================================================== */}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">

        <StatCard
          icon={<Users className="w-4 h-4" />}
          label="Total Resumes"
          value={calculatedStats.total}
        />

        <StatCard
          icon={<Target className="w-4 h-4" />}
          label="Average Score"
          value={`${calculatedStats.average}%`}
          accent="indigo"
        />

        <StatCard
          icon={<CheckCircle2 className="w-4 h-4" />}
          label="Eligible"
          value={calculatedStats.eligible}
          accent="emerald"
        />

        <StatCard
          icon={<XCircle className="w-4 h-4" />}
          label="Ineligible"
          value={calculatedStats.ineligible}
          accent="red"
        />

      </div>

      {/* ======================================================
          CHART ROW 1
      ====================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* SCORE DISTRIBUTION */}

        <ChartCard
          icon={<PieChartIcon className="w-4 h-4" />}
          title="Candidate Fit Distribution"
          subtitle="Overall candidate quality"
        >

          {pieData.length > 0 ? (
            <div className="h-[290px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>

                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={72}
                    outerRadius={105}
                    paddingAngle={4}
                    animationBegin={0}
                    animationDuration={700}
                  >
                    {pieData.map(
                      (entry, index) => (
                        <Cell
                          key={index}
                          fill={entry.color}
                          stroke="none"
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip
                    contentStyle={tooltipStyle}
                  />

                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: 11,
                      color: "#9ca3af",
                    }}
                  />

                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyChart />
          )}

        </ChartCard>

        {/* SCORE TREND */}

        <ChartCard
          icon={<Activity className="w-4 h-4" />}
          title="Candidate Score Trend"
          subtitle="Score progression across analyzed resumes"
        >

          {scoreTrendData.length > 0 ? (
            <div className="h-[290px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <AreaChart
                  data={scoreTrendData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 5,
                  }}
                >

                  <defs>
                    <linearGradient
                      id="scoreGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={COLORS.primary}
                        stopOpacity={0.45}
                      />

                      <stop
                        offset="100%"
                        stopColor={COLORS.primary}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    stroke="rgba(255,255,255,0.06)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="candidate"
                    tick={{
                      fill: "#666",
                      fontSize: 10,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    domain={[0, 100]}
                    tick={{
                      fill: "#666",
                      fontSize: 10,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => [
                      `${value}%`,
                      "Score",
                    ]}
                  />

                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke={COLORS.primary}
                    strokeWidth={2}
                    fill="url(#scoreGradient)"
                    animationDuration={700}
                  />

                </AreaChart>
              </ResponsiveContainer>

            </div>
          ) : (
            <EmptyChart />
          )}

        </ChartCard>

      </div>

      {/* ======================================================
          CHART ROW 2
      ====================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* SKILL GAP */}

        <ChartCard
          icon={<AlertTriangle className="w-4 h-4" />}
          title="Top Skill Gaps"
          subtitle="Most frequently missing skills"
        >

          {skillGapData.length > 0 ? (
            <div className="h-[320px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={skillGapData}
                  layout="vertical"
                  margin={{
                    left: 15,
                    right: 15,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                    horizontal={false}
                  />

                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{
                      fill: "#666",
                      fontSize: 10,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    type="category"
                    dataKey="name"
                    width={105}
                    tick={{
                      fill: "#aaa",
                      fontSize: 10,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => [
                      `${value}%`,
                      "Missing",
                    ]}
                  />

                  <Bar
                    dataKey="missing"
                    fill={COLORS.weak}
                    radius={[
                      0,
                      6,
                      6,
                      0,
                    ]}
                    barSize={15}
                    animationDuration={700}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>
          ) : (
            <EmptyChart
              text="No significant skill gaps found."
            />
          )}

        </ChartCard>

        {/* ELIGIBILITY */}

        <ChartCard
          icon={<Award className="w-4 h-4" />}
          title="Eligibility Overview"
          subtitle="Candidate eligibility screening"
        >

          <div className="space-y-6 pt-3">

            <EligibilityBar
              label="Eligible"
              value={calculatedStats.eligible}
              total={calculatedStats.total}
              color="bg-emerald-400"
            />

            <EligibilityBar
              label="Ineligible"
              value={calculatedStats.ineligible}
              total={calculatedStats.total}
              color="bg-red-400"
            />

            <div className="grid grid-cols-2 gap-3 pt-2">

              <MiniMetric
                label="Eligibility Rate"
                value={
                  calculatedStats.total
                    ? `${Math.round(
                        (calculatedStats.eligible /
                          calculatedStats.total) *
                          100
                      )}%`
                    : "0%"
                }
              />

              <MiniMetric
                label="Candidates"
                value={calculatedStats.total}
              />

            </div>

          </div>

        </ChartCard>

      </div>

      {/* ======================================================
          AI INSIGHTS
      ====================================================== */}

      <div className="rounded-2xl bg-gradient-to-br from-indigo-500/[0.08] to-violet-500/[0.04] border border-indigo-500/15 p-6">

        <div className="flex items-start gap-4">

          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
            <Brain className="w-5 h-5 text-indigo-400" />
          </div>

          <div className="flex-1">

            <p className="text-[10px] tracking-[0.18em] font-semibold text-indigo-400">
              AI INSIGHTS
            </p>

            <h2 className="text-lg font-semibold text-white mt-1">
              Batch intelligence
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              AI-generated signals from the current candidate pool.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">

              <InsightMetric
                icon={<TrendingUp className="w-4 h-4" />}
                label="Average Score"
                value={`${calculatedStats.average}%`}
              />

              <InsightMetric
                icon={<Target className="w-4 h-4" />}
                label="Eligibility Rate"
                value={
                  calculatedStats.total
                    ? `${Math.round(
                        (calculatedStats.eligible /
                          calculatedStats.total) *
                          100
                      )}%`
                    : "0%"
                }
              />

              <InsightMetric
                icon={<Award className="w-4 h-4" />}
                label="Strong Fits"
                value={
                  scoreDistribution.strong_fit ||
                  0
                }
              />

            </div>

          </div>

        </div>

      </div>

      {/* ======================================================
          INDIVIDUAL RESULTS
      ====================================================== */}

      <div className="rounded-2xl bg-white/[0.025] border border-white/10 overflow-hidden">

        <div className="p-5 border-b border-white/10">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <h2 className="font-semibold text-white">
                Individual Results
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                {filteredResults.length} of{" "}
                {resultRows.length} candidates
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">

              <div className="relative">

                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search candidate..."
                  className="w-full sm:w-56 bg-white/[0.03] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-gray-600 outline-none focus:border-indigo-500/40"
                />

              </div>

              <div className="relative">

                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 pointer-events-none" />

                <select
                  value={filter}
                  onChange={(e) =>
                    setFilter(e.target.value)
                  }
                  className="appearance-none bg-white/[0.03] border border-white/10 rounded-xl pl-9 pr-8 py-2.5 text-xs text-gray-300 outline-none"
                >
                  <option value="all">
                    All Candidates
                  </option>

                  <option value="pass">
                    Eligible
                  </option>

                  <option value="fail">
                    Ineligible
                  </option>

                  <option value="unknown">
                    Unknown
                  </option>

                </select>

              </div>

            </div>

          </div>

        </div>

        <div className="p-5">

          {filteredResults.length > 0 ? (
            <div className="space-y-2">

              {filteredResults.map(
                (result, index) => (
                  <ResultRow
                    key={
                      result?.resume_id ||
                      result?.id ||
                      `${result?.candidate_name}-${index}`
                    }
                    result={result}
                  />
                )
              )}

            </div>
          ) : (
            <div className="py-14 text-center">

              <Search className="w-7 h-7 text-gray-700 mx-auto mb-3" />

              <p className="text-sm text-gray-500">
                No candidates found.
              </p>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

/* ================================================================
   RESULT ROW
================================================================ */

function ResultRow({ result }) {
  const [expanded, setExpanded] =
    useState(false);

  const status =
    String(
      result?.eligibility_status || "unknown"
    ).toLowerCase();

  const statusConfig = {
    pass: {
      icon: (
        <CheckCircle2 className="w-3.5 h-3.5" />
      ),
      className:
        "bg-emerald-500/10 text-emerald-300 border-emerald-500/10",
    },

    fail: {
      icon: (
        <XCircle className="w-3.5 h-3.5" />
      ),
      className:
        "bg-red-500/10 text-red-300 border-red-500/10",
    },

    unknown: {
      icon: (
        <HelpCircle className="w-3.5 h-3.5" />
      ),
      className:
        "bg-white/5 text-gray-400 border-white/10",
    },
  };

  const config =
    statusConfig[status] ||
    statusConfig.unknown;

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden hover:bg-white/[0.02] transition">

      <button
        type="button"
        onClick={() =>
          setExpanded(!expanded)
        }
        className="w-full p-4 text-left"
      >

        <div className="flex items-center gap-4">

          <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4 text-gray-500" />
          </div>

          <div className="flex-1 min-w-0">

            <p className="text-sm font-medium text-white truncate">
              {result?.candidate_name ||
                "Unnamed Candidate"}
            </p>

            <p className="text-xs text-gray-600 truncate mt-1">
              {result?.resume_summary ||
                "No summary available."}
            </p>

          </div>

          <div className="flex items-center gap-3 flex-shrink-0">

            <span
              className={`hidden sm:flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border ${config.className}`}
            >
              {config.icon}
              {status}
            </span>

            <span className="text-lg font-bold text-indigo-400 w-14 text-right">
              {Number(
                result?.overall_score || 0
              )}
              %
            </span>

            <ChevronDown
              className={`w-4 h-4 text-gray-600 transition-transform ${
                expanded
                  ? "rotate-180"
                  : ""
              }`}
            />

          </div>

        </div>

      </button>

      {expanded && (
        <div className="px-4 pb-5">

          <div className="border-t border-white/10 pt-5 space-y-5">

            {/* SUMMARY */}

            {result?.resume_summary && (
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-600 mb-2">
                  Resume Summary
                </p>

                <p className="text-sm text-gray-400 leading-relaxed">
                  {result.resume_summary}
                </p>
              </div>
            )}

            {/* MATCH SCORES */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              <MatchMetric
                label="Must-Have Skills"
                value={
                  result?.must_have_match_pct
                }
              />

              <MatchMetric
                label="Nice-to-Have Skills"
                value={
                  result?.nice_to_have_match_pct
                }
              />

            </div>

            {/* MATCHED SKILLS */}

            <SkillGroup
              label="Matched Skills"
              skills={result?.matched_skills}
              color="indigo"
            />

            {/* MISSING SKILLS */}

            <SkillGroup
              label="Missing Must-Have"
              skills={
                result?.missing_must_have_skills
              }
              color="red"
            />

            {/* ELIGIBILITY */}

            {result?.eligibility_reasons?.length >
              0 && (
              <div>

                <p className="text-[10px] uppercase tracking-wider text-gray-600 mb-2">
                  Eligibility Details
                </p>

                <ul className="space-y-1.5">

                  {result.eligibility_reasons.map(
                    (reason, index) => (
                      <li
                        key={index}
                        className="flex gap-2 text-xs text-gray-500"
                      >
                        <span className="text-indigo-400">
                          •
                        </span>

                        {reason}
                      </li>
                    )
                  )}

                </ul>

              </div>
            )}

            {/* SUGGESTIONS */}

            {result?.suggestions && (
              <div className="rounded-xl bg-indigo-500/[0.05] border border-indigo-500/10 p-4">

                <div className="flex gap-3">

                  <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />

                  <div>

                    <p className="text-xs font-medium text-indigo-300">
                      AI Recommendation
                    </p>

                    <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                      {result.suggestions}
                    </p>

                  </div>

                </div>

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}

/* ================================================================
   COMPONENTS
================================================================ */

function ChartCard({
  icon,
  title,
  subtitle,
  children,
}) {
  return (
    <div className="bg-white/[0.025] border border-white/10 rounded-2xl p-5">

      <div className="flex items-center gap-3 mb-4">

        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/10 flex items-center justify-center text-indigo-400">
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

function StatCard({
  icon,
  label,
  value,
  accent = "default",
}) {
  const colors = {
    default: "text-white",
    indigo: "text-indigo-400",
    emerald: "text-emerald-400",
    red: "text-red-400",
  };

  return (
    <div className="bg-white/[0.025] border border-white/10 rounded-2xl p-5">

      <div className="flex items-center justify-between">

        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500">
          {icon}
        </div>

      </div>

      <p
        className={`text-2xl font-bold mt-4 ${colors[accent]}`}
      >
        {value}
      </p>

      <p className="text-xs text-gray-600 mt-1">
        {label}
      </p>

    </div>
  );
}

function MatchMetric({
  label,
  value,
}) {
  const numericValue = Number(
    value || 0
  );

  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">

      <div className="flex items-center justify-between mb-2">

        <span className="text-xs text-gray-500">
          {label}
        </span>

        <span className="text-xs font-semibold text-white">
          {numericValue}%
        </span>

      </div>

      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">

        <div
          className="h-full bg-indigo-400 rounded-full transition-all duration-700"
          style={{
            width: `${Math.min(
              100,
              Math.max(0, numericValue)
            )}%`,
          }}
        />

      </div>

    </div>
  );
}

function EligibilityBar({
  label,
  value,
  total,
  color,
}) {
  const percentage = total
    ? Math.round(
        (value / total) * 100
      )
    : 0;

  return (
    <div>

      <div className="flex items-center justify-between mb-2">

        <span className="text-xs text-gray-400">
          {label}
        </span>

        <span className="text-xs text-white font-medium">
          {value}{" "}
          <span className="text-gray-600">
            ({percentage}%)
          </span>
        </span>

      </div>

      <div className="h-2 bg-white/5 rounded-full overflow-hidden">

        <div
          className={`h-full ${color} rounded-full transition-all duration-700`}
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>
  );
}

function MiniMetric({
  label,
  value,
}) {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">

      <p className="text-[10px] uppercase tracking-wider text-gray-600">
        {label}
      </p>

      <p className="text-xl font-bold text-white mt-1">
        {value}
      </p>

    </div>
  );
}

function InsightMetric({
  icon,
  label,
  value,
}) {
  return (
    <div className="bg-black/10 border border-white/5 rounded-xl p-4">

      <div className="flex items-center gap-2 text-gray-500">

        {icon}

        <span className="text-xs">
          {label}
        </span>

      </div>

      <p className="text-lg font-bold text-white mt-2">
        {value}
      </p>

    </div>
  );
}

function SkillGroup({
  label,
  skills,
  color = "indigo",
}) {
  if (!Array.isArray(skills) || skills.length === 0) {
    return null;
  }

  const colorMap = {
    indigo:
      "bg-indigo-500/10 text-indigo-300 border-indigo-500/10",

    red:
      "bg-red-500/10 text-red-300 border-red-500/10",

    violet:
      "bg-violet-500/10 text-violet-300 border-violet-500/10",
  };

  return (
    <div>

      <p className="text-[10px] uppercase tracking-wider text-gray-600 mb-2">
        {label}
      </p>

      <div className="flex flex-wrap gap-1.5">

        {skills.map((skill, index) => (
          <span
            key={`${skill}-${index}`}
            className={`text-xs px-2.5 py-1.5 rounded-lg border ${
              colorMap[color]
            }`}
          >
            {skill}
          </span>
        ))}

      </div>

    </div>
  );
}

function ProgressBar({
  progress,
  label,
}) {
  return (
    <div>

      <div className="flex items-center justify-between mb-2">

        <span className="text-xs text-gray-500">
          {label}
        </span>

        <span className="text-xs text-indigo-300">
          {progress}%
        </span>

      </div>

      <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">

        <div
          className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-200"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

    </div>
  );
}

function EmptyChart({
  text = "No data available.",
}) {
  return (
    <div className="h-[290px] flex items-center justify-center">

      <div className="text-center">

        <BarChart3 className="w-7 h-7 text-gray-700 mx-auto mb-2" />

        <p className="text-xs text-gray-600">
          {text}
        </p>

      </div>

    </div>
  );
}

function ResultsLoading() {
  return (
    <div className="min-h-[550px] flex items-center justify-center">

      <div className="text-center">

        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto">

          <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin" />

        </div>

        <p className="text-sm text-gray-400 mt-4">
          Loading analysis...
        </p>

        <p className="text-xs text-gray-600 mt-1">
          Preparing candidate insights
        </p>

      </div>

    </div>
  );
}