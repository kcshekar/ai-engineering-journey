# UX/UI audit: learningtracker (branch feat/ux-course-research)

Scope: read-only review of app/, components/, lib/, types/, the six layer.json files (field statistics), docs/roadmap.md. Date 2026-11-23. Contrast ratios are computed from the CSS tokens (WCAG 2.x formula). Not verified in a running browser, so layout findings come from reading CSS and JSX.

Content scale: 6 layers, 15-17 items each (93 total), 10-11 quiz questions and 6-7 must-know terms per layer, 4-5 Python challenges per layer.

---

## 1. Information architecture

### Pages

| Route | File | Shows | Notes |
|---|---|---|---|
| `/login` | app/(auth)/login/page.tsx | Email + password | Placeholders only (no labels), error has no `role="alert"`. |
| `/` Dashboard | app/(app)/page.tsx + DashboardClient | Progress ring, current layer card (status, core bar, hours chip, deadline badge, week chips), 4 stat cards, 26-week streak, this week's Build + Python task | Read-only. Nothing is a link. |
| `/layers` | layers/page.tsx | 6 layer rows: number, title, description, core bar, ~Nh core, weeks, status + Current badge | Only entry into a layer. |
| `/layers/[id]` | LayerDetailClient > LayerCard, WeeklyPlan, QuizSection | Header, Started/Deadline editors, must-know, deadline banner, start-here, items by stage, projects, outcomes + portfolio proof, weekly plan, quiz | One very long page, no in-page nav. |
| Course drawer | CoursePanel | Notes textarea, Python Practice (Monaco + Pyodide), Challenge tab | Where study actually happens. |
| `/notes`, `/notes/[layerId]` | notes pages | Static `notes.md` from the repo, rendered | Not the learner's own notes (see dead end 1). |
| `/projects` | projects/page.tsx | 2 hardcoded cards | Unrelated to the `kind: "project"` items. One card names day-job work: check against the employer-confidential rule. |

### Typical day today

1. Open Dashboard: sees %, and this week's task text. Cannot tell what to study next.
2. Layers (click 1) > current layer (click 2) > scroll through 15-17 cards to the next unticked one.
3. Click item (click 3): drawer opens on the Notes tab.
4. "Open course" (external tab), come back, type notes. Save is manual (Ctrl+S or button). Closing the drawer discards unsaved text with no prompt.
5. Python tab: Monaco loads from a CDN; Pyodide (about 10 MB) loads on first Run.
6. "Mark done" in the drawer, or the checkbox on the card.
7. Quiz is at the very bottom of the layer page, below the weekly plan.

Minimum 3 clicks plus a scroll to reach the first thing to study. Target: 1 click from the dashboard.

### Dead ends and gaps

1. Learner notes are not browsable. `/notes` lists repo notes.md files, not the notes typed in the drawer (stored in Turso). The only way to re-read your own note is to open that exact item. `hasNotes`/`noteChars`/`codeRuns` are already tracked per course.
2. No "continue where you left off". `CourseMetaEntry.lastEngaged` is returned by the API but never used for navigation. No next-unticked-item pointer. Drawer state is not in the URL (no `?item=`), so refresh or back loses it.
3. No search or filter: 93 items, skills, must-know terms, notes. Skill tags are not clickable.
4. Dashboard is passive: layer card, week chips, "Layer 2 of 6" are not links.
5. Two stat cards are dead. `totalHoursSpent: 0` and `weeklyCheckins: []` are hard-coded in app/(app)/page.tsx:66-67, shown at DashboardClient.tsx:110-112 as "Hours spent 0" and "Check-ins 0". `overallProgress: 0` is a placeholder; `meta.currentLayer` is stale and unused.
6. Quiz is far from the work. The pre-check ("know it already? skip ahead") is the best onboarding idea but sits below 15 cards. Skip-ahead only targets intermediate/advanced anchors.
7. Quiz copy contradicts the UI: QuizSection.tsx:145 says "not multiple choice" while the same card offers auto-scored MCQs; title says "Quiz Unlocked" while the final check may still be locked.
8. No layer switcher: from Layer 3 you go back to /layers to reach Layer 4. No prev/next.
9. RoadmapSelector is a fake control: a `<select>` with one option.
10. Sign out sits in the primary nav at equal weight.
11. Opening any item silently marks the layer started and starts the deadline clock (LayerCard.tsx:313-321). Layer `weeks` is not shown on the layer page itself.
12. Weekly plan is not actionable: `WeekPlan.courses` only feeds date suggestions; week cards list neither the items nor links.

