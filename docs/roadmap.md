# Roadmap

## Now
- Active plan: [Roadmap content v2](plans/roadmap-content-v2.md). Phase 1, T1 and T2 are done (optional types, plus a content check in `verify`).
- Next task: Phase 1, T3: completion counts core items only. First take T4's "before" snapshot of `progress` (read-only), so there is something to compare against after T3.
- Still open (yours): rotate the login password that is in git history (`lib/auth.ts` and an old memory file).

## Next
- README is out of date: it refers to `webapp/` and `roadmaps/` paths and has a leftover "Resume this session" line.
- Add a first test so `verify` covers more than types (GAPS_AND_RISKS #14).
- Remove `components/*.bak` and `next.config.ts.bak`.

## Later
- Items in `GAPS_AND_RISKS.md` (auth, multi-user, monitoring, export).
