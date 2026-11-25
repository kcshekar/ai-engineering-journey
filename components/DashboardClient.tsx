"use client"

import { motion } from "framer-motion"
import { Clock, Layers, Flame, Target, Hammer, Terminal } from "lucide-react"
import ProgressRing from "./ui/ProgressRing"
import StatTile from "./ui/StatTile"
import { DURATION, EASE_OUT, staggerDelay } from "@/lib/motion"
import RoadmapSelector from "./RoadmapSelector"
import ProgressBar from "./ProgressBar"
import StreakGraph from "./StreakGraph"
import {
  getCurrentLayer, getCurrentWeek, getCompletedCount, getRequiredCount, getLayerHours,
  calculateOverallProgress, getLayerDeadline, getDeadlineStatus, getLayerStatus,
  getHoursDone, countActiveDays,
} from "@/lib/loader"
import { useLocalToday } from "./useLocalToday"
import type { RoadmapData, ActivityDay, LayerProgressEntry } from "@/types"

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  in: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE_OUT } },
}

interface Props {
  initialRoadmap: RoadmapData
  initialActivityMap: Record<string, ActivityDay>
}

export default function DashboardClient({ initialRoadmap, initialActivityMap }: Props) {
  // Read-only view: the dashboard never edits progress, so it renders the server data directly.
  const roadmap = initialRoadmap
  const activityMap = initialActivityMap

  const currentLayer   = getCurrentLayer(roadmap.layers, roadmap.progress)
  const currentWeekPlan = getCurrentWeek(currentLayer, roadmap.progress.currentWeek)
  const overallPercent = calculateOverallProgress(roadmap.layers, roadmap.progress)
  const completedCount = getCompletedCount(currentLayer, roadmap.progress)
  const currentLayerStatus = getLayerStatus(currentLayer, roadmap.progress.layerProgress)

  const currentLayerProgress = roadmap.progress.layerProgress[String(currentLayer.id)] as LayerProgressEntry | undefined
  const currentDeadline  = getLayerDeadline(currentLayer, currentLayerProgress)
  const deadlineStatus   = getDeadlineStatus(currentDeadline)

  const hoursDone  = getHoursDone(roadmap.layers, roadmap.progress)
  const today      = useLocalToday() // null while server-rendering, so server and browser days can't disagree
  const activeDays = today ? countActiveDays(activityMap, today, 30) : "–"

  return (
    <motion.div className="dashboard" variants={pageVariants} initial="initial" animate="in">
      <div className="dashboard-top">
        <div className="progress-ring-card">
          <RoadmapSelector meta={roadmap.meta} />
          <ProgressRing value={overallPercent} />
          <div className="progress-ring-title">Layer {currentLayer.id} of {roadmap.meta.totalLayers}</div>
        </div>

        <div className="current-layer-card">
          <div className="current-layer-header">
            <div>
              <div className="current-layer-name">Layer {currentLayer.id}: {currentLayer.title}</div>
              <div className="current-layer-desc">{currentLayer.description}</div>
            </div>
            <div className={`current-layer-badge status-${currentLayerStatus}`}>
              {currentLayerStatus.replace("-", " ")}
            </div>
          </div>
          <ProgressBar label="Core progress" value={completedCount} max={getRequiredCount(currentLayer)} />
          {(() => {
            const { required, optional } = getLayerHours(currentLayer)
            return required + optional > 0 ? (
              <div className="hours-chip"><Clock size={13} /><span>~{required}h core</span>{optional > 0 && <span className="hours-chip-optional">+{optional}h optional</span>}</div>
            ) : null
          })()}
          {deadlineStatus.status !== "none" && (
            <div className={`deadline-badge-dash deadline-${deadlineStatus.status}`}>
              {deadlineStatus.status === "overdue"
                ? `Overdue by ${Math.abs(deadlineStatus.daysRemaining!)}d`
                : `${deadlineStatus.daysRemaining}d to deadline`}
            </div>
          )}
          <div className="current-layer-weeks">
            {currentLayer.weeklyPlan.map((w) => (
              <div key={w.week} className={`week-chip ${w.week === roadmap.progress.currentWeek ? "active" : ""}`}>
                <span className="week-chip-num">Week {w.week}</span>
                <span className="week-chip-focus">{w.focus}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="stats-row">
        {([
          { icon: Clock,  tone: "green",  value: `${hoursDone}h`, label: "Est. hours done" },
          { icon: Layers, tone: "cyan",   value: Object.values(roadmap.progress.layerProgress).filter((l) => (l as LayerProgressEntry).completed).length, label: "Layers done" },
          { icon: Flame,  tone: "amber",  value: activeDays, label: "Active days (30d)" },
          { icon: Target, tone: "purple", value: roadmap.meta.targetRole.split("/")[0].trim(), label: "Target role" },
        ] satisfies Omit<React.ComponentProps<typeof StatTile>, "index">[]).map((stat, i) => (
          <StatTile key={stat.label} {...stat} index={i} />
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DURATION.base, ease: EASE_OUT, delay: staggerDelay(4) }}>
        <StreakGraph activityMap={activityMap} />
      </motion.div>

      {currentWeekPlan && (
        <div className="today-section">
          <motion.div className="today-card build" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DURATION.base, ease: EASE_OUT, delay: staggerDelay(5) }}>
            <div className="today-card-label"><Hammer /> Build Task &mdash; Week {currentWeekPlan.week}</div>
            <div className="today-card-text">{currentWeekPlan.buildTask}</div>
          </motion.div>
          <motion.div className="today-card python" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DURATION.base, ease: EASE_OUT, delay: staggerDelay(6) }}>
            <div className="today-card-label"><Terminal /> Python Practice</div>
            <div className="today-card-text">{currentWeekPlan.pythonTask}</div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
