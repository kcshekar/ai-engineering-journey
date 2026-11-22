"use client"

import { useState, useCallback } from "react"
import LayerCard from "./LayerCard"
import WeeklyPlan from "./WeeklyPlan"
import QuizSection from "./QuizSection"
import { api } from "@/lib/api-client"
import { getCompletedCount, getRequiredCount, applyItemToggle, isQuizUnlocked } from "@/lib/loader"
import type { Layer, RoadmapProgress, LayerProgressEntry, Course } from "@/types"

interface Props {
  layer: Layer
  initialProgress: RoadmapProgress
  allCourses: Course[]
}

export default function LayerDetailClient({ layer, initialProgress, allCourses }: Props) {
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
      applyItemToggle(layer, lp, courseId)
      api.saveLayerProgress(layerId, lp)
      return np
    })
    api.logActivity("complete")
  }, [layer])

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

  const handleSaveQuiz = useCallback((score: number) => {
    setProgress((prev) => {
      const np = JSON.parse(JSON.stringify(prev))
      const key = String(layer.id)
      if (!np.layerProgress[key]) np.layerProgress[key] = { started: false, completed: false, coursesCompleted: [], quizScore: null, quizAttempts: 0, startedDate: null, completedDate: null, deadline: null, courseTimelines: {} }
      const lp = np.layerProgress[key]
      lp.quizScore = score
      lp.quizAttempts = (lp.quizAttempts ?? 0) + 1
      api.saveLayerProgress(layer.id, { quizScore: lp.quizScore, quizAttempts: lp.quizAttempts })
      return np
    })
  }, [layer.id])

  const completedCount = getCompletedCount(layer, progress)
  const lpNow = progress.layerProgress[String(layer.id)] as LayerProgressEntry | undefined
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
        allCourses={allCourses}
      />
      <WeeklyPlan weeklyPlan={layer.weeklyPlan} currentWeek={progress.currentWeek} />
      <QuizSection
        quiz={layer.quiz}
        isUnlocked={quizUnlocked}
        completedCount={completedCount}
        totalCourses={getRequiredCount(layer)}
        layerId={layer.id}
        quizScore={lpNow?.quizScore ?? null}
        quizAttempts={lpNow?.quizAttempts ?? 0}
        onSaveQuiz={handleSaveQuiz}
      />
    </div>
  )
}
