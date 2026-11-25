import type { Metadata } from "next"
import Providers from "@/components/Providers"
import { ThemeProvider, THEME_INIT_SCRIPT } from "@/components/ThemeProvider"
import { firaSans, firaCode } from "@/lib/fonts"
import "./globals.css"

export const metadata: Metadata = {
  title: { default: "AI Engineering Journey", template: "%s · AI Engineering Journey" },
  description: "Track your path from Full-Stack Engineer to Applied AI Engineer",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${firaSans.variable} ${firaCode.variable}`} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <ThemeProvider>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
