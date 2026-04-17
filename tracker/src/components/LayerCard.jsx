import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  ExternalLink,
  Clock,
  Monitor,
  BookOpen,
} from 'lucide-react';
import ProgressBar from './ProgressBar';

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function LayerCard({ layer, progress, onToggleCourse }) {
  const layerProgress = progress.layerProgress[String(layer.id)] || {
    coursesCompleted: [],
  };

  return (
    <div className="layer-view">
      <div className="layer-header">
        <div className="layer-title-area">
          <h2>
            Layer {layer.id}: {layer.title}
          </h2>
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

      <motion.div
        className="courses-grid"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <AnimatePresence>
          {layer.courses.map((course) => {
            const done = layerProgress.coursesCompleted.includes(course.id);
            return (
              <motion.div
                key={course.id}
                className={`course-card ${done ? 'completed' : ''}`}
                variants={fadeUp}
                onClick={() => onToggleCourse(layer.id, course.id)}
                role="button"
                tabIndex={0}
                aria-label={`${done ? 'Mark incomplete' : 'Mark complete'}: ${course.title}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onToggleCourse(layer.id, course.id);
                  }
                }}
              >
                <div className="course-checkbox">
                  <Check />
                </div>
                <div className="course-info">
                  <div className="course-title">{course.title}</div>
                  <div className="course-meta">
                    <span className="course-meta-item">
                      <Monitor />
                      {course.platform}
                    </span>
                    <span className="course-meta-item">
                      <Clock />
                      {course.duration}
                    </span>
                    {course.videos && (
                      <span className="course-meta-item">
                        <BookOpen />
                        {course.videos} videos
                      </span>
                    )}
                    <span className="course-meta-item">{course.cost}</span>
                  </div>
                  <div className="course-why">{course.why}</div>
                </div>
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
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
