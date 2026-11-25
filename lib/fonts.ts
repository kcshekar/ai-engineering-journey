import { Fira_Code, Fira_Sans } from "next/font/google"

// Self-hosted at build time by next/font (FX-13), so no render-blocking request to Google.
// Each sets a CSS variable on <html>; app/globals.css builds --font-sans and --font-mono from them.
export const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-fira-sans",
  display: "swap",
})

// Fira Code is a variable font, so no weight list is needed. The generated fallback would be
// size-adjusted Arial (proportional), which shifts Monaco's cursor while the font loads, so fall back to monospace.
export const firaCode = Fira_Code({
  subsets: ["latin"],
  adjustFontFallback: false,
  fallback: ["ui-monospace", "Cascadia Code", "JetBrains Mono", "monospace"],
  variable: "--font-fira-code",
  display: "swap",
})
