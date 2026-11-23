---
type: plan
title: UX redesign and 2026 curriculum upgrade
status: draft
size: M
updated: 2026-11-23
covers: [docs/research/, docs/decisions/0002-curriculum-structure-and-tracks.md, app/, components/, lib/, types/index.ts, data/roadmaps/ai-engineering/, scripts/check-content.mjs, app/globals.css]
---

# UX redesign and 2026 curriculum upgrade

The tracker gets a modern, bold UI and a curriculum that matches what Applied, Agentic and Forward Deployed AI engineers need in late 2026. The work is based on Coding Ninjas, Bosscoder FDE, Krish Naik and modern learning platforms.

**Size: M**, a major redesign of an existing app plus a content refresh. It's not L: no new product, no new stack, and one optional DB table (P6). Gates 1+2 combined (this plan), then Gate 4 (review before merge).

Every change has an ID in `docs/research/tracker.md`. Phases list IDs, not repeats.

## Requirements (the user's words)

| # | Requirement | Phase |
|---|---|---|
| R1 | "First scan this project what we have and create a memory if you did not find the relevant docs" | P0 (done: memory written) |
| R2 | "get complete information about UI/UX designing, AI engineering course topics, the levels, flow and everything that are more modern" | P0 (research 01–06) |
| R3 | "which makes our application stand out" | P3, P4, P5 |
| R4 | "Research in deep on things what you think we can improve by comparing with their sites and make sure you do not miss a detail" | P0, `tracker.md` |
| R5 | "create a doc with the topics or changes like a memory which you want to improve or adapt like a tracker" | P0 (`docs/research/tracker.md`) |
| R6 | "Plan everything in step by step phases with individual plans if required" | this plan; P5 and P6 get their own plan file when they start |
| R7 | "If you are not able to access the full content … let me know or help me with steps on how to get it" | `docs/research/README.md` |
| R8 | "You can use multiple parallel agents … Update the docs accordingly" | P0 (6 tracks) and every phase |
| R9 | "during the process anything adapting makes it advantage, then plan it and update" | standing rule: tracker row first, then phase |
| R10 | "process the above request in separate branch with commit message without adding a claude tag" | all (branch `feat/ux-course-research`) |
| R11 | "Once everything is done with all things we planned then we merge it main branch" | P8 |
| R12 | "auto commit and push changes to sub branch not main branch, when planned things are done" | all (commit and push at each green phase) |

## Tools for this plan

- **Skills:**
  - `frontend-design` and `ui-ux-pro-max` for P3–P5 (bold UI)
  - `design:accessibility-review` at the end of P3 and P5
  - `dataviz` for rings, heatmap and charts
  - `design:ux-copy` for empty states and copy
  - `run` to screenshot pages
  - `code-review` before merge
- **Subagents:**
  - parallel content agents per layer in P2 (Sonnet, with web verification of every new URL)
  - `reviewer` after each phase
  - an Explore agent (Haiku) for code sweeps
- **Models:**
  - Opus: planning and review
  - Sonnet: building
  - Haiku: search
- **Second opinion:** Gemini on decision 0002 and on the P6 review-queue design (data model and FSRS). Optional, since both are reversible.
- **New dependencies (need your OK when we reach them):**
  - `ts-fsrs` v6 in P6. It needs Node ≥24; local is 26.13. Check the Vercel Node version.
  - Command palette: build it by hand (about 150 lines), with no `cmdk`, whose README lists React 18 only.

## Decisions

- `docs/decisions/0002-curriculum-structure-and-tracks.md` (proposed: extend; add Layer 7 FDE and tracks as views)
- 0001 still applies: never rename or remove an item id.

## Phases

### P0: Research, tracker and plan (this turn)
- Entry: branch `feat/ux-course-research` from `main` at 9768d61.
- [x] T1 Project scan and memory notes
- [x] T2 Six research tracks → `docs/research/01–06`
- [x] T3 Tracker, research index (blocked content and how to get it), decision 0002, this plan
- Exit: docs committed and pushed to the branch · artifact page published · you approve the plan.
- Rollback: delete the branch.

### P1: Safety and accessibility fixes (S, about 1 day)
- Entry: **the Next 16 upgrade is merged into main and this branch is rebased on it** (the uncommitted Next 16 work on main must land first, or the UI phases conflict).
- [ ] T1 FX-01 note-loss guard and autosave; FX-02 single-fire saves with rollback and toast
- [ ] T2 FX-03, FX-04, FX-09 a11y names, contrast and focus semantics
- [ ] T3 FX-05 reduced motion; FX-07 loading, error and not-found plus per-page titles
- [ ] T4 FX-06 real dashboard stats; FX-08 quiz copy; FX-10 local-date streak keys; FX-12 explicit layer start
- Exit: `npm run verify` green · new tests for the save rollback and the local-date key · manual: save notes offline (DevTools offline) does not wipe them · tracker rows set to done.
- Rollback: `git revert` the P1 commits (no DB change).

