"use client"

// Client-only: the icon prop is a component, which a server component cannot pass. Use it from client components.

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { DURATION, EASE_OUT, staggerDelay } from "@/lib/motion"

export type StatTone = "green" | "cyan" | "amber" | "purple"

interface Props {
  icon: LucideIcon
  tone: StatTone
  value: string | number
  label: string
  /** Position in its row, for the entrance stagger. */
  index?: number
}

export default function StatTile({ icon: Icon, tone, value, label, index = 0 }: Props) {
  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.base, ease: EASE_OUT, delay: staggerDelay(index) }}
    >
      <div className={`stat-icon ${tone}`} aria-hidden="true"><Icon /></div>
      <div>
        <div className="stat-value">{String(value)}</div>
        <div className="stat-label">{label}</div>
      </div>
    </motion.div>
  )
}
