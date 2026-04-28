"use client"

import { useState, useCallback } from "react"
import LayerCard from "./LayerCard"
import WeeklyPlan from "./WeeklyPlan"
import QuizSection from "./QuizSection"
import { api } from "@/lib/api-client"
import { getCompletedCount, isQuizUnlocked } from "@/lib/loader"
import type { Layer, RoadmapProgress, LayerProgressEntry } from "@/types"

interface Props {
  layer: Layer
  initialProgress: RoadmapProgress
}

export default function LayerDetailClient({ layer, initialProgress }: Props) {
  const [progress, setProgress] = useState(initialProgress)

  const refreshActivity = useCallback(() => {}, [])

  const handleToggleCourse = useCallback((layerId: number, courseId: string) => {
    setProgress((prev) => {
      const np = JSON.parse(JSON.stringify(prev))
      const key = String(layerId)
      if (!np.layerProgress[key]) {
        np.layerProgress[key] = {
          started: false, completed: false, coursesCompleted: [],
          quizScore: null, quizAttempts: 0, startedDate: null,
          completedDate: null, deadline: null, courseTimelines: {},
        }
      }
      const lp = np.layerProgress[key]
      const idx = lp.coursesCompleted.indexOf(courseId)
      if (idx > -1) {
        lp.coursesCompleted.splice(idx, 1)
      } else {
        lp.coursesCompleted.push(courseId)
        if (!lp.started) { lp.started = true; lp.startedDate = new Date().toISOString().split("T")[0] }
      }
      if (lp.coursesCompleted.length === layer.courses.length) {
        lp.completed = true; lp.completedDate = new Date().toISOString().split("T")[0]
      } else {
        lp.completed = false; lp.completedDate = null
      }
      api.saveLayerProgress(layerId, lp)
      return np
    })
    api.logActivity("complete")
  }, [layer.courses.length])

  const handleSaveDates = useCallback((layerId: number, patch: Record<string, unknown>) => {
    api.saveLayerProgress(layerId, patch)
    setProgress((prev) => {
      const np = JSON.parse(JSON.stringify(prev))
      const key = String(layerId)
      if (!np.layerProgress[key]) {
        np.layerProgress[key] = {
          started: false, completed: false, coursesCompleted: [], quizScore: null,
          quizAttempts: 0, startedDate: null, completedDate: null, deadline: null, courseTimelines: {},
        }
      }
      Object.assign(np.layerProgress[key], patch)
      return np
    })
  }, [])

  const handleSaveCourseTimeline = useCallback((layerId: number, courseId: string, patch: Record<string, unknown>) => {
    api.saveCourseTimeline(layerId, courseId, patch)
    setProgress((prev) => {
      const np = JSON.parse(JSON.stringify(prev))
      const key = String(layerId)
      if (!np.layerProgress[key]) np.layerProgress[key] = { started: false, completed: false, coursesCompleted: [], quizScore: null, quizAttempts: 0, startedDate: null, completedDate: null, deadline: null, courseTimelines: {} }
      if (!np.layerProgress[key].courseTimelines) np.layerProgress[key].courseTimelines = {}
      np.layerProgress[key].courseTimelines[courseId] = { ...(np.layerProgress[key].courseTimelines[courseId] || {}), ...patch }
      return np
    })
  }, [])

  const completedCount = getCompletedCount(layer, progress)
  const quizUnlocked   = isQuizUnlocked(layer, progress)

  return (
    <div style={{ display: "grid", gap: 32 }}>
      <LayerCard
        layer={layer}
        progress={progress}
        onToggleCourse={handleToggleCourse}
        onActivity={refreshActivity}
        onSaveDates={handleSaveDates}
        onSaveCourseTimeline={handleSaveCourseTimeline}
      />
      <WeeklyPlan weeklyPlan={layer.weeklyPlan} currentWeek={progress.currentWeek} />
      <QuizSection
        quiz={layer.quiz}
        isUnlocked={quizUnlocked}
        completedCount={completedCount}
        totalCourses={layer.courses.length}
      />
    </div>
  )
}
