#!/usr/bin/env node
// Content check for data/roadmaps/<id>/layer-N/{layer,planning}.json (decision 0001).
// Usage: node scripts/check-content.mjs [roadmapsDir]   (default: data/roadmaps)
// Exits 1 and lists every problem if any check fails.
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const KINDS = ["course", "video", "article", "docs", "book", "repo", "project"]
const PRICES = ["free", "freemium", "paid"]
const TRACKS = ["core", "optional"]
const STAGES = ["beginner", "intermediate", "advanced"]
const QUIZ_STAGES = ["pre", "check", "post"]
// Same idea as AI Engineering from Scratch's check_quiz_bias.py: a question is
// guessable when the correct option is strictly longest and this much longer.
const LENGTH_RATIO = 1.25
const MAX_LENGTH_BIASED_SHARE = 0.5
const MIN_QUESTIONS_FOR_BIAS = 4

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const root = path.resolve(process.argv[2] ?? path.join(repoRoot, "data", "roadmaps"))
const errors = []
let layerCount = 0
let itemCount = 0
let mcqCount = 0

const isStr = (v) => typeof v === "string" && v.trim() !== ""
const isStrArray = (v) => Array.isArray(v) && v.every(isStr)
const isObj = (v) => v !== null && typeof v === "object" && !Array.isArray(v)

// Returns the list, or [] with an error when the field is present but not a list.
function list(value, where, field) {
  if (value === undefined) return []
  if (Array.isArray(value)) return value
  errors.push(`${where}: ${field} must be a list`)
  return []
}

function readJson(file, where) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"))
  } catch (e) {
    errors.push(`${where}: cannot read ${path.basename(file)} (${e.message})`)
    return null
  }
}

function checkEnum(value, allowed, where, field) {
  if (value !== undefined && !allowed.includes(value)) {
    errors.push(`${where}: ${field} "${value}" is not one of ${allowed.join(", ")}`)
  }
}

function checkItem(item, where, pickGroupIds) {
  if (!isStr(item.id)) errors.push(`${where}: item has no id`)
  if (!isStr(item.title)) errors.push(`${where}: item has no title`)
  checkEnum(item.kind, KINDS, where, "kind")
  checkEnum(item.price, PRICES, where, "price")
  checkEnum(item.track, TRACKS, where, "track")
  checkEnum(item.stage, STAGES, where, "stage")
  if (item.recommended !== undefined && typeof item.recommended !== "boolean") {
    errors.push(`${where}: recommended must be true or false`)
  }
  if (item.hours !== undefined && !(typeof item.hours === "number" && item.hours > 0)) {
    errors.push(`${where}: hours must be a number above 0`)
  }
  if (item.pickGroup !== undefined && !pickGroupIds.has(item.pickGroup)) {
    errors.push(`${where}: pickGroup "${item.pickGroup}" is not in this layer's pickGroups`)
  }
  for (const field of ["prereqs", "skills", "keep"]) {
    if (item[field] !== undefined && !isStrArray(item[field])) {
      errors.push(`${where}: ${field} must be a list of strings`)
    }
  }
  const pc = item.pythonChallenge
  if (pc) {
    if (pc.tests !== undefined && !isStr(pc.tests)) errors.push(`${where}: pythonChallenge.tests must be Python code`)
    if (pc.hints !== undefined && !isStrArray(pc.hints)) errors.push(`${where}: pythonChallenge.hints must be a list of strings`)
  }
}

function checkQuiz(quiz, where) {
  if (!quiz) return []
  const mcqs = []
  const ids = new Set()
  for (const q of list(quiz.questions, where, "quiz.questions")) {
    if (!isObj(q)) {
      errors.push(`${where}: each quiz question must be an object`)
      continue
    }
    const qw = `${where} quiz ${q.id ?? "(no id)"}`
    if (!isStr(q.id)) errors.push(`${qw}: question has no id`)
    else if (ids.has(q.id)) errors.push(`${qw}: duplicate question id`)
    else ids.add(q.id)
    checkEnum(q.stage, QUIZ_STAGES, qw, "stage")
    const hasMcqField = ["options", "correct", "explanation"].some((f) => q[f] !== undefined)
    if (!hasMcqField) continue
    if (!isStrArray(q.options) || q.options.length < 2) {
      errors.push(`${qw}: options must list at least 2 answers`)
      continue
    }
    if (!Number.isInteger(q.correct) || q.correct < 0 || q.correct >= q.options.length) {
      errors.push(`${qw}: correct must be an index from 0 to ${q.options.length - 1}`)
      continue
    }
    if (!isStr(q.explanation)) errors.push(`${qw}: an auto-scored question needs an explanation`)
    mcqs.push({ where: qw, options: q.options, correct: q.correct })
  }
  return mcqs
}

function checkQuizBias(mcqs, where) {
  if (mcqs.length < MIN_QUESTIONS_FOR_BIAS) return
  const positions = new Set(mcqs.map((q) => q.correct))
  if (positions.size === 1) {
    errors.push(`${where}: every auto-scored answer is option ${[...positions][0] + 1}; spread the correct position`)
  }
  const biased = mcqs.filter(({ options, correct }) => {
    const right = options[correct].length
    const longestOther = Math.max(...options.filter((_, i) => i !== correct).map((o) => o.length))
    return right > longestOther && right >= LENGTH_RATIO * longestOther
  })
  if (biased.length / mcqs.length > MAX_LENGTH_BIASED_SHARE) {
    errors.push(
      `${where}: ${biased.length} of ${mcqs.length} auto-scored answers are clearly the longest option; ` +
        `shorten them or lengthen distractors (${biased.map((b) => b.where.split(" quiz ")[1]).join(", ")})`
    )
  }
}

