# learningtracker

Personal AI-engineering learning tracker: a Next.js 15 app that reads roadmaps from JSON and stores progress, notes and code in Turso. It has a single user (the owner).

## Commands
- Dev: `npm run dev` (Next.js with Turbopack) → http://localhost:3000
- Verify (run before saying a task is done): `npm run verify` (`tsc --noEmit`, then `node scripts/check-content.mjs`, which checks the roadmap JSON: ids, references, enums, pick groups, quiz answers, then `npm test`). About 10 s. No lint yet.
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
- `app/api/*`: route handlers (activity, code, course-meta, layer-progress, notes, auth).
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
