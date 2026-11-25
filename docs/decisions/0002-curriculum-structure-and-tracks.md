---
type: decision
title: Curriculum structure, FDE layer and tracks
status: accepted
updated: 2026-11-25
---

# 0002: Curriculum structure, FDE layer and tracks

## Context
The 2026-11-23 research (`docs/research/`) found these gaps:
- Our 6 layers miss Forward Deployed Engineer (FDE) skills entirely (Bosscoder, curriculum track).
- Several items are stale, for example MCP before the 2026-07-28 spec.
- Learners want different targets: Applied AI, Agentic AI or FDE.

Krish Naik's roadmap uses a different shape: 10 short stages with ranks, checkpoints and a quest map, built from lesson slices. Decision 0001 says never rename or remove an item id, because progress, notes and code are keyed by `courseId`.

## Considered options
1. **Keep current**: 6 layers, and add items only where they fit. No FDE content, and no tracks.
2. **Extend (additive)**: keep layers 1–6 and every id. Add Layer 7 "Forward Deployed Engineering". Add optional stage metadata to layers (kicker, rank, colour, checkpoint). Add a `tracks` file that marks each layer or item as required or optional per track (Applied, Agentic, FDE). The quest map and focus mode are views over this data.
3. **Re-shape into Krish-style stages**: split the 6 layers into about 10–12 stages with new ids, and map old ids onto them.

| | Keep current | Extend (2) | Re-shape (3) |
|---|---|---|---|
| Cost | none | about 2–3 days of content, plus about 1 day of loader and type work | about 5–7 days, plus a re-key of progress, notes and code |
| Risk | content stays stale; FDE gap stays open | low: optional fields; old JSON loads; ids kept | high: DB rows must be re-keyed; layer completion flags change |
| DB change | none | none (tracks live in JSON) | yes (layer ids and progress rows) |
| Reversible? | n/a | easy: revert commits | hard: needs a down-migration of user data |
| Gets the research ideas | few | all: FDE, tracks, ranks, checkpoints, quest map | all, with closer visual parity to Krish Naik |

## Decision
Chosen: **Extend (2)**. It closes the top gaps (FDE, stale MCP, security, OTel) and enables tracks and the quest map, with no DB change, and it keeps decision 0001's id rule. Approved with the plan on 2026-11-25.

## Consequences
- Good: existing progress and completed layers stay valid; the quest map works from stage metadata.
- Good: tracks can mark Layer 4 (fine-tuning) as optional for Applied and FDE.
- Bad: layers stay larger than Krish Naik's stages; focus mode (UX-13) covers that in the UI.
- Bad: `meta.totalLayers` becomes 7, so the dashboard and overall progress must read the real layer count.

## Confirmation
- `npm run verify` passes, and `check-content.mjs` validates the new fields (`tracks`, stage metadata).
- Layers 1–2 keep their completed state (see 0001 update).
- The dashboard shows 7 layers, and the overall % counts only the layers required by the selected track.
