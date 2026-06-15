# Ideas Hub 💡

A premium, production-ready internal innovation showcase web application built with **Next.js 15 (App Router)**, **TypeScript**, and **Tailwind CSS v4**.

Ideas Hub provides a centralized portal for displaying and filtering employee-submitted innovation ideas, featuring a clean, responsive aesthetic inspired by modern interfaces like Linear and Notion.

## Features

- 📱 **Fully Responsive Layout**: Mobile-first, fluid responsive grids for tablet and desktop display.
- 🔍 **Instant Search**: Real-time client-side search filtering by idea name or owner.
- 🏷️ **Dynamic Category Tabs**: Filter ideas by category (`AI/LLMs`, `Mobile`, `Frontend/UI`) with dynamic item counters (e.g., `AI/LLMs (5)`).
- 📊 **Dynamic Badges**: Curated and custom badges representing categories and project confidence (from `Total Feasible` to `Very Risky`).
- 💬 **Details Modal Overlay**: Clicking an idea cards displays a rich detailed popup showcasing the specific problem statement and the proposed solution.
- 🌓 **Dark Mode Support**: Seamless out-of-the-box system preference theme switching.
- 📭 **Empty State**: Beautiful SVG empty states when filters do not match any records.
- ⚡ **Zero External Packages**: Fully optimized codebase utilizing only core React, Next.js, and Tailwind CSS.
- 🛡️ **Strict Type-Safety**: 100% type coverage for data schemas and components.

---

## File Structure

```text
IdeaThon/
├── data/
│   └── ideas.json             # Innovation ideas database
├── src/
│   ├── app/
│   │   ├── globals.css        # Global CSS variables, themes, & animations
│   │   ├── layout.tsx         # Main HTML layout, fonts, & metadata
│   │   └── page.tsx           # Home page server entrypoint
│   ├── components/
│   │   ├── EmptyState.tsx     # Empty state display component
│   │   ├── IdeaCard.tsx       # Single idea display card
│   │   ├── IdeaModal.tsx      # Full detail description modal
│   │   └── IdeasHub.tsx       # Core filter and search coordinator
│   └── types/
│       └── idea.ts            # Core TypeScript model interfaces
├── package.json               # Dependencies and build scripts
├── tsconfig.json              # Strict TypeScript compiler options
└── tailwind.config.ts         # Tailwind integration options
```

---

## Getting Started

### Prerequisites

You will need **Node.js 18.17.0** or later.

### Installation

Install the dependencies:

```bash
npm install
```

### Run the Development Server

Start the local server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Build for Production

Compile and run the production checks:

```bash
npm run build
```

Start the production-built server locally:

```bash
npm run start
```