---

## 2. Content model coverage (types/index.ts)

Good = clearly surfaced. Weak = shown but easy to miss or incomplete. Hidden = in JSON, never rendered.

### Course
| Field | Where shown | Verdict |
|---|---|---|
| title, platform, url | card, drawer, Open link | Good |
| kind | 14 px icon with `title` tooltip only | Weak (no text, no filter) |
| price | badge | Good; falls back to `cost` string |
| cost | drawer header, fallback | Redundant with price |
| duration / hours | card shows `hours` else `duration`; drawer shows `duration` only | Weak: card and drawer can disagree |
| videos | card, drawer | Good (only 2 of 15 items have it) |
| order | not used | Hidden (array order used instead) |
| why | card (not on compact pick-group cards); not in drawer | Weak: rationale vanishes where you study, and on pick-group members where choosing needs it most |
| recommended | "Top pick" badge | Good; does not pre-select inside pick groups |
| track | Optional badge; collapsed "Optional extras (N)" | Good (collapsed hides items completely) |
| stage | stage sections, pill, hours | Good |
| pickGroup | grouped card "Finish any 1 of N" | Good |
| prereqs | grey "Needs first: A, B" text, only for undone prereqs with known titles (LayerCard.tsx:176, 221) | Weak: not clickable, no blocked state, not in drawer; 10-14 of 15 items per layer carry prereqs; unknown ids vanish silently |
| skills | small tag chips, hidden on compact cards | Weak: not filterable, not aggregated per layer, not in drawer |
| keep | "Keep as evidence" list on project items only | Good for projects; never aggregated into a portfolio view |
| pythonChallenge | drawer Challenge tab, level badge | Good in drawer. No marker on the card, no saved pass/fail. `difficulty` and `level` are redundant. `hint` is always visible while `hints[]` are progressive, so the first hint is not hidden |

### Layer
| Field | Verdict |
|---|---|
| title, description | Good |
| weeks | Hidden on layer page; on /layers only when hours > 0 |
| appliesTo | Hidden: not rendered anywhere |
| mustKnow (term, oneLiner, misconception) | Good card grid with "Common trap" disclosure; sits above the items, not reachable from the drawer or quiz |
| stageGoals | Weak: one plain line under the stage pill |
| pickGroups | Good (labels) |
| outcomes | Weak: panel at the bottom of a very long page; flips to "You can now..." when done (nice) |
| startHere | Callout after must-know and the date row; below the fold on mobile |
| portfolioProof | Weak: inside the bottom outcomes panel; not on dashboard or /projects |
| weeklyPlan.week, focus | Good |
| weeklyPlan.dailyMinutes | Weekly plan page only, not the dashboard |
| weeklyPlan.buildTask, pythonTask | Good on dashboard (current week only) |
| weeklyPlan.courses | Hidden as UI |
| quiz.unlockCondition, passingScore | Shown |
| question `type`, MCQ `hint` | Hidden for MCQs |
| question `stage` | Drives the three modes. Good |

### Meta and progress
- `RoadmapMeta.description`, `startDate`: not shown. `targetRole` shown only up to the first "/" ("Applied AI Engineer").
- `completedDate`: never shown. `quizAttempts`: only inside the final-check button.
- `ActivityDay` type breakdown: only in a native `title` tooltip on 16 px cells (not touch or keyboard reachable).
- `CourseMetaEntry.lastEngaged`, `noteChars`, `codeChars`: unused. `views` only feeds a 4-level border colour.

