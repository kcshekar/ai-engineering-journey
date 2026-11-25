import type { Layer, LayerProgressEntry, WeekPlan, RoadmapProgress, ActivityDay, Stage } from "@/types"

// Dates are "YYYY-MM-DD" keys in the learner's local time. Never use toISOString() for a day:
// it is UTC, so east of UTC local midnight becomes the previous day.
export function localDateKey(d: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

// Local midnight of a "YYYY-MM-DD" key. new Date("YYYY-MM-DD") would be UTC midnight instead.
export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(key: string, days: number): string {
  const d = parseDateKey(key)
  d.setDate(d.getDate() + days)
  return localDateKey(d)
}

/** Whole days from key a to key b (b - a). */
export function daysBetween(a: string, b: string): number {
  return Math.round((parseDateKey(b).getTime() - parseDateKey(a).getTime()) / 86400000)
}

export function emptyLayerEntry(): LayerProgressEntry {
  return {
    started: false, completed: false, coursesCompleted: [], quizScore: null, quizAttempts: 0,
    startedDate: null, completedDate: null, deadline: null, courseTimelines: {},
  }
}

/** A deep copy of progress with one layer's entry changed by mutate; the input is left untouched. */
export function updateLayerEntry(
  progress: RoadmapProgress,
  layerId: number,
  mutate: (lp: LayerProgressEntry) => void,
): RoadmapProgress {
  const next: RoadmapProgress = structuredClone(progress)
  const lp = (next.layerProgress[String(layerId)] ??= emptyLayerEntry())
  lp.courseTimelines ??= {}
  mutate(lp)
  return next
}

/**
 * After a save of change `next` (made from `prev`) failed, what to show now (`cur` is the latest state).
 * - Nothing changed since: show `prev` again.
 * - A later change was made: keep it and apply `undo` to that layer only. `resync` is that layer's corrected
 *   entry, which must be written again, because the later change's write may have carried the failed one.
 */
export function resolveFailedSave(
  cur: RoadmapProgress,
  next: RoadmapProgress,
  prev: RoadmapProgress,
  layerId: number,
  undo: (lp: LayerProgressEntry) => void,
): { progress: RoadmapProgress; resync: LayerProgressEntry | null } {
  if (cur === next) return { progress: prev, resync: null }
  const progress = updateLayerEntry(cur, layerId, undo)
  return { progress, resync: progress.layerProgress[String(layerId)] }
}

/** Estimated hours of finished work: the hours of every completed item. */
export function getHoursDone(layers: Layer[], progress: RoadmapProgress): number {
  let hours = 0
  for (const layer of layers) {
    const done = new Set(progress.layerProgress[String(layer.id)]?.coursesCompleted ?? [])
    for (const item of layer.courses) if (done.has(item.id)) hours += item.hours ?? 0
  }
  return Math.round(hours * 10) / 10
}

/** Days with any activity in the last `days` days, today included. */
export function countActiveDays(activityMap: Record<string, ActivityDay>, today: string, days = 30): number {
  let count = 0
  for (let i = 0; i < days; i++) if ((activityMap[addDays(today, -i)]?.total ?? 0) > 0) count++
  return count
}

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

const STAGE_ORDER: Stage[] = ["beginner", "intermediate", "advanced"]

export interface StageProgress { stage: Stage; done: number; required: number }

/** Required units per item stage, in stage order; a pick group counts in the stage of its items. */
export function getStageProgress(layer: Layer, completedIds: string[]): StageProgress[] {
  const done = new Set(completedIds)
  const byId = new Map(layer.courses.map((c) => [c.id, c]))
  const rows = new Map<Stage, StageProgress>()
  for (const ids of getRequiredUnits(layer)) {
    const stage = byId.get(ids[0])?.stage
    if (!stage) continue
    const row = rows.get(stage) ?? { stage, done: 0, required: 0 }
    row.required++
    if (ids.some((id) => done.has(id))) row.done++
    rows.set(stage, row)
  }
  return STAGE_ORDER.filter((s) => rows.has(s)).map((s) => rows.get(s)!)
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

// A layer finished earlier stays finished when new core items are added later (plan Phase 3 note):
// the stored flag also unlocks the quiz, while the bars still show the new items.
export function isQuizUnlocked(layer: Layer, progress: RoadmapProgress): boolean {
  const lp = progress.layerProgress[String(layer.id)]
  if (!lp) return false
  return lp.completed || isLayerWorkDone(layer, lp.coursesCompleted)
}

// Toggles one item in place and updates started/completed. Completion is cleared only when the
// required work was done before this toggle and is not done after it (the learner unticked a
// required item), so a layer flagged complete before new items were added keeps its flag.
export function applyItemToggle(layer: Layer | undefined, lp: LayerProgressEntry, courseId: string): void {
  const today = localDateKey()
  const wasDone = layer ? isLayerWorkDone(layer, lp.coursesCompleted) : false
  const idx = lp.coursesCompleted.indexOf(courseId)
  if (idx > -1) {
    lp.coursesCompleted.splice(idx, 1)
  } else {
    lp.coursesCompleted.push(courseId)
    // Keep a start date the learner set before the first tick.
    if (!lp.started) { lp.started = true; lp.startedDate ??= today }
  }
  if (!layer) return
  if (isLayerWorkDone(layer, lp.coursesCompleted)) {
    // Keep the first completion date when an optional or extra pick-group item is toggled.
    if (!lp.completed) { lp.completed = true; lp.completedDate = today }
  } else if (wasDone) {
    lp.completed = false; lp.completedDate = null
  }
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
  return addDays(lp.startedDate, getLayerDuration(layer))
}

export function getDeadlineStatus(deadline: string | null): {
  daysRemaining: number | null
  status: "none" | "ok" | "warning" | "danger" | "overdue"
} {
  if (!deadline) return { daysRemaining: null, status: "none" }
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const end = parseDateKey(deadline)
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
  const startDate = addDays(lp.startedDate, offset)
  return { startDate, endDate: addDays(startDate, 6) }
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
  const diffDays = daysBetween(lp.startedDate, localDateKey())
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
