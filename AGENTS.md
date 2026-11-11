# learningtracker

Personal AI-engineering learning tracker: a Next.js 15 app that reads roadmaps from JSON and stores progress, notes and code in Turso. It has a single user (the owner).

## Commands
- Dev: `npm run dev` (Next.js with Turbopack) → http://localhost:3000
- Verify (run before saying a task is done): `npm run verify` (`tsc --noEmit`, about 4 s). There are no tests or lint yet.
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
- Env vars: `DATABASE_URL`, `DATABASE_AUTH_TOKEN` and `AUTH_SECRET` live in `.env.local`. Never read or print that file.
- The users list in `lib/auth.ts` is hardcoded and contains a credential. Don't copy credentials into docs or memory files.
- Package manager: npm (`package-lock.json`).
- Schema changes: edit `lib/db/schema.ts`, run `npm run migrate` against dev, then run a check query.

## Docs
- Pending work: `docs/roadmap.md`, starting with `## Now`.
- Active plans: `docs/plans/`. Delete a plan when it's done; git keeps it.
- Decisions: `docs/decisions/`.
- `GAPS_AND_RISKS.md`: known gaps backlog. `PROJECT_OVERVIEW.md`, `PUBLIC_STORY.md`: positioning. `MIGRATION_COMPLETE.md`: architecture and API notes from the Next.js migration.