Net: the content is richly authored and the UI under-sells it. Surface first: prereqs as a dependency state, `why` + `skills` in the drawer, `appliesTo`, outcomes/startHere at the top, `portfolioProof` + `keep` as a portfolio checklist, `weeklyPlan.courses` as the weekly to-do.

---

## 3. Visual design system

### Tokens (app/globals.css:3-58)
- Present: surface scale (bg-primary/secondary/card/card-hover/elevated), border, border-bright, text primary/secondary/muted, accent/cyan/amber/rose/purple with -dim variants, radius sm 8 / md 12 / lg 16 / xl 24, two font families, shadows. Dark and light via `[data-theme]` with a pre-hydration script. A solid base.
- Missing: type-scale tokens. 19 distinct font sizes (9, 10, 11, 12, 12.5, 13, 13.5, 14, 15, 16, 17, 18, 19, 20, 22, 24, 32, 36, 48). About 90 declarations at 9-12 px (24 at 11 px, 6 at 10, 2 at 9).
- Missing: spacing tokens. About 17 distinct padding/gap values (2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 40), several off a 4/8 grid.
- Hardcoded colour: about 118 colour literals against 389 `var(--` uses. Examples: completed card `rgba(34,197,94,0.3)` (globals.css ~396), StreakGraph.tsx:37-38, LayerCard.tsx:30, `#fff` logo (line 122), black backdrop/shadow in both themes.
- `transition: all` appears 17 times.
- Inline styles bypass tokens: LayerDetailClient.tsx:230, WeeklyPlan.tsx:291/298, layers/page.tsx:133, projects/page.tsx:246.
- `.projects-grid` is shared by the /projects page and the in-layer projects section (LayerCard.tsx:502): a change to one affects the other.
- Emoji used as icons in empty states and output (📝 🐍 ⏳ ✓) next to lucide icons.
- Seven or more button styles (nav-btn, panel-btn, mcq-btn, output-*-btn, course-notes-btn, login-btn, deadline-value) and 8+ badge/pill systems (badge-*, engage-badge, stage-pill, layer-row-badge, current-layer-badge, deadline-badge, deadline-badge-dash, challenge-*-badge), with different heights and radii. No shared Card, Button or Badge primitive.
- Font loading: CSS `@import` of Google Fonts (globals.css:1).

### Contrast (WCAG AA: 4.5:1 text under 18 px, 3:1 large text and UI)
| Pair | Ratio | Verdict |
|---|---|---|
| Dark: `--text-muted` #64748B on card #1A1F2E | 3.45 | Fails |
| Dark: muted on bg-primary #0B0F1A | 4.02 | Fails |
| Dark: muted on bg-elevated #252B3B | 2.97 | Fails badly |
| Dark: text-secondary #94A3B8 on card | 6.40 | Pass |
| Light: muted #64748B on card #FFFFFF | 4.76 | Pass (marginal) |
| Light: muted on bg-primary #F5F7FA | 4.43 | Fails by a hair |
| Light: muted on bg-elevated #EEF1F6 | 4.20 | Fails |
| Light: text-secondary #475569 on white | 7.58 | Pass |
| Light: accent #16A34A text on white | 3.30 | Fails |
| Light: cyan #0891B2 on white | 3.68 | Fails |
| Light: amber #D97706 on white | 3.19 | Fails |
| Light: white text on accent #16A34A | 3.30 | Fails under 18 px bold |
| Dark: accent #22C55E on card | 7.20 | Pass |
| Dark: dark navy on #22C55E (checkbox tick, selection) | 8.4 | Pass |
| Dark: white on #22C55E | 2.28 | Fails (avoid) |
| Light: rose, purple on white | 4.70, 5.70 | Pass |

Muted text is used at 9-12 px (dates, "Wk N", badges, hours, streak legend, empty output). Dark-theme meta text on cards therefore fails AA across the app. Suggested fix: dark `--text-muted` to about #8A9AB3 (about 5.3:1 on card); add `--accent-text`, `--cyan-text`, `--amber-text` darker variants for light-theme text (for example #15803D, #0E7490, #B45309, all above 5:1) and keep the bright values for fills. Item engagement is a 3 px coloured border (a text badge also exists, good); the streak graph is colour-only.

