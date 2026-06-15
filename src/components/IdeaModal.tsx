import React, { useEffect } from "react";
import { Idea } from "@/types/idea";

interface IdeaModalProps {
  idea: Idea | null;
  onClose: () => void;
}

export default function IdeaModal({ idea, onClose }: IdeaModalProps) {
  // Handle escape key to close
  useEffect(() => {
    if (!idea) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    // Disable body scroll when modal is open
    document.body.style.overflow = "hidden";
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [idea, onClose]);

  if (!idea) return null;

  // Styles based on categories
  const getCategoryStyles = (category: string) => {
    switch (category) {
      case "AI/LLMs":
        return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/30";
      case "Mobile":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/30";
      case "Frontend/UI":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/30";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/40 dark:text-slate-300 dark:border-slate-800/30";
    }
  };

  // Styles based on confidence levels
  const getConfidenceStyles = (confidence: string) => {
    switch (confidence) {
      case "Total Feasible":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400 dark:bg-emerald-500/15";
      case "Pretty Doable":
        return "bg-teal-500/10 text-teal-600 border-teal-500/20 dark:text-teal-400 dark:bg-teal-500/15";
      case "Tight but Ok":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:text-yellow-400 dark:bg-yellow-500/15";
      case "Might Stretch":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400 dark:bg-orange-500/15";
      case "Very Risky":
        return "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400 dark:bg-red-500/15";
      default:
        return "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:text-slate-400 dark:bg-slate-500/15";
    }
  };

  const ownerInitial = idea.owner ? idea.owner.charAt(0).toUpperCase() : "?";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop (Fades in) */}
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Card (Scales in) */}
      <div className="relative w-full max-w-2xl bg-card-bg border border-card-border rounded-2xl shadow-xl overflow-hidden z-10 transition-transform duration-300 transform scale-100 animate-scale-in flex flex-col max-h-[90vh]">
        
        {/* Header Section */}
        <div className="p-6 border-b border-card-border flex items-start justify-between">
          <div className="space-y-3">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getCategoryStyles(
                  idea.category
                )}`}
              >
                {idea.category}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getConfidenceStyles(
                  idea.confidence
                )}`}
              >
                {idea.confidence}
              </span>
            </div>
            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight leading-tight">
              {idea.name}
            </h2>
            {/* Owner Info */}
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-color/10 text-accent-color text-xs font-semibold">
                {ownerInitial}
              </div>
              <span className="text-sm font-medium text-muted-text">
                Submitted by <strong className="text-foreground">{idea.owner}</strong>
              </span>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close details"
            className="p-1.5 rounded-lg text-muted-text hover:text-foreground hover:bg-muted-text/10 transition-colors duration-150 cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content Section (Scrollable if too long) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Problem Section */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold tracking-wider text-muted-text uppercase flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-red-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              The Problem
            </h4>
            <div className="p-4 rounded-xl border border-red-500/10 bg-red-500/5 text-sm sm:text-base text-foreground leading-relaxed">
              {idea.problem}
            </div>
          </div>

          {/* Solution Section */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold tracking-wider text-muted-text uppercase flex items-center gap-1.5">
              <svg
                className="w-4 h-4 text-emerald-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Proposed Solution
            </h4>
            <div className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5 text-sm sm:text-base text-foreground leading-relaxed">
              {idea.solution}
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="p-4 border-t border-card-border bg-card-bg flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-accent-color hover:bg-accent-hover text-white transition-colors duration-150 shadow-xs cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
