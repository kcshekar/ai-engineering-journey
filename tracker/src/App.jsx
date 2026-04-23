import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Layers,
  Flame,
  Target,
  Hammer,
  Terminal,
  FileText,
  FolderGit2,
  ExternalLink,
  BookOpen,
  Cpu,
  MessageSquare,
} from 'lucide-react';
import Header from './components/Header';
import RoadmapSelector from './components/RoadmapSelector';
import LayerCard from './components/LayerCard';
import ProgressBar from './components/ProgressBar';
import WeeklyPlan from './components/WeeklyPlan';
import QuizSection from './components/QuizSection';
import StreakGraph from './components/StreakGraph';
import { api } from './data/api';
import {
  loadRoadmap,
  getCurrentLayer,
  getCurrentWeek,
  getCompletedCount,
  isQuizUnlocked,
  calculateOverallProgress,
  getLayerDeadline,
  getDeadlineStatus,
} from './data/loader';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  out: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

export default function App() {
  const [roadmap, setRoadmap] = useState(() => loadRoadmap());
  const [activePage, setActivePage] = useState('dashboard');
  const [activityMap, setActivityMap] = useState({});

  // Load activity from disk on mount
  React.useEffect(() => {
    api.getActivity().then(setActivityMap);
  }, []);

  const refreshActivity = useCallback(() => {
    api.getActivity().then(setActivityMap);
  }, []);

  const currentLayer = getCurrentLayer(roadmap);
  const currentWeekPlan = getCurrentWeek(currentLayer, roadmap.progress.currentWeek);
  const overallPercent = calculateOverallProgress(roadmap.layers, roadmap.progress);
  const completedCount = getCompletedCount(currentLayer, roadmap.progress);
  const quizUnlocked = isQuizUnlocked(currentLayer, roadmap.progress);

  const currentLayerProgress = roadmap.progress.layerProgress[String(currentLayer.id)];
  const currentDeadline = getLayerDeadline(currentLayer, currentLayerProgress);
  const deadlineStatus = getDeadlineStatus(currentDeadline);

  const circumference = 2 * Math.PI * 64;
  const strokeOffset = circumference - (overallPercent / 100) * circumference;

  const handleToggleCourse = useCallback(
    (layerId, courseId) => {
      setRoadmap((prev) => {
        const newProgress = JSON.parse(JSON.stringify(prev.progress));
        const key = String(layerId);
        if (!newProgress.layerProgress[key]) {
          newProgress.layerProgress[key] = {
            started: false,
            completed: false,
            coursesCompleted: [],
            quizScore: null,
            quizAttempts: 0,
            notes: '',
            startedDate: null,
            completedDate: null,
          };
        }
        const lp = newProgress.layerProgress[key];
        const idx = lp.coursesCompleted.indexOf(courseId);
        if (idx > -1) {
          lp.coursesCompleted.splice(idx, 1);
        } else {
          lp.coursesCompleted.push(courseId);
          if (!lp.started) {
            lp.started = true;
            lp.startedDate = new Date().toISOString().split('T')[0];
          }
        }
        const layer = prev.layers.find((l) => l.id === layerId);
        if (layer && lp.coursesCompleted.length === layer.courses.length) {
          lp.completed = true;
          lp.completedDate = new Date().toISOString().split('T')[0];
        } else {
          lp.completed = false;
          lp.completedDate = null;
        }
        return { ...prev, progress: newProgress };
      });
      api.logActivity('complete').then(() => api.getActivity().then(setActivityMap));
    },
    []
  );

  const handleSaveLayerDates = useCallback((layerId, patch) => {
    api.saveLayerProgress(layerId, patch);
    setRoadmap((prev) => {
      const newProgress = JSON.parse(JSON.stringify(prev.progress));
      const key = String(layerId);
      if (!newProgress.layerProgress[key]) {
        newProgress.layerProgress[key] = {
          started: false, completed: false, coursesCompleted: [],
          quizScore: null, quizAttempts: 0, notes: '',
          startedDate: null, completedDate: null, deadline: null, courseTimelines: {},
        };
      }
      Object.assign(newProgress.layerProgress[key], patch);
      return { ...prev, progress: newProgress };
    });
  }, []);

  const handleSaveCourseTimeline = useCallback((layerId, courseId, patch) => {
    api.saveCourseTimeline(layerId, courseId, patch);
    setRoadmap((prev) => {
      const newProgress = JSON.parse(JSON.stringify(prev.progress));
      const key = String(layerId);
      if (!newProgress.layerProgress[key]) {
        newProgress.layerProgress[key] = {
          started: false, completed: false, coursesCompleted: [],
          quizScore: null, quizAttempts: 0, notes: '',
          startedDate: null, completedDate: null, deadline: null, courseTimelines: {},
        };
      }
      if (!newProgress.layerProgress[key].courseTimelines) {
        newProgress.layerProgress[key].courseTimelines = {};
      }
      newProgress.layerProgress[key].courseTimelines[courseId] = {
        ...(newProgress.layerProgress[key].courseTimelines[courseId] || {}),
        ...patch,
      };
      return { ...prev, progress: newProgress };
    });
  }, []);

  return (
    <>
      <Header activePage={activePage} onNavigate={setActivePage} />
      <main className="main">
        <AnimatePresence mode="wait">
          {activePage === 'dashboard' && (
            <motion.div
              key="dashboard"
              className="dashboard"
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
            >
              {/* Top: Progress Ring + Current Layer */}
              <div className="dashboard-top">
                <div className="progress-ring-card">
                  <RoadmapSelector meta={roadmap.meta} />
                  <div className="progress-ring-wrapper">
                    <svg className="progress-ring-svg" viewBox="0 0 144 144">
                      <defs>
                        <linearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#22C55E" />
                          <stop offset="100%" stopColor="#06B6D4" />
                        </linearGradient>
                      </defs>
                      <circle className="progress-ring-bg" cx="72" cy="72" r="64" />
                      <motion.circle
                        className="progress-ring-fill"
                        cx="72"
                        cy="72"
                        r="64"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: strokeOffset }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                      />
                    </svg>
                    <div className="progress-ring-text">
                      <div className="progress-ring-value">{overallPercent}%</div>
                      <div className="progress-ring-label">complete</div>
                    </div>
                  </div>
                  <div className="progress-ring-title">
                    Layer {currentLayer.id} of {roadmap.meta.totalLayers}
                  </div>
                </div>

                <div className="current-layer-card">
                  <div className="current-layer-header">
                    <div>
                      <div className="current-layer-name">
                        Layer {currentLayer.id}: {currentLayer.title}
                      </div>
                      <div className="current-layer-desc">
                        {currentLayer.description}
                      </div>
                    </div>
                    <div className="current-layer-badge">{currentLayer.status}</div>
                  </div>
                  <ProgressBar
                    label="Course progress"
                    value={completedCount}
                    max={currentLayer.courses.length}
                  />
                  {deadlineStatus.status !== 'none' && (
                    <div className={`deadline-badge-dash deadline-${deadlineStatus.status}`}>
                      {deadlineStatus.status === 'overdue'
                        ? `Overdue by ${Math.abs(deadlineStatus.daysRemaining)}d`
                        : `${deadlineStatus.daysRemaining}d to deadline`}
                    </div>
                  )}
                  <div className="current-layer-weeks">
                    {currentLayer.weeklyPlan.map((w) => (
                      <div
                        key={w.week}
                        className={`week-chip ${w.week === roadmap.progress.currentWeek ? 'active' : ''}`}
                      >
                        <span className="week-chip-num">Week {w.week}</span>
                        <span className="week-chip-focus">{w.focus}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="stats-row">
                <motion.div
                  className="stat-card"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="stat-icon green"><Clock /></div>
                  <div>
                    <div className="stat-value">{roadmap.progress.totalHoursSpent}</div>
                    <div className="stat-label">Hours spent</div>
                  </div>
                </motion.div>
                <motion.div
                  className="stat-card"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="stat-icon cyan"><Layers /></div>
                  <div>
                    <div className="stat-value">
                      {Object.values(roadmap.progress.layerProgress).filter((l) => l.completed).length}
                    </div>
                    <div className="stat-label">Layers done</div>
                  </div>
                </motion.div>
                <motion.div
                  className="stat-card"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="stat-icon amber"><Flame /></div>
                  <div>
                    <div className="stat-value">{roadmap.progress.weeklyCheckins.length}</div>
                    <div className="stat-label">Check-ins</div>
                  </div>
                </motion.div>
                <motion.div
                  className="stat-card"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="stat-icon purple"><Target /></div>
                  <div>
                    <div className="stat-value">{roadmap.meta.targetRole.split('/')[0].trim()}</div>
                    <div className="stat-label">Target role</div>
                  </div>
                </motion.div>
              </div>

              {/* Streak Graph */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <StreakGraph activityMap={activityMap} />
              </motion.div>

              {/* Today's Tasks */}
              {currentWeekPlan && (
                <div className="today-section">
                  <motion.div
                    className="today-card build"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.35 }}
                  >
                    <div className="today-card-label">
                      <Hammer /> Build Task &mdash; Week {currentWeekPlan.week}
                    </div>
                    <div className="today-card-text">{currentWeekPlan.buildTask}</div>
                  </motion.div>
                  <motion.div
                    className="today-card python"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.35 }}
                  >
                    <div className="today-card-label">
                      <Terminal /> Python Practice
                    </div>
                    <div className="today-card-text">{currentWeekPlan.pythonTask}</div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}

          {activePage === 'layers' && (
            <motion.div
              key="layers"
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
              style={{ display: 'grid', gap: 32 }}
            >
              <LayerCard
                layer={currentLayer}
                progress={roadmap.progress}
                onToggleCourse={handleToggleCourse}
                onActivity={refreshActivity}
                onSaveDates={handleSaveLayerDates}
                onSaveCourseTimeline={handleSaveCourseTimeline}
              />
              <WeeklyPlan
                weeklyPlan={currentLayer.weeklyPlan}
                currentWeek={roadmap.progress.currentWeek}
              />
              <QuizSection
                quiz={currentLayer.quiz}
                isUnlocked={quizUnlocked}
                completedCount={completedCount}
                totalCourses={currentLayer.courses.length}
              />
            </motion.div>
          )}

          {activePage === 'notes' && (
            <motion.div
              key="notes"
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
            >
              <div className="section-title">
                <FileText /> Notes
              </div>
              <div className="notes-grid">
                {roadmap.layers.map((layer) => (
                  <a
                    key={layer.id}
                    className="note-card"
                    href={`https://github.com/kcshekar/ai-engineering-journey/tree/main/notes/layer-${layer.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div className="card-icon green"><BookOpen /></div>
                    <div className="card-name">Layer {layer.id}: {layer.title}</div>
                    <div className="card-desc">
                      {layer.description}
                    </div>
                    <div className="card-link">
                      View notes on GitHub <ExternalLink />
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          )}

          {activePage === 'projects' && (
            <motion.div
              key="projects"
              variants={pageVariants}
              initial="initial"
              animate="in"
              exit="out"
            >
              <div className="section-title">
                <FolderGit2 /> Projects
              </div>
              <div className="projects-grid">
                <a
                  className="project-card"
                  href="https://github.com/kcshekar/ai-engineering-journey/tree/main/projects/cuva-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="card-icon cyan"><Cpu /></div>
                  <div className="card-name">Cuva AI</div>
                  <div className="card-desc">
                    AI-powered workflow orchestration platform using AutoGen agents for complex task automation.
                  </div>
                  <div className="card-tags">
                    <span className="card-tag">AutoGen</span>
                    <span className="card-tag">Orchestration</span>
                    <span className="card-tag">Python</span>
                  </div>
                  <div className="card-link">
                    Architecture notes <ExternalLink />
                  </div>
                </a>
                <a
                  className="project-card"
                  href="https://github.com/kcshekar/ai-engineering-journey/tree/main/projects/nuraknect"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="card-icon purple"><MessageSquare /></div>
                  <div className="card-name">NuraKnect AI</div>
                  <div className="card-desc">
                    AI-powered Instagram DM management platform that classifies, responds to, and manages direct messages.
                  </div>
                  <div className="card-tags">
                    <span className="card-tag">NLP</span>
                    <span className="card-tag">Classification</span>
                    <span className="card-tag">LLM APIs</span>
                  </div>
                  <div className="card-link">
                    Architecture notes <ExternalLink />
                  </div>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
