---
type: tracker
title: UX and course improvement tracker
updated: 2026-11-23
---

# Improvement tracker

Every change we want to adopt, so nothing from the research gets lost. Plan: `docs/plans/ux-course-upgrade.md`.

- **IDs:** FX = fix, DS = design system, UX = flow/UI, LM = learning mechanics, CT = content, TR = tracks/structure.
- **Status:** `todo` · `doing` · `done` · `parked` · `dropped (reason)`.
- **Source:** the research file number (01–06) or the outside site.
- **Rule:** when you add an idea, add a row here first, then put it in a plan phase.

## FX: fixes from the app audit (06)

| ID | Change | Sev | Source | Phase | Status |
|---|---|---|---|---|---|
| FX-01 | Notes/code load errors become empty content and Save overwrites real notes (`lib/api-client.ts:23,28`). Separate load error, disable edit and retry, ~~autosave~~, guard close and `beforeunload` | High | 06 #1 | P1 | done (2026-11-25). No autosave: you removed it on purpose in `ad28a5d`. Close now saves first, and a failed save keeps the panel open. Save also reports failures instead of always showing "Saved" |
| FX-02 | API calls inside `setProgress` updaters double-fire, and failures show as done (`LayerDetailClient.tsx:23-35, 70-77`). Call once, roll back and toast on failure | High | 06 #7 | P1 | done (2026-11-25). Also fixed `api-client` turning network errors into `{ ok: true }` |
| FX-03 | Icon-only mobile nav has no accessible name; add `aria-current` | High | 06 #6, #26 | P1 | done (2026-11-25) |
| FX-04 | AA contrast failures (dark muted 3.45:1, light accent/cyan/amber text about 3.2–3.7:1) | High | 06 #4 | P1 | done (2026-11-25). Dark muted 4.7–5.5:1; light accent/cyan/amber/rose/muted ≥5:1 on white |
| FX-05 | Framer Motion ignores reduced-motion; long entrance on every visit | Med | 06 #13 | P1 | done for reduced motion (`MotionConfig`); trimming entrance animations moves to DS-05 in P3 |
| FX-06 | Dashboard "Hours spent" and "Check-ins" are always 0; stale `meta.currentLayer` | Med | 06 #8 | P1 | done (2026-11-25): "Est. hours done" from item hours, "Active days (30d)". Current layer was already computed from progress |
| FX-07 | No `loading.tsx` / `error.tsx` / `not-found`; one global `<title>` | Med | 06 #15 | P1 | done (2026-11-25). Next 16 `retry()` error boundary, title template |
| FX-08 | Quiz copy contradicts the MCQs; "Unlocked" while the final check is locked | Med | 06 #17 | P1 | done (2026-11-25) |
| FX-09 | `outline:none` focus cues; `role="button"` div wraps controls; checkbox has no state | Med | 06 #16, #18 | P1 | done (2026-11-25). Title is a real button; checkbox has `role=checkbox aria-checked` |
| FX-10 | Streak day keys use UTC (`toISOString`); evening activity lands on the wrong day | Low → **High** | 06 #25 | P1 | done (2026-11-25). Worse than the audit said: east of UTC (for example India) every heatmap cell was keyed a day early. Local date keys everywhere; the activity API stores the client's local day |
| FX-11 | `/projects` NuraKnect card links to a deleted `projects/nuraknect` folder; cards are hardcoded | Low | 06 #29 (verified) | P4 | todo |
| FX-12 | Opening any item silently starts the layer clock | Low | 06 #27 | P1 | done (2026-11-25): starts on the first tick or a start date you set |
| FX-13 | `transition: all` (17 uses); render-blocking font `@import` → `next/font` | Low | 06 #21, #23 | P3 | todo |

## DS: design system v2 (04 §2, 03 §8)

| ID | Change | Source | Phase | Status |
|---|---|---|---|---|
| DS-01 | Type scale tokens `--fs-*` (1.25 ratio, fluid xl/2xl, 12px floor) to replace 19 ad-hoc sizes | 04, 06 #14 | P3 | todo |
| DS-02 | Spacing tokens (4px base), radius set, elevation by surface step plus one accent glow | 04 | P3 | todo |
| DS-03 | Colour tokens v2: surfaces 1–3, `*-text` tokens per theme that pass AA, heatmap ramp, 5 stage hues always with icon and label | 04, 03 | P3 | todo |
| DS-04 | Focus ring via `box-shadow` on `:focus-visible`; 24px minimum targets (WCAG 2.2 2.5.8) | 04 F | P3 | todo |
| DS-05 | Motion rules: 120/200/320ms, transform and opacity only, `<MotionConfig reducedMotion="user">`, confetti only at layer completion | 04 | P3 | todo |
| DS-06 | Components: ProgressRing, SegmentedBar, StatTile, StageChip, KindIcon, Drawer, Tabs, Toast, Tooltip, Skeleton, EmptyState | 04 | P3 | todo |
| DS-07 | Bold identity: ambient green glow and a faint dot grid on the dashboard, Fira Code tabular numerals for stats, glass only on palette, drawer and header | 04 | P3 | todo |
| DS-08 | Monaco theme follows the app theme; spinner while Pyodide loads | 06 #19 | P3 | todo |

