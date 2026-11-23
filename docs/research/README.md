---
type: research
title: UX and course research index
updated: 2026-11-23
---

# UX and course research (2026-11-23)

Six parallel research tracks for `docs/plans/ux-course-upgrade.md`. Every idea we keep is in `tracker.md` with an ID. The reports below are the raw evidence.

| # | File | What it covers | Confidence |
|---|---|---|---|
| 01 | `01-codingninjas.md` | Coding Ninjas "Advanced Certification in GenAI and Multi-Agent Systems": months 1–3, 4 named projects, perks and thresholds | Page text verified; months 4–6 gated |
| 02 | `02-bosscoder-fde.md` | Bosscoder "AI Forward Deployed Engineer": 8 modules / 24 weeks, a project per module, FDE skills matrix | Page verified; FAQ answers, syllabus and fees gated |
| 03 | `03-krishnaik.md` | Krish Naik Agentic AI Engineer roadmap: 10 stages, 27 stops, the `id=/roadmap=/stop=` lesson-slice scheme, quest map, tutorial UX | Verified from server-rendered `__NEXT_DATA__` |
| 04 | `04-modern-ux.md` | 35 modern learning-UX patterns, design-system tokens, WCAG 2.2 | Tagged `[V url, date]` / `[K]` not rechecked / `[X]` removed |
| 05 | `05-curriculum-2026.md` | Late-2026 topic map, gap table against our 6 layers, projects per level, tracks | Section 0.1 lists live-verified facts; `[U]` = unverified |
| 06 | `06-app-ux-audit.md` | Code-level UX audit of this app: 30 issues with severity and effort | Read from code, not checked in a browser. Issue 7's line ref is really `LayerDetailClient.tsx:23-35, 70-77` |

## What we could not get, and how you can get it

| Source | Blocked content | How to get it |
|---|---|---|
| Coding Ninjas | Months 4–6, hours, weekly schedule, the 20+ tools list (behind the "Download full curriculum" form); LMS dashboard (login) | Submit the form, then save the brochure PDF into `docs/research/raw/` (gitignored if you prefer) or paste its text to me. Screenshots of the page cover the visual design. |
| Bosscoder | Brochure (form), Syllabus page, 23 of 24 FAQ answers (collapsed, JS), fees (callback only), learner dashboard | Open the page, expand all FAQs, then use Ctrl+P → "Save as PDF". Download the brochure and drop it in `docs/research/raw/`. |
| Krish Naik | Rendered look and feel (no browser here), quiz pages, capstone page, `/learn-ai` dashboard and Vidya AI tutor (login) | Chrome DevTools → device toolbar → ⋮ → "Capture full size screenshot" for the roadmap and one lesson. For login pages: sign in, then DevTools → Application → Local Storage and Network (copy the JSON responses). |
| roadmap.sh | AI Engineer / AI Agents node lists (rendered client-side) | Open each roadmap, then use "Download" (PDF/PNG) on the page, or paste the node list. |
| OWASP | Item titles of the Agentic Top 10 (2026) | Download the PDF from genai.owasp.org and drop it in `docs/research/raw/`. |
