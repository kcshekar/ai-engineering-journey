# Roadmap

## Now
- Done 2026-11-23: Next.js 16 upgrade; API input checks (400 on bad input, known fields only); lint is clean with the React Compiler rules back to error. No active plan.
- Yours to finish (outside the repo):
  - remove `AUTH_USER_EMAIL` and `AUTH_USER_PASSWORD_HASH` from your `.env` and from Vercel (nothing reads them now)
  - if Vercel uses a different Turso DB than your `.env`, run `npm run migrate` and `npm run set-password` against it
  - optional: purge `download`, `memory/project_learningtracker.md` and the deleted employer docs from git history (commands in the hand-off); the retired password in old commits must never be reused

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
