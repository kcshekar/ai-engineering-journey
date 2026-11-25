// Run with: npm test   (Node's built-in runner; Node 22.18+ loads the .ts modules directly)
import { test } from "node:test"
import assert from "node:assert/strict"
import { randomBytes, scryptSync } from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import {
  getRequiredCount, countDoneUnits, isLayerWorkDone, isQuizUnlocked, applyItemToggle, getLayerHours, getStageProgress,
} from "../lib/loader.ts"
import { verifyPassword, hashPassword } from "../lib/password.ts"

const item = (id, extra = {}) => ({ id, title: id, platform: "", url: "", cost: "", duration: "", order: 1, why: "", ...extra })
const layer = (courses, extra = {}) => ({ id: 9, title: "t", weeks: "1-2", description: "", appliesTo: [], weeklyPlan: [], quiz: { unlockCondition: "", passingScore: 70, questions: [] }, courses, ...extra })
const entry = (ids, extra = {}) => ({ started: false, completed: false, coursesCompleted: [...ids], quizScore: null, quizAttempts: 0, startedDate: null, completedDate: null, deadline: null, courseTimelines: {}, ...extra })

// core a, core b, optional c, pick group g = {d, e}
const L = layer([
  item("a", { hours: 2 }),
  item("b", { hours: 1 }),
  item("c", { track: "optional", hours: 4 }),
  item("d", { pickGroup: "g", hours: 3 }),
  item("e", { pickGroup: "g", hours: 5 }),
])

test("required units: core items count, optional items never, a pick group once", () => {
  assert.equal(getRequiredCount(L), 3)
  assert.equal(countDoneUnits(L, ["c"]), 0)
  assert.equal(countDoneUnits(L, ["a", "e"]), 2)
  assert.equal(countDoneUnits(L, ["a", "d", "e"]), 2)
})

test("layer work is done when every unit is done, and never for a layer with no core items", () => {
  assert.equal(isLayerWorkDone(L, ["a", "b", "d"]), true)
  assert.equal(isLayerWorkDone(L, ["a", "b", "c"]), false)
  assert.equal(isLayerWorkDone(layer([item("x", { track: "optional" })]), ["x"]), false)
})

test("hours: optional apart, a pick group counted once at its first member", () => {
  assert.deepEqual(getLayerHours(L), { required: 6, optional: 4 })
})

test("toggle: finishing the last unit completes the layer with today's date", () => {
  const lp = entry(["a", "b"])
  applyItemToggle(L, lp, "e")
  assert.equal(lp.completed, true)
  assert.match(lp.completedDate, /^\d{4}-\d{2}-\d{2}$/)
  assert.equal(lp.started, true)
})

test("toggle: an extra optional or pick-group item keeps the first completion date", () => {
  const lp = entry(["a", "b", "d"], { completed: true, completedDate: "2026-01-01" })
  applyItemToggle(L, lp, "c")
  applyItemToggle(L, lp, "e")
  assert.equal(lp.completed, true)
  assert.equal(lp.completedDate, "2026-01-01")
})

test("toggle: unticking a required item clears completion", () => {
  const lp = entry(["a", "b", "d"], { completed: true, completedDate: "2026-01-01" })
  applyItemToggle(L, lp, "a")
  assert.equal(lp.completed, false)
  assert.equal(lp.completedDate, null)
})

test("toggle: a layer finished before new core items were added stays finished (decision 0001)", () => {
  const lp = entry(["a"], { completed: true, completedDate: "2026-01-01" })
  applyItemToggle(L, lp, "b")
  applyItemToggle(L, lp, "b")
  assert.equal(lp.completed, true)
  assert.equal(lp.completedDate, "2026-01-01")
})

test("quiz unlock: the stored completed flag or finished work", () => {
  const progress = (lp) => ({ layerProgress: { "9": lp } })
  assert.equal(isQuizUnlocked(L, progress(entry(["a"]))), false)
  assert.equal(isQuizUnlocked(L, progress(entry(["a"], { completed: true }))), true)
  assert.equal(isQuizUnlocked(L, progress(entry(["a", "b", "e"]))), true)
  assert.equal(isQuizUnlocked(L, { layerProgress: {} }), false)
})

test("password: hashPassword output verifies, a wrong password or bad format fails", () => {
  const salt = randomBytes(16)
  const stored = `scrypt:${salt.toString("hex")}:${scryptSync("correct horse battery", salt, 64).toString("hex")}`
  assert.equal(verifyPassword("correct horse battery", stored), true)
  assert.equal(verifyPassword("wrong horse battery", stored), false)
  assert.equal(verifyPassword("correct horse battery", undefined), false)
  assert.equal(verifyPassword("correct horse battery", "plain-text-password"), false)
  assert.equal(verifyPassword("", stored), false)
  const made = hashPassword("another long password")
  assert.match(made, /^scrypt:[0-9a-f]{32}:[0-9a-f]{128}$/)
  assert.equal(verifyPassword("another long password", made), true)
  assert.notEqual(hashPassword("same"), hashPassword("same"), "every hash gets a new salt")
})

test("real content: every layer has core work and its ids are unique across the roadmap", () => {
  const base = path.join(import.meta.dirname, "..", "data", "roadmaps", "ai-engineering")
  const seen = new Set()
  for (const dir of fs.readdirSync(base).filter((d) => /^layer-\d+$/.test(d))) {
    const l = JSON.parse(fs.readFileSync(path.join(base, dir, "layer.json"), "utf8"))
    assert.ok(getRequiredCount(l) > 0, `${dir} has no core work`)
    for (const c of l.courses) {
      assert.ok(!seen.has(c.id), `duplicate id ${c.id}`)
      seen.add(c.id)
    }
  }
  for (const id of ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8"]) assert.ok(seen.has(id), `progress id ${id} is gone`)
})

test("stage progress: required units per stage in order, a pick group once in its stage, optional never", () => {
  const S = layer([
    item("x", { stage: "advanced" }),
    item("a", { stage: "beginner" }),
    item("b", { stage: "beginner", track: "optional" }),
    item("d", { stage: "intermediate", pickGroup: "g" }),
    item("e", { stage: "intermediate", pickGroup: "g" }),
  ])
  assert.deepEqual(getStageProgress(S, ["e", "b"]), [
    { stage: "beginner", done: 0, required: 1 },
    { stage: "intermediate", done: 1, required: 1 },
    { stage: "advanced", done: 0, required: 1 },
  ])
})
