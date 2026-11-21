import type { Layer, LayerProgressEntry, WeekPlan, RoadmapProgress } from "@/types"

export function getCurrentLayer(layers: Layer[], progress: RoadmapProgress): Layer {
  return layers.find((l) => l.id === progress.currentLayer) ?? layers[0]
}

export function getCurrentWeek(layer: Layer, weekNum: number): WeekPlan | undefined {
  return layer.weeklyPlan.find((w) => w.week === weekNum) ?? layer.weeklyPlan[0]
}

// Required units for completion (decision 0001): each core item is one unit, and a
// pick group with at least one core item is one unit, done when any of its items is done.
// Optional items never count. A missing track means core, so older layers behave as before.
function getRequiredUnits(layer: Layer): string[][] {
  const units: string[][] = []
  const groups = new Map<string, string[]>()
  const coreGroups = new Set<string>()
  for (const item of layer.courses) {
    const isCore = (item.track ?? "core") === "core"
    if (item.pickGroup) {
      if (!groups.has(item.pickGroup)) {
        const ids: string[] = []
        groups.set(item.pickGroup, ids)
        units.push(ids)
      }
      groups.get(item.pickGroup)!.push(item.id)
      if (isCore) coreGroups.add(item.pickGroup)
    } else if (isCore) {
      units.push([item.id])
    }
  }
  return units.filter((ids) => {
    const group = layer.courses.find((c) => c.id === ids[0])?.pickGroup
    return group ? coreGroups.has(group) : true
  })
}

export function countDoneUnits(layer: Layer, completedIds: string[]): number {
  const done = new Set(completedIds)
  return getRequiredUnits(layer).filter((ids) => ids.some((id) => done.has(id))).length
}

export function getRequiredCount(layer: Layer): number {
  return getRequiredUnits(layer).length
}

export function getCompletedCount(layer: Layer, progress: RoadmapProgress): number {
  return countDoneUnits(layer, progress.layerProgress[String(layer.id)]?.coursesCompleted ?? [])
}

export function isLayerWorkDone(layer: Layer, completedIds: string[]): boolean {
  const required = getRequiredCount(layer)
  return required > 0 && countDoneUnits(layer, completedIds) === required
}

export function isQuizUnlocked(layer: Layer, progress: RoadmapProgress): boolean {
  const lp = progress.layerProgress[String(layer.id)]
  if (!lp) return false
  return isLayerWorkDone(layer, lp.coursesCompleted)
}

export function getLayerHours(layer: Layer): { required: number; optional: number } {
  let required = 0
  let optional = 0
  const seenGroups = new Set<string>()
  for (const item of layer.courses) {
    if (!item.hours) continue
    if ((item.track ?? "core") === "optional") {
      optional += item.hours
    } else if (item.pickGroup) {
      // Count a pick group once, at its first core member's hours, since only one is needed.
      if (!seenGroups.has(item.pickGroup)) required += item.hours
      seenGroups.add(item.pickGroup)
    } else {
      required += item.hours
    }
  }
  return { required, optional }
}

export type LayerStatus = "completed" | "in-progress" | "not-started"

export function getLayerStatus(
  layer: Layer,
  layerProgress: Record<string, LayerProgressEntry> | undefined
): LayerStatus {
  const lp = layerProgress?.[String(layer.id)]
  const completedIds = lp?.coursesCompleted ?? []
  if (lp?.completed || isLayerWorkDone(layer, completedIds)) {
    return "completed"
  }
  if (lp?.started || completedIds.length > 0) return "in-progress"
  return "not-started"
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

export function getEffectiveCurrentLayer(
  layers: Layer[],
  layerProgress: Record<string, LayerProgressEntry> | undefined
): Layer {
  const sorted = [...layers].sort((a, b) => a.id - b.id)
  const firstIncomplete = sorted.find((l) => getLayerStatus(l, layerProgress) !== "completed")
  return firstIncomplete ?? sorted[sorted.length - 1]
}

export function getCurrentWeekNum(layer: Layer, lp: LayerProgressEntry | undefined): number {
  const weeks = layer.weeklyPlan.map((w) => w.week)
  const minWeek = Math.min(...weeks)
  const maxWeek = Math.max(...weeks)
  if (!lp?.startedDate) return minWeek
  const start = new Date(lp.startedDate)
  const diffDays = Math.floor((Date.now() - start.getTime()) / 86400000)
  const weekOffset = Math.floor(diffDays / 7)
  return Math.min(maxWeek, Math.max(minWeek, minWeek + weekOffset))
}

export function calculateOverallProgress(layers: Layer[], progress: RoadmapProgress): number {
  let total = 0
  let completed = 0
  layers.forEach((layer) => {
    total += getRequiredCount(layer)
    completed += getCompletedCount(layer, progress)
  })
  return total > 0 ? Math.round((completed / total) * 100) : 0
}
