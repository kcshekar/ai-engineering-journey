"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import LayerCard from "./LayerCard"
import WeeklyPlan from "./WeeklyPlan"
import QuizSection from "./QuizSection"
import { api } from "@/lib/api-client"
import {
  getCompletedCount, getRequiredCount, applyItemToggle, isQuizUnlocked, updateLayerEntry, resolveFailedSave,
} from "@/lib/loader"
import type { Layer, RoadmapProgress, LayerProgressEntry, Course } from "@/types"

interface Props {
  layer: Layer
  initialProgress: RoadmapProgress
  allCourses: Course[]
}

type Mutate = (lp: LayerProgressEntry) => void
type Write = (lp: LayerProgressEntry) => Promise<boolean>

const FAILED = "Couldn't save your change, so it was undone. Check your connection and try again."

export default function LayerDetailClient({ layer, initialProgress, allCourses }: Props) {
  const [progress, setProgress] = useState(initialProgress)
  const [saveError, setSaveError] = useState<string | null>(null)
  // Latest rendered progress, read when a save fails later. Writes go through one queue so they
  // reach the server in the order they were made (each toggle writes the whole layer entry).
  const latest = useRef(progress)
  const queue = useRef<Promise<unknown>>(Promise.resolve())
  useEffect(() => { latest.current = progress }, [progress])

  const refreshActivity = useCallback(() => {}, [])

  // Show the change at once, then save it. If the save fails, undo it (see resolveFailedSave).
  const commit = useCallback((layerId: number, mutate: Mutate, undo: Mutate, write: Write) => {
    const prev = progress
    const next = updateLayerEntry(prev, layerId, mutate)
    const entry = next.layerProgress[String(layerId)]
    setProgress(next)
    setSaveError(null)
    queue.current = queue.current.then(async () => {
      if (await write(entry)) return
      const { progress: fixed, resync } = resolveFailedSave(latest.current, next, prev, layerId, undo)
      setProgress(fixed)
      setSaveError(FAILED)
      if (resync && !(await api.saveLayerProgress(layerId, { ...resync }))) {
        setSaveError("Couldn't save your changes. Reload the page when you're back online to see what was stored.")
      }
    })
  }, [progress])

  const handleToggleCourse = useCallback((layerId: number, courseId: string) => {
    // A toggle is its own undo.
    const toggle: Mutate = (lp) => applyItemToggle(layer, lp, courseId)
    commit(layerId, toggle, toggle, (lp) => api.saveLayerProgress(layerId, { ...lp }))
    api.logActivity("complete")
  }, [layer, commit])

  const handleSaveDates = useCallback((layerId: number, patch: Record<string, unknown>) => {
    const before = progress.layerProgress[String(layerId)] as LayerProgressEntry | undefined
    const old = Object.fromEntries(Object.keys(patch).map((k) => [k, before?.[k as keyof LayerProgressEntry] ?? null]))
    commit(layerId, (lp) => { Object.assign(lp, patch) }, (lp) => { Object.assign(lp, old) },
      () => api.saveLayerProgress(layerId, patch))
  }, [progress, commit])

  const handleSaveCourseTimeline = useCallback((layerId: number, courseId: string, patch: Record<string, unknown>) => {
    const old = progress.layerProgress[String(layerId)]?.courseTimelines?.[courseId]
    commit(layerId,
      (lp) => { lp.courseTimelines[courseId] = { ...(lp.courseTimelines[courseId] ?? {}), ...patch } as LayerProgressEntry["courseTimelines"][string] },
      (lp) => { if (old) lp.courseTimelines[courseId] = old; else delete lp.courseTimelines[courseId] },
      () => api.saveCourseTimeline(layerId, courseId, patch))
  }, [progress, commit])

  const handleSaveQuiz = useCallback((score: number) => {
    const before = progress.layerProgress[String(layer.id)]
    const old = { quizScore: before?.quizScore ?? null, quizAttempts: before?.quizAttempts ?? 0 }
    commit(layer.id,
      (lp) => { lp.quizScore = score; lp.quizAttempts = (lp.quizAttempts ?? 0) + 1 },
      (lp) => { Object.assign(lp, old) },
      (lp) => api.saveLayerProgress(layer.id, { quizScore: lp.quizScore, quizAttempts: lp.quizAttempts }))
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
