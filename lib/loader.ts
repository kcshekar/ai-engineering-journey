import type { Layer, LayerProgressEntry, WeekPlan, RoadmapProgress } from "@/types"

export function getCurrentLayer(layers: Layer[], progress: RoadmapProgress): Layer {
  return layers.find((l) => l.id === progress.currentLayer) ?? layers[0]
}

export function getCurrentWeek(layer: Layer, weekNum: number): WeekPlan | undefined {
  return layer.weeklyPlan.find((w) => w.week === weekNum) ?? layer.weeklyPlan[0]
}

export function getCompletedCount(layer: Layer, progress: RoadmapProgress): number {
  return progress.layerProgress[String(layer.id)]?.coursesCompleted.length ?? 0
}

export function isQuizUnlocked(layer: Layer, progress: RoadmapProgress): boolean {
  const lp = progress.layerProgress[String(layer.id)]
  if (!lp) return false
  return lp.coursesCompleted.length === layer.courses.length
}

export function getLayerDuration(layer: Layer): number {
  const [start, end] = layer.weeks.split("-").map(Number)
  return (end - start + 1) * 7
}

export function getLayerDeadline(
  layer: Layer,
  lp: LayerProgressEntry | undefined
): string | null {
  if (lp?.deadline) return lp.deadline
  if (!lp?.startedDate) return null
  const d = new Date(lp.startedDate)
  d.setDate(d.getDate() + getLayerDuration(layer))
  return d.toISOString().split("T")[0]
}

export function getDeadlineStatus(deadline: string | null): {
  daysRemaining: number | null
  status: "none" | "ok" | "warning" | "danger" | "overdue"
} {
  if (!deadline) return { daysRemaining: null, status: "none" }
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const end = new Date(deadline)
  end.setHours(0, 0, 0, 0)
  const diff = Math.round((end.getTime() - today.getTime()) / 86400000)
  if (diff < 0) return { daysRemaining: diff, status: "overdue" }
  if (diff <= 3) return { daysRemaining: diff, status: "danger" }
  if (diff <= 7) return { daysRemaining: diff, status: "warning" }
  return { daysRemaining: diff, status: "ok" }
}

export function getCourseWeekNum(layer: Layer, courseId: string): number | null {
  return layer.weeklyPlan.find((w) => w.courses.includes(courseId))?.week ?? null
}

export function getCourseSuggestedDates(
  layer: Layer,
  lp: LayerProgressEntry | undefined,
  courseId: string
): { startDate: string; endDate: string } | null {
  if (!lp?.startedDate) return null
  const weekNum = getCourseWeekNum(layer, courseId)
  if (weekNum == null) return null
  const minWeek = Math.min(...layer.weeklyPlan.map((w) => w.week))
  const offset = (weekNum - minWeek) * 7
  const start = new Date(lp.startedDate)
  start.setDate(start.getDate() + offset)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  return {
    startDate: start.toISOString().split("T")[0],
    endDate: end.toISOString().split("T")[0],
  }
}

export function getCourseTimeline(
  layer: Layer,
  lp: LayerProgressEntry | undefined,
  courseId: string
): { startDate: string | null; endDate: string | null; isCustom: boolean } {
  const custom = lp?.courseTimelines?.[courseId]
  if (custom?.startDate || custom?.endDate) {
    return { startDate: custom.startDate ?? null, endDate: custom.endDate ?? null, isCustom: true }
  }
  const suggested = getCourseSuggestedDates(layer, lp, courseId)
  return suggested
    ? { ...suggested, isCustom: false }
    : { startDate: null, endDate: null, isCustom: false }
}

export function calculateOverallProgress(layers: Layer[], progress: RoadmapProgress): number {
  let total = 0
  let completed = 0
  layers.forEach((layer) => {
    total += layer.courses.length
    completed += progress.layerProgress[String(layer.id)]?.coursesCompleted.length ?? 0
  })
  return total > 0 ? Math.round((completed / total) * 100) : 0
}
