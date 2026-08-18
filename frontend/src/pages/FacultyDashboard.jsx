// frontend/src/pages/FacultyDashboard.jsx

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  uploadJD,
  uploadBatch,
  getBatches,
  getBatchResults,
  getBatchInsights,
  deleteBatch,
} from "../api/faculty";
import { useEstimatedProgress } from "../hooks/useEstimatedProgress";
import { Sparkles, LogOut } from "lucide-react";

import HomeView from "../components/faculty/HomeView";
import UploadJDView from "../components/faculty/UploadJDView";
import UploadResumesView from "../components/faculty/UploadResumesView";
import ResultsView from "../components/faculty/ResultsView";

export default function FacultyDashboard() {
  const { user, logout } = useAuth();

  const [view, setView] = useState("home");

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


  const handleDeleteBatch = async (batchId) => {
  try {
    await deleteBatch(batchId);

    setBatches((prev) =>
      prev.filter((batch) => batch.id !== batchId)
    );
  } catch (err) {
    console.error(err);

    alert(
      err.response?.data?.detail ||
        "Failed to delete batch."
    );
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

    if (!jdFile) {
      return setJdError("Please select a JD file.");
    }

    setJdError("");
    setJdLoading(true);
    jdProgress.start(10);

    try {
      const data = await uploadJD(jdFile);

      setJdData(data);
      jdProgress.finish();
      // setView("upload-resumes");
    } catch (err) {
      setJdError(err.response?.data?.detail || "JD upload failed.");
      jdProgress.stop();
    } finally {
      setJdLoading(false);
    }
  };

  const handleBatchUpload = async (e) => {
    e.preventDefault();

    if (resumeFiles.length === 0) {
      return setBatchError("Please select at least 1 resume.");
    }

    if (resumeFiles.length > 30) {
      return setBatchError("Maximum 30 resumes allowed.");
    }

    setBatchError("");
    setBatchLoading(true);
    batchProgress.start(resumeFiles.length * 6);

    try {
      const data = await uploadBatch(
        jdData.id,
        batchName || "Untitled Batch",
        resumeFiles
      );

      batchProgress.finish();

      await loadResults(data.id);
      await loadBatches();

      setView("results");
    } catch (err) {
      setBatchError(
        err.response?.data?.detail || "Batch upload failed."
      );

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
      <header className="border-b border-white/10 sticky top-0 bg-[#0a0a0f]/80 backdrop-blur-md z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>

            <span className="font-bold tracking-tight">
              PlacementAI
            </span>

            <span className="text-gray-500 text-sm ml-2">
              / Faculty
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              {user?.name}
            </span>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
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
            onDelete={handleDeleteBatch}
          />
        )}

        {view === "upload-jd" && (
  <UploadJDView
    jdFile={jdFile}
    setJdFile={setJdFile}
    jdData={jdData}
    onSubmit={handleJdUpload}
    onContinue={() => setView("upload-resumes")}
    loading={jdLoading}
    error={jdError}
    progress={jdProgress.progress}
    onBack={() => setView("home")}
  />
)}

        {view === "upload-resumes" && (
  <UploadResumesView
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