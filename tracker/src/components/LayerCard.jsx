import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ExternalLink, Clock, Monitor, BookOpen, FileText, Play } from 'lucide-react';
import ProgressBar from './ProgressBar';
import CoursePanel from './CoursePanel';
import { api } from '../data/api';

const IS_DEV = import.meta.env.DEV;

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// 0=none 1=viewed 2=has notes or code 3=notes+code 4=notes+code+runs
function engagementLevel(meta) {
  if (!meta) return 0;
  const { views = 0, hasNotes, hasCode, codeRuns = 0 } = meta;
  if (hasNotes && hasCode && codeRuns > 0) return 4;
  if (hasNotes && hasCode) return 3;
  if (hasNotes || hasCode) return 2;
  if (views > 0) return 1;
  return 0;
}

const LEVEL_BORDER = {
  0: 'transparent',
  1: 'rgba(148,163,184,0.25)',
  2: 'var(--amber)',
  3: 'var(--cyan)',
  4: 'var(--accent)',
};

const LEVEL_LABEL = {
  1: 'Viewed',
  2: 'In progress',
  3: 'Notes + Code',
  4: 'Well studied',
};

export default function LayerCard({ layer, progress, onToggleCourse, onActivity }) {
  const [openCourse, setOpenCourse] = useState(null);
  const [courseMetas, setCourseMetas] = useState({});

  const layerProgress = progress.layerProgress[String(layer.id)] || { coursesCompleted: [] };

  // Load per-course engagement data
  const refreshMetas = useCallback(() => {
    if (!IS_DEV) return;
    api.getAllCourseMetas().then(setCourseMetas);
  }, []);

  useEffect(() => { refreshMetas(); }, [refreshMetas]);

  return (
    <div className="layer-view">
      <div className="layer-header">
        <div className="layer-title-area">
          <h2>Layer {layer.id}: {layer.title}</h2>
          <p>{layer.description}</p>
        </div>
        <div className="layer-progress-bar">
          <ProgressBar
            label="Courses completed"
            value={layerProgress.coursesCompleted.length}
            max={layer.courses.length}
          />
        </div>
      </div>

      <motion.div className="courses-grid" variants={stagger} initial="hidden" animate="show">
        <AnimatePresence>
          {layer.courses.map((course) => {
            const done  = layerProgress.coursesCompleted.includes(course.id);
            const meta  = courseMetas[course.id];
            const level = done ? 5 : engagementLevel(meta);
            const borderColor = done ? undefined : LEVEL_BORDER[level];

            return (
              <motion.div
                key={course.id}
                className={`course-card ${done ? 'completed' : ''} ${level > 0 && !done ? `engaged-${level}` : ''}`}
                style={borderColor ? { borderLeftColor: borderColor, borderLeftWidth: 3 } : undefined}
                variants={fadeUp}
              >
                {/* Checkbox */}
                <button
                  className="course-checkbox"
                  onClick={(e) => { e.stopPropagation(); onToggleCourse(layer.id, course.id); }}
                  aria-label={done ? 'Mark incomplete' : 'Mark complete'}
                >
                  <Check />
                </button>

                {/* Card body — opens panel */}
                <div
                  className="course-info course-info-clickable"
                  role="button"
                  tabIndex={0}
                  onClick={() => setOpenCourse(course)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenCourse(course); }
                  }}
                >
                  <div className="course-title">{course.title}</div>
                  <div className="course-meta">
                    <span className="course-meta-item"><Monitor />{course.platform}</span>
                    <span className="course-meta-item"><Clock />{course.duration}</span>
                    {course.videos && (
                      <span className="course-meta-item"><BookOpen />{course.videos} videos</span>
                    )}
                    <span className="course-meta-item">{course.cost}</span>

                    {/* Engagement badges */}
                    {!done && level > 0 && (
                      <span className={`engage-badge engage-level-${level}`}>
                        {LEVEL_LABEL[level]}
                      </span>
                    )}
                    {meta?.hasNotes && (
                      <span className="engage-badge engage-detail">
                        <FileText size={10} /> Notes
                      </span>
                    )}
                    {meta?.codeRuns > 0 && (
                      <span className="engage-badge engage-detail">
                        <Play size={10} /> {meta.codeRuns} run{meta.codeRuns !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <div className="course-why">{course.why}</div>
                </div>

                {/* Actions */}
                <div className="course-actions">
                  <button
                    className="course-notes-btn"
                    onClick={() => setOpenCourse(course)}
                    title="Notes & Practice"
                  >
                    <FileText size={14} />
                  </button>
                  <a
                    href={course.url}
                    className="course-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Open <ExternalLink />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {openCourse && (
          <CoursePanel
            key={openCourse.id}
            course={openCourse}
            layerId={layer.id}
            isCompleted={layerProgress.coursesCompleted.includes(openCourse.id)}
            onToggle={(lid, cid) => onToggleCourse(lid, cid)}
            onClose={() => setOpenCourse(null)}
            onActivity={onActivity}
            onMetaChange={refreshMetas}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