if (!fs.existsSync(root)) {
  console.error(`check-content: ${root} does not exist`)
  process.exit(1)
}

for (const roadmap of fs.readdirSync(root, { withFileTypes: true }).filter((e) => e.isDirectory())) {
  const roadmapDir = path.join(root, roadmap.name)
  const layerDirs = fs
    .readdirSync(roadmapDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && /^layer-\d+$/.test(e.name))
  const allIds = new Map()
  const prereqRefs = []
  const roadmapMcqs = []
  let layersWithMcqs = 0

  for (const dir of layerDirs) {
    const where = `${roadmap.name}/${dir.name}`
    const layer = readJson(path.join(roadmapDir, dir.name, "layer.json"), where)
    const planning = readJson(path.join(roadmapDir, dir.name, "planning.json"), where)
    if (!isObj(layer)) {
      if (layer !== null) errors.push(`${where}: layer.json must hold an object`)
      continue
    }
    layerCount++

    const folderNum = Number(dir.name.split("-")[1])
    if (layer.id !== folderNum) errors.push(`${where}: layer id ${layer.id} does not match the folder number ${folderNum}`)

    const pickGroupIds = new Set()
    const courses = list(layer.courses, where, "courses")
    for (const g of list(layer.pickGroups, where, "pickGroups")) {
      if (!isObj(g) || !isStr(g.id) || !isStr(g.label)) errors.push(`${where}: each pickGroup needs an id and a label`)
      else if (pickGroupIds.has(g.id)) errors.push(`${where}: duplicate pickGroup id "${g.id}"`)
      else pickGroupIds.add(g.id)
    }
    for (const t of list(layer.mustKnow, where, "mustKnow")) {
      if (!isObj(t) || !isStr(t.term) || !isStr(t.oneLiner)) errors.push(`${where}: each mustKnow entry needs a term and a oneLiner`)
    }
    if (layer.stageGoals) {
      for (const k of Object.keys(layer.stageGoals)) checkEnum(k, STAGES, where, "stageGoals key")
    }
    if (layer.outcomes !== undefined && !isStrArray(layer.outcomes)) errors.push(`${where}: outcomes must be a list of strings`)
    if (layer.portfolioProof && (!isStr(layer.portfolioProof.title) || !isStrArray(layer.portfolioProof.evidence))) {
      errors.push(`${where}: portfolioProof needs a title and a list of evidence`)
    }

    const layerIds = new Set()
    for (const item of courses) {
      itemCount++
      if (!isObj(item)) {
        errors.push(`${where}: each item in courses must be an object`)
        continue
      }
      const iw = `${where} item ${item.id ?? "(no id)"}`
      checkItem(item, iw, pickGroupIds)
      if (!isStr(item.id)) continue
      if (allIds.has(item.id)) errors.push(`${iw}: id is already used in ${allIds.get(item.id)}`)
      else allIds.set(item.id, where)
      layerIds.add(item.id)
      if (isStrArray(item.prereqs)) for (const p of item.prereqs) prereqRefs.push({ iw, p })
    }

    for (const g of pickGroupIds) {
      if (!courses.some((c) => isObj(c) && c.pickGroup === g)) errors.push(`${where}: pickGroup "${g}" has no items`)
    }
    // lib/loader.ts never completes a layer with no core item, so its quiz would never unlock.
    if (!courses.some((c) => isObj(c) && (c.track ?? "core") === "core")) {
      errors.push(`${where}: layer needs at least one core item, or it can never be completed`)
    }

    const weeks = isObj(planning) ? list(planning.weeklyPlan, `${where} planning`, "weeklyPlan") : []
    for (const week of weeks) {
      if (!isObj(week)) {
        errors.push(`${where} planning: each week must be an object`)
        continue
      }
      for (const id of list(week.courses, `${where} planning week ${week.week}`, "courses")) {
        if (!layerIds.has(id)) errors.push(`${where} planning week ${week.week}: course "${id}" is not in this layer`)
      }
    }

    const mcqs = checkQuiz(layer.quiz, where)
    mcqCount += mcqs.length
    roadmapMcqs.push(...mcqs)
    if (mcqs.length) layersWithMcqs++
    checkQuizBias(mcqs, `${where} quiz`)
  }

  for (const { iw, p } of prereqRefs) {
    if (!allIds.has(p)) errors.push(`${iw}: prereq "${p}" does not exist in this roadmap`)
  }
  // Across layers, so a pattern spread thinly over several layers is still caught.
  if (layersWithMcqs > 1) checkQuizBias(roadmapMcqs, `${roadmap.name} quizzes overall`)
}

if (errors.length) {
  console.error(`check-content: ${errors.length} problem(s)`)
  for (const e of errors) console.error(`  - ${e}`)
  process.exit(1)
}
console.log(`check-content: ok (${layerCount} layers, ${itemCount} items, ${mcqCount} auto-scored questions)`)
