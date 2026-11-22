import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto"

// Stored format: "scrypt:<salt hex>:<hash hex>", written by `npm run set-password`.
// Uses Node's built-in scrypt, so no new dependency.
const KEY_LENGTH = 64

export function verifyPassword(plain: string, stored: string | undefined): boolean {
  if (!plain || !stored) return false
  const [scheme, saltHex, hashHex] = stored.split(":")
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false
  const expected = Buffer.from(hashHex, "hex")
  if (expected.length !== KEY_LENGTH) return false
  const actual = scryptSync(plain, Buffer.from(saltHex, "hex"), KEY_LENGTH)
  return timingSafeEqual(actual, expected)
}

export function hashPassword(plain: string): string {
  const salt = randomBytes(16)
  return `scrypt:${salt.toString("hex")}:${scryptSync(plain, salt, KEY_LENGTH).toString("hex")}`
}
