import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

import { verifyPassword } from "@/lib/password"

// Single owner account. The email and a scrypt hash of the password live in env vars
// (AUTH_USER_EMAIL, AUTH_USER_PASSWORD_HASH); make the hash with `npm run hash-password`.
// Never put a password or its hash in this file.
const OWNER = { id: "kcshekar", name: "Chandu" }

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase()
        const password = String(credentials?.password ?? "")
        const ownerEmail = (process.env.AUTH_USER_EMAIL ?? "").trim().toLowerCase()
        if (!ownerEmail || email !== ownerEmail) return null
        if (!verifyPassword(password, process.env.AUTH_USER_PASSWORD_HASH)) return null
        const user = { ...OWNER, email: ownerEmail }
        return { id: user.id, name: user.name, email: user.email }
      },
    }),
  ],
  pages: { signIn: "/login" },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string
      return session
    },
  },
})
