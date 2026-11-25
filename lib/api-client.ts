import { localDateKey } from "@/lib/loader"

const BASE = "/api"

async function get(path: string, params: Record<string, string> = {}) {
  const url = new URL(BASE + path, window.location.origin)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

async function post(path: string, body: unknown) {
  const res = await fetch(BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) return { ok: false }
  return res.json()
}

/** A write the learner relies on: true only when the server stored it (false on an HTTP error or no network). */
async function save(path: string, body: unknown): Promise<boolean> {
  try {
    const res = await fetch(BASE + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    return res.ok
  } catch {
    return false
  }
}

export const api = {
  // Loads throw on failure: an empty fallback here could later be saved over the real notes.
  getNotes: (courseId: string, layerId: number): Promise<{ content?: string }> =>
    get("/notes", { courseId, layerId: String(layerId) }),
  saveNotes: (courseId: string, layerId: number, content: string) =>
    save("/notes", { courseId, layerId, content }),

  getCode: (courseId: string, layerId: number): Promise<{ content?: string }> =>
    get("/code", { courseId, layerId: String(layerId) }),
  saveCode: (courseId: string, layerId: number, content: string) =>
    save("/code", { courseId, layerId, content }),

  getActivity: () => get("/activity").catch(() => ({})),
  // Sends the learner's local day, so the streak graph and the stored day agree.
  logActivity: (type: string) => post("/activity", { type, date: localDateKey() }).catch(() => ({ ok: false })),

  getAllCourseMetas: () => get("/course-metas").catch(() => ({})),
  updateCourseMeta: (courseId: string, patch: Record<string, unknown>) =>
    post("/course-meta", { courseId, patch }).catch(() => ({})),

  saveLayerProgress: (layerId: number | string, patch: Record<string, unknown>) =>
    save("/layer-progress", { layerId, patch }),

  saveCourseTimeline: (layerId: number | string, courseId: string, patch: Record<string, unknown>) =>
    save("/course-timeline", { layerId, courseId, patch }),
}
