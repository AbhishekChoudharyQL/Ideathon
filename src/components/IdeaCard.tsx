import React, { useState } from "react";
import { Idea } from "@/types/idea";

interface IdeaCardProps {
  idea: Idea;
  onViewDetails: (idea: Idea) => void;
  hasVoted: boolean;
  onVote: (ideaId: string) => Promise<void>;
}

export default function IdeaCard({ idea, onViewDetails, hasVoted, onVote }: IdeaCardProps) {
  const [isVoting, setIsVoting] = useState(false);

  // Styles based on categories
  const getCategoryStyles = (category: string) => {
    switch (category) {
      case "AI/LLMs":
        return "bg-indigo-50/80 text-indigo-700 border-indigo-200/60 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/30";
      case "Mobile":
        return "bg-emerald-50/80 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/30";
      case "Frontend/UI":
        return "bg-amber-50/80 text-amber-700 border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/30";
      default:
        return "bg-slate-50/80 text-slate-700 border-slate-200/60 dark:bg-slate-900/40 dark:text-slate-300 dark:border-slate-800/30";
    }
  };

  // Styles based on confidence levels
  const getConfidenceStyles = (confidence: string) => {
    switch (confidence) {
      case "Total Feasible":
        return "bg-emerald-500/8 text-emerald-600 border-emerald-500/20 dark:text-emerald-400 dark:bg-emerald-500/10";
      case "Pretty Doable":
        return "bg-teal-500/8 text-teal-600 border-teal-500/20 dark:text-teal-400 dark:bg-teal-500/10";
      case "Tight but Ok":
        return "bg-yellow-500/8 text-yellow-600 border-yellow-500/20 dark:text-yellow-400 dark:bg-yellow-500/10";
      case "Might Stretch":
        return "bg-orange-500/8 text-orange-600 border-orange-500/20 dark:text-orange-400 dark:bg-orange-500/10";
      case "Very Risky":
        return "bg-red-500/8 text-red-600 border-red-500/20 dark:text-red-400 dark:bg-red-500/10";
      default:
        return "bg-slate-500/8 text-slate-600 border-slate-500/20 dark:text-slate-400 dark:bg-slate-500/10";
    }
  };

  // Icon for owner (first letter fallback avatar)
  const ownerInitial = idea.owner ? idea.owner.charAt(0).toUpperCase() : "?";

  const handleVote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasVoted || isVoting) return;
    setIsVoting(true);
    try {
      await onVote(idea.id);
    } catch (err) {
      console.error("Failed to submit vote:", err);
    } finally {
      setIsVoting(false);
    }
  };

  const votesCount = idea.votesCount || 0;

  return (
    <div className="group relative flex flex-col justify-between p-6 rounded-2xl border border-card-border bg-card-bg shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-accent-color/40 dark:hover:border-accent-color/30">
      <div>
        {/* Card Header: Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
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

        {/* Idea Name */}
        <h3 className="text-lg font-bold text-foreground tracking-tight mb-2 group-hover:text-accent-color transition-colors duration-150">
          {idea.name}
        </h3>

        {/* Owner Info */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-color/10 text-accent-color text-xs font-semibold">
            {ownerInitial}
          </div>
          <span className="text-sm font-medium text-muted-text">
            {idea.owner}
          </span>
        </div>

        {/* Problem Statement (Truncated) */}
        <div className="text-sm text-muted-text/90 mb-6 leading-relaxed line-clamp-2 min-h-[2.5rem]">
          {idea.problem}
        </div>
      </div>

      {/* Action Buttons: Details and Voting */}
      <div className="flex items-center gap-2 mt-auto">
        <button
          onClick={() => onViewDetails(idea)}
          className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg border border-card-border text-foreground bg-card-bg hover:bg-muted-text/5 active:bg-muted-text/10 transition-colors duration-150 shadow-xs cursor-pointer"
        >
          Details
        </button>
        <button
          onClick={handleVote}
          disabled={hasVoted || isVoting}
          className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg border transition-all duration-150 shadow-xs cursor-pointer ${
            hasVoted
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 cursor-not-allowed"
              : "bg-accent-color border-accent-color text-white hover:bg-accent-hover active:scale-98"
          }`}
        >
          {isVoting ? (
            <svg
              className="animate-spin h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : hasVoted ? (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Voted ({votesCount})
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 15l7-7 7 7"
                />
              </svg>
              Vote ({votesCount})
            </>
          )}
        </button>
      </div>
    </div>
  );
}
