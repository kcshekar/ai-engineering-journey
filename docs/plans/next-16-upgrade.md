---
type: plan
title: Next.js 16 upgrade
status: draft
size: S
updated: 2026-11-23
covers: [package.json, package-lock.json, eslint.config.mjs, app/layout.tsx, next.config.ts, AGENTS.md, docs/roadmap.md]
---

# Next.js 16 upgrade

Move from Next 15.5 to Next 16 to clear the last high `npm audit` finding (postcss inside Next). Size S: one dependency bump in an existing app, and the repo already avoids most of the breaking changes (checked below).

## Requirements (the user's words)

| # | Requirement | Phase |
|---|---|---|
| R1 | "Plan it, don't do it yet" (the Next 16 upgrade for the postcss audit finding) | 1 |
| R2 | "make sure that nothing breaks and everything should work as of now" (standing rule from the cleanup) | 1 |

## Tools for this plan

- Skills: none needed.
- Subagents: `web-fetch` for the upgrade guide (done), `reviewer` on the diff.
- Models: Sonnet for the bump, Opus for review.
- Second opinion: no; it's a documented, reversible upgrade.

## Research (source: nextjs.org/docs/app/guides/upgrading/version-16, last updated 2026-11-18)

What changes in 16, and where this repo stands:

| Change in 16 | This repo |
|---|---|
| Node 20.9+, TypeScript 5.1+ | Node 26, TS 5.x: fine |
| `params`, `cookies()`, `headers()` must be awaited | pages already use `params: Promise<…>`; no `cookies()`/`headers()` calls |
| `middleware` renamed to `proxy` | no middleware file |
| `next lint` removed; `eslint-config-next@16` is native flat config | we already run `eslint .`; drop `FlatCompat` from `eslint.config.mjs` |
| Turbopack is the default for dev and build; custom webpack config fails the build | no webpack config; `--turbopack` flag on `dev` becomes redundant |
| Next no longer overrides `scroll-behavior: smooth` on navigation | `app/globals.css` sets it on `html`; add `data-scroll-behavior="smooth"` to `<html>` to keep today's behaviour |
| next/image default changes, `revalidateTag` needs 2 args, AMP and runtime config removed | not used |
| `next dev` writes to `.next/dev` | dev and build can then run at the same time |

`next-auth@5.0.0-beta.32` lists `next ^16.0.0` as a supported peer (npm, 2026-11-23). Unverified: login flow on 16 until Phase 1 runs.

## Phases

### Phase 1: Upgrade and verify
- Entry: working tree clean; `npm run verify` green on 15.5.
- [ ] T1 `npm install next@16 eslint-config-next@16` (react is already 19.2). Then run `npx @next/codemod@latest upgrade latest` in dry-run mode and apply only what fits.
- [ ] T2 Simplify `eslint.config.mjs` to the native flat config; drop `--turbopack` from the `dev` script.
- [ ] T3 Add `data-scroll-behavior="smooth"` to `<html>` in `app/layout.tsx`.
- [ ] T4 Check: `npm audit` no longer lists the postcss high finding.
- Exit: `npm run verify` and `npm run build` green · browser: login, logout, wrong password, dashboard, layers 1–6 (tick and untick an item, run a Python check, open a quiz), notes, projects at 390 and 1280 px with no console errors · AGENTS.md and roadmap updated.
- Rollback: `git checkout -- package.json package-lock.json eslint.config.mjs app/layout.tsx && npm ci`, or revert the commit.

## Parking lot

- The 3 `react-hooks/exhaustive-deps` lint warnings (`CoursePanel.tsx` 197 and 206, `LayerCard.tsx` 321). Fixing them changes when effects re-run, so each needs its own look.
