import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ExternalLink, Clock, Monitor, BookOpen, FileText, Play, Pencil, X, AlertTriangle, AlertCircle } from 'lucide-react';
import ProgressBar from './ProgressBar';
import CoursePanel from './CoursePanel';
import { api } from '../data/api';
import { getLayerDeadline, getDeadlineStatus, getCourseTimeline, getCourseWeekNum } from '../data/loader';

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

function fmt(dateStr) {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split('-');
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function CourseTimeline({ layer, layerProgress, courseId, onSave }) {
  const [editing, setEditing] = useState(false);
  const startRef = useRef(null);
  const { startDate, endDate, isCustom } = getCourseTimeline(layer, layerProgress, courseId);
  const weekNum = getCourseWeekNum(layer, courseId);

  function commit(newStart, newEnd) {
    setEditing(false);
    if (onSave) onSave(courseId, { startDate: newStart || null, endDate: newEnd || null });
  }

  function clear() {
    if (onSave) onSave(courseId, { startDate: null, endDate: null });
  }

  if (editing) {
    return (
      <div className="course-timeline editing" onClick={(e) => e.stopPropagation()}>
        <input
          ref={startRef}
          type="date"
          className="deadline-input"
          defaultValue={startDate || ''}
          autoFocus
          placeholder="Start"
        />
        <span className="deadline-sep">→</span>
        <input
          type="date"
          className="deadline-input"
          defaultValue={endDate || ''}
          placeholder="End"
        />
        <button className="course-tl-save" onClick={(e) => {
          e.stopPropagation();
          const inputs = e.currentTarget.closest('.course-timeline').querySelectorAll('input');
          commit(inputs[0].value, inputs[1].value);
        }}>✓</button>
        <button className="course-tl-cancel" onClick={(e) => { e.stopPropagation(); setEditing(false); }}>✕</button>
      </div>
    );
  }

  return (
    <div className="course-timeline" onClick={(e) => e.stopPropagation()}>
      {startDate ? (
        <>
          <span className={`course-tl-dates${isCustom ? ' custom' : ' auto'}`}>
            {fmt(startDate)} → {fmt(endDate)}
          </span>
          {!isCustom && weekNum && (
            <span className="course-tl-week">Wk {weekNum}</span>
          )}
          <button className="course-tl-edit" onClick={() => setEditing(true)} title="Edit dates">
            <Pencil size={10} />
          </button>
          {isCustom && (
            <button className="deadline-clear" onClick={clear} title="Reset to auto">
              <X size={10} />
            </button>
          )}
        </>
      ) : (
        <button className="course-tl-unset" onClick={() => setEditing(true)}>
          {layerProgress?.startedDate ? `Wk ${weekNum ?? '?'} — set dates` : 'Set layer start first'}
          <Pencil size={10} />
        </button>
      )}
    </div>
  );
}

export default function LayerCard({ layer, progress, onToggleCourse, onActivity, onSaveDates, onSaveCourseTimeline }) {
  const [openCourse, setOpenCourse] = useState(null);
  const [courseMetas, setCourseMetas] = useState({});

  // Deadline editing state
  const [editingStart, setEditingStart] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState(false);
  const startInputRef = useRef(null);
  const deadlineInputRef = useRef(null);

  const layerProgress = progress.layerProgress[String(layer.id)] || { coursesCompleted: [] };

  const deadline = getLayerDeadline(layer, layerProgress);
  const isCustomDeadline = !!layerProgress?.deadline;
  const { daysRemaining, status: deadlineStatus } = getDeadlineStatus(deadline);

  useEffect(() => {
    if (editingStart && startInputRef.current) startInputRef.current.focus();
  }, [editingStart]);

  useEffect(() => {
    if (editingDeadline && deadlineInputRef.current) deadlineInputRef.current.focus();
  }, [editingDeadline]);

  function commitStart(val) {
    setEditingStart(false);
    if (val && onSaveDates) onSaveDates(layer.id, { startedDate: val });
  }

  function commitDeadline(val) {
    setEditingDeadline(false);
    if (val && onSaveDates) onSaveDates(layer.id, { deadline: val });
  }

  function clearDeadline() {
    if (onSaveDates) onSaveDates(layer.id, { deadline: null });
  }

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

      {/* Deadline row */}
      <div className="deadline-row">
        {/* Start date */}
        <div className="deadline-field">
          <span className="deadline-field-label">Started</span>
          {editingStart ? (
            <input
              ref={startInputRef}
              type="date"
              className="deadline-input"
              defaultValue={layerProgress.startedDate || ''}
              onBlur={(e) => commitStart(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') commitStart(e.target.value); if (e.key === 'Escape') setEditingStart(false); }}
            />
          ) : (
            <button className="deadline-value" onClick={() => setEditingStart(true)}>
              {layerProgress.startedDate ? fmt(layerProgress.startedDate) : 'Not set'}
              <Pencil size={11} />
            </button>
          )}
        </div>

        <span className="deadline-sep">→</span>

        {/* Deadline */}
        <div className="deadline-field">
          <span className="deadline-field-label">Deadline{!isCustomDeadline && deadline ? ' (Auto)' : ''}</span>
          {editingDeadline ? (
            <input
              ref={deadlineInputRef}
              type="date"
              className="deadline-input"
              defaultValue={deadline || ''}
              onBlur={(e) => commitDeadline(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') commitDeadline(e.target.value); if (e.key === 'Escape') setEditingDeadline(false); }}
            />
          ) : (
            <span className="deadline-value-group">
              <button className="deadline-value" onClick={() => setEditingDeadline(true)}>
                {deadline ? fmt(deadline) : 'Not set'}
                <Pencil size={11} />
              </button>
              {isCustomDeadline && (
                <button className="deadline-clear" onClick={clearDeadline} title="Reset to auto">
                  <X size={11} />
                </button>
              )}
            </span>
          )}
        </div>

        {/* Status badge */}
        {deadlineStatus !== 'none' && (
          <div className={`deadline-badge deadline-${deadlineStatus}`}>
            {deadlineStatus === 'overdue'
              ? `${Math.abs(daysRemaining)}d overdue`
              : `${daysRemaining}d left`}
          </div>
        )}
      </div>

      {/* Warning / overdue banner */}
      {(deadlineStatus === 'danger' || deadlineStatus === 'overdue') && (
        <div className={`deadline-banner deadline-banner-${deadlineStatus}`}>
          {deadlineStatus === 'danger'
            ? <><AlertTriangle size={14} /> Deadline in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} — keep pushing!</>
            : <><AlertCircle size={14} /> Deadline passed {Math.abs(daysRemaining)} day{Math.abs(daysRemaining) !== 1 ? 's' : ''} ago — time to catch up!</>}
        </div>
      )}

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
                  <CourseTimeline
                    layer={layer}
                    layerProgress={layerProgress}
                    courseId={course.id}
                    onSave={(courseId, patch) => onSaveCourseTimeline && onSaveCourseTimeline(layer.id, courseId, patch)}
                  />
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
