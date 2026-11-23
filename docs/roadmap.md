# Roadmap

## Now
- Roadmap content v2 is done (decision 0001, accepted). All 6 layers use the new shape.
- Login now lives in the `users` table (2026-11-22). Yours to finish:
  - run `npm run set-password` before you log out (the table is empty until you do), using the id `kcshekar` default
  - then remove `AUTH_USER_EMAIL` and `AUTH_USER_PASSWORD_HASH` from your env file and from Vercel
  - if Vercel uses a different Turso DB than your `.env`, run `npm run migrate` and `npm run set-password` against that one too
  - the old plaintext password is still in git history; it is retired, so never reuse it
- Repo cleanup is done (2026-11-23; the plan is deleted, git keeps it). Optional: purge `memory/project_learningtracker.md` from git history like `download`.
- Remove the stray `download` file from git history (commands in the hand-off; it is now in `.gitignore`).

## Next
- `npm audit` (2026-11-22, after fixes): 8 left (1 high, 5 moderate, 2 low), none critical.
  - postcss inside Next.js (high): needs Next 16, a major upgrade. Low risk here because postcss only processes our own CSS at build time. Plan the Next 16 upgrade separately.
  - esbuild through drizzle-kit (moderate): dev tool only; affects `drizzle-kit studio` while it runs.
  - dompurify through monaco-editor (moderate): the editor loads its code from a CDN at runtime, so this copy is not what runs.
- Add lint.

## Later
- Multi-user support, monitoring and data export (from the old gaps list, now deleted; git history has it).
- Ideas from the roadmap research, not built yet:
  - a spaced-repetition review queue (needs a DB table)
  - an MCP server over your notes and progress, so Claude Code can tutor from them
  - several career routes, and route orderings (GenAI-first vs fundamentals-first)
  - "mutant" wrong solutions that the challenge tests must catch
  - an AI tutor per topic, related roadmaps and an FAQ block
- A real topic tree (option 3 in decision 0001), only if the flat item list starts to hurt.
