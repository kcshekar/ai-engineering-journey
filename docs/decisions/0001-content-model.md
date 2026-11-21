---
type: decision
title: Richer roadmap content model
status: proposed
updated: 2026-11-22
---

# 0001: Richer roadmap content model

## Context
Research on 5 AI roadmap sources (roadmap.sh, amitshekhariitbhu, bishwaghimire, krishnaik06, EngrSaad2; Nov 2026) showed ideas our layers lack:
- typed resources with a price and a "recommended" flag
- core vs optional items, and "pick one" groups
- hours per item and prerequisites
- a Must-know card, Beginner/Intermediate/Advanced stages, projects per level, and a "you can now…" outcomes list

Today a layer is a flat `courses[]` list. Progress, notes and code are all keyed by `courseId` in Turso (`progress.courses_completed`, `notes`, `exercises`, `course_meta`). Layer completion and the quiz unlock need every course to be done.

## Considered options
1. **Keep current**: leave `courses[]` as it is. New topics go in as more courses, with no types, no core vs optional and no hours.
2. **Extend the course item (additive)**: keep `courses[]` and every existing id. Add optional fields to each item: `kind` (course, video, article, docs, book, repo, project), `price`, `recommended`, `hours`, `track` (core or optional), `pickGroup`, `prereqs`, `stage`, `skills`. Add optional layer fields: `mustKnow`, `stageGoals`, `outcomes`, `pickGroups`. Projects become items with `kind: "project"`, so notes, code and ticks work for them unchanged. Completion counts only core items, and a pick group counts as done once any one of its items is done.
3. **New topic tree**: layer → topics → resources, with progress per topic. This needs a new table or column, a data migration for the c1–c8 progress, notes and code, and a rewrite of the loader and the progress API.

| | Keep current | Extend item (2) | Topic tree (3) |
|---|---|---|---|
| Cost | none | about 1–2 days of code | about 4–6 days of code plus a data migration |
| Risk | the content stays flat | low: the fields are optional, so the old JSON still loads | high: existing progress and notes rows must be re-keyed |
| DB change | none | none | yes |
| Reversible? | n/a | easy: revert the commits | hard: needs a down-migration of user data |
| Gets the research ideas | no | all 4 chosen ideas | all of them, plus nested topics |

Update, 2026-11-22: research on AI Engineering from Scratch (rohitg00, MIT, 542 lessons) supports option 2. That repo also keeps content as files and adds features as optional fields. It adds four optional pieces that fit option 2 with no DB change:
- `pythonChallenge.tests` and `hints`, run in the Pyodide setup we already have
- quiz `options`, `correct`, `explanation` and `stage` (the score goes to the existing `quizScore`)
- a `misconception` line on Must-know terms
- `keep` evidence on projects, and a `portfolioProof` per layer

## Decision
Chosen: **Extend the course item (2)**. It delivers all four ideas you picked (resource types and price, core vs optional, hours and prerequisites, layer layout with projects). It needs no database change and keeps existing progress valid. It can be reverted with git.

## Consequences
- Good: no migration. The c1–c8 progress, notes and code stay valid. The old JSON keeps loading.
- Good: projects get notes, code and ticks for free.
- Bad: "course" in the type and DB names now means "item". We keep the names to avoid churn and note the meaning in `types/index.ts`.
- Bad: no nested topics. A topic with several resources becomes several items in a pick group or stage. We revisit option 3 only if that hurts.
- Rule: **never rename or remove an existing item id.** Mark it optional instead.

## Confirmation
- `npm run verify` runs a content check: ids are unique, `prereqs` and `pickGroup` resolve, and enum values are valid.
- A read-only check query against dev shows the same `courses_completed` rows before and after.
- Layers 1–2 show the same completion state as before.
