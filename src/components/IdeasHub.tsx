"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Idea, Category } from "@/types/idea";
import { voteIdea, getVotedIdeaIds } from "@/lib/supabase";
import IdeaCard from "./IdeaCard";
import IdeaModal from "./IdeaModal";
import EmptyState from "./EmptyState";

interface IdeasHubProps {
  initialIdeas: Idea[];
}

export default function IdeasHub({ initialIdeas }: IdeasHubProps) {
  // Stateful ideas to allow instant local upvote increment
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
  
  // Voting client states
  const [voterId, setVoterId] = useState<string>("");
  const [votedIdeaIds, setVotedIdeaIds] = useState<string[]>([]);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);

  // Synchronize state when initialIdeas changes (e.g., after router refresh)
  useEffect(() => {
    setIdeas(initialIdeas);
  }, [initialIdeas]);

  // Load or generate voter ID and fetch previously voted records
  useEffect(() => {
    if (typeof window !== "undefined") {
      let id = localStorage.getItem("ideas_hub_voter_id");
      if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem("ideas_hub_voter_id", id);
      }
      setVoterId(id);

      // Fetch what this browser has already voted for
      const fetchVotes = async () => {
        try {
          const votedIds = await getVotedIdeaIds(id!);
          setVotedIdeaIds(votedIds);
        } catch (err) {
          console.error("Failed to load voted idea IDs on mount:", err);
        }
      };
      fetchVotes();
    }
  }, []);

  // Compute category list and dynamic counts from stateful ideas
  const categories: (Category | "All")[] = ["All", "AI/LLMs", "Mobile", "Frontend/UI"];

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: ideas.length,
      "AI/LLMs": 0,
      Mobile: 0,
      "Frontend/UI": 0,
    };

    ideas.forEach((idea) => {
      if (counts[idea.category] !== undefined) {
        counts[idea.category]++;
      }
    });

    return counts;
  }, [ideas]);

  // Filter ideas based on search query and category
  const filteredIdeas = useMemo(() => {
    return ideas.filter((idea) => {
      // Category match
      const matchesCategory =
        selectedCategory === "All" || idea.category === selectedCategory;

      // Search match (idea name or owner name)
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        idea.name.toLowerCase().includes(query) ||
        idea.owner.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory, ideas]);

  // Handle voting with Optimistic UI updates
  const handleVote = async (ideaId: string) => {
    if (!voterId) return;

    // Optimistically update states for sub-second visual responses
    setIdeas((prevIdeas) =>
      prevIdeas.map((idea) => {
        if (idea.id === ideaId) {
          return {
            ...idea,
            votesCount: (idea.votesCount || 0) + 1,
          };
        }
        return idea;
      })
    );
    setVotedIdeaIds((prev) => [...prev, ideaId]);

    try {
      const success = await voteIdea(ideaId, voterId);
      if (!success) {
        // Rollback optimistic update if the vote was rejected (e.g. duplicate vote)
        rollbackVote(ideaId);
      }
    } catch (err) {
      console.error("Failed to submit vote to API, rolling back UI:", err);
      rollbackVote(ideaId);
    }
  };

  const rollbackVote = (ideaId: string) => {
    setIdeas((prevIdeas) =>
      prevIdeas.map((idea) => {
        if (idea.id === ideaId) {
          return {
            ...idea,
            votesCount: Math.max(0, (idea.votesCount || 0) - 1),
          };
        }
        return idea;
      })
    );
    setVotedIdeaIds((prev) => prev.filter((id) => id !== ideaId));
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
  };

  // Find updated selectedIdea details in case votes count changed while modal is open
  const modalIdea = selectedIdea ? ideas.find((i) => i.id === selectedIdea.id) || selectedIdea : null;

  return (
    <div className="w-full space-y-8 animate-fade-in">
      {/* Search and Category Filter Section */}
      <div className="flex flex-col gap-6 p-6 rounded-2xl border border-card-border bg-card-bg/50 backdrop-blur-md shadow-xs">
        {/* Search Input */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-muted-text/80"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by idea name or owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-10 py-3 rounded-xl border border-card-border bg-card-bg text-foreground placeholder-muted-text/70 focus:outline-hidden focus:ring-2 focus:ring-accent-color/50 focus:border-accent-color transition-all duration-150 text-sm sm:text-base"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-text hover:text-foreground cursor-pointer"
              aria-label="Clear search"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-muted-text uppercase tracking-wider">
            Filter by Category
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              const count = categoryCounts[category] || 0;

              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-accent-color border-accent-color text-white shadow-xs"
                      : "bg-card-bg border-card-border text-foreground hover:bg-muted-text/5 hover:border-muted-text/25"
                  }`}
                >
                  <span>{category}</span>
                  <span
                    className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-2xs font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-muted-text/10 text-muted-text"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ideas Grid Section */}
      {filteredIdeas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIdeas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              hasVoted={votedIdeaIds.includes(idea.id)}
              onVote={handleVote}
              onViewDetails={setSelectedIdea}
            />
          ))}
        </div>
      ) : (
        <EmptyState onClearFilters={handleClearFilters} />
      )}

      {/* Details Modal */}
      <IdeaModal
        idea={modalIdea}
        onClose={() => setSelectedIdea(null)}
      />
    </div>
  );
}
