#!/usr/bin/env node
// Creates the owner account or changes its password, in the `users` table of the DB in your env file.
// Usage: npm run set-password            (asks for email and password; nothing is printed or stored in plain text)
//        npm run set-password -- --id kcshekar --name Chandu
// The id must stay "kcshekar" for the existing owner: progress, notes and code rows are keyed by it.
// Needs Node 22.18+ (it imports lib/password.ts directly).
import { createRequire } from "node:module"
import readline from "node:readline"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { hashPassword } from "../lib/password.ts"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const require = createRequire(path.join(root, "package.json"))
require("@next/env").loadEnvConfig(root, true, { info() {}, error() {} })
const { createClient } = require("@libsql/client")

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i + 1] : fallback
}

// One reader for every question, so pasted or piped input is not lost between prompts.
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: !!process.stdin.isTTY })
let muted = false
const write = rl._writeToOutput.bind(rl)
rl._writeToOutput = (s) => { if (!muted) write(s) }
// Lines are read through one buffered iterator, so typed, pasted or piped answers are never dropped.
const lines = rl[Symbol.asyncIterator]()
async function ask(prompt, { hidden = false } = {}) {
  process.stdout.write(prompt)
  muted = hidden
  const { value } = await lines.next()
  muted = false
  if (hidden) process.stdout.write("\n")
  return value ?? ""
}

if (!process.env.DATABASE_URL) { console.error("DATABASE_URL is not set (.env or .env.local)."); process.exit(1) }
const id = arg("id", "kcshekar")
const name = arg("name", "Chandu")
const email = (await ask("Login email: ")).trim().toLowerCase()
if (!email.includes("@")) { console.error("That is not an email address. Nothing was changed."); process.exit(1) }
const first = await ask("New password: ", { hidden: true })
const second = await ask("Repeat it: ", { hidden: true })
if (first !== second) { console.error("The two entries differ. Nothing was changed."); process.exit(1) }
if (first.length < 12) { console.error("Use at least 12 characters. Nothing was changed."); process.exit(1) }
rl.close()

const db = createClient({ url: process.env.DATABASE_URL, authToken: process.env.DATABASE_AUTH_TOKEN })
await db.execute({
  sql: `INSERT INTO users (id, email, name, password_hash, updated_at) VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET email = excluded.email, name = excluded.name,
          password_hash = excluded.password_hash, updated_at = excluded.updated_at`,
  args: [id, email, name, hashPassword(first), new Date().toISOString()],
})
console.log(`Saved login for user "${id}" (${email}).`)
