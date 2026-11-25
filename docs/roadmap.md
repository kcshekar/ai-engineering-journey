# Roadmap

## Now
- Active plan: `docs/plans/ux-course-upgrade.md` (approved 2026-11-25; decision 0002 accepted), P0 and P1 merged (PR #1); P2 on branch `feat/ux-course-p2`. Tracker: `docs/research/tracker.md`.
- Done: P1 safety and accessibility fixes (verify and build green). Yours: the offline check for notes in your browser (steps in the plan's P1 exit).
- Done: P2 (content) on `feat/ux-course-p2`. Yours: push it and open the PR.
- Done: P3 T1 design tokens, `next/font`, AA text tokens, on `feat/ux-course-p3` (stacked on P2). Yours: log in and glance at the dashboard and a layer page in both themes.
- Done: P3 T2 motion rules, stage tokens and 7 components (`components/ui/`).
- Next task: P3 T3, DS-07 identity touches and DS-08 Monaco theme and Pyodide spinner.
- Yours: remove `AUTH_USER_EMAIL` and `AUTH_USER_PASSWORD_HASH` from `.env` if they are still there (Vercel never had them; it uses the same Turso DB, so it already has the `users` table).
- Optional: purge `download`, `memory/project_learningtracker.md` and the deleted employer docs from git history. The retired password in old commits must never be reused.

## Next
- `npm audit` (2026-11-23, on Next 16): 6 left (4 moderate, 2 low), no high or critical.
  - esbuild through drizzle-kit (moderate): dev tool only; affects `drizzle-kit studio` while it runs.
  - dompurify through monaco-editor (moderate): the editor loads its code from a CDN at runtime, so this copy is not what runs.

## Later
- Multi-user support, monitoring and data export (from the old gaps list, now deleted; git history has it).
- Ideas from the roadmap research, not built yet:
  - a spaced-repetition review queue (needs a DB table)
  - an MCP server over your notes and progress, so Claude Code can tutor from them
  - several career routes, and route orderings (GenAI-first vs fundamentals-first)
  - "mutant" wrong solutions that the challenge tests must catch
  - an AI tutor per topic, related roadmaps and an FAQ block
- A real topic tree (option 3 in decision 0001), only if the flat item list starts to hurt.
