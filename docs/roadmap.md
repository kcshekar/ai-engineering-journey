# Roadmap

## Now
- Active plan: [Roadmap content v2](plans/roadmap-content-v2.md). Phase 1, T1–T3 are done (optional types, a content check in `verify`, completion counted on core items).
- Next task: Phase 1, T4: the read-only `progress` check query. It is blocked until `.env.local` exists on this machine (you add it; never paste it into chat). Then come the Phase 1 exit checks.
- Still open (yours): rotate the login password that is in git history (`lib/auth.ts` and an old memory file).

## Next
- README is out of date: it refers to `webapp/` and `roadmaps/` paths and has a leftover "Resume this session" line.
- Add a first test so `verify` covers more than types (GAPS_AND_RISKS #14).
- Remove `components/*.bak` and `next.config.ts.bak`.

## Later
- Items in `GAPS_AND_RISKS.md` (auth, multi-user, monitoring, export).
