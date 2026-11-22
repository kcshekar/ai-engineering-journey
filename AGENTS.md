# learningtracker

Personal AI-engineering learning tracker: a Next.js 15 app that reads roadmaps from JSON and stores progress, notes and code in Turso. It has a single user (the owner).

## Commands
- Dev: `npm run dev` (Next.js with Turbopack) → http://localhost:3000
- Verify (run before saying a task is done): `npm run verify` (`tsc --noEmit`, then `node scripts/check-content.mjs`, which checks the roadmap JSON: ids, references, enums, pick groups, quiz answers, then `npm test`). About 10 s. No lint yet.
- Test: `npm test` (Node's built-in runner, `tests/*.test.mjs`; needs Node 22.18+ because it loads `.ts` files directly).
- New login password hash: `npm run hash-password` (prints an `AUTH_USER_PASSWORD_HASH=` line; the password is never stored).
- Build: `npm run build`
- Migrate: `npm run migrate` (`drizzle-kit push`). It pushes `lib/db/schema.ts` straight to Turso and writes no migration files (`/drizzle` is gitignored).
- DB browser: `npm run db:studio`

## Ports and environments
| Environment | Where | Ports | How to reach it | Limits |
|---|---|---|---|---|
| Dev | local | 3000 | `npm run dev` | uses the Turso DB in `.env.local` |
| Prod | Vercel (per memory notes; unverified) | n/a | n/a | the user deploys |

## Layout
- `app/(app)/`: dashboard, layers, notes, projects pages. `app/(auth)/login`.
- `app/api/*`: route handlers (activity, code, course-meta, layer-progress, notes, auth).
- `lib/db/`: Drizzle schema and client (Turso/libsql). `lib/auth.ts`: NextAuth v5 credentials.
- `data/roadmaps/<id>/`: roadmap content (`meta.json`, `progress.json`, `layer-N/layer.json`, notes).
- `components/`: client components. Ignore the `*.bak` files.

## Rules for this repo
- Env vars: `DATABASE_URL`, `DATABASE_AUTH_TOKEN`, `AUTH_SECRET`, `AUTH_USER_EMAIL` and `AUTH_USER_PASSWORD_HASH` live in `.env.local` (names only in `.env.example`). Never read or print that file.
- Login: one owner account. `lib/auth.ts` checks the email and a scrypt hash from env vars (`lib/password.ts`). Never put a password or hash in code, docs or memory files. Old commits still contain a retired plaintext password; it must never be reused.
- Package manager: npm (`package-lock.json`).
- Schema changes: edit `lib/db/schema.ts`, run `npm run migrate` against dev, then run a check query.

## Docs
- Pending work: `docs/roadmap.md`, starting with `## Now`.
- Active plans: `docs/plans/`. Delete a plan when it's done; git keeps it.
- Decisions: `docs/decisions/`.
- `GAPS_AND_RISKS.md`: known gaps backlog. `PROJECT_OVERVIEW.md`, `PUBLIC_STORY.md`: positioning. `MIGRATION_COMPLETE.md`: architecture and API notes from the Next.js migration.
