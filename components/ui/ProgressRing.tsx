"use client"

import { useId } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { DURATION, EASE_OUT } from "@/lib/motion"

const R = 64
const CIRCUMFERENCE = 2 * Math.PI * R

interface Props {
  /** 0–100; values outside are clamped. */
  value: number
  label?: string
}

// The ring draws once (700 ms). Reduced motion skips the draw: MotionConfig only stops transforms, not strokes.
// The start state is the same on server and client; only the transition changes, so hydration always matches.
export default function ProgressRing({ value, label = "complete" }: Props) {
  const gradientId = `ring-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`
  const reduce = useReducedMotion()
  const pct = Math.max(0, Math.min(100, Math.round(value)))
  const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE

  return (
    <div className="progress-ring-wrapper" role="img" aria-label={`${pct}% ${label}`}>
      <svg className="progress-ring-svg" viewBox="0 0 144 144" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" style={{ stopColor: "var(--accent)" }} />
            <stop offset="100%" style={{ stopColor: "var(--cyan)" }} />
          </linearGradient>
        </defs>
        <circle className="progress-ring-bg" cx="72" cy="72" r={R} />
        <motion.circle
          className="progress-ring-fill"
          cx="72" cy="72" r={R}
          stroke={`url(#${gradientId})`}
          strokeDasharray={CIRCUMFERENCE}
          initial={{ strokeDashoffset: CIRCUMFERENCE }}
          animate={{ strokeDashoffset: offset }}
          transition={reduce ? { duration: 0 } : { duration: DURATION.ring, ease: EASE_OUT }}
        />
      </svg>
      <div className="progress-ring-text" aria-hidden="true">
        <div className="progress-ring-value">{pct}%</div>
        <div className="progress-ring-label">{label}</div>
      </div>
    </div>
  )
}
