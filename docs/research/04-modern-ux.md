# Modern learning-tracker UX patterns (2025-2026) for a single-user Next.js tracker

Written 2026-11-23. Verification pass done the same day with WebFetch/WebSearch.
Tags: **[V url, date]** = checked against a live page on 2026-11-23. **[K]** = from general knowledge, not re-checked (treat as likely, confirm before citing). **[X]** = removed or corrected because it failed verification.
Learning-science citations are classic papers (Roediger & Karpicke 2006; Cepeda et al. 2006; Rohrer & Taylor 2007; Bjork & Bjork; Dunlosky et al. 2013; Sweller). They were not re-fetched.
Effort: S = under 1 day, M = 1-3 days, L = a week or more. Priority is for a SINGLE-USER tracker (no leagues or social).

## 0. Verification results (what changed vs the first draft)
- roadmap.sh AI Tutor: launched 3 Apr 2025; floating tutor on roadmap pages + global chat 27 Jun 2025; "personalize" button on every roadmap 22 Aug 2025; AI Learning Plan Generator 22 Sep 2025; tutor in all guides 31 Dec 2025; AI tooltips that explain terms 27 Feb 2026. [V https://roadmap.sh/changelog, 2026-11-23]. The changelog has NO entries about progress tracking, so I make no claim about roadmap.sh progress features beyond what I knew [K].
- Boot.dev: Boots is a Socratic chatbot that knows your lesson and solution and is trained not to give the answer; before completing a lesson it costs 1 baked salmon or 50% of the lesson XP, after completion it is free. XP: next level needs current level x 5 XP; max role Archmage at level 100. Streak needs a lesson or a commit to a linked GitHub repo per calendar day in your timezone; Embers and Frozen Flames protect streaks (4 days for vacation per the Jan 2025 Beat). Daily quests date from a 2023 update. [V https://www.boot.dev/dashboard?modal=info-streak ; https://www.boot.dev/blog/news/bootdev-beat-2025-01 ; https://blog.boot.dev/news/bootdev-beat-2023-06/ , 2026-11-23]. 2026 posts: Nov 2026 Beat (light mode, rearrangeable lesson page sections, Learn AI Coding course), Oct 2026 Beat (profile redesign, Training Grounds keeps a queue of challenges) [V https://www.boot.dev/blog, 2026-11-23]. Details of the Nov post could not be fetched (404 on the guessed URL).
- Duolingo streak freeze: equipped in advance, applied automatically on a missed day, up to two equipped, bought with gems (200 per third-party guides). Official help page not found, so exact cost is [K]. [V https://blog.duolingo.com/how-duolingo-streak-builds-habit and search results, 2026-11-23].
- Brilliant: launched Koji, an AI tutor for math and coding, blog dated 29 May 2026; guided hints and a Socratic style, not direct answers. [V https://blog.brilliant.org/a-world-class-tutor-in-every-home/ via search, 2026-11-23]. First draft said nothing about this; it is the strongest 2026 precedent for a hint-first tutor.
- DeepLearning.AI: NO evidence of an in-platform AI assistant; a community thread asks for one. It has a Pro membership and a steady flow of short courses. [V https://www.deeplearning.ai/blog/thank-you-for-learning-with-deeplearning-ai-this-year and https://community.deeplearning.ai/t/an-ai-learning-assistant-for-ai-learning-platform/806134 , 2026-11-23]. [X] my earlier claim "DeepLearning.AI course assistant" is removed. The split video+notebook layout is [K].
- Frontend Masters: 24 learning paths, 250+ courses, per-course progress tracking, bookmarks, annotations, public profile with path completion rate (courses watched 50%+ shown coloured). [V https://frontendmasters.com/features , 2026-11-23]. A "Continue watching" button was NOT confirmed; the claim is downgraded to [K].
- Exercism: blog fetch gave no dated 2025-26 feature posts (only "GitHub Syncer and Favorites", "over 1 year ago"). Concept exercises, mentoring and the test-runner UI remain [K]; I do not cite Insiders or badges as current.
- cmdk: package `cmdk`, unstyled with `[cmdk-*]` data attributes, `Command.Dialog` composes Radix Dialog, a11y tested with VoiceOver per its FAQ. The README states React 18 and does not mention React 19; confirm peer deps on npm before installing into Next 15/16. [V https://github.com/pacocoursey/cmdk , 2026-11-23].
- ts-fsrs: current major is v6; README example uses `DefaultScheduler()` (async), `scheduler.newCard({now})`, `scheduler.preview({card, now})`, `scheduler.review({card, grade: Rating.Good, now})`, default algorithm FSRS-7; MIT; supports ESM/CJS/UMD. **README says ts-fsrs v6 and its binding require Node >= 24.** Our repo asks for Node 22.18+, so either upgrade Node or pin an older ts-fsrs (v4/v5 API with `fsrs()`, `createEmptyCard()`, `f.repeat(card, now)` is [K], unverified). [V https://github.com/open-spaced-repetition/ts-fsrs , 2026-11-23]. [X] my earlier snippet of `fsrs()/repeat` as the current API.
- WCAG 2.2: W3C Recommendation, dated 12 Dec 2024 on the page. 2.5.8 Target Size (Minimum) is AA, 24x24 CSS px with exceptions (spacing, equivalent, inline, user-agent, essential). 2.4.11 Focus Not Obscured (Minimum) is AA. 2.4.13 Focus Appearance is AAA, in WCAG 2.2, area at least a 2px perimeter and 3:1 change of contrast. 3.3.7 Redundant Entry is A; 3.3.8 Accessible Authentication (Minimum) is AA. [V https://www.w3.org/TR/WCAG22/ and https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html , 2026-11-23]. Note: "published Oct 2023" in draft 1 was wrong; the Recommendation is dated Dec 2024 on the TR page (the original 2.2 Recommendation was Oct 2023 and it was re-issued, so cite the TR page date).

## 1. Pattern catalogue

### A. Navigation and flow
| # | Pattern | What it is | Best example | Why it helps | Effort | Priority |
|---|---|---|---|---|---|---|
| 1 | Resume hero card | One large card: last item, stage, % done, one "Resume" button deep-linking to the exact step | Duolingo path, Scrimba, Frontend Masters [K] (resume button not confirmed) | Lowers start-up friction; Zeigarnik effect keeps unfinished work salient | S | P0 |
| 2 | Command palette Cmd/Ctrl+K | Fuzzy search over items, layers, notes, terms, plus actions (mark done, new note, focus mode) | Linear, Raycast [K]; cmdk [V github.com/pacocoursey/cmdk] | Cuts navigation cost; doubles as retrieval surface for terms | S-M | P0 |
| 3 | Keyboard shortcuts | `g d`, `j/k`, `x` done, `/`, `?` sheet, `f` focus | Linear, GitHub [K] | Protects flow | S | P1 |
| 4 | Focus mode | Hide chrome, show only item + notes + code | Scrimba, Brilliant [K] | Less extraneous cognitive load (Sweller) | S | P1 |
| 5 | Sticky progress header and breadcrumb | Layer > Item > Stage with thin progress bar | roadmap.sh [K] | Orientation | S | P1 |
| 6 | AI tutor side panel, hint-first | Docked panel that knows the current item, notes and code; Explain / Quiz me / Review code; Socratic by default | roadmap.sh AI Tutor + floating tutor [V roadmap.sh/changelog, 2025-04 to 2026-02]; Boot.dev Boots (Socratic, costs XP before completion) [V boot.dev]; Brilliant Koji [V blog.brilliant.org, 2026-05-29] | Self-explanation and elaboration (Dunlosky 2013); hint-first protects desirable difficulty | L | P2 |
| 7 | AI term tooltips | Hover/tap a term to get a short AI or glossary explanation | roadmap.sh guides [V changelog 2026-02-27]. For us, use our own Must-know terms first (S), AI later | Just-in-time elaboration | S (static) / M (AI) | P2 |

### B. Progress and motivation
| # | Pattern | What it is | Best example | Why | Effort | Priority |
|---|---|---|---|---|---|---|
| 8 | Honest contribution heatmap | Year grid, 5 intensity steps, tooltip "N things on Date", weekday labels, longest streak, count real learning events | GitHub [K] | Visible streak is a commitment device | S | P0 |
| 9 | Streak forgiveness | Freeze, or "4 of 7 days" weekly goal | Duolingo streak freeze, max 2 equipped [V blog.duolingo.com]; Boot.dev Embers and Frozen Flames [V boot.dev dashboard] | Avoids the what-the-hell effect after a miss | S | P0 |
| 10 | Progress rings and segmented bars | Per-layer ring with count; bar split by stage | Apple rings, Brilliant tiles, Exercism tracks [K] | Goal-gradient effect | S | P0 |
| 11 | Light XP and levels | XP per action, level titles; level N needs N x 5 XP (Boot.dev formula) | Boot.dev [V boot.dev lessons, 2026-11-23] | Early habit help; overjustification risk (Deci 1971), so tie XP to retrieval | M | P2 |
| 12 | Daily/weekly quests | e.g. "3 reviews + 1 challenge" | Boot.dev daily quests (2023 origin) [V blog.boot.dev 2023-06] | Concrete small goals | M | P2 |
| 13 | Training-queue of ready challenges | A queue of next challenges prepared for you | Boot.dev Training Grounds [V boot.dev blog, Oct 2026 Beat] | Removes choice friction | M | P2 |
| 14 | Leagues, leaderboards | Weekly ranks | Duolingo [K] | Social; meaningless solo | M | SKIP |
| 15 | Milestone toasts | Layer done, 7/30/100-day streak | Boot.dev, Exercism [K] | Marks progress | S | P2 |
| 16 | Weekly review card | Done, time, weakest quiz topics, next week prefilled | Maven/cohort dashboards [K] | Metacognition | M | P1 |
| 17 | Profile / path completion view | Completion rate per path, coloured when watched 50%+ | Frontend Masters profiles [V frontendmasters.com/features] | Visible mastery map | S | P3 |

### C. Learning-science mechanics (highest learning value)
| # | Pattern | What it is | Best example | Why | Effort | Priority |
|---|---|---|---|---|---|---|
| 18 | FSRS spaced-review queue | Cards (terms, quiz Qs, snippets) with due date; "Review N due"; 4 ratings with predicted next interval | Anki, FSRS; ts-fsrs v6 `DefaultScheduler`, `newCard`, `preview`, `review`, `Rating` [V github.com/open-spaced-repetition/ts-fsrs] | Spacing and testing effects | M; Node >= 24 for v6 (we target 22.18+), pin older version or upgrade | P0 |
| 19 | Retrieval-first UI | Show term only, recall, reveal, self-grade | Anki, Brilliant [K] | Retrieval beats rereading (Karpicke & Blunt 2011) | S | P0 |
| 20 | Interleaved mixed review | Due items from several layers in one session | Brilliant, Anki [K] | Interleaving aids discrimination (Rohrer & Taylor 2007) | S after #18 | P1 |
| 21 | Hint ladder | Hint 1, hint 2, solution; log use; lock solution until N attempts | Boot.dev Boots (Socratic) [V], Exercism [K] | Productive struggle | S | P1 |
| 22 | Test-result list in code runner | Per-test pass/fail rows, Ctrl+Enter run, console, reset | Exercism, Boot.dev [K] | Immediate feedback | S | P1 |
| 23 | Confidence rating | "How sure?" before answering, calibration chart | [K] | Metacognition | S-M | P2 |
| 24 | Explain-it-back note | 2-sentence teach-it prompt per item | Feynman technique [K] | Self-explanation | S | P1 |

### D. Maps and structure
| # | Pattern | What it is | Best example | Why | Effort | Priority |
|---|---|---|---|---|---|---|
| 25 | Interactive roadmap graph | Status-coloured nodes, click opens drawer, pan/zoom | roadmap.sh [K], React Flow | Advance organizer (Ausubel) | L (M for a static layered map) | P1 |
| 26 | Item drawer | Side sheet for details while list stays | roadmap.sh, Linear [K] | Keeps context | M | P1 |
| 27 | Stage chips, kind icons, pick-group badges | Compact labelled chips; "pick 1 of 3" with clear chosen state | [K] | Scannability | S | P0 |
| 28 | Portfolio proof cards | Outcome linked to evidence (repo, demo) with gap warnings | Maven showcases [K] | Transfer, career value | S-M | P1 |
| 29 | Week strip | 7-day strip, today highlighted, time boxes | Linear cycles, Maven [K] | Implementation intentions (Gollwitzer) | M | P1 |
| 30 | Personalised roadmap | AI adjusts the roadmap to background and goals | roadmap.sh personalize [V changelog 2025-08-22] | Relevance | L | P3 (single user already curated) |

### E. Visual and interaction trends
| # | Pattern | Notes | Effort | Priority |
|---|---|---|---|---|
| 31 | Bento dashboard | Asymmetric card grid with CSS grid areas and container queries [K] | S-M | P0 |
| 32 | Dark-first tokens | Already dark. Boot.dev just added a light mode (Nov 2026 Beat) [V], so a light theme is optional, P3 | S | P3 |
| 33 | Subtle glass | `backdrop-filter` only on palette, drawer, sticky header | S | P1 |
| 34 | Variable fonts | Fontsource variable builds for Fira Code; Fira Sans variable availability [K, check] | S | P1 |
| 35 | Motion with reduced-motion | `MotionConfig reducedMotion="user"`, count-ups, ring draw, check tick | S | P0 |
| 36 | Optimistic UI + skeletons | Instant tick with undo toast | S-M | P1 |
| 37 | Rearrangeable lesson sections | Let user reorder panels (notes, code, quiz) | Boot.dev lesson page [V Nov 2026 Beat title] | M | P2 |
| 38 | Terminal microcopy | `$ resume`, caret on active item | S | P1 |

### F. Accessibility (WCAG 2.2 [V w3.org/TR/WCAG22, 2026-11-23])
- 2.5.8 Target Size (Minimum), AA: 24x24 CSS px or spacing exception. Aim 32-40 for primary controls.
- 2.4.11 Focus Not Obscured (Minimum), AA: sticky header and palette must not fully hide focus; use `scroll-padding-top`.
- 2.4.13 Focus Appearance, AAA (in 2.2): at least 2px perimeter, 3:1 contrast change. Good target, not required.
- 3.3.7 Redundant Entry (A), 3.3.8 Accessible Authentication (AA): login must allow paste and password managers.
- Still relevant from 2.1: 1.4.3 (4.5:1 text), 1.4.11 (3:1 UI), 1.4.13 (tooltips dismissible and hoverable), 2.1.4 (single-key shortcuts need off switch or no-input-focus scope), 2.3.3 (animation), 1.4.10 reflow [K].
- Heatmap needs a text or table alternative; do not rely on colour alone for stage status.
- Monaco: confirm the Tab-escape shortcut (Ctrl+M) [K].

## 2. Design-system recommendations (dark terminal identity, plain CSS)

### Colour tokens (`:root`)
```
--bg:#0a0d0b; --surface-1:#101512; --surface-2:#161d19; --surface-3:#1e2823;
--border:rgba(255,255,255,.08); --border-strong:rgba(255,255,255,.16);
--text:#e6efe9; --text-dim:#9bab9f; --text-faint:#6f8076; /* faint: non-essential only, verify contrast */
--accent:#3ddc84; --accent-strong:#22c55e; --accent-ink:#04130a; --accent-glow:rgba(61,220,132,.18);
--info:#5bc0ff; --warn:#ffb84d; --danger:#ff6b6b; --violet:#a78bfa;
--heat-0:#121815; --heat-1:#0f3d24; --heat-2:#166534; --heat-3:#22a055; --heat-4:#3ddc84;
--focus-ring:0 0 0 2px var(--bg),0 0 0 4px var(--accent);
```
Stage colours (always with icon and label): todo faint, learning info, practiced violet, done accent, skipped warn-dim. Bold touches: ambient radial green glow at top of dashboard, faint 24px dot grid at 3-4% opacity. Run a contrast check on every token pair before shipping.

### Type scale (ratio 1.25; Fira Sans UI, Fira Code for numbers and labels)
```
--fs-xs:.75rem; --fs-sm:.875rem; --fs-base:1rem; --fs-lg:1.25rem;
--fs-xl:clamp(1.5rem,1.2rem + 1vw,1.875rem); --fs-2xl:clamp(2rem,1.5rem + 2vw,2.75rem);
line-height 1.55 body / 1.15 headings; letter-spacing -.01em at xl and up
```
`font-variant-numeric: tabular-nums` on counters. Labels: Fira Code, uppercase, .7rem, +.08em tracking.

### Spacing, radius, elevation
4px base (4, 8, 12, 16, 24, 32, 48, 64). Card padding 20-24, grid gap 16. Radius 6 chips, 12 cards, 16 panels, 999 pills. Elevation by border and surface step; one glow for active: `0 0 0 1px var(--accent), 0 8px 32px var(--accent-glow)`. Glass: `color-mix(in oklab, var(--surface-3) 70%, transparent)` + `backdrop-filter: blur(14px) saturate(1.2)` on palette, drawer, sticky header only.

### Layout
Dashboard: 12-col, max 1200. Resume (6 x 2 rows), review-due (3), today streak (3), heatmap (8), weekly plan (4), 6 layer rings (12). One column under 720px via container queries. Layer detail: list 40% / CoursePanel 60% at 1100px+, drawer on mobile, sticky progress header, stage groups collapsible.

### Components (build order)
1 ProgressRing, SegmentedBar, StatTile. 2 ResumeCard. 3 CommandPalette (cmdk) and ShortcutSheet. 4 StageChip, KindIcon, PickGroup. 5 Heatmap (tooltip, legend, table fallback). 6 ReviewSession and DueBadge. 7 TestResultList, HintLadder. 8 Drawer, Tabs, Toast, Tooltip, Skeleton, EmptyState. 9 FocusModeToggle, WeekStrip. 10 later: TutorPanel, RoadmapGraph.

### Motion rules
Durations 120 / 200 / 320ms; ring draw 700ms once. Ease-out `cubic-bezier(.2,.8,.2,1)`; springs (stiffness 300, damping 30) for layout. Animate transform and opacity only. Motion only for state change, spatial continuity, or feedback. Wrap the app in `<MotionConfig reducedMotion="user">` and add the `prefers-reduced-motion` CSS fallback. Stagger 30ms, cap 8 items. Confetti only at layer completion and off under reduced motion.

### Interaction rules
Everything reachable by keyboard and palette. Visible `:focus-visible` ring. One filled accent button per view. Optimistic toggles with 5s undo. Lower-case terminal voice, no guilt copy on lapsed streaks.

## 3. Ranked top 10 (impact / effort)
1. Resume hero card (S)
2. Bento dashboard with rings and segmented bars (S-M)
3. FSRS review queue with retrieval-first Must-know terms (M; check ts-fsrs v6 Node >= 24 vs our Node 22.18+)
4. Command palette and shortcut sheet (S-M; confirm cmdk React peer range)
5. Streak forgiveness plus honest heatmap (S)
6. Stage chips, kind icons, pick-group clarity (S)
7. Reduced-motion-aware micro-motion pass (S)
8. Focus mode and item drawer (S-M)
9. Hint ladder and test-result list in the code runner (S)
10. Weekly review card and week strip (M)
Later: hint-first AI tutor (L), roadmap graph (L), XP and quests (M). Skip: leagues, social.

## 4. Risks
- Gamification can crowd out intrinsic motivation; tie XP to retrieval.
- FSRS needs honest grading and weeks of data; start with defaults.
- Glass, glow and blur hurt contrast and performance if overused.
- AI tutor that gives answers defeats desirable difficulty; follow Boots and Koji (hint-first).
- Items still tagged [K] have not been checked against a live page.
