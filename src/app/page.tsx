import React from "react";
import Link from "next/link";
import IdeasHub from "@/components/IdeasHub";
import { getIdeas } from "@/lib/supabase";

export const metadata = {
  title: "Ideas Hub | Internal Innovation Showcase",
  description: "Explore and discover innovation ideas submitted by the team.",
};

export default async function Home() {
  const ideas = await getIdeas();

  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden selection:bg-accent-color/20 selection:text-accent-color">
      {/* Background Glow / Aura (Linear Style) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none -z-10 opacity-70">
        <div className="absolute inset-0 bg-radial-[ellipse_80%_50%_at_50%_0%] from-accent-color/20 via-transparent to-transparent dark:from-accent-color/15" />
      </div>

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--card-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--card-border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 pointer-events-none -z-20" />

      {/* Header Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-card-border/80 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent-color text-white shadow-xs">
              {/* Logo icon */}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-linear-to-r from-foreground to-foreground/80 bg-clip-text">
              Ideas Hub
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-muted-text">
              <span>v1.0.0</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-500 font-medium">Live Dashboard</span>
            </div>
            <Link
              href="/submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-accent-color hover:bg-accent-hover text-white transition-colors duration-150 shadow-xs cursor-pointer"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Submit Idea
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10 sm:space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground sm:leading-none leading-10">
            Ideas Hub
          </h1>
          <p className="text-lg sm:text-xl text-muted-text font-medium leading-relaxed">
            Explore innovation ideas submitted by the team
          </p>
        </div>

        {/* Main interactive ideas workspace */}
        <IdeasHub initialIdeas={ideas} />
      </main>

      {/* Footer Section */}
      <footer className="w-full border-t border-card-border/80 bg-card-bg/20 py-8 text-center text-xs text-muted-text">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-medium">
            Ideas Hub &copy; {new Date().getFullYear()} &bull; Internal Innovation Platform
          </p>
          <p className="text-2xs text-muted-text/70">
            Next.js App &bull; TypeScript &bull; Tailwind CSS v4
          </p>
        </div>
      </footer>
    </div>
  );
}
