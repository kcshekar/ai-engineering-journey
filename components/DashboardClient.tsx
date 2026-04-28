"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, Layers, Flame, Target, Hammer, Terminal } from "lucide-react"
import RoadmapSelector from "./RoadmapSelector"
import ProgressBar from "./ProgressBar"
import StreakGraph from "./StreakGraph"
import { api } from "@/lib/api-client"
import {
  getCurrentLayer, getCurrentWeek, getCompletedCount,
  calculateOverallProgress, getLayerDeadline, getDeadlineStatus,
} from "@/lib/loader"
import type { RoadmapData, ActivityDay, CourseMetaEntry, LayerProgressEntry } from "@/types"

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
}

interface Props {
  initialRoadmap: RoadmapData
  initialActivityMap: Record<string, ActivityDay>
}

export default function DashboardClient({ initialRoadmap, initialActivityMap }: Props) {
  const [roadmap, setRoadmap]       = useState(initialRoadmap)
  const [activityMap, setActivityMap] = useState(initialActivityMap)

  const refreshActivity = useCallback(() => {
    api.getActivity().then((m) => setActivityMap(m as Record<string, ActivityDay>))
  }, [])

  const currentLayer   = getCurrentLayer(roadmap.layers, roadmap.progress)
  const currentWeekPlan = getCurrentWeek(currentLayer, roadmap.progress.currentWeek)
  const overallPercent = calculateOverallProgress(roadmap.layers, roadmap.progress)
  const completedCount = getCompletedCount(currentLayer, roadmap.progress)

  const currentLayerProgress = roadmap.progress.layerProgress[String(currentLayer.id)] as LayerProgressEntry | undefined
  const currentDeadline  = getLayerDeadline(currentLayer, currentLayerProgress)
  const deadlineStatus   = getDeadlineStatus(currentDeadline)

  const circumference = 2 * Math.PI * 64
  const strokeOffset  = circumference - (overallPercent / 100) * circumference

  const handleToggleCourse = useCallback((layerId: number, courseId: string) => {
    setRoadmap((prev) => {
      const newProgress = JSON.parse(JSON.stringify(prev.progress))
      const key = String(layerId)
      if (!newProgress.layerProgress[key]) {
        newProgress.layerProgress[key] = {
          started: false, completed: false, coursesCompleted: [],
          quizScore: null, quizAttempts: 0, startedDate: null, completedDate: null,
          deadline: null, courseTimelines: {},
        }
      }
      const lp = newProgress.layerProgress[key]
      const idx = lp.coursesCompleted.indexOf(courseId)
      if (idx > -1) {
        lp.coursesCompleted.splice(idx, 1)
      } else {
        lp.coursesCompleted.push(courseId)
        if (!lp.started) { lp.started = true; lp.startedDate = new Date().toISOString().split("T")[0] }
      }
      const layer = prev.layers.find((l) => l.id === layerId)
      if (layer && lp.coursesCompleted.length === layer.courses.length) {
        lp.completed = true; lp.completedDate = new Date().toISOString().split("T")[0]
      } else {
        lp.completed = false; lp.completedDate = null
      }
      api.saveLayerProgress(layerId, lp)
      return { ...prev, progress: newProgress }
    })
    api.logActivity("complete").then(refreshActivity)
  }, [refreshActivity])

  const handleSaveLayerDates = useCallback((layerId: number, patch: Record<string, unknown>) => {
    api.saveLayerProgress(layerId, patch)
    setRoadmap((prev) => {
      const newProgress = JSON.parse(JSON.stringify(prev.progress))
      const key = String(layerId)
      if (!newProgress.layerProgress[key]) {
        newProgress.layerProgress[key] = {
          started: false, completed: false, coursesCompleted: [], quizScore: null,
          quizAttempts: 0, startedDate: null, completedDate: null, deadline: null, courseTimelines: {},
        }
      }
      Object.assign(newProgress.layerProgress[key], patch)
      return { ...prev, progress: newProgress }
    })
  }, [])

  const handleSaveCourseTimeline = useCallback((layerId: number, courseId: string, patch: Record<string, unknown>) => {
    api.saveCourseTimeline(layerId, courseId, patch)
    setRoadmap((prev) => {
      const newProgress = JSON.parse(JSON.stringify(prev.progress))
      const key = String(layerId)
      if (!newProgress.layerProgress[key]) {
        newProgress.layerProgress[key] = {
          started: false, completed: false, coursesCompleted: [], quizScore: null,
          quizAttempts: 0, startedDate: null, completedDate: null, deadline: null, courseTimelines: {},
        }
      }
      if (!newProgress.layerProgress[key].courseTimelines) newProgress.layerProgress[key].courseTimelines = {}
      newProgress.layerProgress[key].courseTimelines[courseId] = {
        ...(newProgress.layerProgress[key].courseTimelines[courseId] || {}),
        ...patch,
      }
      return { ...prev, progress: newProgress }
    })
  }, [])

  return (
    <motion.div className="dashboard" variants={pageVariants} initial="initial" animate="in">
      <div className="dashboard-top">
        <div className="progress-ring-card">
          <RoadmapSelector meta={roadmap.meta} />
          <div className="progress-ring-wrapper">
            <svg className="progress-ring-svg" viewBox="0 0 144 144">
              <defs>
                <linearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#22C55E" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
              <circle className="progress-ring-bg" cx="72" cy="72" r="64" />
              <motion.circle
                className="progress-ring-fill"
                cx="72" cy="72" r="64"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: strokeOffset }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
              />
            </svg>
            <div className="progress-ring-text">
              <div className="progress-ring-value">{overallPercent}%</div>
              <div className="progress-ring-label">complete</div>
            </div>
          </div>
          <div className="progress-ring-title">Layer {currentLayer.id} of {roadmap.meta.totalLayers}</div>
        </div>

        <div className="current-layer-card">
          <div className="current-layer-header">
            <div>
              <div className="current-layer-name">Layer {currentLayer.id}: {currentLayer.title}</div>
              <div className="current-layer-desc">{currentLayer.description}</div>
            </div>
            <div className="current-layer-badge">{currentLayer.status}</div>
          </div>
          <ProgressBar label="Course progress" value={completedCount} max={currentLayer.courses.length} />
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
        {[
          { icon: Clock,  color: "green",  value: roadmap.progress.totalHoursSpent,       label: "Hours spent" },
          { icon: Layers, color: "cyan",   value: Object.values(roadmap.progress.layerProgress).filter((l) => (l as LayerProgressEntry).completed).length, label: "Layers done" },
          { icon: Flame,  color: "amber",  value: roadmap.progress.weeklyCheckins.length,  label: "Check-ins" },
          { icon: Target, color: "purple", value: roadmap.meta.targetRole.split("/")[0].trim(), label: "Target role" },
        ].map(({ icon: Icon, color, value, label }, i) => (
          <motion.div key={label} className="stat-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
            <div className={`stat-icon ${color}`}><Icon /></div>
            <div>
              <div className="stat-value">{String(value)}</div>
              <div className="stat-label">{label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <StreakGraph activityMap={activityMap} />
      </motion.div>

      {currentWeekPlan && (
        <div className="today-section">
          <motion.div className="today-card build" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <div className="today-card-label"><Hammer /> Build Task &mdash; Week {currentWeekPlan.week}</div>
            <div className="today-card-text">{currentWeekPlan.buildTask}</div>
          </motion.div>
          <motion.div className="today-card python" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <div className="today-card-label"><Terminal /> Python Practice</div>
            <div className="today-card-text">{currentWeekPlan.pythonTask}</div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
