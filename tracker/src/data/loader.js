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
