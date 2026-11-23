import type { Metadata } from "next"
import Providers from "@/components/Providers"
import { ThemeProvider, THEME_INIT_SCRIPT } from "@/components/ThemeProvider"
import "./globals.css"

export const metadata: Metadata = {
  title: "AI Engineering Journey",
  description: "Track your path from Full-Stack Engineer to Applied AI Engineer",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
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
