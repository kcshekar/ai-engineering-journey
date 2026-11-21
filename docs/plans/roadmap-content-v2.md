---
type: plan
title: Roadmap content v2 (structure, then new topics)
status: approved
size: M
updated: 2026-11-22
covers:
  - types/index.ts
  - lib/loader.ts
  - lib/roadmap-data.ts
  - scripts/check-content.mjs
  - package.json
  - components/LayerCard.tsx
  - components/CoursePanel.tsx
  - components/LayerDetailClient.tsx
  - components/DashboardClient.tsx
  - app/(app)/layers/**
  - app/globals.css
  - data/roadmaps/ai-engineering/**
  - README.md
  - docs/**
---

# Roadmap content v2

This plan uses the research on 5 AI roadmap sources (Nov 2026) to improve the tracker. First it gives the content a richer shape: resource types, core vs optional items, hours, prerequisites, and the same layout for every layer. Then it fills all 6 layers in that shape. It is size **M** because it redesigns the content model and the layer page across about 10 files and adds 4 layers of new content. It is not size L because it adds no new product, service or database table.

## Requirements (the user's words)

| # | Requirement | Phase |
|---|---|---|
| R1 | "improve it further" (the learning app) | 1–5 |
| R2 | "every small detail that can help us improve our application course" (use the research findings) | 1–4 |
| R3 | Scope: "B then A": change the structure first, then add new topics in that shape | 1–4 |
| R4 | "Keep 6, expand them": put new topics in the closest existing layer | 3–4 |
| R5 | "Resource types + price" | 1, 2 |
| R6 | "Core vs optional topics" (including "pick one" groups) | 1, 2 |
| R7 | "Hours + prerequisites" | 1, 2 |
| R8 | "Layer layout + projects" (Must-know card, stages, projects per level, "you can now…") | 1, 2 |
| R9 | "find the things which may help use improve our project or the architecture" (from the AI Engineering from Scratch repo), and "Add all" of the proposed changes | 1–4 |
| R10 | Quiz style: "Both": keep the mentor-chat questions and add an auto-scored multiple-choice check | 1, 2 |

## Tools for this plan

- Skills:
  - `frontend-design` or `ui-ux-pro-max` for the layer page in Phase 2. UI work should be bold and modern.
  - `artifact-design` for the overview page.
- Subagents:
  - Phase 4: one Sonnet agent per layer (3–6) running in parallel. Each finds and checks resources (live link, price, hours) and drafts items, projects and quiz questions.
  - `web-fetch` for checking links.
  - `reviewer` after each phase.
- Models:
  - Opus: this plan and the reviews.
  - Sonnet: building, and content drafts.
  - Haiku: link-check sweeps.
- Second opinion: the Gemini MCP tools are not available in this session. Worth one review of decision 0001 if you enable them; otherwise skip.

## Decisions

- [0001 Richer roadmap content model](../decisions/0001-content-model.md): extend the course item additively, with no DB change (proposed).
- Easy choices, already made:
  - Keep the type and DB names `Course` and `coursesCompleted`, and document that they now mean "item".
  - Prerequisites are soft hints, not locks.
  - A pick group counts as done when any one of its items is done.

## Content shape (summary)

```jsonc
// layer.json (all new fields optional)
{
  "mustKnow": [{ "term": "MCP", "oneLiner": "…", "misconception": "what people say vs what it means" }],
  "stageGoals": { "beginner": "…", "intermediate": "…", "advanced": "…" },
  "pickGroups": [{ "id": "vectordb", "label": "Vector DB: pick one" }],
  "outcomes": ["Build a hybrid-search RAG with a reranker", "…"],
  "startHere": "If you already ship APIs, skip to c12",
  "portfolioProof": { "title": "…", "evidence": ["eval set + report", "cost scorecard"] },
  "quiz": { "questions": [{
    "id": "q1", "type": "conceptual", "question": "…", "hint": "…",   // existing mentor-chat question
    "options": ["…", "…", "…", "…"], "correct": 2, "explanation": "…", "stage": "pre | check | post"  // optional: makes it auto-scored
  }] },
  "courses": [{
    "id": "c9", "title": "…", "url": "…",
    "kind": "course | video | article | docs | book | repo | project",
    "price": "free | freemium | paid", "recommended": true,
    "hours": 3, "track": "core | optional", "stage": "beginner | intermediate | advanced",
    "pickGroup": "vectordb", "prereqs": ["c6"], "skills": ["chunking", "embeddings"],
    "keep": ["the eval report", "the per-query deltas"],   // for kind "project": evidence to save
    "pythonChallenge": { "…existing fields…": "",
      "tests": "assert neuron_forward([1.0,0.5,-1.0],[0.4,0.8,0.2],0.3) == pytest.approx(0.5744, abs=1e-4)",
      "hints": ["nudge", "key idea"] }
    // existing fields kept: platform, cost, duration, why, order
  }]
}
```

## Phases

### Phase 1: Content model and checks (no UI change)
- Entry: plan and decision 0001 approved. Working tree clean.
- [x] T1 Extend `types/index.ts` with the optional fields above:
  - item: kind, price, recommended, hours, track, stage, pickGroup, prereqs, skills, keep
  - layer: mustKnow (with misconception), stageGoals, pickGroups, outcomes, startHere, portfolioProof
  - pythonChallenge: tests, hints
  - quiz question: options, correct, explanation, stage
  Add a comment saying "course = any learning item".
- [x] T2 Add `scripts/check-content.mjs`, a Node script with no new dependencies. It checks:
  - every item id is unique across the roadmap
  - `prereqs` and `pickGroup` point to ids that exist
  - enum values are valid
  - every `planning.json` week references real ids
  - multiple-choice questions: `correct` is in range, the correct answer isn't always in the same position, and it isn't usually the longest option (the same idea as AI Engineering from Scratch's `check_quiz_bias.py`)
  Then make `verify` run `tsc --noEmit && node scripts/check-content.mjs`.
- [x] T3 Update `lib/loader.ts` so that layer completion, the quiz unlock and overall progress count only core items. Pick groups count as 1. Missing `track` defaults to core, so layers 1–2 behave exactly as they do now. Add `getLayerHours()`.
- [ ] T4 Run a read-only check query against dev before and after: `SELECT layer_id, courses_completed FROM progress;` The output must be unchanged.
  - Status 2026-11-22: blocked. There is no `.env.local` on this machine, so dev Turso is unreachable and the "before" snapshot could not be taken ahead of T3. T3 writes nothing to the DB, and an old-vs-new loader comparison over every completed-id subset of layers 1–2 gave 0 differences in 6144 comparisons. When `.env.local` exists, run the query once to confirm the rows look sane (every id is in its layer).
- Exit:
  - `npm run verify` is green, with the content check passing on layers 1–2.
  - The check query output is the same before and after.
  - The layers 1–2 pages show the same counts as before.
  - `reviewer` has no open findings.
- Rollback: revert the Phase 1 commits. There is no DB change to undo.

### Phase 2: Layer page redesign (bold, modern)
- Entry: Phase 1 exit met.
- [ ] T1 Add a Must-know card at the top of the layer page, plus a total-hours chip.
- [ ] T2 Group items under Beginner, Intermediate and Advanced sections, each with its stage goal. Ungrouped items stay in one list.
- [ ] T3 Item card changes:
  - an icon for each kind
  - price and ⭐ badges
  - core vs optional styling (optional items muted and collapsible)
  - pick-one groups as a single grouped card
  - "needs X first" prerequisite hints
  - hours shown on each item
- [ ] T4 Projects section, with level and skill tags, using the existing notes and code panel.
- [ ] T5 A "You can now…" outcomes panel that appears when a layer is complete.
- [ ] T6 Update the dashboard and layers-list progress bars to use core-only counts and hours.
- [ ] T7 Challenge checks in `CoursePanel.tsx`, using the Pyodide setup that is already there:
  - a "Check" button runs your code, then the challenge `tests`, and shows pass/fail for each check
  - hints appear one at a time
  - nothing new is loaded or installed
- [ ] T8 Auto-scored quiz check in `QuizSection.tsx`:
  - the mentor-chat questions stay as they are
  - questions that have `options` become a multiple-choice check with an explanation after each answer
  - the score saves to the existing `quizScore` and `quizAttempts` fields (the API already accepts them)
  - a good score on the "pre" questions offers "skip ahead"
- Exit:
  - `npm run verify` is green.
  - Browser check of layers 1 and 2 at desktop and phone width (no horizontal scroll), in light and dark themes.
  - `reviewer` has no open findings.
- Rollback: revert the Phase 2 commits. The JSON is unaffected.

### Phase 3: Retrofit layers 1–2 (R4)
- Entry: Phase 2 exit met.
- Note from the T3 review: `getLayerStatus` trusts the stored `completed` flag, but the quiz unlock and the bars recompute from items. A new core item added to an already-completed layer leaves it "completed" with the quiz locked. Decide in T1/T2: either clear `completed` when the required count grows, or accept it.
- [ ] T1 Layer 1: add the new fields to the existing items, keeping their ids. Add:
  - Must-know terms: token, context window, sampling, embedding, prompt vs context.
  - Context engineering items (core).
  - "Choosing a model" (core), and a group for open vs closed models.
  - Projects for each level.
- [ ] T2 Layer 2: add the new fields. Fix the c5 URL, which points to an Anthropic course while the title says ChatGPT API. Add:
  - hybrid search, rerankers, contextual retrieval and HyDE (core)
  - GraphRAG and agentic RAG (optional)
  - a "Vector DB: pick one" group
  - an intro to RAGAS
  - projects: PDF Q&A, then hybrid search, then a reranker
- [ ] T3 Check every link in layers 1–2 (live, price, hours). Update `planning.json` weeks if the hours grow.
- [ ] T4 Add `tests` and `hints` to every existing Python challenge in layers 1–2. Add 6 multiple-choice questions per layer (2 pre, 2 check, 2 post) next to the mentor-chat ones. Add a portfolio proof and `startHere` to both layers.
- Exit:
  - `npm run verify` is green.
  - All links checked.
  - The check query still shows c1–c8 progress unchanged.
  - You have reviewed both layers.
- Rollback: revert the Phase 3 commits.

### Phase 4: Write layers 3–6 (R4)
- Entry: Phase 3 exit met. One parallel research agent per layer.
- Main source: AI Engineering from Scratch (MIT, aiengineeringfromscratch.com). Map its lessons to our items, credit any adapted quiz question, and fill gaps with official docs. Matching phases:
  - layer 3: phases 13 and 14
  - layer 4: phases 10 and 11
  - layer 5: phases 11, 14 and 18
  - layer 6: phase 17 and its interview bank
- [ ] T1 Layer 3, Agents and orchestration:
  - function calling, ReAct, memory, human-in-the-loop
  - **MCP** (host, client, server, building a server)
  - an agent SDK pick-one group (Claude Agent SDK, OpenAI Agents, LangGraph, CrewAI)
  - multi-agent
  - computer-use and browser agents (optional)
- [ ] T2 Layer 4, Fine-tuning and training:
  - LoRA and PEFT, instruction tuning, distillation, quantization
  - DPO, GRPO and RLVR (optional)
- [ ] T3 Layer 5, Evaluation and testing:
  - LLM-as-judge, agent eval, regression tests, RAGAS
  - an observability pick-one group (Langfuse, LangSmith, Helicone)
  - safety: prompt injection, guardrails, red teaming
- [ ] T4 Layer 6, Production AI systems:
  - inference (KV cache, vLLM or Ollama), cost and latency, caching, routing
  - multimodal and voice (optional)
  - AI coding tools (optional)
  - interview prep
- Each layer gets the same set:
  - `layer.json` with Python challenges, a quiz and projects
  - `planning.json`
  - `notes.md`
  - `README.md`
- Exit:
  - `npm run verify` is green, and all 6 layers load.
  - All links checked.
  - You have reviewed each layer.
- Rollback: delete the new `layer-3` to `layer-6` folders or revert their commits. Existing progress is unaffected.

### Phase 5: Docs
- Entry: Phase 4 exit met.
- [ ] T1 Update the README layer table and features. Fix the stale `webapp/` and `roadmaps/` paths and the leftover line.
- [ ] T2 Update the weeks and `estimatedMonths` in `meta.json`. Mark decision 0001 accepted. Update `docs/roadmap.md`. Delete this plan.
- Exit: `npm run verify` is green, and the docs match the app.
- Rollback: revert the docs commit.

## Parking lot

- Rotate the login password that is in git history (still the "Now" item, and yours to do).
- The Stop hook `.claude/hooks/verify.sh` (playbook-managed) runs only `npx tsc --noEmit`, and only when `.ts` or `.tsx` files change. It does not run the content check when `layer.json` changes. Consider making it run `npm run verify`.
- `npm audit` (2026-11-22, after `npm ci` on Node 18.19.1) reports 16 vulnerabilities: 4 critical, 6 high, 6 moderate. One of them is sharp/libvips (GHSA-f88m-g3jw-g9cj). Triage them in a separate task.
- Remove the `*.bak` files.
- The roadmap.sh research agent left raw files in `/tmp/r.json` and `/tmp/all.md`. Delete them when convenient.
- Ideas not chosen this time:
  - different route orderings (GenAI-first vs fundamentals-first)
  - an AI tutor for each topic
  - related roadmaps and an FAQ block
  - English/Hindi resource variants
- Option 3 from decision 0001 (a real topic tree), only if the flat item list starts to hurt.
- From AI Engineering from Scratch, not in this plan:
  - a spaced-repetition review queue (needs a DB table)
  - an MCP server over our own notes and progress, so Claude Code can tutor from them
  - several career routes
  - "mutant" wrong solutions that the challenge tests must catch
- For you, outside the app (not installed): their Claude Code tutor (`npx skills add rohitg00/ai-engineering-from-scratch`), their MCP server, the interview bank, and the Claude and MCPA certification paths (alignment with the official exam guides is unverified).

## Research notes (sources fetched 2026-11-16; AI Engineering from Scratch fetched 2026-11-22)

| Source | Updated | Shape | Main takeaway |
|---|---|---|---|
| rohitg00/ai-engineering-from-scratch | 2026-11-18 | 542 lessons in 20 phases (MIT, about 80k stars). One content source feeds the website, a book, an AI tutor and an MCP server | Practice problems with tests and hints; multiple-choice quizzes with explanations and pre/check/post stages, with a check that answers aren't guessable; Problem → Build → Use → Ship lessons; a portfolio proof per route; hours by background. The best source for layers 3–6 |
| roadmap.sh/ai-engineer | 2026-11-10 | About 190 topics in a diagram (React Flow JSON), with a markdown file per topic | Typed resources, solid vs dashed (core vs optional) links, "pick one" groups, content keyed by node id |
| amitshekhariitbhu/ai-engineer-roadmap | 2026-11-16 | Steps 0–18, about 250 topics, one blog post each | Newest topics: context and harness engineering, MCP, GRPO/RLVR, inference, voice agents; a Step 0 must-know |
| bishwaghimire/ai-learning-roadmaps | 2026-06-15 | 12 markdown roadmaps that share one layout | Prerequisites, then 3 stages, then a resources table, then projects per level, then outcomes |
| krishnaik06 (index + 3 repos) | 2025 | Links to YouTube playlists in 3 paths | Path tied to a career outcome, route orderings, the agent framework list (LangGraph, CrewAI, AutoGen, Agno). GPL: take ideas only |
| EngrSaad2 | 2024-05 (stale) | A flat list of links | Free math and ML books (Strang, Hefferon, ISLR, Sutton and Barto, Bishop) |
