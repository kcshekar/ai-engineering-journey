# Roadmap

## Now
- Active plan: `docs/plans/next-16-upgrade.md` (draft, waiting for your go). Clears the last high `npm audit` finding.
- Yours to finish (outside the repo):
  - remove `AUTH_USER_EMAIL` and `AUTH_USER_PASSWORD_HASH` from your `.env` and from Vercel (nothing reads them now)
  - if Vercel uses a different Turso DB than your `.env`, run `npm run migrate` and `npm run set-password` against it
  - optional: purge `download`, `memory/project_learningtracker.md` and the deleted employer docs from git history (commands in the hand-off); the retired password in old commits must never be reused

## Next
- `npm audit` (2026-11-23): 8 left (1 high, 5 moderate, 2 low), none critical.
  - postcss inside Next.js (high): fixed by the Next 16 plan.
  - esbuild through drizzle-kit (moderate): dev tool only; affects `drizzle-kit studio` while it runs.
  - dompurify through monaco-editor (moderate): the editor loads its code from a CDN at runtime, so this copy is not what runs.
- API input checks: the POST routes trust the body (for example `/api/course-timeline` returns 500 on a missing `layerId`). Return 400 instead. Low risk (login required, single user).
- Lint warnings: 3 `react-hooks/exhaustive-deps` in `CoursePanel.tsx` and `LayerCard.tsx`; each changes when an effect re-runs, so fix them one at a time.

## Later
- Multi-user support, monitoring and data export (from the old gaps list, now deleted; git history has it).
- Ideas from the roadmap research, not built yet:
  - a spaced-repetition review queue (needs a DB table)
  - an MCP server over your notes and progress, so Claude Code can tutor from them
  - several career routes, and route orderings (GenAI-first vs fundamentals-first)
  - "mutant" wrong solutions that the challenge tests must catch
  - an AI tutor per topic, related roadmaps and an FAQ block
- A real topic tree (option 3 in decision 0001), only if the flat item list starts to hurt.
