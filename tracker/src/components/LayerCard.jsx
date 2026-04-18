import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ExternalLink, Clock, Monitor, BookOpen, FileText } from 'lucide-react';
import ProgressBar from './ProgressBar';
import CoursePanel from './CoursePanel';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function LayerCard({ layer, progress, onToggleCourse, onActivity }) {
  const [openCourse, setOpenCourse] = useState(null);

  const layerProgress = progress.layerProgress[String(layer.id)] || {
    coursesCompleted: [],
  };

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
            const done = layerProgress.coursesCompleted.includes(course.id);
            return (
              <motion.div
                key={course.id}
                className={`course-card ${done ? 'completed' : ''}`}
                variants={fadeUp}
              >
                {/* Checkbox — toggles completion */}
                <button
                  className="course-checkbox"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleCourse(layer.id, course.id);
                  }}
                  aria-label={done ? 'Mark incomplete' : 'Mark complete'}
                >
                  <Check />
                </button>

                {/* Card body — opens notes panel */}
                <div
                  className="course-info course-info-clickable"
                  role="button"
                  tabIndex={0}
                  onClick={() => setOpenCourse(course)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setOpenCourse(course);
                    }
                  }}
                  aria-label={`Open notes for ${course.title}`}
                >
                  <div className="course-title">{course.title}</div>
                  <div className="course-meta">
                    <span className="course-meta-item"><Monitor />{course.platform}</span>
                    <span className="course-meta-item"><Clock />{course.duration}</span>
                    {course.videos && (
                      <span className="course-meta-item"><BookOpen />{course.videos} videos</span>
                    )}
                    <span className="course-meta-item">{course.cost}</span>
                  </div>
                  <div className="course-why">{course.why}</div>
                </div>

                {/* Right side actions */}
                <div className="course-actions">
                  <button
                    className="course-notes-btn"
                    onClick={() => setOpenCourse(course)}
                    aria-label="Open notes"
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
                    aria-label={`Open ${course.title}`}
                  >
                    Open <ExternalLink />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Slide-in panel */}
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
          />
        )}
      </AnimatePresence>
    </div>
  );
}
