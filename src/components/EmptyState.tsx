import React from "react";

interface EmptyStateProps {
  onClearFilters: () => void;
}

export default function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-card-border bg-card-bg/30 backdrop-blur-xs transition-all">
      <div className="relative mb-6">
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-accent-color/10 blur-xl rounded-full" />
        
        {/* Modern empty search/filter SVG illustration */}
        <svg
          className="relative w-20 h-20 text-muted-text/60 dark:text-muted-text/40 animate-pulse"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      </div>

      <h3 className="text-lg font-semibold text-foreground tracking-tight mb-2">
        No ideas found
      </h3>
      <p className="text-sm text-muted-text max-w-sm mb-6 leading-relaxed">
        We couldn&apos;t find any innovation ideas matching your current search terms or selected category filters.
      </p>

      <button
        onClick={onClearFilters}
        className="px-4 py-2 text-sm font-medium text-white bg-accent-color hover:bg-accent-hover rounded-lg shadow-xs transition-colors duration-150 cursor-pointer"
      >
        Reset Filters
      </button>
    </div>
  );
}
