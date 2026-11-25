# learningtracker

Personal AI-engineering learning tracker: a Next.js 16 app that reads roadmaps from JSON and stores progress, notes and code in Turso. It has a single user (the owner).

## Commands
- Dev: `npm run dev` (Next.js 16, Turbopack by default) → http://localhost:3000. Dev writes to `.next/dev`, so `npm run build` can run alongside it.
- Verify (run before saying a task is done): `npm run verify` (`tsc --noEmit`, then `npm run lint`, then `node scripts/check-content.mjs`, which checks the roadmap JSON: ids, references, enums, pick groups, quiz answers, then `npm test`). About 20 s.
- Lint: `npm run lint` (ESLint 9 with `eslint-config-next` 16, including the React Compiler rules). It is clean: 0 errors, 0 warnings; keep it that way.
- Test: `npm test` (Node's built-in runner, `tests/*.test.mjs`; needs Node 22.18+ because it loads `.ts` files directly).
- Set or change the login: `npm run set-password` (asks for email and password, writes a scrypt hash to the `users` table; run it yourself, it needs a terminal for hidden input).
- Build: `npm run build`
- Migrate: `npm run migrate` (`drizzle-kit push`). It pushes `lib/db/schema.ts` straight to Turso and writes no migration files (`/drizzle` is gitignored).
- DB browser: `npm run db:studio`

## Ports and environments
| Environment | Where | Ports | How to reach it | Limits |
|---|---|---|---|---|
| Dev | local | 3000 | `npm run dev` | uses the Turso DB in `.env` (Next.js also reads `.env.local` first) |
| Prod | Vercel (per memory notes; unverified) | n/a | n/a | the user deploys |

## Layout
- `app/(app)/`: dashboard, layers, notes, projects pages. `app/(auth)/login`.
- `app/api/*`: route handlers (activity, code, course-meta, course-metas, course-timeline, layer-progress, notes, auth). Every route checks its input with `lib/api-input.ts` and answers 400 on bad input; `course-meta` and `layer-progress` accept only their known fields.
- `lib/db/`: Drizzle schema and client (Turso/libsql). `lib/auth.ts`: NextAuth v5 credentials.
- `data/roadmaps/<id>/`: roadmap content (`meta.json`, `layer-N/layer.json`, `planning.json`, notes).
- `components/`: client components.

## Rules for this repo
- Env vars: `DATABASE_URL`, `DATABASE_AUTH_TOKEN` and `AUTH_SECRET` live in `.env` on this machine (gitignored; names only in `.env.example`). Never read or print env files, and never grep a folder that contains them. Scripts load them with `@next/env`, the same way Next.js does.
- Login: accounts live in the `users` table (id, email, name, scrypt `password_hash`); `lib/auth.ts` looks the email up and checks the hash (`lib/password.ts`). The owner's id is `kcshekar`, which every other table is keyed by. Never put a password or hash in code, env files, docs or memory files. Old commits still contain a retired plaintext password; it must never be reused.
- Package manager: npm (`package-lock.json`).
- Schema changes: edit `lib/db/schema.ts`, run `npm run migrate` against dev, then run a check query.

## Docs
- Pending work: `docs/roadmap.md`, starting with `## Now`.
- Active plans: `docs/plans/`. Delete a plan when it's done; git keeps it.
- Decisions: `docs/decisions/`.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
