// Local-date keys, the immutable progress update behind save rollback, and dashboard stats (lib/loader.ts),
// plus the activity day check (lib/api-input.ts).
import { test } from "node:test"
import assert from "node:assert/strict"
import {
  localDateKey, parseDateKey, addDays, daysBetween, updateLayerEntry, emptyLayerEntry,
  getHoursDone, countActiveDays, getLayerDeadline, applyItemToggle, resolveFailedSave,
} from "../lib/loader.ts"
import { activityDayOf } from "../lib/api-input.ts"

const item = (id, extra = {}) => ({ id, title: id, platform: "", url: "", cost: "", duration: "", order: 1, why: "", ...extra })
const layer = (id, courses, extra = {}) => ({ id, title: "t", weeks: "1-2", description: "", appliesTo: [], weeklyPlan: [], quiz: { unlockCondition: "", passingScore: 70, questions: [] }, courses, ...extra })
const progressOf = (layerProgress) => ({ userId: "u", roadmapId: "r", overallProgress: 0, currentLayer: 1, currentWeek: 1, layerProgress, weeklyCheckins: [], totalHoursSpent: 0 })

test("localDateKey: the local calendar day, not the UTC one", () => {
  // 23:30 local time is still the same local day in every time zone.
  assert.equal(localDateKey(new Date(2026, 10, 25, 23, 30)), "2026-11-25")
  assert.equal(localDateKey(new Date(2026, 0, 1, 0, 5)), "2026-01-01")
})

test("parseDateKey: local midnight of the key", () => {
  const d = parseDateKey("2026-03-09")
  assert.deepEqual([d.getFullYear(), d.getMonth(), d.getDate(), d.getHours()], [2026, 2, 9, 0])
})

test("addDays and daysBetween: calendar maths across months and years", () => {
  assert.equal(addDays("2026-01-31", 1), "2026-02-01")
  assert.equal(addDays("2026-12-31", 1), "2027-01-01")
  assert.equal(addDays("2026-03-01", -1), "2026-02-28")
  assert.equal(daysBetween("2026-11-01", "2026-11-15"), 14)
  assert.equal(daysBetween("2026-11-15", "2026-11-01"), -14)
})

test("getLayerDeadline: start date plus the layer's weeks, as a local day", () => {
  const l = layer(1, [], { weeks: "1-3" })
  assert.equal(getLayerDeadline(l, { ...emptyLayerEntry(), startedDate: "2026-11-01" }), "2026-11-22")
  assert.equal(getLayerDeadline(l, { ...emptyLayerEntry(), deadline: "2026-12-01" }), "2026-12-01")
})

test("updateLayerEntry: returns a changed copy and leaves the input alone (save rollback relies on it)", () => {
  const prev = progressOf({ 1: { ...emptyLayerEntry(), coursesCompleted: ["c1"] } })
  const before = structuredClone(prev)
  const next = updateLayerEntry(prev, 1, (lp) => applyItemToggle(layer(1, [item("c1"), item("c2")]), lp, "c2"))
  assert.deepEqual(prev, before)
  assert.notEqual(next, prev)
  assert.deepEqual(next.layerProgress[1].coursesCompleted, ["c1", "c2"])
})

test("updateLayerEntry: creates a missing layer entry", () => {
  const next = updateLayerEntry(progressOf({}), 4, (lp) => { lp.deadline = "2026-12-01" })
  assert.equal(next.layerProgress[4].deadline, "2026-12-01")
  assert.deepEqual(next.layerProgress[4].courseTimelines, {})
})

test("getHoursDone: sums the hours of completed items only", () => {
  const layers = [layer(1, [item("a", { hours: 2 }), item("b", { hours: 1.5 }), item("c")]), layer(2, [item("d", { hours: 4 })])]
  assert.equal(getHoursDone(layers, progressOf({ 1: { ...emptyLayerEntry(), coursesCompleted: ["a", "b", "c"] } })), 3.5)
  assert.equal(getHoursDone(layers, progressOf({})), 0)
})

test("countActiveDays: days with activity in the window, today included", () => {
  const map = { "2026-11-25": { total: 3 }, "2026-11-24": { total: 0 }, "2026-11-20": { total: 1 }, "2026-10-01": { total: 9 } }
  assert.equal(countActiveDays(map, "2026-11-25", 30), 2)
  assert.equal(countActiveDays(map, "2026-11-25", 1), 1)
})

test("activityDayOf: trusts the client's local day within one day of UTC, else uses UTC", () => {
  const now = new Date("2026-11-25T20:00:00Z")
  assert.equal(activityDayOf("2026-11-26", now), "2026-11-26") // east of UTC, after local midnight
  assert.equal(activityDayOf("2026-11-24", now), "2026-11-24") // far west of UTC
  assert.equal(activityDayOf("2026-11-28", now), "2026-11-25")
  assert.equal(activityDayOf("2026-13-45", now), "2026-11-25")
  assert.equal(activityDayOf(undefined, now), "2026-11-25")
  assert.equal(activityDayOf(42, now), "2026-11-25")
})

test("resolveFailedSave: no later change, so the previous state comes back", () => {
  const l = layer(1, [item("a"), item("b")])
  const toggleA = (lp) => applyItemToggle(l, lp, "a")
  const prev = progressOf({ 1: emptyLayerEntry() })
  const next = updateLayerEntry(prev, 1, toggleA)
  const { progress, resync } = resolveFailedSave(next, next, prev, 1, toggleA)
  assert.equal(progress, prev)
  assert.equal(resync, null)
})

test("resolveFailedSave: a later change survives, the failed one is undone, and the layer is re-sent", () => {
  const l = layer(1, [item("a"), item("b"), item("c")])
  const toggle = (id) => (lp) => applyItemToggle(l, lp, id)
  const prev = progressOf({ 1: emptyLayerEntry() })
  const next = updateLayerEntry(prev, 1, toggle("a"))  // A: tick a (its save fails)
  const later = updateLayerEntry(next, 1, toggle("b")) // B: tick b (saved; its write carried a)
  const { progress, resync } = resolveFailedSave(later, next, prev, 1, toggle("a"))
  assert.deepEqual(progress.layerProgress[1].coursesCompleted, ["b"])
  assert.deepEqual(resync.coursesCompleted, ["b"])
  assert.deepEqual(later.layerProgress[1].coursesCompleted, ["a", "b"]) // inputs untouched
})

test("applyItemToggle: the first tick keeps a start date the learner set", () => {
  const lp = { ...emptyLayerEntry(), startedDate: "2026-11-01" }
  applyItemToggle(layer(1, [item("a"), item("b")]), lp, "a")
  assert.equal(lp.started, true)
  assert.equal(lp.startedDate, "2026-11-01")
})
