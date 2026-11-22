---
status: proposed (waiting for the owner to pick items)
size: S
---

# Repo cleanup

Audit of tracked files on 2026-11-22. Nothing is removed until you choose. "Safe" means no code reads it.

## A. Remove (recommended)
- [ ] `public/e2e-test.html`: an old manual test page that calls `/api/activity`. Anything in `public/` is served on the live site.
- [ ] `memory/project_learningtracker.md`: the old memory file that holds the retired password. Remove it, and optionally purge it from history with the same `filter-branch` command used for `download`.
- [ ] `components/DashboardClient.tsx.bak`, `components/LayerDetailClient.tsx.bak`, `next.config.ts.bak`: old copies, never imported.
- [ ] `activity.json`, `course-meta.json` (repo root) and `data/roadmaps/ai-engineering/progress.json`: data from the pre-Turso JSON version (last touched in April). No code reads them; Turso holds this data now.
- [ ] `.claude/skills/ui-ux-pro-max/scripts/__pycache__/*.pyc`: Python bytecode committed by accident. Add `__pycache__/` to `.gitignore`.
- [ ] `dotenv` dependency: nothing imports it any more (`drizzle.config.ts` now uses `@next/env`).
- [ ] `db:push` script: the same command as `migrate`.

## B. Decide (judgment calls)
- [ ] Employer names in a public repo. `PROJECT_OVERVIEW.md` (4 mentions), `PUBLIC_STORY.md` (2), `GAPS_AND_RISKS.md` (1), and the layer 1–2 content (layer.json, README, notes: about 30 mentions) name your employer. The GitHub repo is public. Options: replace them with a neutral phrase ("my day job", "an enterprise AI platform"), or keep them if you have cleared it.
- [ ] `MIGRATION_COMPLETE.md` (April): describes the Vite → Next.js migration. Keep it as history, or fold the still-true API notes into the README and delete it.
- [ ] `PROJECT_OVERVIEW.md` and `PUBLIC_STORY.md`: positioning and LinkedIn copy. Useful to you, but not to the app. Keep them, or move them out of the public repo.
- [ ] `GAPS_AND_RISKS.md` (368 lines, Nov 12): partly out of date after content v2, the tests and the DB login. Trim it to the items still open, or merge them into `docs/roadmap.md`.
- [ ] `.claude/skills/ui-ux-pro-max/` (about 3,900 lines of CSV and Python), `.agents/skills/frontend-design` and `skills-lock.json`: vendored Claude skills. Keep them if you want them per repo; drop them if you have them installed globally.
- [ ] Unused JSON fields: item `status` and `quiz.status` in every `layer.json`, and `meta.author` and `meta.estimatedMonths`. No code reads them. Removing them makes the content smaller but touches every layer file.
- [ ] The `exercises` table name: it stores the Python Practice code (`/api/code`). It's only the name that's odd; renaming needs a migration, so it's probably not worth it.

## C. Keep (checked, still used)
- `lib/notes-data.ts`, `MarkdownView`, `react-markdown`, `remark-gfm`: the Notes pages.
- `RoadmapSelector`, `StreakGraph`, `WeeklyPlan`: the dashboard and layer pages.
- `/api/course-metas`, `/api/course-timeline`: used by `lib/api-client.ts`.
- `getLayerDuration` and `getCourseSuggestedDates`: used inside `lib/loader.ts`.
- `CLAUDE.md` (one line pointing at `AGENTS.md`).
