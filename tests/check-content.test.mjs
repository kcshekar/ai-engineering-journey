// Runs scripts/check-content.mjs against small temporary roadmaps.
import { test } from "node:test"
import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

const script = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "scripts", "check-content.mjs")

const item = (id, extra = {}) => ({ id, title: id, platform: "", url: "", cost: "", duration: "", order: 1, why: "", ...extra })
const stage = (extra = {}) => ({ stage: "beginner", kicker: "Start", rank: "Builder", color: "accent", checkpoint: "Why?", ...extra })

// Writes one roadmap with one layer and returns the check's exit code and output.
function check(layerExtra = {}, courses = [item("a", { stage: "beginner" }), item("p", { kind: "project", stage: "beginner" })]) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "check-content-"))
  const layerDir = path.join(dir, "rm", "layer-1")
  fs.mkdirSync(layerDir, { recursive: true })
  const layer = { id: 1, title: "t", weeks: "1", description: "", appliesTo: [], courses, quiz: { questions: [] }, ...layerExtra }
  fs.writeFileSync(path.join(layerDir, "layer.json"), JSON.stringify(layer))
  fs.writeFileSync(path.join(layerDir, "planning.json"), JSON.stringify({ weeklyPlan: [] }))
  const r = spawnSync(process.execPath, [script, dir], { encoding: "utf8" })
  fs.rmSync(dir, { recursive: true, force: true })
  return { code: r.status, out: r.stdout + r.stderr }
}

test("stages: a complete stage with its project passes", () => {
  const r = check({ stages: [stage({ project: "p" })] })
  assert.equal(r.code, 0, r.out)
})

test("stages: bad enum, duplicate, unused stage, missing fields and wrong project fail", () => {
  const r = check({
    stages: [
      stage({ color: "green" }),
      stage(),
      stage({ stage: "advanced", rank: "" }),
      stage({ stage: "expert" }),
    ],
  })
  assert.equal(r.code, 1)
  assert.match(r.out, /stage beginner: color must be one of/)
  assert.match(r.out, /stage beginner: listed twice/)
  assert.match(r.out, /stage advanced: no item in this layer has this stage/)
  assert.match(r.out, /stage advanced: needs a rank/)
  assert.match(r.out, /stage expert: stage must be one of/)

  const p = check({ stages: [stage({ project: "a" })] })
  assert.match(p.out, /project "a" is not a project item/)
  const q = check({ stages: [stage({ project: "zz" })] })
  assert.match(q.out, /project "zz" is not in this layer/)
})

test("items: lastChecked must be a real date and versions need one", () => {
  assert.equal(check({}, [item("a", { lastChecked: "2026-11-25", versions: { langgraph: "1.2.24" } })]).code, 0)
  const r = check({}, [
    item("a", { lastChecked: "2026-02-30" }),
    item("b", { versions: { langgraph: "1.2.24" } }),
    item("c", { lastChecked: "2026-11-25", versions: { langgraph: 1 } }),
  ])
  assert.equal(r.code, 1)
  assert.match(r.out, /item a: lastChecked must be a date/)
  assert.match(r.out, /item b: versions need a lastChecked date/)
  assert.match(r.out, /item c: versions must map package names/)
})
