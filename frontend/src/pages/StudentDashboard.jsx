import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { analyzeResume } from "../api/student";
import { useEstimatedProgress } from "../hooks/useEstimatedProgress";

export default function StudentDashboard() {
  const { user, logout } = useAuth();

  const [resumeFile, setResumeFile] = useState(null);
  const [jdFile, setJdFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const { progress, start, finish, stop } = useEstimatedProgress();

  const handleAnalyze = async (e) => {
  e.preventDefault();
  if (!resumeFile || !jdFile) {
    setError("Please select both a resume and a JD file.");
    return;
  }

  setError("");
  setLoading(true);
  setResult(null);
  start(12); // resume + JD parsing + matching ~ 12 sec estimate

  try {
    const data = await analyzeResume(resumeFile, jdFile);
    setResult(data);
    finish();
  } catch (err) {
    setError(err.response?.data?.detail || "Analysis failed. Please try again.");
    stop();
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Welcome, {user?.name}</h1>
          <button onClick={logout} className="text-sm text-red-600 hover:underline">
            Logout
          </button>
        </div>

        {/* Upload Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Analyze Your Resume</h2>
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Resume (PDF/DOCX)</label>
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => setResumeFile(e.target.files[0])}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Job Description (PDF/DOCX)</label>
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => setJdFile(e.target.files[0])}
                className="w-full border rounded px-3 py-2 text-sm"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            {loading ? (
  <div>
    <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
      <div
        className="bg-blue-600 h-2 rounded-full transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
    <p className="text-xs text-center text-gray-500">Analyzing... {progress}%</p>
  </div>
) : (
  <button
    type="submit"
    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
  >
    Analyze
  </button>
)}
          </form>
        </div>

        {/* Result */}
        {result && (
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {result.jd_company} — {result.jd_role}
              </h2>
              <span className="text-3xl font-bold text-blue-600">
                {result.overall_score}%
              </span>
            </div>

            <p className="text-sm text-gray-600">{result.resume_summary}</p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Must-Have Match:</span>{" "}
                {result.must_have_match_pct}%
              </div>
              <div>
                <span className="font-medium">Nice-to-Have Match:</span>{" "}
                {result.nice_to_have_match_pct}%
              </div>
            </div>

            <div>
              <span className="font-medium text-sm">Eligibility: </span>
              <span
                className={`text-sm px-2 py-0.5 rounded ${
                  result.eligibility_status === "pass"
                    ? "bg-green-100 text-green-700"
                    : result.eligibility_status === "fail"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {result.eligibility_status}
              </span>
              <ul className="text-xs text-gray-500 mt-1 list-disc list-inside">
                {result.eligibility_reasons?.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-medium text-sm mb-1">Matched Skills</p>
              <div className="flex flex-wrap gap-1">
                {result.matched_skills?.map((s, i) => (
                  <span key={i} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="font-medium text-sm mb-1">Missing Must-Have Skills</p>
              <div className="flex flex-wrap gap-1">
                {result.missing_must_have_skills?.map((s, i) => (
                  <span key={i} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="font-medium text-sm mb-1">Suggestions</p>
              <p className="text-sm text-gray-600">{result.suggestions}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}