# AI Engineering Learning Tracker — Project Overview

**Live:** https://ai-engineering-journey.vercel.app/  
**GitHub:** https://github.com/kcshekar/ai-engineering-journey (public)  
**Status:** Active development & personal use  
**Author:** kcshekar (solo project)  
**Built:** 100% with AI assistance (Claude)

---

## Summary

The **AI Engineering Learning Tracker** is a structured, layer-based learning app designed to guide engineers transitioning from full-stack development into applied AI engineering. It combines a public learning roadmap (6 layers, ~9 months) with persistent progress tracking, daily activity metrics, Python code practice, and layer-based quizzes. Users progress through curated courses (YouTube, DeepLearning.AI) with weekly build tasks and daily Python practice, proving mastery through conversational quizzes before advancing layers.

**Current use:** Personal learning tool for the author's transition into AI engineering while building production AI projects (Cuva AI, NuraKnect AI).

---

## Problem Statement

**Problem:** Most learning paths for AI engineers are static checklists with no structure, no connection to real projects, and no way to prove understanding before moving forward.

**Solution:** A layer-by-layer tracker that:
- Gates progression (can't move to Layer 2 without completing Layer 1)
- Ties every course to real-world projects
- Enforces weekly cadence with daily Python practice (20 min/day)
- Requires quiz-based mastery (not multiple choice)
- Is extensible — add a new roadmap folder and the app reads it automatically

**Target users:** Senior engineers (MERN, backend, etc.) building AI projects who need structured, project-driven learning with deadlines.

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend Framework** | Next.js 15 (App Router) |
| **UI Library** | React 19 |
| **Language** | TypeScript (full type safety) |
| **Styling** | CSS Modules (globals.css) |
| **Animations** | Framer Motion |
| **Code Editor** | Monaco Editor (for Python practice) |
| **Icons** | Lucide React |
| **Backend** | Next.js API Routes (serverless) |
| **Authentication** | NextAuth v5 (credentials-based, hardcoded test user) |
| **Database** | Turso (LibSQL cloud SQLite) |
| **ORM** | Drizzle ORM (type-safe SQL) |
| **Deployment** | Vercel (with GitHub integration CI/CD) |
| **Python Execution** | Pyodide (WASM Python runtime, client-side) |

---

## Architecture Overview

### Data Model

**5 Database Tables (Turso):**

1. **progress** — Layer completion state, quiz scores, deadlines
   - Tracks: started, completed, courses done, quiz score, attempt count, dates
   - Keys: userId, roadmapId, layerId (multi-user ready, but currently single hardcoded user)

2. **activity** — Daily engagement metrics
   - Tracks: views, notes written, code runs, courses completed (daily)
   - Used for: streak graph, heatmap visualization

3. **courseMeta** — Course engagement stats
   - Tracks: views, last engaged time, notes written, code written, code runs
   - Per-user, per-course metadata

4. **notes** — Markdown notes content
   - User-generated study notes per course
   - Persisted markdown text with timestamps

5. **exercises** — Python code practice
   - User-written Python code per course
   - Executed client-side via Pyodide, saved to database

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/[...nextauth]` | POST | NextAuth authentication callback |
| `/api/activity` | GET/POST | Daily activity tracking |
| `/api/notes` | GET/POST | Save/retrieve course notes |
| `/api/code` | GET/POST | Save/retrieve Python practice code |
| `/api/layer-progress` | GET/POST | Mark courses/layers complete |
| `/api/course-meta` | GET/POST | Update course engagement stats |
| `/api/course-timeline` | POST | Store course start/end dates |

### Frontend Pages

| Route | Purpose |
|-------|---------|
| `/login` | Credentials form (hardcoded: korpolechandrashekar@gmail.com / learning2024) |
| `/` (dashboard) | Streak graph, activity heatmap, layer overview |
| `/layers` | All 6 layers with completion progress |
| `/layers/[id]` | Layer detail: courses, weekly plan, quiz gate, course panels |
| `/notes` | All notes per layer (read-only view) |
| `/projects` | Projects tied to learning (Cuva AI, NuraKnect AI) |

### Data Flow

```
User clicks course
  ↓
CoursePanel opens (modal)
  ↓
User writes notes / code / marks complete
  ↓
API route called (authenticated via NextAuth session)
  ↓
Data written to Turso via Drizzle ORM
  ↓
Page re-renders with updated state
  ↓
Streak graph & activity heatmap update
```

### Deployment Pipeline

```
Push to GitHub main branch
  ↓
Vercel webhook triggered (GitHub integration)
  ↓
Vercel builds & deploys (Next.js build)
  ↓
Live at https://ai-engineering-journey.vercel.app/
```

---

## Key Features

### 1. **Layer-Based Learning Structure**
- 6 layers total (AI Foundation → Production AI Systems)
- ~3 weeks per layer
- Gates progression: can't unlock Layer 2 quiz until all Layer 1 courses done
- Each layer tied to specific projects (Cuva AI, NuraKnect AI)

### 2. **Course Management**
- Curated courses (YouTube, DeepLearning.AI, free)
- Each course has: title, platform, duration, why it matters, video count
- Mark courses complete → triggers activity tracking
- Weekly focus with daily build tasks (e.g., "Make your first raw OpenAI API call")

### 3. **Python Code Practice**
- Monaco Editor with Python syntax highlighting
- Client-side execution via Pyodide (WASM)
- Output captured (stdout, stderr, exceptions)
- Code auto-saved to Turso database

### 4. **Activity Tracking & Visualization**
- Daily counters: views, notes written, code runs, courses completed
- Streak graph: days with activity (green boxes, GitHub-style heatmap)
- Persisted in `activity` table per user per date

### 5. **Course Engagement Metrics**
- Track notes written, code written, code execution count
- Last engaged timestamp
- Used to recommend next actions (e.g., "You haven't written code for this course yet")

### 6. **Quiz Gates**
- Unlocked when all courses in layer complete
- 5 questions per layer (explain, conceptual, practical, architectural)
- Designed to test understanding, not memorization
- Taken conversationally with mentor (Claude), not in-app

### 7. **Notes & Markdown**
- Write markdown notes per course
- Persisted to database
- Available in `/notes` page for review

### 8. **Responsive & Animated UI**
- Mobile-friendly layout
- Smooth animations via Framer Motion
- Modal panels for courses
- Real-time streak graph updates

---

## Challenges Solved

### 1. **Designing a Useful, Extensible Structure**
- **Challenge:** How to make this useful for others (different roles, different learning paths) while staying simple?
- **Solution:** 
  - JSON-based roadmap files (`meta.json`, `layers.json`)
  - App reads whatever roadmap folder exists
  - No hardcoded course names or layer counts
  - Anyone can fork, add `/roadmaps/their-role/`, and it works

### 2. **Client-Side Python Execution**
- **Challenge:** Users need to practice Python daily. Running Python server-side is expensive.
- **Solution:** 
  - Pyodide (WASM Python runtime)
  - Runs 100% client-side, no server calls
  - Instant feedback on code execution
  - Captures output, errors, exceptions

### 3. **Authentication Without a Separate Backend**
- **Challenge:** Can't build separate auth backend (costs, complexity).
- **Solution:** 
  - NextAuth v5 with credentials provider
  - Session stored as HttpOnly cookie
  - No separate server needed
  - Middleware protects routes automatically

### 4. **Cost-Effective Cloud Database**
- **Challenge:** PostgreSQL/MySQL hosting costs add up. Need something free/cheap.
- **Solution:** 
  - Turso (LibSQL cloud SQLite)
  - Free tier sufficient for personal use
  - No monthly bill
  - Easy schema management with Drizzle

### 5. **Built 100% with AI Assistance**
- **Challenge:** How to build a full-stack app while learning AI, without writing code manually?
- **Insight:** Used Claude (this AI) to generate 100% of the code as a proof-of-concept for AI-assisted development.
- **Outcome:** 
  - Full working app in 2-3 weeks
  - Learned AI workflow generation vs. traditional coding
  - Validated that AI can handle full-stack web dev
  - Demonstrated AI capability (not just chat)

---

## Current Impact & Metrics

| Metric | Value |
|--------|-------|
| **Live Users** | 1 (author) |
| **Roadmaps** | 1 (AI Engineering) |
| **Layers** | 6 |
| **Courses** | 4 in Layer 1, ~20+ total |
| **GitHub Visibility** | Public (no stars/forks yet) |
| **Business Model** | Free forever |
| **Revenue** | $0 (pre-revenue) |
| **Daily Active Users** | 1 |
| **Deployment** | Vercel (live) |

---

## Current Status

**Active Development & Personal Use**

- Using the app daily for AI learning journey
- Currently in Layer 1 (AI Foundation)
- Adding courses to roadmap as learning progresses
- Pushing progress to GitHub regularly
- No public marketing or sharing yet

---

## Codebase Quality

- **Language:** 100% TypeScript
- **Code Generation:** 100% AI-assisted (Claude)
- **Manual Code Written:** 0 lines
- **Architecture:** Next.js 15 best practices, API routes, middleware
- **Database:** Type-safe Drizzle ORM
- **State Management:** React hooks + API client
- **Error Handling:** Basic (hardcoded user, simple auth flow)

---

## Timeline

| Date | Event |
|------|-------|
| Apr 18, 2025 | Project started (JSON-based Vite app) |
| Apr 29, 2026 | Migrated to Next.js 15 + Turso |
| Apr 29, 2026 | Added favicon |
| Apr 30, 2026 | Added NextAuth, page-level redirects |
| May 2026 | Currently using for Layer 1 learning |

---

## Author Info

**Name:** kcshekar  
**Email:** korpolechandrashekar@gmail.com  
**Role:** Senior Full-Stack MERN Engineer → Applied AI Engineer  
**Current Work:** Building Cuva AI and NuraKnect AI while transitioning into AI engineering  
**Learning:** Layer-by-layer AI fundamentals, RAG, agents, fine-tuning, evals, production systems

