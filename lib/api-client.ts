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

export const api = {
  getNotes: (courseId: string, layerId: number) =>
    get("/notes", { courseId, layerId: String(layerId) }).catch(() => ({ content: "" })),
  saveNotes: (courseId: string, layerId: number, content: string) =>
    post("/notes", { courseId, layerId, content }),

  getCode: (courseId: string, layerId: number) =>
    get("/code", { courseId, layerId: String(layerId) }).catch(() => ({ content: "" })),
  saveCode: (courseId: string, layerId: number, content: string) =>
    post("/code", { courseId, layerId, content }),

  getActivity: () => get("/activity").catch(() => ({})),
  logActivity: (type: string) => post("/activity", { type }).catch(() => ({ ok: true })),

  getAllCourseMetas: () => get("/course-metas").catch(() => ({})),
  updateCourseMeta: (courseId: string, patch: Record<string, unknown>) =>
    post("/course-meta", { courseId, patch }).catch(() => ({})),

  saveLayerProgress: (layerId: number | string, patch: Record<string, unknown>) =>
    post("/layer-progress", { layerId, patch }).catch(() => ({ ok: true })),

  saveCourseTimeline: (
    layerId: number | string,
    courseId: string,
    patch: Record<string, unknown>
  ) => post("/course-timeline", { layerId, courseId, patch }).catch(() => ({ ok: true })),
}