### P2: Curriculum refresh, Layer 7 FDE and stage metadata (content only, M)
- Entry: decision 0002 approved. It can run in parallel with P1, since it touches only `data/`, `types/` and `scripts/`.
- [ ] T1 Types and check: optional layer `stages[]` (kicker, rank, colour, checkpoint, project id) and item `lastChecked`/`versions`; extend `check-content.mjs` (TR-02, CT-17)
- [ ] T2 L1–L3 items: CT-02, CT-03, CT-04 (primer), CT-05, CT-06, CT-11, CT-12, CT-14, CT-15
- [ ] T3 L5–L6 items: CT-04 (full), CT-07, CT-08, CT-09, CT-10; L4 marked as fine-tuning-specialist content
- [ ] T4 Layer 7 FDE: CT-01, plus capstone CT-16 (client engagement)
- [ ] T5 One outcome-titled project per layer with a time tag, plus a checkpoint per stage (CT-13, LM-05)
- [ ] T6 Verify every new URL live (parallel agents) and pin versions with a check date
- Exit: `npm run verify` green · layers 1–2 still show completed · no existing id renamed or removed (diff check) · tracker updated.
- Rollback: revert the `data/` and `types/` commits.

### P3: Design system v2 (M)
- Entry: P1 done.
- [ ] T1 DS-01–DS-04 tokens (type, space, colour, focus) in `globals.css`; FX-13 `next/font` and no `transition: all`
- [ ] T2 DS-05 motion config; DS-06 components (ProgressRing, SegmentedBar, StatTile, StageChip, KindIcon, Drawer, Tabs, Toast, Tooltip, Skeleton, EmptyState)
- [ ] T3 DS-07 identity touches; DS-08 Monaco theme and Pyodide spinner
- Exit: `npm run verify` green · `design:accessibility-review` passes AA in both themes · screenshots of every page in both themes attached to the PR · no hardcoded font sizes left (grep check).
- Rollback: revert the commits (CSS and components only).

### P4: Daily loop and pages (M)
- Entry: P3 done.
- [ ] T1 UX-01 resume hero and deep link; UX-02 bento dashboard; UX-17 stats strip
- [ ] T2 UX-04 accessible drawer; UX-06 "About this item"; UX-07 prereq chips; UX-08 hidden fields
- [ ] T3 UX-05 layer sub-nav and next-item button
- [ ] T4 UX-03 "My notes" page; UX-09 and FX-11 generated projects page
- Exit: `npm run verify` green · manual: from login, reach the next unticked item in 1 click · notes typed in the drawer appear on My notes · screenshots.
- Rollback: revert the commits.

### P5: Map, navigation and tracks UI (M; own plan file `docs/plans/quest-map.md` at start)
- Entry: P2 and P4 done.
- [ ] T1 UX-12 vertical quest map from stage metadata, with rank, XP ring and "Up next"
- [ ] T2 UX-13 focus mode, UX-15 slices, UX-14 return-to-stop
- [ ] T3 UX-10 hand-built command palette and shortcut sheet; UX-11 filters
- [ ] T4 TR-01 track picker (Applied, Agentic, FDE) driving required vs optional and overall %
- [ ] T5 UX-18 "pick this if / skip if" cards
- Exit: `npm run verify` green · keyboard-only walkthrough of map → item → palette · a11y review · screenshots.
- Rollback: revert the commits; track choice is in JSON or localStorage, with no DB change.

### P6: Learning mechanics (M; own plan file `docs/plans/review-queue.md` at start)
- Entry: P4 done; you approve `ts-fsrs` and the `reviews` table.
- [ ] T1 `reviews` table in `lib/db/schema.ts` → `npm run migrate` on dev → check query
- [ ] T2 LM-01 and LM-02 review queue page and a due badge on the dashboard
- [ ] T3 LM-03 hint ladder, test result list and saved pass state
- [ ] T4 LM-04 streak forgiveness and accessible heatmap; UX-16 weekly review card
- [ ] T5 LM-06 completion vs excellence; LM-07 ranks and XP tied to retrieval and projects
- Exit: `npm run verify` green · tests for scheduling and XP rules · migration check query output · manual review session.
- Rollback: revert the commits and drop the `reviews` table (`DROP TABLE reviews;` on dev, after you confirm).

### P7: Job-skill matrix and FDE extras (S)
- Entry: P2 and P5 done.
- [ ] T1 TR-03 skill matrix and a "skills I can prove" view from `skills` and `keep`
- [ ] T2 Re-read the tracker; turn every parked row into keep or drop, with a reason
- Exit: `npm run verify` green · tracker has no `todo` rows for P1–P7.
- Rollback: revert the commits.

### P8: Review and merge
- Entry: P1–P7 exits met.
- [ ] T1 `code-review` and `reviewer` against R1–R12; fix the findings
- [ ] T2 Update README, AGENTS.md, roadmap `## Now`; delete this plan (git keeps it)
- [ ] T3 You approve → merge `feat/ux-course-research` into main (you merge, or I merge on your explicit go)
- Exit: `npm run verify` green on main · `npm run build` passes.
- Rollback: revert the merge commit.

## Parking lot

- LM-08 hint-first AI tutor panel: needs a provider and API-key decision (a separate plan).
- LM-09 MCP server over notes and progress (already in roadmap "Later").
- TR-04 Build/Deploy/Solve pillar view; UX-19 cross-tab sync; TR-05 topic tree.
- Gated content (brochures, FAQ answers, login dashboards): see `docs/research/README.md`; merge it into the tracker if you supply it.
- Roadmap "Next" items (API 400s, lint warnings) stay in roadmap.md; P1 may fix the lint warnings it touches.
