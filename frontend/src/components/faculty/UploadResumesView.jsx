import {
  ArrowLeft,
  ArrowRight,
  Upload,
  FileText,
  CheckCircle2,
  Loader2,
  Sparkles,
  Users,
} from "lucide-react";

export default function UploadResumesView({
  batchName,
  setBatchName,
  resumeFiles = [],
  setResumeFiles,
  onSubmit,
  loading = false,
  error,
  progress = 0,
  onBack,
}) {
  const handleFiles = (files) => {
    if (!files || !setResumeFiles) return;

    const selectedFiles = Array.from(files);

    const validFiles = selectedFiles.filter((file) => {
      const name = file.name.toLowerCase();

      return (
        name.endsWith(".pdf") ||
        name.endsWith(".docx")
      );
    });

    setResumeFiles(validFiles.slice(0, 30));
  };

  const handleInputChange = (event) => {
    handleFiles(event.target.files);

    // Allows selecting the same files again
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();

    if (loading) return;

    handleFiles(event.dataTransfer.files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();

    if (!loading) {
      event.dataTransfer.dropEffect = "copy";
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col">

      {/* =====================================================
          TOP NAVIGATION
      ===================================================== */}

      <div className="flex items-center justify-between mb-8">

        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="group flex items-center gap-2 text-sm text-gray-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition" />
          Back
        </button>

        {/* Step Indicator */}

        <div className="hidden sm:flex items-center gap-2 text-xs">

          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />

            <span className="text-gray-500">
              Job Description
            </span>
          </div>

          <div className="w-8 h-px bg-white/10" />

          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[11px] font-semibold">
              2
            </span>

            <span className="text-white font-medium">
              Resumes
            </span>
          </div>

        </div>

      </div>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="max-w-2xl mx-auto w-full text-center mb-8">

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/15 text-indigo-300 text-xs font-medium mb-4">

          <Users className="w-3.5 h-3.5" />

          Candidate Resumes

        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Upload Resumes
        </h1>

        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          Create a batch and upload candidate resumes for AI analysis.
        </p>

      </div>

      {/* =====================================================
          MAIN WORKSPACE
      ===================================================== */}

      <div className="max-w-2xl mx-auto w-full">

        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
            loading
              ? "border-indigo-500/20 bg-indigo-500/[0.03]"
              : "border-white/10 bg-white/[0.02] hover:border-white/15"
          }`}
        >

          {/* Background Glow */}

          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/[0.05] blur-3xl rounded-full pointer-events-none" />

          <div className="relative p-5 sm:p-7">

            {/* =================================================
                BATCH NAME
            ================================================= */}

            {!loading && (
              <div className="mb-5">

                <label className="flex items-center gap-2 text-xs font-medium text-gray-400 mb-2">
                  Batch Name
                </label>

                <input
                  type="text"
                  value={batchName || ""}
                  onChange={(e) =>
                    setBatchName(e.target.value)
                  }
                  placeholder="e.g. TCS Software Engineer 2026"
                  disabled={loading}
                  className="w-full h-11 px-4 rounded-xl bg-white/[0.025] border border-white/10 text-sm text-white placeholder:text-gray-700 outline-none focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/10 disabled:opacity-50 transition"
                />

                <p className="text-[11px] text-gray-600 mt-1.5">
                  Use a clear name to identify this resume batch later.
                </p>

              </div>
            )}

            {/* =================================================
                UPLOAD AREA
            ================================================= */}

            {!loading && (
              <label
                htmlFor="resume-upload"
                className="block cursor-pointer"
              >

                <div className="border border-dashed border-white/10 rounded-xl p-9 sm:p-11 text-center hover:border-indigo-500/30 hover:bg-indigo-500/[0.02] transition">

                  <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center border border-white/10 bg-white/[0.04]">

                    <Upload className="w-6 h-6 text-gray-400" />

                  </div>

                  <h2 className="text-base font-semibold text-white mt-5">
                    Drop resumes here
                  </h2>

                  <p className="text-xs text-gray-600 mt-1.5">
                    Upload up to 30 PDF or DOCX files
                  </p>

                  <div className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 rounded-lg bg-white text-gray-900 text-xs font-semibold hover:bg-gray-200 transition">

                    <FileText className="w-3.5 h-3.5" />

                    Browse Resumes

                  </div>

                </div>

                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.docx"
                  multiple
                  onChange={handleInputChange}
                  className="hidden"
                />

              </label>
            )}

            {/* =================================================
                SELECTED FILES
            ================================================= */}

            {!loading && resumeFiles.length > 0 && (
              <div className="mt-5">

                <div className="flex items-center justify-between mb-2">

                  <p className="text-xs font-medium text-gray-400">
                    Selected Resumes
                  </p>

                  <span className="text-[11px] text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded-md">
                    {resumeFiles.length} / 30
                  </span>

                </div>

                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">

                  {resumeFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.025] border border-white/5"
                    >

                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">

                        <FileText className="w-3.5 h-3.5 text-indigo-400" />

                      </div>

                      <p className="text-xs text-gray-300 truncate flex-1">
                        {file.name}
                      </p>

                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />

                    </div>
                  ))}

                </div>

              </div>
            )}

            {/* =================================================
                ERROR
            ================================================= */}

            {error && !loading && (
              <div className="mt-4 p-3.5 rounded-xl bg-red-500/[0.06] border border-red-500/15">

                <p className="text-xs text-red-400">
                  {error}
                </p>

              </div>
            )}

            {/* =================================================
                LOADING STATE
            ================================================= */}

            {loading && (
              <div className="py-10">

                <div className="flex flex-col items-center text-center">

                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center">

                    <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />

                  </div>

                  <h2 className="text-base font-semibold text-white mt-5">
                    Analyzing resumes
                  </h2>

                  <p className="text-xs text-gray-600 mt-1.5 max-w-sm leading-relaxed">
                    AI is reading the candidate resumes and
                    comparing them with the job requirements.
                  </p>

                  <div className="w-full max-w-md mt-6">

                    <div className="flex items-center justify-between mb-2">

                      <span className="text-[11px] text-gray-500">
                        Processing candidates
                      </span>

                      <span className="text-[11px] text-indigo-300">
                        {progress}%
                      </span>

                    </div>

                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            Math.max(progress, 0),
                            100
                          )}%`,
                        }}
                      />

                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* =================================================
                ANALYZE BUTTON
            ================================================= */}

            {!loading && (
              <button
                type="button"
                onClick={onSubmit}
                disabled={
                  resumeFiles.length === 0 ||
                  !batchName?.trim()
                }
                className="w-full mt-5 flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-400 disabled:bg-white/10 disabled:text-gray-600 disabled:cursor-not-allowed transition"
              >

                <Sparkles className="w-4 h-4" />

                Analyze Resumes

                <ArrowRight className="w-4 h-4" />

              </button>
            )}

          </div>

        </div>

        {/* =====================================================
            INFO
        ===================================================== */}

        {!loading && (
          <div className="grid grid-cols-3 gap-2.5 mt-3">

            <UploadInfo
              icon={
                <FileText className="w-3.5 h-3.5" />
              }
              text="PDF / DOCX"
            />

            <UploadInfo
              icon={
                <Users className="w-3.5 h-3.5" />
              }
              text="Up to 30"
            />

            <UploadInfo
              icon={
                <Sparkles className="w-3.5 h-3.5" />
              }
              text="AI Analysis"
            />

          </div>
        )}

      </div>

    </div>
  );
}


/* ============================================================
   INFO CARD
============================================================ */

function UploadInfo({ icon, text }) {
  return (
    <div className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white/[0.02] border border-white/5">

      <span className="text-indigo-400">
        {icon}
      </span>

      <span className="text-[11px] text-gray-600">
        {text}
      </span>

    </div>
  );
}