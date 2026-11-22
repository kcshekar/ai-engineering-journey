#!/usr/bin/env node
// Makes the AUTH_USER_PASSWORD_HASH value for .env.local and Vercel.
// Usage: npm run hash-password   (type the new password; it is not shown or stored)
import { randomBytes, scryptSync } from "node:crypto"
import readline from "node:readline"

const KEY_LENGTH = 64

function ask(prompt) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true })
    // Hide what is typed.
    rl._writeToOutput = (s) => { if (s.startsWith(prompt)) rl.output.write(prompt) }
    rl.question(prompt, (answer) => { rl.close(); process.stdout.write("\n"); resolve(answer) })
  })
}

const first = await ask("New password: ")
const second = await ask("Repeat it: ")
if (first !== second) { console.error("The two entries differ. Nothing was made."); process.exit(1) }
if (first.length < 12) { console.error("Use at least 12 characters."); process.exit(1) }

const salt = randomBytes(16)
const hash = scryptSync(first, salt, KEY_LENGTH)
console.log(`AUTH_USER_PASSWORD_HASH=scrypt:${salt.toString("hex")}:${hash.toString("hex")}`)
