import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

const REPO_ROOT = path.resolve(import.meta.dirname, '..');

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function readJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => {
      try {
        resolve(JSON.parse(data));
      } catch {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

// Routes: GET/POST /api/notes, /api/code, /api/activity
const routes = {
  async 'GET /api/notes'(req, res, query) {
    const file = path.join(REPO_ROOT, 'notes', `layer-${query.layerId}`, `${query.courseId}.md`);
    const content = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
    send(res, 200, { content });
  },

  async 'POST /api/notes'(req, res) {
    const { courseId, layerId, content } = await readBody(req);
    const file = path.join(REPO_ROOT, 'notes', `layer-${layerId}`, `${courseId}.md`);
    ensureDir(file);
    fs.writeFileSync(file, content, 'utf8');
    send(res, 200, { ok: true });
  },

  async 'GET /api/code'(req, res, query) {
    const file = path.join(REPO_ROOT, 'exercises', `layer-${query.layerId}`, `${query.courseId}.py`);
    const content = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
    send(res, 200, { content });
  },

  async 'POST /api/code'(req, res) {
    const { courseId, layerId, content } = await readBody(req);
    const file = path.join(REPO_ROOT, 'exercises', `layer-${layerId}`, `${courseId}.py`);
    ensureDir(file);
    fs.writeFileSync(file, content, 'utf8');
    send(res, 200, { ok: true });
  },

  async 'GET /api/course-metas'(req, res) {
    const file = path.join(REPO_ROOT, 'course-meta.json');
    send(res, 200, readJson(file, {}));
  },

  async 'POST /api/course-meta'(req, res) {
    const { courseId, patch } = await readBody(req);
    const file = path.join(REPO_ROOT, 'course-meta.json');
    const all = readJson(file, {});
    const existing = all[courseId] || {};
    const merged = { ...existing };
    // Support '__inc__' as a sentinel to increment a counter
    for (const [k, v] of Object.entries(patch)) {
      merged[k] = v === '__inc__' ? (existing[k] || 0) + 1 : v;
    }
    merged.lastEngaged = new Date().toISOString().split('T')[0];
    all[courseId] = merged;
    fs.writeFileSync(file, JSON.stringify(all, null, 2), 'utf8');
    send(res, 200, all[courseId]);
  },

  async 'POST /api/course-timeline'(req, res) {
    const { layerId, courseId, patch } = await readBody(req);
    const file = path.join(import.meta.dirname, 'src/data/roadmaps/ai-engineering/progress.json');
    const progress = readJson(file, {});
    if (!progress.layerProgress) progress.layerProgress = {};
    const key = String(layerId);
    if (!progress.layerProgress[key]) progress.layerProgress[key] = {};
    if (!progress.layerProgress[key].courseTimelines) progress.layerProgress[key].courseTimelines = {};
    progress.layerProgress[key].courseTimelines[courseId] = {
      ...(progress.layerProgress[key].courseTimelines[courseId] || {}),
      ...patch,
    };
    fs.writeFileSync(file, JSON.stringify(progress, null, 2), 'utf8');
    send(res, 200, { ok: true });
  },

  async 'GET /api/layer-progress'(req, res, query) {
    const file = path.join(import.meta.dirname, 'src/data/roadmaps/ai-engineering/progress.json');
    const progress = readJson(file, {});
    const lp = (progress.layerProgress || {})[String(query.layerId)] || {};
    send(res, 200, lp);
  },

  async 'POST /api/layer-progress'(req, res) {
    const { layerId, patch } = await readBody(req);
    const file = path.join(import.meta.dirname, 'src/data/roadmaps/ai-engineering/progress.json');
    const progress = readJson(file, {});
    if (!progress.layerProgress) progress.layerProgress = {};
    const key = String(layerId);
    progress.layerProgress[key] = { ...(progress.layerProgress[key] || {}), ...patch };
    fs.writeFileSync(file, JSON.stringify(progress, null, 2), 'utf8');
    send(res, 200, { ok: true });
  },

  async 'GET /api/activity'(req, res) {
    const file = path.join(REPO_ROOT, 'activity.json');
    send(res, 200, readJson(file, {}));
  },

  async 'POST /api/activity'(req, res) {
    const { type } = await readBody(req);
    const file = path.join(REPO_ROOT, 'activity.json');
    const log = readJson(file, {});
    const today = new Date().toISOString().split('T')[0];
    if (!log[today]) log[today] = { total: 0 };
    log[today].total = (log[today].total || 0) + 1;
    log[today][type] = (log[today][type] || 0) + 1;
    fs.writeFileSync(file, JSON.stringify(log, null, 2), 'utf8');
    send(res, 200, { ok: true });
  },
};

function localApiPlugin() {
  function attachMiddleware(server) {
    server.middlewares.use(async (req, res, next) => {
      const url = new URL(req.url, 'http://localhost');
      if (!url.pathname.startsWith('/api/')) return next();

      const routeKey = `${req.method} ${url.pathname}`;
      const handler = routes[routeKey];
      if (!handler) return send(res, 404, { error: `No route: ${routeKey}` });

      const query = Object.fromEntries(url.searchParams.entries());
      try {
        await handler(req, res, query);
      } catch (err) {
        console.error('[local-api]', err);
        send(res, 500, { error: err.message });
      }
    });
  }

  return {
    name: 'local-file-api',
    configureServer: attachMiddleware,
    configurePreviewServer: attachMiddleware,
  };
}

export default defineConfig({
  plugins: [react(), localApiPlugin()],
  server: {
    port: 3000,
    open: true,
  },
});
