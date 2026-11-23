// Next.js 16 lint rules (eslint-config-next ships flat config natively).
import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // React Compiler rules that arrived with Next 16. They flag working code in CoursePanel and
    // ThemeProvider; kept as warnings until those are refactored (see docs/roadmap.md, "Lint warnings").
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
    },
  },
  globalIgnores([".next/**", "node_modules/**", "next-env.d.ts", "drizzle/**", ".claude/**"]),
])
