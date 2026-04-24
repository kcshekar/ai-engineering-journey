const BASE = '/api';

async function get(path, params = {}) {
  const url = new URL(BASE + path, window.location.origin);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function post(path, body) {
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) return { ok: false };
  return res.json();
}

export const api = {
  // In dev: Vite middleware reads from notes/layer-X/courseId.md
  // In prod (GitHub Pages): falls back to static file copied into dist/notes/
  getNotes: async (courseId, layerId) => {
    try {
      return await get('/notes', { courseId, layerId });
    } catch {
      const res = await fetch(`/notes/layer-${layerId}/${courseId}.md`);
      return { content: res.ok ? await res.text() : '' };
    }
  },
  saveNotes: (courseId, layerId, content) => post('/notes', { courseId, layerId, content }),

  // In dev: Vite middleware reads from exercises/layer-X/courseId.py
  // In prod (GitHub Pages): falls back to static file copied into dist/exercises/
  getCode: async (courseId, layerId) => {
    try {
      return await get('/code', { courseId, layerId });
    } catch {
      const res = await fetch(`/exercises/layer-${layerId}/${courseId}.py`);
      return { content: res.ok ? await res.text() : '' };
    }
  },
  saveCode: (courseId, layerId, content) => post('/code', { courseId, layerId, content }),

  getActivity: () => get('/activity').catch(() => ({})),
  logActivity: (type) => post('/activity', { type }).catch(() => ({ ok: true })),

  getAllCourseMetas: () => get('/course-metas').catch(() => ({})),
  updateCourseMeta: (courseId, patch) => post('/course-meta', { courseId, patch }).catch(() => ({})),

  saveLayerProgress: (layerId, patch) => post('/layer-progress', { layerId, patch }).catch(() => ({ ok: true })),

  saveCourseTimeline: (layerId, courseId, patch) =>
    post('/course-timeline', { layerId, courseId, patch }).catch(() => ({ ok: true })),
};
