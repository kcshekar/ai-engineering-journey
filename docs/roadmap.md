# Roadmap

## Now
- Focus: nothing in progress on `main` (2026-11-25). Next 16, API input checks and clean lint are done; verify, build and browser checks are green.
- Next step: review the draft plan `docs/plans/ux-course-upgrade.md` on local branch `feat/ux-course-research` (UX redesign, 2026 curriculum, Layer 7; decision 0002 proposed). Its P1 needed Next 16, now on `main`, so rebase the branch onto `main` first.
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
