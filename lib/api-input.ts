// Small input checks for the API routes: bad input gets a 400 instead of a crash or a bad row.

export const badRequest = (error: string) => Response.json({ error }, { status: 400 })

/** The JSON body as a plain object, or null when it is missing, invalid or not an object. */
export async function readBody(req: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await req.json()
    return isObject(body) ? body : null
  } catch {
    return null
  }
}

export function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v)
}

/** A layer id: a positive whole number, sent as a number or a numeric string. */
export function layerIdOf(v: unknown): number | null {
  const n = typeof v === "number" ? v : typeof v === "string" && /^\d+$/.test(v) ? Number(v) : NaN
  return Number.isInteger(n) && n > 0 && n < 1000 ? n : null
}

/** An item id from the roadmap JSON, such as "c1" or "c305". */
export function courseIdOf(v: unknown): string | null {
  return typeof v === "string" && /^[a-z0-9-]{1,64}$/.test(v) ? v : null
}

/** Notes and code: any string up to 200 KB. */
export function contentOf(v: unknown): string | null {
  return typeof v === "string" && v.length <= 200_000 ? v : null
}

/** A date as YYYY-MM-DD, or null. Returns undefined for anything else. */
export function dateOrNull(v: unknown): string | null | undefined {
  if (v === null) return null
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : undefined
}

type FieldChecks = Record<string, (v: unknown) => boolean>

/** Patch keys that are unknown or have a bad value. Own keys only, so "__proto__" and friends are rejected. */
export function invalidFields(fields: FieldChecks, patch: Record<string, unknown>): string[] {
  return Object.keys(patch).filter((k) => !Object.hasOwn(fields, k) || !fields[k](patch[k]))
}

const isCount = (v: unknown) => Number.isInteger(v) && (v as number) >= 0
const isDateOrNull = (v: unknown) => dateOrNull(v) !== undefined

/** Fields /api/layer-progress accepts (a LayerProgressEntry). */
export const LAYER_PROGRESS_FIELDS: FieldChecks = {
  started: (v) => typeof v === "boolean",
  completed: (v) => typeof v === "boolean",
  coursesCompleted: (v) => Array.isArray(v) && v.every((id) => courseIdOf(id) !== null),
  quizScore: (v) => v === null || (typeof v === "number" && v >= 0 && v <= 100),
  quizAttempts: isCount,
  startedDate: isDateOrNull,
  completedDate: isDateOrNull,
  deadline: isDateOrNull,
  courseTimelines: isObject,
}

/** Fields /api/course-meta accepts. "__inc__" adds one to a counter. */
export const COURSE_META_FIELDS: FieldChecks = {
  views: (v) => v === "__inc__",
  codeRuns: (v) => v === "__inc__",
  hasNotes: (v) => typeof v === "boolean",
  hasCode: (v) => typeof v === "boolean",
  noteChars: isCount,
  codeChars: isCount,
}

/** Fields /api/course-timeline accepts. */
export const TIMELINE_FIELDS: FieldChecks = { startDate: isDateOrNull, endDate: isDateOrNull }
