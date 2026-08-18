import { useMemo, useState } from "react";
import {
  Plus,
  FileText,
  Users,
  Clock,
  Search,
  MoreVertical,
  Trash2,
  ArrowUpRight,
  CheckCircle2,
  Loader2,
  CalendarDays,
  BarChart3,
  Sparkles,
  X,
} from "lucide-react";

export default function HomeView({
  batches,
  loading,
  onNew,
  onOpen,
  onDelete,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [menuOpen, setMenuOpen] = useState(null);
  const [deleteBatchData, setDeleteBatchData] = useState(null);
  const [deletingBatchId, setDeletingBatchId] = useState(null);

  const filteredBatches = useMemo(() => {
    return batches.filter((batch) => {
      const batchName = (
        batch.batch_name || "Untitled Batch"
      ).toLowerCase();

      const matchesSearch = batchName.includes(
        searchQuery.toLowerCase()
      );

      const matchesFilter =
        filter === "all" ||
        batch.status?.toLowerCase() === filter;

      return matchesSearch && matchesFilter;
    });
  }, [batches, searchQuery, filter]);

  const totalResumes = batches.reduce(
    (sum, batch) => sum + (batch.total_resumes || 0),
    0
  );

  const completedBatches = batches.filter(
    (batch) =>
      batch.status?.toLowerCase() === "completed"
  ).length;

  const processingBatches = batches.filter(
    (batch) =>
      batch.status?.toLowerCase() === "processing"
  ).length;

  const handleDelete = async () => {
    if (!deleteBatchData) return;

    try {
      setDeletingBatchId(deleteBatchData.id);

      await onDelete(deleteBatchData.id);

      setDeleteBatchData(null);
      setMenuOpen(null);
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingBatchId(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return {
          wrapper:
            "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
          icon: (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ),
        };

      case "processing":
        return {
          wrapper:
            "bg-amber-500/10 border-amber-500/20 text-amber-400",
          icon: (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ),
        };

      default:
        return {
          wrapper:
            "bg-white/5 border-white/10 text-gray-400",
          icon: (
            <Clock className="w-3.5 h-3.5" />
          ),
        };
    }
  };

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />

            <span className="text-xs font-medium uppercase tracking-wider text-indigo-400">
              Faculty Dashboard
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Placement Overview
          </h1>

          <p className="text-gray-400 text-sm mt-2">
            Manage your placement drives and candidate analysis.
          </p>
        </div>

        <button
          onClick={onNew}
          className="self-start sm:self-auto flex items-center justify-center gap-2 bg-white text-gray-900 px-5 py-3 rounded-xl font-semibold text-sm hover:bg-gray-200 active:scale-[0.98] transition-all shadow-lg shadow-white/5"
        >
          <Plus className="w-4 h-4" />
          New Analysis
        </button>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <StatCard
          icon={
            <FileText className="w-5 h-5" />
          }
          label="Total Batches"
          value={batches.length}
          description="Placement drives"
        />

        <StatCard
          icon={
            <Users className="w-5 h-5" />
          }
          label="Resumes Analyzed"
          value={totalResumes}
          description="Across all batches"
        />

        <StatCard
          icon={
            <CheckCircle2 className="w-5 h-5" />
          }
          label="Completed"
          value={completedBatches}
          description={
            processingBatches > 0
              ? `${processingBatches} currently processing`
              : "All available batches"
          }
        />

      </div>

      {/* Batch Section */}

      <div>

        {/* Section Header */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">

          <div>
            <h2 className="text-lg font-semibold text-white">
              Recent Analysis
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Your saved placement analysis batches
            </p>
          </div>

          {batches.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3">

              {/* Search */}

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  placeholder="Search batches..."
                  className="w-full sm:w-64 bg-white/[0.03] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-gray-600 outline-none focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/10 transition"
                />
              </div>

              {/* Filter */}

              <div className="flex items-center gap-1 bg-white/[0.03] border border-white/10 rounded-xl p-1">

                <FilterButton
                  active={filter === "all"}
                  onClick={() => setFilter("all")}
                >
                  All
                </FilterButton>

                <FilterButton
                  active={filter === "completed"}
                  onClick={() =>
                    setFilter("completed")
                  }
                >
                  Completed
                </FilterButton>

                <FilterButton
                  active={filter === "processing"}
                  onClick={() =>
                    setFilter("processing")
                  }
                >
                  Processing
                </FilterButton>

              </div>
            </div>
          )}
        </div>

        {/* Loading */}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-7 h-7 text-indigo-400 animate-spin mb-3" />

            <p className="text-sm text-gray-500">
              Loading your batches...
            </p>
          </div>
        ) : batches.length === 0 ? (

          <EmptyState onNew={onNew} />

        ) : filteredBatches.length === 0 ? (

          <div className="border border-white/10 rounded-2xl py-16 text-center bg-white/[0.02]">

            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Search className="w-5 h-5 text-gray-500" />
            </div>

            <h3 className="font-medium text-white mb-1">
              No batches found
            </h3>

            <p className="text-sm text-gray-500">
              Try changing your search or filter.
            </p>

            {(searchQuery ||
              filter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilter("all");
                }}
                className="mt-4 text-sm text-indigo-400 hover:text-indigo-300 transition"
              >
                Clear filters
              </button>
            )}

          </div>

        ) : (

          /* Batch List */

          <div className="space-y-3">

            {filteredBatches.map((batch) => {
              const status = getStatusStyle(
                batch.status
              );

              const isDeleting =
                deletingBatchId === batch.id;

              return (
                <div
                  key={batch.id}
                  className={`group relative bg-white/[0.025] border border-white/10 rounded-2xl p-5 transition-all ${
                    isDeleting
                      ? "opacity-50 pointer-events-none"
                      : "hover:bg-white/[0.045] hover:border-white/15"
                  }`}
                >

                  <div className="flex items-center gap-4">

                    {/* Batch Icon */}

                    <div className="hidden sm:flex w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/10 items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-5 h-5 text-indigo-400" />
                    </div>

                    {/* Batch Information */}

                    <button
                      onClick={() =>
                        onOpen(batch.id)
                      }
                      className="flex-1 min-w-0 text-left"
                    >

                      <div className="flex flex-wrap items-center gap-2 mb-1.5">

                        <h3 className="font-semibold text-white truncate">
                          {batch.batch_name ||
                            "Untitled Batch"}
                        </h3>

                        <span
                          className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-full border ${status.wrapper}`}
                        >
                          {status.icon}

                          <span className="capitalize">
                            {batch.status ||
                              "uploaded"}
                          </span>
                        </span>

                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">

                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />

                          {batch.total_resumes ||
                            0}{" "}
                          resumes
                        </span>

                        <span className="flex items-center gap-1.5">
                          <CalendarDays className="w-3.5 h-3.5" />

                          {new Date(
                            batch.created_at
                          ).toLocaleDateString(
                            undefined,
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </span>

                      </div>

                    </button>

                    {/* Actions */}

                    <div className="flex items-center gap-2 flex-shrink-0">

                      {/* View Results */}

                      <button
                        onClick={() =>
                          onOpen(batch.id)
                        }
                        className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition"
                      >
                        View Results

                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Loading */}

                      {isDeleting && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 px-2">
                          <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                          Deleting...
                        </div>
                      )}

                      {/* Menu */}

                      {!isDeleting && (
                        <div className="relative">

                          <button
                            onClick={(e) => {
                              e.stopPropagation();

                              setMenuOpen(
                                menuOpen ===
                                  batch.id
                                  ? null
                                  : batch.id
                              );
                            }}
                            className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {menuOpen ===
                            batch.id && (
                            <>
                              <button
                                className="fixed inset-0 z-10 cursor-default"
                                onClick={() =>
                                  setMenuOpen(null)
                                }
                              />

                              <div className="absolute right-0 top-full mt-2 w-40 bg-[#17171f] border border-white/10 rounded-xl p-1.5 shadow-2xl z-20">

                                <button
                                  onClick={() => {
                                    setMenuOpen(
                                      null
                                    );

                                    onOpen(
                                      batch.id
                                    );
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition"
                                >
                                  <ArrowUpRight className="w-4 h-4" />

                                  View Results
                                </button>

                                <button
                                  onClick={() => {
                                    setMenuOpen(
                                      null
                                    );

                                    setDeleteBatchData(
                                      batch
                                    );
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition"
                                >
                                  <Trash2 className="w-4 h-4" />

                                  Delete Batch
                                </button>

                              </div>
                            </>
                          )}

                        </div>
                      )}

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

      {/* Delete Modal */}

      {deleteBatchData && (
        <DeleteModal
          batch={deleteBatchData}
          onCancel={() => {
            if (!deletingBatchId) {
              setDeleteBatchData(null);
            }
          }}
          onConfirm={handleDelete}
          deleting={
            deletingBatchId ===
            deleteBatchData.id
          }
        />
      )}

    </div>
  );
}


/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  icon,
  label,
  value,
  description,
}) {
  return (
    <div className="group bg-white/[0.025] border border-white/10 rounded-2xl p-5 hover:bg-white/[0.04] hover:border-white/15 transition-all">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {label}
          </p>

          <p className="text-2xl font-bold text-white mt-2">
            {value}
          </p>

          <p className="text-xs text-gray-600 mt-1">
            {description}
          </p>
        </div>

        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition">
          {icon}
        </div>

      </div>

    </div>
  );
}


/* ============================================================
   FILTER BUTTON
============================================================ */

function FilterButton({
  active,
  onClick,
  children,
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
        active
          ? "bg-white/10 text-white shadow-sm"
          : "text-gray-500 hover:text-gray-300"
      }`}
    >
      {children}
    </button>
  );
}


/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyState({ onNew }) {
  return (
    <div className="relative overflow-hidden border border-white/10 rounded-2xl bg-gradient-to-br from-indigo-500/[0.06] via-transparent to-violet-500/[0.04] py-20 px-6 text-center">

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative">

        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-5">
          <Sparkles className="w-6 h-6 text-indigo-400" />
        </div>

        <h3 className="text-lg font-semibold text-white">
          Start your first placement analysis
        </h3>

        <p className="text-sm text-gray-500 max-w-md mx-auto mt-2 leading-relaxed">
          Upload a job description and candidate
          resumes to automatically evaluate your
          batch.
        </p>

        <button
          onClick={onNew}
          className="inline-flex items-center gap-2 mt-6 bg-white text-gray-900 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 active:scale-[0.98] transition"
        >
          <Plus className="w-4 h-4" />
          New Analysis
        </button>

      </div>

    </div>
  );
}


/* ============================================================
   DELETE MODAL
============================================================ */

function DeleteModal({
  batch,
  onCancel,
  onConfirm,
  deleting,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

      {/* Backdrop */}

      <button
        onClick={!deleting ? onCancel : undefined}
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm ${
          deleting
            ? "cursor-not-allowed"
            : ""
        }`}
      />

      {/* Modal */}

      <div className="relative w-full max-w-md bg-[#15151c] border border-white/10 rounded-2xl shadow-2xl p-6">

        {!deleting && (
          <button
            onClick={onCancel}
            className="absolute right-4 top-4 p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${
            deleting
              ? "bg-indigo-500/10 border border-indigo-500/15"
              : "bg-red-500/10 border border-red-500/15"
          }`}
        >
          {deleting ? (
            <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
          ) : (
            <Trash2 className="w-5 h-5 text-red-400" />
          )}
        </div>

        <h3 className="text-lg font-semibold text-white">
          {deleting
            ? "Deleting batch..."
            : "Delete this batch?"}
        </h3>

        <p className="text-sm text-gray-400 mt-2 leading-relaxed">
          {deleting ? (
            <>
              Please wait while we remove{" "}
              <span className="text-white font-medium">
                {batch.batch_name ||
                  "Untitled Batch"}
              </span>
              .
            </>
          ) : (
            <>
              You're about to permanently delete{" "}
              <span className="text-white font-medium">
                {batch.batch_name ||
                  "Untitled Batch"}
              </span>
              .
            </>
          )}
        </p>

        {!deleting && (
          <p className="text-xs text-gray-600 mt-2">
            This action will remove the batch and
            its analysis results. This cannot be
            undone.
          </p>
        )}

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onCancel}
            disabled={deleting}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex items-center justify-center gap-2 min-w-[125px] px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {deleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete Batch
              </>
            )}
          </button>

        </div>

      </div>

    </div>
  );
}