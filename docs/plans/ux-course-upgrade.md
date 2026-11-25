---
type: plan
title: UX redesign and 2026 curriculum upgrade
status: active
size: M
updated: 2026-11-25
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
| R10 | "process the above request in separate branch with commit message without adding a claude tag" | all (research on `feat/ux-course-research`, merged 2026-11-25; P1 on `feat/ux-course-upgrade`, merged as PR #1 `a43a350`; P2 on `feat/ux-course-p2`) |
| R13 | "once you verify with them and it all looks good, shall we proceed with the our initial plan?" (2026-11-25: plan approved after re-checking it against the Next 16, API-input and lint commits) | P1 onward |
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

- `docs/decisions/0002-curriculum-structure-and-tracks.md` (accepted 2026-11-25: extend; add Layer 7 FDE and tracks as views)
- 0001 still applies: never rename or remove an item id.

## Phases

### P0: Research, tracker and plan (this turn)
- Entry: branch `feat/ux-course-research` from `main` at 9768d61.
- [x] T1 Project scan and memory notes
- [x] T2 Six research tracks → `docs/research/01–06`
- [x] T3 Tracker, research index (blocked content and how to get it), decision 0002, this plan
- [x] T4 Approved 2026-11-25; research branch merged to main as `6629a73`
- Exit: docs committed and pushed to the branch · artifact page published · you approve the plan. **Met.**
- Rollback: delete the branch.

### P1: Safety and accessibility fixes (S, about 1 day)
- Entry: **the Next 16 upgrade is merged into main and this branch is rebased on it**. Met: branch `feat/ux-course-upgrade` starts from `6629a73` (Next 16, API input checks and clean lint are on main).
- [x] T1 FX-01 note-loss guard (no autosave, see tracker); FX-02 single-fire saves with rollback and an alert
- [x] T2 FX-03, FX-04, FX-09 a11y names, contrast and focus semantics
- [x] T3 FX-05 reduced motion; FX-07 loading, error and not-found plus per-page titles
- [x] T4 FX-06 real dashboard stats; FX-08 quiz copy; FX-10 local-date keys (streak, deadlines, activity API); FX-12 explicit layer start
- Exit: `npm run verify` green · new tests for the save rollback and the local-date key · manual: save notes offline (DevTools offline) does not wipe them · tracker rows set to done.
  - 2026-11-25 review (reviewer subagent, Opus): 0 high, 4 medium, 3 low. Fixed:
    - saves now queue in order, and text typed during a save stays unsaved
    - a failed layer save is undone even after later changes, and the layer is re-sent
    - a start date you set survives the first tick
    - closing again after new edits tries to save again
    - the rollback has tests
    - streak and active days render in the browser only (no hydration mismatch)

    The remaining UTC "today" cases are FX-14 (P4). Verify: 29 tests.
  - 2026-11-25: verify green (26 tests, 9 new in `tests/progress.test.mjs`, also green with TZ Asia/Kolkata, America/Los_Angeles, Pacific/Kiritimati) · `npm run build` green · tracker updated. **Manual offline check still to do in your browser** (the worktree has no `.env`): open an item → DevTools Network "Offline" → reopen it, and the panel should show "Couldn't load… Retry" with editing off; type, then close, and the panel stays open with "Not saved".
- Rollback: `git revert` the P1 commits (no DB change).

### P2: Curriculum refresh, Layer 7 FDE and stage metadata (content only, M)
- Entry: decision 0002 approved. Met: branch `feat/ux-course-p2` from main at `a43a350` (P0 and P1 merged). Touches only `data/`, `types/`, `scripts/` and tests.
- [x] T1 Types and check: optional layer `stages[]` (kicker, rank, colour, checkpoint, project id) and item `lastChecked`/`versions`; extend `check-content.mjs` (TR-02, CT-17). Done 2026-11-25: `LayerStage` and `StageColor` (accent, cyan, amber, rose, purple) in `types/index.ts`; the checker rejects unknown or duplicate stages, a stage no item uses, missing kicker/rank/checkpoint, a project that is not a same-stage project item, a bad `lastChecked` date, and `versions` without a date; `tests/check-content.test.mjs` (3 tests).
- [x] T2 L1–L3 items: CT-02, CT-03, CT-04 (primer), CT-05, CT-06, CT-11, CT-12, CT-14, CT-15. Done 2026-11-25: L1 c114–c115, L2 c215–c217 (all optional, so L1–L2 keep 12 required units each); L3 c316–c323, ADK c321 in the `agent-sdk` pick group, c305/c306 now optional as stale vs MCP 2026-07-28 (c306's challenge uses `notifications/initialized`; c305 not re-read [U]), 2 new MCQs.
- [x] T3 L5–L6 items: CT-04 (full), CT-07, CT-08, CT-09, CT-10; L4 marked as fine-tuning-specialist content. Done 2026-11-25: L5 c516 (OWASP Agentic Top 10; its ASI item titles are only in the PDF [U]), c515 extended into the red-team report; L6 c617–c621 (voice, Docker deploy, Docling, HAX UX). The Docker Python containerize guide is 404, so c619 uses the Dockerfile concepts page. L4 description and startHere say specialist track.
- [x] T4 Layer 7 FDE: CT-01, plus capstone CT-16 (client engagement). Done 2026-11-25: `layer-7/` with c701–c716, an `identity-provider` pick group, quiz (6 MCQs, 2 open), weeks 23–26; `meta.totalLayers` 7. Core load is about 43 hours (projects 33.5). Salesforce/ServiceNow are not covered directly [U].
- [x] T5 One outcome-titled project per layer with a time tag, plus a checkpoint per stage (CT-13, LM-05). Done 2026-11-25: `stages` in all 7 layers (21 stages, each with a scenario checkpoint and a same-stage project); project titles state the outcome and hours; bake-offs in c113, c414, c615.
- [x] T6 Verify every new URL live (parallel agents) and pin versions with a check date. Done 2026-11-25: the 4 content agents fetched each URL; a second curl pass got 200 on all 28 new or changed URLs; 13 `versions` pins all match PyPI on 2026-11-25, each with `lastChecked`.
- Exit: `npm run verify` green · layers 1–2 still show completed · no existing id renamed or removed (diff check) · tracker updated.
  - 2026-11-25: **met.** verify green (7 layers, 128 items, 44 auto-scored questions, 32 tests, lint 0 warnings) · `npm run build` green · id diff against main: no id removed; track changes only c305/c306 (L3); required units L1 12→12, L2 12→12, L3 10→11, L5 11→12, L6 9→10, L7 11 · tracker updated. Not done here: the dashboard still reads `meta.totalLayers` (now 7) and overall % counts every layer; track-aware % is TR-01 (P5).
- Rollback: revert the `data/` and `types/` commits.

### P3: Design system v2 (M)
- Entry: P1 done. Met: branch `feat/ux-course-p3` from `feat/ux-course-p2` at `c4cf856` (stacked so the plan and roadmap don't conflict; rebase on main after P2 merges).
- [x] T1 DS-01–DS-04 tokens (type, space, colour, focus) in `globals.css`; FX-13 `next/font` and no `transition: all`. Done 2026-11-25: 9-step type scale replaces 19 raw sizes (0 left, 12px floor); spacing, radius, surface, active-shadow and heat tokens; per-theme `--<hue>-text` tokens (all ≥4.5:1 on every surface and tint, both themes) on every hue `color`, and the light-theme status colours that failed AA (deadline badges, login error, wrong MCQ) moved onto them; `:focus-visible` outline token, `scroll-padding-top`, 24px targets (not inside Monaco); Fira Sans/Code via `next/font` (`lib/fonts.ts`) with a monospace fallback for Monaco; heatmap on `--heat-0…4`, month labels no longer overlap. Reviewer (Opus): 1 high, 5 medium, 5 low, all fixed except stage-hue tokens, which move to T2 with StageChip. Screens checked: login in both themes (app pages need your login).
- [x] T2 DS-05 motion config; `--stage-*` tokens; DS-06 components. Done 2026-11-25: `lib/motion.ts` (120/200/320 ms, ease-out, spring 300/30, 30 ms stagger capped at 240 ms) used by every animation, bars animate `scaleX` not width, entrance offsets cut to 8px; `--dur-*` and `--stage-*` tokens; `components/ui/` ProgressRing (no draw under reduced motion), SegmentedBar (layers page, per-stage via `getStageProgress`), StatTile, StageChip, KindIcon, Skeleton, EmptyState, each replacing existing markup; check-content now requires a stage on core items. Drawer, Tabs and Toast moved to P4 T2 and Tooltip to P6 T4, where they are first used. Reviewer (Opus): 0 high, 2 medium, 6 low, all fixed. Screens checked on a temporary preview route in both themes (deleted).
- [x] T3 DS-07 identity touches; DS-08 Monaco theme and Pyodide spinner. Done 2026-11-25: a 24px dot grid behind every page (replaces the old line grid; 10%/6% dot alpha on 1px dots, above the research's 3–4% because single-pixel dots vanish lower), an ambient green glow on the dashboard, tabular numerals on every changing number, one `--glass-blur` on the header and item drawer (drawer 92% dark / 96% light so muted text stays ≥4.8:1 even over the backdrop); Monaco `journey-dark`/`journey-light` themes follow the app theme; the output console is a dark island with its own tokens (all text ≥6.3:1); Run/Check show a spinner on the clicked button (still under reduced motion) and the output is a `role=log` region. Checked with a temporary preview route and mocked API calls in both themes: editor background follows the theme, spinner shows while Pyodide loads, code runs. Reviewer (Opus): 1 high (console contrast, pre-existing), 2 medium, 7 low, all fixed.
- Exit: `npm run verify` green · `design:accessibility-review` passes AA in both themes · screenshots of every page in both themes attached to the PR · no hardcoded font sizes left (grep check).
  - 2026-11-25 exit run: verify green (34 tests, lint 0 warnings) · `npm run build` green · grep: 0 raw `font-size` in CSS; the only numeric size is Monaco's `fontSize: 13` editor option (Monaco needs a number; equals `--fs-sm`) · accessibility review (static: code, computed contrast and screenshots; the automated axe-core scan in a browser was blocked by the permission classifier and was not run): fixed FX-15 (6 unlabelled inputs, control edges under 3:1). All text tokens ≥4.5:1 and focus ring ≥4.67:1 in both themes. Known gaps, already planned: the item drawer is not a `role=dialog` with a focus trap and its tabs lack tab roles (P4 T2, UX-04); heatmap cells are mouse-only `title` tooltips and the low heat steps are under 3:1 (P6 T4, LM-04). **Yours:** screenshots of the logged-in pages for the PR (they need your login), and optionally a run of axe DevTools in your browser.
- Rollback: revert the commits (CSS and components only).

### P4: Daily loop and pages (M)
- Entry: P3 done.
- [ ] T1 UX-01 resume hero and deep link; UX-02 bento dashboard; UX-17 stats strip
- [ ] T2 UX-04 accessible drawer; UX-06 "About this item"; UX-07 prereq chips; UX-08 hidden fields; DS-06 Drawer and Tabs (CoursePanel tabs need `role=tab` and `aria-selected`) and Toast (save failures, 5 s undo)
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
- [ ] T4 LM-04 streak forgiveness and accessible heatmap; UX-16 weekly review card; DS-06 Tooltip for heatmap cells (keyboard and touch, replacing `title`)
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
