# AI Engineering Journey

A structured, layer-by-layer learning tracker for engineers transitioning into AI Engineering. Built as a Next.js app that reads roadmaps from JSON files and stores your progress in Turso, so you can track progress, plan weekly study sessions, and add new roadmaps as your learning evolves.

## Why this exists

Most learning paths are static checklists. This one is different:

- **Layer-based progression** - Each layer builds on the last. No skipping. No tutorial-hopping.
- **Project-driven** - Every course ties back to something you're actually building (NuraKnect AI).
- **Weekly cadence** - Each week has a focus, a build task, and daily Python practice.
- **Quiz gates** - Each layer ends with mentor-chat questions you answer in conversation with Claude, plus a short auto-scored check (pre, mid-layer and final) that explains every answer.
- **Core vs optional** - Only core items count toward finishing a layer. "Pick one" groups count once, and optional extras never block you.
- **Generic structure** - Want to track a different roadmap? Add a folder. The app reads whatever is there.

## Quick Start

```bash
# Clone the repo
git clone https://github.com/kcshekar/ai-engineering-journey.git
cd ai-engineering-journey

# Install dependencies
npm ci

# Start the app
npm run dev
```

The app opens at `http://localhost:3000`.
Note: currently single-user. Copy `.env.example` to `.env` and fill in `DATABASE_URL`, `DATABASE_AUTH_TOKEN` and `AUTH_SECRET`, run `npm run migrate`, then `npm run set-password` to create your login (stored as a scrypt hash in the `users` table). Never commit `.env`. Run `npm run verify` before committing: it type-checks, validates the roadmap JSON and runs the tests.

## How it works

Each roadmap lives in `data/roadmaps/<id>/`:

| File | Purpose |
|------|---------|
| `meta.json` | Roadmap title, author, total layers, target role |
| `layer-N/layer.json` | The layer's items (courses, videos, docs, repos, projects), Must-know terms, stage goals, outcomes and quiz |
| `layer-N/planning.json` | The weekly plan: focus, items, build task and Python task per week |
| `layer-N/notes.md`, `README.md` | Note prompts and a summary for the layer |

Progress, notes, code and quiz scores are stored in Turso, keyed by item id. Never rename or remove an item id.

The layer page groups items into Beginner, Intermediate and Advanced sections, shows "pick one" groups as a single card, folds optional extras away, and lists the projects with the evidence to keep. Tick an item to mark it done. When every core item is done, the final quiz check unlocks and a "You can now…" panel appears. Python challenges have a **Check** button that runs your code against the challenge's tests in the browser (Pyodide).

## Adding a new roadmap or layer

1. Create `data/roadmaps/<your-roadmap-id>/meta.json` and one `layer-N/` folder per layer, following `ai-engineering/`.
2. Item fields are typed in `types/index.ts`. The extra fields (`kind`, `price`, `hours`, `track`, `stage`, `pickGroup`, `prereqs`, `skills`, `keep`, `pythonChallenge.tests`/`hints`, and quiz `options`/`correct`/`explanation`/`stage`) are all optional. See `docs/decisions/0001-content-model.md`.
3. Run `npm run verify`. `scripts/check-content.mjs` checks ids, references, enums, pick groups, planning weeks and quiz answers (including answer-position and answer-length bias).

## Project Structure

```
ai-engineering-journey/
├── app/                   # Next.js App Router: (app) pages, (auth) login, api routes
├── components/            # Client components (layer page, course panel, quiz, dashboard)
├── lib/                   # Auth, Drizzle DB client and schema, roadmap loader
├── types/                 # Shared TypeScript types (content model)
├── scripts/               # check-content.mjs (roadmap JSON validator)
├── data/roadmaps/         # Roadmap content (JSON + markdown)
│   └── ai-engineering/
│       ├── meta.json
│       └── layer-1 … layer-6/
└── docs/                  # Roadmap, plans and decision records
```

## Architecture

**Frontend:** Next.js 15 with Turbopack  
**Backend:** API routes with NextAuth v5  
**Database:** Turso (LibSQL) - cloud SQLite with local sync  
**Authentication:** NextAuth credentials; accounts and scrypt password hashes live in the `users` table

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
| 1 | AI Foundation: neural nets, transformers, tokens, context engineering, choosing a model | 1-3 |
| 2 | Applied LLMs: RAG, embeddings, hybrid search, rerankers, vector DBs, RAGAS | 4-6 |
| 3 | Agents & Orchestration: tool calling, ReAct, memory, MCP, agent SDKs, multi-agent | 7-10 |
| 4 | Fine-tuning & Training: datasets, LoRA/QLoRA, distillation, quantization, DPO | 11-14 |
| 5 | Evaluation & Safety: golden sets, LLM-as-judge, agent eval, observability, prompt injection | 15-18 |
| 6 | Production AI Systems: serving, caching, routing, cost and latency, interview prep | 19-22 |

Every layer has 3 projects (one per stage), Python challenges with automatic checks, and a quiz. Sources include AI Engineering from Scratch (MIT), official docs and DeepLearning.AI short courses.

## Features

- **Database persistence** - All progress, notes, and code saved to Turso
- **Activity tracking** - Streak graph and daily activity heatmap
- **Python practice** - Write and run Python in the browser (Pyodide), and check challenge solutions against their tests
- **Auto-scored checks** - Pre-check (with "skip ahead"), mid-layer check and a final check saved to your progress
- **Hours and prerequisites** - Core and optional hours per item, stage and layer, with soft "needs first" hints
- **Responsive UI** - Mobile-friendly with smooth animations
- **Type-safe** - Full TypeScript with Drizzle ORM

## Getting Started

See [MIGRATION_COMPLETE.md](./MIGRATION_COMPLETE.md) for architecture and API notes, and [AGENTS.md](./AGENTS.md) for commands and repo rules.

## Author

**kcshekar** - Senior Full-Stack Engineer transitioning into Applied AI Engineering. Currently building NuraKnectAI.
