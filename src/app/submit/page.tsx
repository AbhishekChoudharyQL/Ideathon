"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createIdea } from "@/lib/supabase";
import { Category, Confidence } from "@/types/idea";

export default function SubmitIdea() {
  const router = useRouter();
  
  // Form state
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [confidence, setConfidence] = useState<Confidence | "">("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Simple Validation
    if (!name.trim()) return setError("Idea Name is required.");
    if (!owner.trim()) return setError("Owner Name is required.");
    if (!category) return setError("Category is required.");
    if (!confidence) return setError("Confidence level is required.");
    if (!problem.trim()) return setError("Problem statement is required.");
    if (!solution.trim()) return setError("Proposed solution is required.");

    setLoading(true);

    try {
      const result = await createIdea({
        name: name.trim(),
        owner: owner.trim(),
        category: category as Category,
        confidence: confidence as Confidence,
        problem: problem.trim(),
        solution: solution.trim(),
      });

      if (result) {
        setSuccess(true);
        // Brief delay for success message animation, then redirect
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1500);
      } else {
        setError("Failed to submit the idea. Please try again.");
        setLoading(false);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred. Please check your Supabase connection.");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground selection:bg-accent-color/20 selection:text-accent-color">
      {/* Background glow styling */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[400px] pointer-events-none -z-10 opacity-70">
        <div className="absolute inset-0 bg-radial-[ellipse_80%_50%_at_50%_0%] from-accent-color/15 via-transparent to-transparent dark:from-accent-color/10" />
      </div>

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--card-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--card-border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 pointer-events-none -z-20" />

      {/* Header bar */}
      <header className="w-full border-b border-card-border/80 bg-background/80 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1 text-sm font-semibold text-muted-text hover:text-foreground transition-colors duration-150 cursor-pointer"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Hub
          </button>
          <span className="font-extrabold text-sm tracking-tight text-muted-text">
            Submit Innovation
          </span>
        </div>
      </header>

      {/* Main Submission Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-10 sm:py-14 space-y-8">
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Submit an Idea
          </h1>
          <p className="text-sm sm:text-base text-muted-text leading-relaxed">
            Have a proposal for an innovation or optimization? Share it with the team to start gathering feedback and votes.
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="p-6 sm:p-8 rounded-2xl border border-card-border bg-card-bg shadow-md space-y-6"
        >
          {/* Status Messages */}
          {error && (
            <div className="p-4 rounded-xl border border-red-500/10 bg-red-500/5 text-sm font-medium text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5 text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <svg
                className="w-5 h-5 animate-bounce"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Idea submitted successfully! Redirecting to dashboard...
            </div>
          )}

          {/* Row 1: Idea Name & Owner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label htmlFor="ideaName" className="block text-sm font-semibold text-foreground">
                Idea Name <span className="text-red-500">*</span>
              </label>
              <input
                id="ideaName"
                type="text"
                disabled={loading || success}
                placeholder="e.g. JerryAI"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full px-4 py-2.5 rounded-xl border border-card-border bg-background text-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-accent-color/50 focus:border-accent-color transition-all duration-150"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="ownerName" className="block text-sm font-semibold text-foreground">
                Submitted By (Name) <span className="text-red-500">*</span>
              </label>
              <input
                id="ownerName"
                type="text"
                disabled={loading || success}
                placeholder="e.g. Aryan Singhal"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="block w-full px-4 py-2.5 rounded-xl border border-card-border bg-background text-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-accent-color/50 focus:border-accent-color transition-all duration-150"
              />
            </div>
          </div>

          {/* Row 2: Category & Confidence */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-semibold text-foreground">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                disabled={loading || success}
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="block w-full px-4 py-2.5 rounded-xl border border-card-border bg-background text-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-accent-color/50 focus:border-accent-color transition-all duration-150 cursor-pointer"
              >
                <option value="" disabled>Select Category</option>
                <option value="AI/LLMs">AI / LLMs</option>
                <option value="Mobile">Mobile</option>
                <option value="Frontend/UI">Frontend / UI</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="confidence" className="block text-sm font-semibold text-foreground">
                Execution Confidence <span className="text-red-500">*</span>
              </label>
              <select
                id="confidence"
                disabled={loading || success}
                value={confidence}
                onChange={(e) => setConfidence(e.target.value as Confidence)}
                className="block w-full px-4 py-2.5 rounded-xl border border-card-border bg-background text-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-accent-color/50 focus:border-accent-color transition-all duration-150 cursor-pointer"
              >
                <option value="" disabled>Select Confidence</option>
                <option value="Total Feasible">Total Feasible</option>
                <option value="Pretty Doable">Pretty Doable</option>
                <option value="Tight but Ok">Tight but Ok</option>
                <option value="Might Stretch">Might Stretch</option>
                <option value="Very Risky">Very Risky</option>
              </select>
            </div>
          </div>

          {/* Problem Statement */}
          <div className="space-y-2">
            <label htmlFor="problem" className="block text-sm font-semibold text-foreground">
              What is the problem? <span className="text-red-500">*</span>
            </label>
            <textarea
              id="problem"
              rows={4}
              disabled={loading || success}
              placeholder="Describe the issue, inefficiency, or challenge that you are trying to solve..."
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              className="block w-full px-4 py-3 rounded-xl border border-card-border bg-background text-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-accent-color/50 focus:border-accent-color transition-all duration-150 resize-y"
            />
          </div>

          {/* Proposed Solution */}
          <div className="space-y-2">
            <label htmlFor="solution" className="block text-sm font-semibold text-foreground">
              What is your proposed solution? <span className="text-red-500">*</span>
            </label>
            <textarea
              id="solution"
              rows={4}
              disabled={loading || success}
              placeholder="Describe your design, library, system, or features that will resolve this problem..."
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              className="block w-full px-4 py-3 rounded-xl border border-card-border bg-background text-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-accent-color/50 focus:border-accent-color transition-all duration-150 resize-y"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-card-border">
            <button
              type="button"
              disabled={loading || success}
              onClick={() => router.push("/")}
              className="px-5 py-2.5 rounded-xl border border-card-border text-sm font-semibold text-foreground hover:bg-muted-text/5 transition-colors duration-150 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="px-5 py-2.5 rounded-xl bg-accent-color hover:bg-accent-hover disabled:opacity-50 text-sm font-semibold text-white transition-colors duration-150 shadow-xs cursor-pointer flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
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
                  Submitting...
                </>
              ) : (
                "Submit Idea"
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
