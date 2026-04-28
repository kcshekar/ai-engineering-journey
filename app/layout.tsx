import type { Metadata } from "next"
import Providers from "@/components/Providers"
import "./globals.css"

export const metadata: Metadata = {
  title: "AI Engineering Journey",
  description: "Track your path from Full-Stack Engineer to Applied AI Engineer",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