## UX: daily flow and pages

| ID | Change | Source | Phase | Status |
|---|---|---|---|---|
| UX-01 | "Continue where you left off" hero: last-engaged item, else first unticked; deep link `/layers/N?item=id` opens the drawer | 04 #1, 06 #2 | P4 | todo |
| UX-02 | Bento dashboard: resume, review-due, streak, heatmap, week plan, 6–7 layer rings | 04 #2 | P4 | todo |
| UX-03 | "My notes" page listing your DB notes by layer and item; repo notes become a tab | 06 #3 | P4 | todo |
| UX-04 | Accessible item drawer: `role=dialog`, focus trap and return, Escape, tablist semantics | 06 #5 | P4 | todo |
| UX-05 | Layer page sticky sub-nav (Overview / Items / Plan / Quiz), goals at the top, collapse done items, "next item" button | 06 #9 | P4 | todo |
| UX-06 | "About this item" block in the drawer: why, skills, hours, kind, prereqs, keep | 06 #11 | P4 | todo |
| UX-07 | Prereq chips that open the prerequisite, with a blocked/dim state | 06 #10 | P4 | todo |
| UX-08 | Surface hidden fields: `appliesTo` "good for" chips, items under each week, "completed on" date | 06 #28 | P4 | todo |
| UX-09 | `/projects` generated from `kind:"project"` items, `keep` and `portfolioProof`, with done state | 06 #29, 02 | P4 | todo |
| UX-10 | Command palette (Ctrl/Cmd+K) with a shortcut sheet: jump to item, layer, term, note | 04 #4, 06 #12 | P5 | todo |
| UX-11 | Filter chips (not done, has notes, kind, price, stage); clickable skills | 06 #12 | P5 | todo |
| UX-12 | Vertical quest map per roadmap: zig-zag nodes on an SVG trail, larger project "boss" nodes, side detail drawer, % ring, rank and "Up next → Continue" | 03 #6 | P5 | todo |
| UX-13 | Focus mode: show only the current stage's items, dim the rest, "item N of M" and prev/next inside the slice | 03 #2, 04 #8 | P5 | todo |
| UX-14 | Return-to-stop: finishing a slice scrolls to and flashes its map node | 03 #3 | P5 | todo |
| UX-15 | Deep-linkable slices `?items=c1-c4,c9&stop=<id>` (parse and compress helpers) | 03 #1 | P5 | todo |
| UX-16 | Weekly review card and week strip (what you did, what's next, due reviews) | 04 #10 | P6 | todo |
| UX-17 | Stats strip in the header: layers, items, hours, projects, streak (as on CN/Bosscoder pages) | 01, 02 | P4 | todo |
| UX-18 | "Pick this if / skip if" cards for tool choices in pick groups | 03 #8 | P5 | todo |
| UX-19 | Cross-tab sync event, so a tick in one tab updates the others | 03 #7 | P5 | parked |

## LM: learning mechanics

| ID | Change | Source | Phase | Status |
|---|---|---|---|---|
| LM-01 | FSRS spaced-review queue over Must-know terms and quiz questions (needs a `reviews` table; ts-fsrs v6 needs Node ≥24, and we run 26) | 04 #3 | P6 | todo |
| LM-02 | Retrieval first: show the term, ask for recall, then reveal the one-liner and misconception | 04 C | P6 | todo |
| LM-03 | Hint ladder and per-test result list in the code runner; save the pass state and badge it | 04 #9, 06 #19 | P6 | todo |
| LM-04 | Streak forgiveness (weekly goal or freeze), plus an honest heatmap with focusable cells and a table fallback | 04 #5 | P6 | todo |
| LM-05 | Stage checkpoint question ("clear it to earn <rank>"): one per stage, answered in notes | 03 #5 | P2 (content) + P6 (UI) | todo |
| LM-06 | Completion vs excellence: done = core items; excellence = all quizzes ≥90% plus portfolio proof | 01 | P6 | todo |
| LM-07 | Ranks and XP tied to retrieval and projects, not to clicks | 03, 04 | P6 | todo |
| LM-08 | Hint-first AI tutor side panel (Socratic, like Boot.dev Boots, roadmap.sh, Brilliant Koji); needs a provider and API-key decision | 04 | Later | parked |
| LM-09 | MCP server over your notes and progress, so Claude Code can tutor from them (already in roadmap "Later") | roadmap.md | Later | parked |

## CT: curriculum content (05 is the main source)

| ID | Change | Rank | Source | Phase | Status |
|---|---|---|---|---|---|
| CT-01 | New Layer 7 "Forward Deployed Engineering": discovery and scoping, SOW and ADRs, enterprise data access, client-env deploy (VPC, SSO, RBAC, multi-tenant), compliance and audit, demos, handover and runbooks, build vs buy and token economics, case-interview practice | 1 | 02, 05 | P2 | todo |
| CT-02 | OpenTelemetry GenAI tracing taught in L3 (not only L5); new OTel project exporting to two backends | 2 | 05 | P2 | todo |
| CT-03 | Refresh MCP items to spec 2026-07-28: stateless, `server/discover`, MRTR, tasks extension, deprecated Roots/Sampling/Logging, Client ID Metadata Documents auth; flag stale items as optional | 3 | 05 §0.1 | P2 | todo |
| CT-04 | Agent security: OWASP LLM 2025 IDs in mustKnow, OWASP Agentic Top 10 (2026), lethal trifecta, excessive agency, MCP tool poisoning; injection primer moves to L3 | 4 | 05 | P2 | todo |
| CT-05 | A2A v1.0 item in L3, plus mustKnow "A2A vs MCP" | 5 | 05 | P2 | todo |
| CT-06 | Long-term memory and durable or long-running agents (checkpoints, background agents) | 6 | 05 | P2 | todo |
| CT-07 | Voice/realtime as its own item and project, with a latency-budget mustKnow | 7 | 05 | P2 | todo |
| CT-08 | Deployment: Docker, a queue for long jobs, eval-gated release and canary | 8 | 02, 05 | P2 | todo |
| CT-09 | Document parsing and ingestion (OCR, tables) and ACL-aware retrieval | 9 | 05 | P2 | todo |
| CT-10 | AI product and agent UX patterns (streaming, citations, approvals, feedback) | 9 | 05 | P2 | todo |
| CT-11 | DSPy / prompt optimisation; Google ADK 2.x in the framework pick group; coding-agent skills, hooks, subagents and AGENTS.md moved earlier | 10 | 05 | P2 | todo |
| CT-12 | RAG evaluation and fallback strategies as an explicit topic | — | 01 | P2 | todo |
| CT-13 | One outcome-titled project per layer with a time tag ("6 HOURS"); "bake-off" projects that compare options on cost and quality | — | 02, 01 | P2 | todo |
| CT-14 | Repeat evals and guardrails across layers (a golden-set primer in L2/L3), not only L5 | — | 02, 05 | P2 | todo |
| CT-15 | Python/TS engineering baseline checklist (async, typing, testing, APIs) as a "start here" gate | — | 01, 05 | P2 | todo |
| CT-16 | Capstones: deep-research agent, secure agent red-team report, FDE end-to-end client engagement | — | 02, 03, 05 | P2/P7 | todo |
| CT-17 | Pin versions and "last checked" per item (openai-agents 0.25.0, claude-agent-sdk 0.2.187, google-adk 2.15.0, langgraph 1.2.24 on 2026-11-23) | — | 03 #8, 05 | P2 | todo |

## TR: tracks and structure

| ID | Change | Source | Phase | Status |
|---|---|---|---|---|
| TR-01 | Tracks as views over the same layers: Applied AI, Agentic AI, FDE (and an optional Model/Inference) set required vs optional per layer | 05 §4 | P7 | todo |
| TR-02 | Stage metadata per layer: kicker, rank title, colour, checkpoint, project (Krish Naik pattern) | 03 #5 | P2 | todo |
| TR-03 | Job-skill matrix: each item maps to role skills; a "skills I can prove" view | 02 | P7 | todo |
| TR-04 | Build / Deploy / Solve pillar view next to layers | 02 | P7 | parked |
| TR-05 | A real topic tree (decision 0001 option 3), only if the flat list starts to hurt | 0001 | — | parked |
