const BASE = '/api';

async function get(path, params = {}) {
  const url = new URL(BASE + path, window.location.origin);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url);
  return res.json();
}

async function post(path, body) {
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export const api = {
  getNotes: (courseId, layerId) => get('/notes', { courseId, layerId }),
  saveNotes: (courseId, layerId, content) => post('/notes', { courseId, layerId, content }),

  getCode: (courseId, layerId) => get('/code', { courseId, layerId }),
  saveCode: (courseId, layerId, content) => post('/code', { courseId, layerId, content }),

  getActivity: () => get('/activity'),
  logActivity: (type) => post('/activity', { type }),
};
