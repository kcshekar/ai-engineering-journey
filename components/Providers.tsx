"use client"

import { SessionProvider } from "next-auth/react"
import { MotionConfig } from "framer-motion"

// reducedMotion="user": Framer Motion skips transform and layout animations when the OS asks for reduced motion.
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </SessionProvider>
  )
}
