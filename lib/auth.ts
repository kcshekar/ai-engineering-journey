import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

// Hardcoded for now — replace authorize() body with a DB lookup for real multi-user auth
const USERS = [
  {
    id: "kcshekar",
    name: "Chandu",
    email: "korpolechandrashekar@gmail.com",
    password: "learning2024",
  },
]

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = USERS.find(
          (u) =>
            u.email === credentials?.email &&
            u.password === credentials?.password
        )
        if (!user) return null
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
