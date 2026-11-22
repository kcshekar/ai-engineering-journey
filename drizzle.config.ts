import { defineConfig } from "drizzle-kit"
import { loadEnvConfig } from "@next/env"

// Same env files and order as Next.js (.env.local, then .env).
loadEnvConfig(process.cwd())

export default defineConfig({
  dialect: "turso",
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
})
