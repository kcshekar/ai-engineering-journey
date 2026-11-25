// Input checks shared by the API routes (lib/api-input.ts).
import { test } from "node:test"
import assert from "node:assert/strict"
import {
  readBody, layerIdOf, courseIdOf, contentOf, dateOrNull, badRequest,
  invalidFields, LAYER_PROGRESS_FIELDS, COURSE_META_FIELDS, TIMELINE_FIELDS,
} from "../lib/api-input.ts"

const req = (body) => new Request("http://x/api", { method: "POST", body })

test("readBody: a JSON object, otherwise null", async () => {
  assert.deepEqual(await readBody(req('{"a":1}')), { a: 1 })
  assert.equal(await readBody(req("")), null)
  assert.equal(await readBody(req("not json")), null)
  assert.equal(await readBody(req("[1,2]")), null)
  assert.equal(await readBody(req("null")), null)
})

test("layerIdOf: positive whole numbers, as numbers or numeric strings", () => {
  assert.equal(layerIdOf(3), 3)
  assert.equal(layerIdOf("3"), 3)
  for (const bad of [undefined, null, 0, -1, 1.5, "abc", "3x", "", NaN, 5000]) assert.equal(layerIdOf(bad), null, String(bad))
})

test("courseIdOf: roadmap item ids only", () => {
  assert.equal(courseIdOf("c305"), "c305")
  for (const bad of [undefined, 5, "", "C1", "c1;drop", "a".repeat(65)]) assert.equal(courseIdOf(bad), null, String(bad))
})

test("contentOf and dateOrNull", () => {
  assert.equal(contentOf(""), "")
  assert.equal(contentOf(42), null)
  assert.equal(contentOf("x".repeat(200_001)), null)
  assert.equal(dateOrNull("2026-11-23"), "2026-11-23")
  assert.equal(dateOrNull(null), null)
  assert.equal(dateOrNull("23/11/2026"), undefined)
  assert.equal(dateOrNull(undefined), undefined)
})

test("badRequest: a 400 with the message", async () => {
  const res = badRequest("nope")
  assert.equal(res.status, 400)
  assert.deepEqual(await res.json(), { error: "nope" })
})

// The exact payloads the app sends (LayerDetailClient, LayerCard, CoursePanel, QuizSection).
// api-client hides save errors, so a false 400 here would silently lose progress.
test("field tables accept every payload the client sends", () => {
  const fullEntry = {
    started: false, completed: false, coursesCompleted: [], quizScore: null, quizAttempts: 0,
    startedDate: null, completedDate: null, deadline: null, courseTimelines: {},
  }
  const ticked = { ...fullEntry, started: true, startedDate: "2026-11-23", coursesCompleted: ["c305", "c306"] }
  for (const patch of [fullEntry, ticked, { started: true, startedDate: "2026-11-23" }, { deadline: null },
    { deadline: "2026-12-31" }, { quizScore: 83, quizAttempts: 2 }, { quizScore: 0, quizAttempts: 1 }]) {
    assert.deepEqual(invalidFields(LAYER_PROGRESS_FIELDS, patch), [], JSON.stringify(patch))
  }
  for (const patch of [{ views: "__inc__" }, { codeRuns: "__inc__", hasCode: true, codeChars: 0 },
    { hasNotes: false, noteChars: 0, hasCode: true, codeChars: 120 }]) {
    assert.deepEqual(invalidFields(COURSE_META_FIELDS, patch), [], JSON.stringify(patch))
  }
  for (const patch of [{ startDate: "2026-11-01", endDate: null }, { startDate: null, endDate: null }]) {
    assert.deepEqual(invalidFields(TIMELINE_FIELDS, patch), [], JSON.stringify(patch))
  }
})

test("field tables reject unknown, inherited and badly typed fields", () => {
  assert.deepEqual(invalidFields(COURSE_META_FIELDS, { userId: "x", id: "y" }), ["userId", "id"])
  assert.deepEqual(invalidFields(COURSE_META_FIELDS, JSON.parse('{"__proto__":1,"constructor":1,"toString":1,"hasOwnProperty":1}')),
    ["__proto__", "constructor", "toString", "hasOwnProperty"])
  assert.deepEqual(invalidFields(COURSE_META_FIELDS, { views: 5, noteChars: -1 }), ["views", "noteChars"])
  assert.deepEqual(invalidFields(LAYER_PROGRESS_FIELDS, { quizScore: 101, started: "yes", coursesCompleted: ["ok", "Bad"] }),
    ["quizScore", "started", "coursesCompleted"])
  assert.deepEqual(invalidFields(TIMELINE_FIELDS, { startDate: "soon", note: "x" }), ["startDate", "note"])
})