### Focus and keyboard
- Good: global `:focus-visible` outline (globals.css:790).
- Inputs, notes textarea, roadmap select and login inputs set `outline: none` and rely on a 1 px border colour change (lines 356, 620, 676, 756): weak focus cue.
- Item card info area is a `div role="button" tabIndex=0` that contains the CourseTimeline buttons: nested interactive controls (ARIA violation). The checkbox button has no `aria-pressed`/checkbox role.
- Drawer is not an accessible dialog: no `role="dialog"`/`aria-modal`, no focus trap, no focus move on open or return on close, no Escape handler (only Ctrl+S and Ctrl+Enter), icon-only close button without a name, tabs without tab roles. Backdrop click closes with no unsaved-changes guard.
- At 768 px and below the nav labels are `display:none` (globals.css:149-153), so the links become icon-only with no accessible name (sign out has only a `title`).
- No skip link; no `<h1>` on the dashboard; layer title is `h2`; /notes titles are divs. All pages share one `<title>`.
- Login: placeholders without labels, error without `role="alert"`.
- Streak cells are `title`-only and not focusable.
- Monaco is always `vs-dark`, even in the light theme.

### Motion
- A global CSS reduced-motion rule exists (globals.css:787-789) plus two local ones. It does not affect Framer Motion: header slide-in, page fade/slide, 1.2 s progress ring, 0.8 s bars, staggered card entrances on every layer page, quiz scale-in, drawer spring. No `useReducedMotion` or `MotionConfig reducedMotion="user"` anywhere. Wrapping Providers in `<MotionConfig reducedMotion="user">` fixes it.
- Entrance animations replay on every visit; content starts at opacity 0 until hydration. Infinite `logo-shift` gradient animation in the header.

### Responsive
- Only three breakpoints (600, 768, 900). Header collapses to icons at 768; dashboard top goes single column at 900; stats two-up at 768. Drawer is `min(640px, 100vw)` and fits a phone, but Monaco plus the output panel stacked in it leaves little editing height (unverified on device).
- Streak grid scrolls horizontally; month labels use hard-coded `col * 16` px (StreakGraph.tsx:94), coupled to CSS cell size.
- No per-page metadata or manifest/theme-color.

### Loading, empty, error states
- No `loading.tsx`, `error.tsx` or `not-found.tsx` under app/. Pages query Turso server-side with no Suspense boundary, so navigation waits on the previous page; a DB failure shows the framework error page.
- Notes and code fetch failures are swallowed: `api.getNotes`/`getCode` return `{content: ""}` on error (api-client.ts:31-32, 36-37). A later Save would overwrite real notes with an empty string. Silent data-loss path.
- Writes are optimistic with no rollback: `post()` returns `{ok:false}` on HTTP errors and callers ignore it, so a failed tick looks saved. `api.saveLayerProgress` is called inside `setProgress` updaters (LayerDetailClient.tsx:178, 220), a side effect in a pure function that double-fires under Strict Mode.
- Course metas fetch failure leaves badges missing with no message.
- Empty states exist for notes and challenges (emoji based); none for the all-zero streak graph.
- Saving is manual only: no autosave, no `beforeunload` guard, closing the drawer drops edits.

---

## 4. Performance and UX

- Client component size: CoursePanel.tsx (449 lines: Pyodide loader, two Python harness strings, notes, editor, challenge UI) and LayerCard.tsx (533 lines, 7 sub-components, grouping logic in a JSX IIFE) are imported statically by the layer page, so the drawer, the Monaco wrapper and Framer Motion ship in the layer bundle even if the drawer is never opened. Use `next/dynamic` with `ssr: false` for CoursePanel and split LayerCard.
- Monaco loads its core from a CDN at runtime on first Code-tab render (no custom `loading` UI, fails offline). Pyodide v0.26.4 (about 10 MB) loads on first Run with only a text line as feedback and is not preloaded when the Code tab opens.
- Fonts: render-blocking CSS `@import`; use `next/font`.
- Layout shift: engagement badges and borders arrive after a client fetch on every layer mount; drawer "Loading..." swaps to content; font swap; entrance animations from opacity 0.
- Cost: every item card is a `motion.div` with stagger; `backdrop-filter` blur on the sticky header and a full-viewport blur on the backdrop.
- Server: the progress-row-to-map block is copy-pasted in three pages (about 14 lines each); `getRoadmapLayers` re-reads and parses all JSON per request; `getLayerNote` re-reads every layer's notes to render one. Small at this scale.

