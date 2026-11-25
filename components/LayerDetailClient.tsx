"use client"

import { useState, useCallback } from "react"
import LayerCard from "./LayerCard"
import WeeklyPlan from "./WeeklyPlan"
import QuizSection from "./QuizSection"
import { api } from "@/lib/api-client"
import {
  getCompletedCount, getRequiredCount, applyItemToggle, isQuizUnlocked, updateLayerEntry,
} from "@/lib/loader"
import type { Layer, RoadmapProgress, LayerProgressEntry, Course } from "@/types"

interface Props {
  layer: Layer
  initialProgress: RoadmapProgress
  allCourses: Course[]
}

export default function LayerDetailClient({ layer, initialProgress, allCourses }: Props) {
  const [progress, setProgress] = useState(initialProgress)
  const [saveError, setSaveError] = useState<string | null>(null)

  const refreshActivity = useCallback(() => {}, [])

  // Show the change at once, save it once, and undo it if the save fails. The undo only applies
  // while this change is still the latest one, so it never wipes a later change.
  const commit = useCallback(async (next: RoadmapProgress, prev: RoadmapProgress, write: () => Promise<boolean>) => {
    setProgress(next)
    setSaveError(null)
    if (await write()) return
    setProgress((cur) => (cur === next ? prev : cur))
    setSaveError("Couldn't save your change, so it was undone. Check your connection and try again.")
  }, [])

  const handleToggleCourse = useCallback((layerId: number, courseId: string) => {
    const next = updateLayerEntry(progress, layerId, (entry) => applyItemToggle(layer, entry, courseId))
    const lp = next.layerProgress[String(layerId)]
    commit(next, progress, () => api.saveLayerProgress(layerId, { ...lp }))
    api.logActivity("complete")
  }, [progress, layer, commit])

  const handleSaveDates = useCallback((layerId: number, patch: Record<string, unknown>) => {
    const next = updateLayerEntry(progress, layerId, (entry) => { Object.assign(entry, patch) })
    commit(next, progress, () => api.saveLayerProgress(layerId, patch))
  }, [progress, commit])

  const handleSaveCourseTimeline = useCallback((layerId: number, courseId: string, patch: Record<string, unknown>) => {
    const next = updateLayerEntry(progress, layerId, (entry) => {
      entry.courseTimelines[courseId] = { ...(entry.courseTimelines[courseId] ?? {}), ...patch } as LayerProgressEntry["courseTimelines"][string]
    })
    commit(next, progress, () => api.saveCourseTimeline(layerId, courseId, patch))
  }, [progress, commit])

  const handleSaveQuiz = useCallback((score: number) => {
    const next = updateLayerEntry(progress, layer.id, (entry) => {
      entry.quizScore = score
      entry.quizAttempts = (entry.quizAttempts ?? 0) + 1
    })
    const { quizScore, quizAttempts } = next.layerProgress[String(layer.id)]
    commit(next, progress, () => api.saveLayerProgress(layer.id, { quizScore, quizAttempts }))
  }, [progress, layer.id, commit])

  const completedCount = getCompletedCount(layer, progress)
  const lpNow = progress.layerProgress[String(layer.id)] as LayerProgressEntry | undefined
  const quizUnlocked   = isQuizUnlocked(layer, progress)

  return (
    <div style={{ display: "grid", gap: 32 }}>
      {saveError && (
        <div className="save-error" role="alert">
          <span>{saveError}</span>
          <button type="button" className="save-error-close" onClick={() => setSaveError(null)}>Dismiss</button>
        </div>
      )}
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
