# AI Engineering Journey

A structured, layer-by-layer learning tracker for engineers transitioning into AI Engineering. Built as a local React app that reads from JSON roadmap files, so you can track progress, plan weekly study sessions, and add new roadmaps as your learning evolves.

## Why this exists

Most learning paths are static checklists. This one is different:

- **Layer-based progression** - Each layer builds on the last. No skipping. No tutorial-hopping.
- **Project-driven** - Every course ties back to something you're actually building (Cuva AI, NuraKnect AI).
- **Weekly cadence** - Each week has a focus, a build task, and daily Python practice.
- **Quiz gates** - You can't move forward without proving you understood the layer. Quizzes are taken in conversation with a mentor (Claude), not as multiple-choice busywork.
- **Generic structure** - Want to track a different roadmap? Add a folder. The app reads whatever is there.

## Quick Start

```bash
# Clone the repo
git clone https://github.com/kcshekar/ai-engineering-journey.git
cd ai-engineering-journey

# Install dependencies
cd webapp
npm install

# Start the app
npm run dev
```

The app opens at `http://localhost:3000` (login: `korpolechandrashekar@gmail.com` / `learning2024`).

## How it works

The tracker reads from JSON files in the `roadmaps/` folder:

| File | Purpose |
|------|---------|
| `meta.json` | Roadmap title, author, total layers, target role |
| `layers.json` | Courses, weekly plans, quiz questions per layer |
| `progress.json` | Your completion state - courses done, quiz scores |

Click a course to mark it complete. When all courses in a layer are done, the quiz unlocks. Take the quiz in your mentor chat, not in the app - this keeps it honest.

## Adding a new roadmap

1. Create a folder under `roadmaps/` with your roadmap id:
   ```
   roadmaps/
   └── your-roadmap-id/
       ├── meta.json
       ├── layers.json
       └── progress.json
   ```

2. Follow the same JSON structure as `ai-engineering/`. The key fields:
   - `meta.json`: `id`, `title`, `totalLayers`, `estimatedMonths`
   - `layers.json`: Array of layers, each with `courses`, `weeklyPlan`, `quiz`
   - `progress.json`: Initialize with empty `layerProgress` for each layer

The app is designed so any roadmap folder works - no hardcoded course names or layer counts.

## Project Structure

```
ai-engineering-journey/
├── README.md
├── MIGRATION_COMPLETE.md  # Architecture documentation
├── webapp/                # Next.js 15 app with database
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   ├── lib/              # Auth, DB, utilities
│   └── public/           # Static assets
├── roadmaps/             # Roadmap definitions (JSON)
│   └── ai-engineering/
│       ├── meta.json
│       ├── layers.json
│       └── (progress stored in Turso DB)
├── notes/                # Your learning notes per layer
│   └── layer-1/
└── exercises/            # Weekly practice exercises
    └── layer-1/
```

## Architecture

**Frontend:** Next.js 15 with Turbopack  
**Backend:** API routes with NextAuth v5  
**Database:** Turso (LibSQL) - cloud SQLite with local sync  
**Authentication:** Credentials-based (email/password)

## Learning Philosophy

1. **Understand before you build.** Watch the course. Take notes. Then code.
2. **Connect everything to your projects.** Abstract knowledge without application is forgettable.
3. **Python daily.** 20 minutes a day. You already know JavaScript - translate that knowledge.
4. **Quiz yourself honestly.** If you can't explain it to a junior dev, you don't know it yet.
5. **One layer at a time.** Depth over breadth. Three weeks per layer. No rushing.

## Current Roadmap: AI Engineering

**Goal:** From Senior Full-Stack MERN Engineer to Applied AI Engineer / AI Systems Architect

| Layer | Focus | Weeks |
|-------|-------|-------|
| 1 | AI Foundation - Neural nets, transformers, LLMs, prompts | 1-3 |
| 2 | RAG & Embeddings | 4-6 |
| 3 | AI Agents & Orchestration | 7-9 |
| 4 | Fine-tuning & Training | 10-12 |
| 5 | Evaluation & Testing | 13-15 |
| 6 | Production AI Systems | 16-18 |

## Features

- **Database persistence** - All progress, notes, and code saved to Turso
- **Activity tracking** - Streak graph and daily activity heatmap
- **Python practice** - Write and execute Python code in browser (via Pyodide)
- **Responsive UI** - Mobile-friendly with smooth animations
- **Type-safe** - Full TypeScript with Drizzle ORM

## Getting Started

See [MIGRATION_COMPLETE.md](./MIGRATION_COMPLETE.md) for detailed architecture, API documentation, and testing instructions.

## Author

**kcshekar** - Senior Full-Stack Engineer building Cuva AI and NuraKnect AI while transitioning into Applied AI Engineering.