---

## 5. Prioritised issues

Severity: High = data loss, a11y blocker or core flow; Med = notable friction; Low = polish. Effort: S under 2 h, M half a day, L over a day.

| # | Sev | Where | Issue | Fix | Effort |
|---|---|---|---|---|---|
| 1 | High | CoursePanel.tsx handleSave; lib/api-client.ts:31-37 | Failed notes/code load becomes empty content, and Save can overwrite real notes. Closing the drawer drops unsaved edits with no prompt. | Treat load error separately (disable edit, retry), add debounced autosave, guard close and `beforeunload`. | M |
| 2 | High | DashboardClient.tsx, app/(app)/page.tsx | No "continue where you left off" or next action; 3 clicks + scroll to start. `lastEngaged` unused. | "Continue: item" hero: last-engaged item, else first unticked in the current layer, deep link `/layers/N?item=id` that opens the drawer. | M |
| 3 | High | notes/page.tsx, notes/[layerId]/page.tsx | "Notes" shows static repo files, not the learner's own notes. | List DB notes by layer/item (with `noteChars`, `lastEngaged`) linking back to the item; keep repo notes as a tab. | M |
| 4 | High | globals.css:3-58 | AA failures: dark muted on card 3.45 (2.97 on elevated); light accent 3.30, cyan 3.68, amber 3.19 as text at 9-12 px. | Lighten dark muted; add darker `*-text` tokens for light theme. | S |
| 5 | High | CoursePanel.tsx (panel markup) | Drawer is not an accessible dialog: no role, trap, focus return, Escape, close label, tab roles. | `role="dialog" aria-modal`, focus management, Escape, `aria-label="Close"`, tablist semantics. | M |
| 6 | High | Header.tsx:47; globals.css:149-153 | Icon-only nav at <=768 px has no accessible name. | Visually-hidden text or `aria-label` on each link and button. | S |
| 7 | High | LayerDetailClient.tsx:165-222 | API calls inside `setProgress` updaters double-fire in Strict Mode; failures ignored so a failed tick shows as done. | Compute state outside the updater, call API once, roll back and toast on failure. | S |
| 8 | Med | DashboardClient.tsx:110-112; page.tsx:63-67 | "Hours spent" and "Check-ins" are always 0; `overallProgress` placeholder; stale `meta.currentLayer`. | Show real data (items done this week, active days, hours from completed items' `hours`, next deadline) or remove. | S |
| 9 | Med | LayerCard.tsx; layers/[id] | One long page; outcomes, start-here and portfolio proof buried; quiz at the bottom. | Sticky sub-nav (Overview / Items / Plan / Quiz), "next item" button, goals at the top, collapse completed items. | M |
| 10 | Med | LayerCard.tsx:176, 221 | `prereqs` only as grey text for undone prereqs; not clickable; unknown ids vanish. | Prereq chips that scroll to or open the prerequisite; blocked/dim state; show in drawer. | M |
| 11 | Med | CoursePanel.tsx header | Drawer omits `why`, `skills`, `hours`, `kind`, `prereqs`, `keep`; shows `duration` where the card shows `hours`. | Collapsible "About this item" block using one shared formatter. | S |
| 12 | Med | (none) | No search or filter over items, skills, terms, notes. | Ctrl+K palette; filter chips (not done, has notes, kind, price); clickable skills. | L |
| 13 | Med | Providers.tsx; Framer usages | Framer Motion ignores reduced-motion; long entrance and stagger on every visit; content hidden until hydration. | `<MotionConfig reducedMotion="user">`; drop page-level entrance and card stagger. | S |
| 14 | Med | globals.css | 19 font sizes, about 90 declarations at 9-12 px; no type or spacing tokens. | Define `--text-*` and `--space-*`, 12 px floor, migrate badges, tags, dates. | M |
| 15 | Med | app/ | No loading/error/not-found files; one global `<title>`. | Route `loading.tsx` skeletons, `error.tsx`, per-page `generateMetadata`. | S |
| 16 | Med | LayerCard.tsx:192-236 | `role="button"` div wraps interactive controls; checkbox lacks state semantics. | Real button for the title, timeline outside it; `role="checkbox" aria-checked`. | S |
| 17 | Med | QuizSection.tsx:141-157 | Copy contradicts the MCQs; "Unlocked" while final check is locked. | Rewrite: practice checks always on, final check unlocks at N items; mentor-chat text only when present; surface quiz in the layer header. | S |
| 18 | Med | globals.css 356, 620, 676, 756 | `outline: none` with 1 px border-colour focus cue. | Focus ring via `box-shadow` on `:focus-visible`. | S |
| 19 | Med | CoursePanel.tsx (Monaco theme, Pyodide) | Editor always dark; text-only runtime loading; challenge pass state not saved and no card marker. | Theme from `useTheme`; spinner and idle preload; save pass in course-meta and show a badge. | M |
| 20 | Med | CoursePanel/LayerCard imports | Drawer, Monaco wrapper and Framer in the layer bundle; 533-line LayerCard. | `dynamic(..., { ssr: false })`; split LayerCard into ItemCard, StageList, DeadlineRow, OutcomesPanel. | M |
| 21 | Low | globals.css:1 | Render-blocking font `@import`, FOUT shift. | `next/font/google`. | S |
| 22 | Low | LayerCard.tsx:30; StreakGraph.tsx:37-38; globals.css | Hardcoded colours ignore the theme. | Move to tokens (`--accent-dim`, `--streak-1..3`). | S |
| 23 | Low | globals.css (17 uses) | `transition: all`. | Limit to colour/transform/opacity. | S |
| 24 | Low | RoadmapSelector.tsx | Fake one-option select. | Plain text until a second roadmap exists. | S |
| 25 | Low | StreakGraph.tsx:10, 100-109 | Details only in native tooltip; cells not focusable; day keys use `toISOString` (UTC), so evening activity in negative-offset zones lands on the wrong day. | Visible tooltip, text summary, local-date keys. | S |
| 26 | Low | Header.tsx | Sign out in the primary nav; no `aria-current`. | Account menu; `aria-current="page"`. | S |
| 27 | Low | LayerCard.tsx:313-321 | Opening any item silently starts the layer and deadline clock. | Start on first tick or explicit "Start layer". | S |
| 28 | Low | `appliesTo`, `order`, `completedDate`, `meta.description/startDate`, `weeklyPlan.courses` | Fields never rendered. | "Good for" chips; items listed under each week; "Completed on" date. | S |
| 29 | Low | projects/page.tsx | Hardcoded cards; ignores project items, `keep` and `portfolioProof`; one card names day-job work. | Generate from layer data with done state; drop or generalise the private line (employer rule). | M |
| 30 | Low | StreakGraph.tsx:94 | Month labels at hard-coded `col * 16`. | CSS variable or grid placement. | S |

### Suggested order
1. Quick wins, about 1 day: 4, 6, 7, 8, 13, 15, 17, 18, 21, 23.
2. Daily-use loop, 2-3 days: 2, 3, 5, 1 (autosave), 11, 9.
3. Later: 12 search, 10 prereq states, 14 tokens, 20 splitting, 19, 29.

### Keep
- Two complete themes, pre-hydration script (no flash), system mode.
- Real content model: stages, pick groups with "any 1 of N" maths, optional extras, project evidence, outcomes flipping to "You can now...".
- Auto-scored pre-check with skip-ahead, in-browser Python with per-assert checks and progressive hints, summary-prompt copy button.
- Global focus-visible outline, global reduced-motion CSS rule, token-driven colour (389 var uses), overflow fixes.
