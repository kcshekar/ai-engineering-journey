"use client"

import { motion } from "framer-motion"
import { DURATION, EASE_OUT } from "@/lib/motion"

interface Props {
  label: string
  value: number
  max: number
}

export default function ProgressBar({ label, value, max }: Props) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="progress-bar-container">
      <div className="progress-bar-header">
        <span className="progress-bar-label">{label}</span>
        <span className="progress-bar-value">{value}/{max}</span>
      </div>
      <div className="progress-bar-track">
        <motion.div
          className="progress-bar-fill"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: percent / 100 }}
          transition={{ duration: DURATION.slow, ease: EASE_OUT }}
        />
      </div>
    </div>
  )
}
