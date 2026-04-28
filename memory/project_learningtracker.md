---
name: project_learningtracker
description: AI Engineering Learning Tracker — architecture, stack, and migration status
type: project
---

# AI Engineering Learning Tracker

## Current state (Apr 2026)
- **Old app:** `tracker/` — Vite + React SPA, localStorage-less, Vite middleware for local API, GitHub Pages deployment, Git as sync mechanism
- **New app (in progress):** `webapp/` — Next.js 15 App Router, Turso (LibSQL) DB, NextAuth v5 auth

## New stack (`webapp/`)
- **Framework:** Next.js 15 (App Router, Turbopack)
- **DB:** Turso (cloud SQLite) via Drizzle ORM
- **Auth:** NextAuth v5 (credentials provider, hardcoded user kcshekar for now)
- **Deploy target:** Vercel (already deployed for old app)

## DB tables (Turso)
- `progress` — layer progress per user/roadmap/layer
- `activity` — daily activity counters
- `course_meta` — per-course engagement stats
- `notes` — markdown notes per user/layer/course
- `exercises` — Python exercise code per user/layer/course

## Auth
- Default login: korpolechandrashekar@gmail.com / learning2024
- Architecture ready for multi-user (swap hardcoded USERS array with DB lookup)
- **Why:** Multi-user planned but not yet needed

## Routes
- `/` — dashboard (server fetch + DashboardClient)
- `/layers` — all layers overview
- `/layers/[id]` — layer detail (LayerDetailClient)
- `/notes` — notes overview (links to GitHub)
- `/projects` — projects overview
- `/login` — credentials login page

## Migration status
- New app is in `webapp/` folder alongside old `tracker/` app
- `webapp/` is NOT yet deployed to Vercel — needs VITE app replaced
- To deploy: in Vercel project settings change Root Directory from `tracker` to `webapp`
- Old app stays in `tracker/` until user verifies new app works

## Important notes
- Token in .env.local was shared publicly in chat — should be regenerated from Turso console
- Notes/exercises now stored in DB (not filesystem) — works in both dev and production
- Overflow fixes applied: streak graph scroll, week chips wrap, panel header wrap, course meta wrap
