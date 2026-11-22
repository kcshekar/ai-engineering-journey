# Roadmap

## Now
- Roadmap content v2 is done (decision 0001, accepted). All 6 layers use the new shape: stages, core vs optional items, pick-one groups, hours, prerequisites, projects, Must-know terms, challenge checks and auto-scored quizzes.
- Still open (yours): rotate the login password that is in git history (`lib/auth.ts` and an old memory file).
- Review the new content in layers 1–6 as you study. Open content questions:
  - c6's title is "Building RAG Agents with LLMs", but its link is DeepLearning.AI's "Building and Evaluating Advanced RAG". Pick the course you meant and fix the title or the link (keep the id).
  - Existing challenges c3, c5, c6, c7 and c8 have starter code that already solves the task, so their checks pass straight away. Consider trimming those starters to skeletons.

## Next
- Add a first test so `verify` covers more than types and content (GAPS_AND_RISKS #14).
- Remove `components/*.bak` and `next.config.ts.bak`.
- `npm audit` (2026-11-22) reports 16 vulnerabilities: 4 critical, 6 high, 6 moderate, including sharp/libvips GHSA-f88m-g3jw-g9cj. Triage them in a separate task.
- The Stop hook `.claude/hooks/verify.sh` (playbook-managed) runs only `npx tsc --noEmit`, and only when `.ts`/`.tsx` change. Consider making it run `npm run verify`, so `layer.json` edits are checked too.

## Later
- Items in `GAPS_AND_RISKS.md` (auth, multi-user, monitoring, export).
- Ideas from the roadmap research, not built yet:
  - a spaced-repetition review queue (needs a DB table)
  - an MCP server over your notes and progress, so Claude Code can tutor from them
  - several career routes, and route orderings (GenAI-first vs fundamentals-first)
  - "mutant" wrong solutions that the challenge tests must catch
  - an AI tutor per topic, related roadmaps and an FAQ block
- A real topic tree (option 3 in decision 0001), only if the flat item list starts to hurt.
