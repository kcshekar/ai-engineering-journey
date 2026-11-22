# Roadmap

## Now
- Roadmap content v2 is done (decision 0001, accepted). All 6 layers use the new shape.
- Login moved to env vars (`AUTH_USER_EMAIL`, `AUTH_USER_PASSWORD_HASH`, made with `npm run hash-password`). Yours to finish:
  - set a NEW password and put both vars in `.env.local` and in Vercel before the next deploy, or login fails
  - the old plaintext password is still in git history; it is retired, so never reuse it
- Remove the stray `download` file from git history (commands in the hand-off; it is now in `.gitignore`).

## Next
- `npm audit` (2026-11-22, after fixes): 8 left (1 high, 5 moderate, 2 low), none critical.
  - postcss inside Next.js (high): needs Next 16, a major upgrade. Low risk here because postcss only processes our own CSS at build time. Plan the Next 16 upgrade separately.
  - esbuild through drizzle-kit (moderate): dev tool only; affects `drizzle-kit studio` while it runs.
  - dompurify through monaco-editor (moderate): the editor loads its code from a CDN at runtime, so this copy is not what runs.
- Remove `components/*.bak` and `next.config.ts.bak`.
- Add lint.

## Later
- Items in `GAPS_AND_RISKS.md` (auth, multi-user, monitoring, export).
- Ideas from the roadmap research, not built yet:
  - a spaced-repetition review queue (needs a DB table)
  - an MCP server over your notes and progress, so Claude Code can tutor from them
  - several career routes, and route orderings (GenAI-first vs fundamentals-first)
  - "mutant" wrong solutions that the challenge tests must catch
  - an AI tutor per topic, related roadmaps and an FAQ block
- A real topic tree (option 3 in decision 0001), only if the flat item list starts to hurt.
