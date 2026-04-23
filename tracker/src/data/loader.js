// Data loader for roadmaps
// JSON files are stored in src/data/roadmaps/ (mirrored from the root roadmaps/ folder)
// To update: sync changes from roadmaps/ JSON files here.

import aiMeta from './roadmaps/ai-engineering/meta.json';
import aiLayers from './roadmaps/ai-engineering/layers.json';
import aiProgress from './roadmaps/ai-engineering/progress.json';

const roadmapRegistry = {
  'ai-engineering': {
    meta: aiMeta,
    layers: aiLayers,
    progress: aiProgress,
  },
};

const DEFAULT_ROADMAP = 'ai-engineering';

export function loadRoadmap(id) {
  const key = id || DEFAULT_ROADMAP;
  const data = roadmapRegistry[key];
  if (!data) {
    throw new Error(`Roadmap "${key}" not found. Available: ${Object.keys(roadmapRegistry).join(', ')}`);
  }
  return {
    meta: data.meta,
    layers: data.layers.layers,
    progress: JSON.parse(JSON.stringify(data.progress)),
  };
}

export function getAvailableRoadmaps() {
  return Object.keys(roadmapRegistry).map((id) => ({
    id,
    title: roadmapRegistry[id].meta.title,
  }));
}

export function getCurrentLayer(roadmap) {
  const currentId = roadmap.progress.currentLayer;
  return roadmap.layers.find((l) => l.id === currentId) || roadmap.layers[0];
}

export function getCurrentWeek(layer, weekNum) {
  return layer.weeklyPlan.find((w) => w.week === weekNum) || layer.weeklyPlan[0];
}

export function getCourseById(layer, courseId) {
  return layer.courses.find((c) => c.id === courseId);
}

export function getCompletedCount(layer, progress) {
  const layerProgress = progress.layerProgress[String(layer.id)];
  if (!layerProgress) return 0;
  return layerProgress.coursesCompleted.length;
}

export function isQuizUnlocked(layer, progress) {
  const layerProgress = progress.layerProgress[String(layer.id)];
  if (!layerProgress) return false;
  return layerProgress.coursesCompleted.length === layer.courses.length;
}

// Parse "1-3" → 21 days, "4-6" → 21 days
export function getLayerDuration(layer) {
  const [start, end] = layer.weeks.split('-').map(Number);
  return (end - start + 1) * 7;
}

// Returns deadline string: custom override OR auto-calculated from startedDate
export function getLayerDeadline(layer, layerProgress) {
  if (layerProgress?.deadline) return layerProgress.deadline;
  if (!layerProgress?.startedDate) return null;
  const d = new Date(layerProgress.startedDate);
  d.setDate(d.getDate() + getLayerDuration(layer));
  return d.toISOString().split('T')[0];
}

// Returns { daysRemaining, status: 'none'|'ok'|'warning'|'danger'|'overdue' }
export function getDeadlineStatus(deadline) {
  if (!deadline) return { daysRemaining: null, status: 'none' };
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const end = new Date(deadline); end.setHours(0, 0, 0, 0);
  const diff = Math.round((end - today) / 86400000);
  if (diff < 0)  return { daysRemaining: diff, status: 'overdue' };
  if (diff <= 3) return { daysRemaining: diff, status: 'danger' };
  if (diff <= 7) return { daysRemaining: diff, status: 'warning' };
  return { daysRemaining: diff, status: 'ok' };
}

// Returns the week number a course belongs to (from weeklyPlan)
export function getCourseWeekNum(layer, courseId) {
  const week = layer.weeklyPlan.find((w) => w.courses.includes(courseId));
  return week ? week.week : null;
}

// Auto-calculate course dates from layer startedDate + week position
// Returns { startDate, endDate } or null if no layer startedDate
export function getCourseSuggestedDates(layer, layerProgress, courseId) {
  if (!layerProgress?.startedDate) return null;
  const weekNum = getCourseWeekNum(layer, courseId);
  if (weekNum == null) return null;
  const minWeek = Math.min(...layer.weeklyPlan.map((w) => w.week));
  const offset = (weekNum - minWeek) * 7;
  const start = new Date(layerProgress.startedDate);
  start.setDate(start.getDate() + offset);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
  };
}

// Returns { startDate, endDate, isCustom } — custom override or auto-suggested
export function getCourseTimeline(layer, layerProgress, courseId) {
  const custom = layerProgress?.courseTimelines?.[courseId];
  if (custom?.startDate || custom?.endDate) {
    return { startDate: custom.startDate || null, endDate: custom.endDate || null, isCustom: true };
  }
  const suggested = getCourseSuggestedDates(layer, layerProgress, courseId);
  return suggested
    ? { ...suggested, isCustom: false }
    : { startDate: null, endDate: null, isCustom: false };
}

export function calculateOverallProgress(layers, progress) {
  let totalCourses = 0;
  let completedCourses = 0;
  layers.forEach((layer) => {
    totalCourses += layer.courses.length;
    const lp = progress.layerProgress[String(layer.id)];
    if (lp) {
      completedCourses += lp.coursesCompleted.length;
    }
  });
  return totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;
}
