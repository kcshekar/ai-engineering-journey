"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ExternalLink, Clock, Monitor, BookOpen, FileText, Play, Pencil, X, AlertTriangle, AlertCircle } from "lucide-react"
import ProgressBar from "./ProgressBar"
import CoursePanel from "./CoursePanel"
import { api } from "@/lib/api-client"
import { getLayerDeadline, getDeadlineStatus, getCourseTimeline, getCourseWeekNum } from "@/lib/loader"
import type { Layer, RoadmapProgress, LayerProgressEntry, CourseMetaEntry } from "@/types"

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const fadeUp   = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } }

function engagementLevel(meta: CourseMetaEntry | undefined) {
  if (!meta) return 0
  const { views = 0, hasNotes, hasCode, codeRuns = 0 } = meta
  if (hasNotes && hasCode && codeRuns > 0) return 4
  if (hasNotes && hasCode) return 3
  if (hasNotes || hasCode) return 2
  if (views > 0) return 1
  return 0
}

const LEVEL_BORDER: Record<number, string> = {
  0: "transparent",
  1: "rgba(148,163,184,0.25)",
  2: "var(--amber)",
  3: "var(--cyan)",
  4: "var(--accent)",
}
const LEVEL_LABEL: Record<number, string> = {
  1: "Viewed", 2: "In progress", 3: "Notes + Code", 4: "Well studied",
}

function fmt(dateStr: string | null) {
  if (!dateStr) return null
  const [y, m, d] = dateStr.split("-")
  return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function CourseTimeline({
  layer, layerProgress, courseId, onSave,
}: {
  layer: Layer
  layerProgress: LayerProgressEntry | undefined
  courseId: string
  onSave: (courseId: string, patch: Record<string, string | null>) => void
}) {
  const [editing, setEditing] = useState(false)
  const startRef = useRef<HTMLInputElement>(null)
  const { startDate, endDate, isCustom } = getCourseTimeline(layer, layerProgress, courseId)
  const weekNum = getCourseWeekNum(layer, courseId)

  function commit(s: string, e: string) {
    setEditing(false)
    onSave(courseId, { startDate: s || null, endDate: e || null })
  }
  function clear() { onSave(courseId, { startDate: null, endDate: null }) }

  if (editing) {
    return (
      <div className="course-timeline editing" onClick={(e) => e.stopPropagation()}>
        <input ref={startRef} type="date" className="deadline-input" defaultValue={startDate || ""} autoFocus />
        <span className="deadline-sep">→</span>
        <input type="date" className="deadline-input" defaultValue={endDate || ""} />
        <button className="course-tl-save" onClick={(e) => {
          e.stopPropagation()
          const inputs = (e.currentTarget.closest(".course-timeline") as HTMLElement).querySelectorAll("input")
          commit((inputs[0] as HTMLInputElement).value, (inputs[1] as HTMLInputElement).value)
        }}>✓</button>
        <button className="course-tl-cancel" onClick={(e) => { e.stopPropagation(); setEditing(false) }}>✕</button>
      </div>
    )
  }

  return (
    <div className="course-timeline" onClick={(e) => e.stopPropagation()}>
      {startDate ? (
        <>
          <span className={`course-tl-dates ${isCustom ? "custom" : "auto"}`}>
            {fmt(startDate)} → {fmt(endDate)}
          </span>
          {!isCustom && weekNum && <span className="course-tl-week">Wk {weekNum}</span>}
          <button className="course-tl-edit" onClick={() => setEditing(true)} title="Edit dates"><Pencil size={10} /></button>
          {isCustom && <button className="deadline-clear" onClick={clear} title="Reset to auto"><X size={10} /></button>}
        </>
      ) : (
        <button className="course-tl-unset" onClick={() => setEditing(true)}>
          {layerProgress?.startedDate ? `Wk ${weekNum ?? "?"} — set dates` : "Set layer start first"}
          <Pencil size={10} />
        </button>
      )}
    </div>
  )
}

interface Props {
  layer: Layer
  progress: RoadmapProgress
  onToggleCourse: (layerId: number, courseId: string) => void
  onActivity: () => void
  onSaveDates: (layerId: number, patch: Record<string, unknown>) => void
  onSaveCourseTimeline: (layerId: number, courseId: string, patch: Record<string, unknown>) => void
}

export default function LayerCard({ layer, progress, onToggleCourse, onActivity, onSaveDates, onSaveCourseTimeline }: Props) {
  const [openCourse, setOpenCourse]       = useState<typeof layer.courses[0] | null>(null)
  const [courseMetas, setCourseMetas]     = useState<Record<string, CourseMetaEntry>>({})
  const [editingStart, setEditingStart]   = useState(false)
  const [editingDeadline, setEditingDeadline] = useState(false)
  const startInputRef    = useRef<HTMLInputElement>(null)
  const deadlineInputRef = useRef<HTMLInputElement>(null)

  const layerProgress = progress.layerProgress[String(layer.id)] as LayerProgressEntry | undefined
  const deadline = getLayerDeadline(layer, layerProgress)
  const isCustomDeadline = !!layerProgress?.deadline
  const { daysRemaining, status: deadlineStatus } = getDeadlineStatus(deadline)

  useEffect(() => { if (editingStart && startInputRef.current) startInputRef.current.focus() }, [editingStart])
  useEffect(() => { if (editingDeadline && deadlineInputRef.current) deadlineInputRef.current.focus() }, [editingDeadline])

  const refreshMetas = useCallback(() => {
    api.getAllCourseMetas().then((m) => setCourseMetas(m as Record<string, CourseMetaEntry>))
  }, [])
  useEffect(() => { refreshMetas() }, [refreshMetas])

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
            value={layerProgress?.coursesCompleted.length ?? 0}
            max={layer.courses.length}
          />
        </div>
      </div>

      <div className="deadline-row">
        <div className="deadline-field">
          <span className="deadline-field-label">Started</span>
          {editingStart ? (
            <input
              ref={startInputRef}
              type="date"
              className="deadline-input"
              defaultValue={layerProgress?.startedDate || ""}
              onBlur={(e) => { setEditingStart(false); if (e.target.value) onSaveDates(layer.id, { startedDate: e.target.value }) }}
              onKeyDown={(e) => {
                if (e.key === "Enter") { setEditingStart(false); if ((e.target as HTMLInputElement).value) onSaveDates(layer.id, { startedDate: (e.target as HTMLInputElement).value }) }
                if (e.key === "Escape") setEditingStart(false)
              }}
            />
          ) : (
            <button className="deadline-value" onClick={() => setEditingStart(true)}>
              {layerProgress?.startedDate ? fmt(layerProgress.startedDate) : "Not set"} <Pencil size={11} />
            </button>
          )}
        </div>
        <span className="deadline-sep">→</span>
        <div className="deadline-field">
          <span className="deadline-field-label">Deadline{!isCustomDeadline && deadline ? " (Auto)" : ""}</span>
          {editingDeadline ? (
            <input
              ref={deadlineInputRef}
              type="date"
              className="deadline-input"
              defaultValue={deadline || ""}
              onBlur={(e) => { setEditingDeadline(false); if (e.target.value) onSaveDates(layer.id, { deadline: e.target.value }) }}
              onKeyDown={(e) => {
                if (e.key === "Enter") { setEditingDeadline(false); if ((e.target as HTMLInputElement).value) onSaveDates(layer.id, { deadline: (e.target as HTMLInputElement).value }) }
                if (e.key === "Escape") setEditingDeadline(false)
              }}
            />
          ) : (
            <span className="deadline-value-group">
              <button className="deadline-value" onClick={() => setEditingDeadline(true)}>
                {deadline ? fmt(deadline) : "Not set"} <Pencil size={11} />
              </button>
              {isCustomDeadline && (
                <button className="deadline-clear" onClick={() => onSaveDates(layer.id, { deadline: null })} title="Reset to auto">
                  <X size={11} />
                </button>
              )}
            </span>
          )}
        </div>
        {deadlineStatus !== "none" && (
          <div className={`deadline-badge deadline-${deadlineStatus}`}>
            {deadlineStatus === "overdue" ? `${Math.abs(daysRemaining!)}d overdue` : `${daysRemaining}d left`}
          </div>
        )}
      </div>

      {(deadlineStatus === "danger" || deadlineStatus === "overdue") && (
        <div className={`deadline-banner deadline-banner-${deadlineStatus}`}>
          {deadlineStatus === "danger"
            ? <><AlertTriangle size={14} /> Deadline in {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} — keep pushing!</>
            : <><AlertCircle size={14} /> Deadline passed {Math.abs(daysRemaining!)} day{Math.abs(daysRemaining!) !== 1 ? "s" : ""} ago — time to catch up!</>}
        </div>
      )}

      <motion.div className="courses-grid" variants={stagger} initial="hidden" animate="show">
        <AnimatePresence>
          {layer.courses.map((course) => {
            const done  = layerProgress?.coursesCompleted.includes(course.id) ?? false
            const meta  = courseMetas[course.id]
            const level = done ? 5 : engagementLevel(meta)
            const borderColor = done ? undefined : LEVEL_BORDER[level]

            return (
              <motion.div
                key={course.id}
                className={`course-card ${done ? "completed" : ""} ${level > 0 && !done ? `engaged-${level}` : ""}`}
                style={borderColor ? { borderLeftColor: borderColor, borderLeftWidth: 3 } : undefined}
                variants={fadeUp}
              >
                <button
                  className="course-checkbox"
                  onClick={(e) => { e.stopPropagation(); onToggleCourse(layer.id, course.id) }}
                  aria-label={done ? "Mark incomplete" : "Mark complete"}
                >
                  <Check />
                </button>

                <div
                  className="course-info course-info-clickable"
                  role="button"
                  tabIndex={0}
                  onClick={() => setOpenCourse(course)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpenCourse(course) } }}
                >
                  <div className="course-title">{course.title}</div>
                  <div className="course-meta">
                    <span className="course-meta-item"><Monitor />{course.platform}</span>
                    <span className="course-meta-item"><Clock />{course.duration}</span>
                    {course.videos && <span className="course-meta-item"><BookOpen />{course.videos} videos</span>}
                    <span className="course-meta-item">{course.cost}</span>
                    {!done && level > 0 && <span className={`engage-badge engage-level-${level}`}>{LEVEL_LABEL[level]}</span>}
                    {meta?.hasNotes && <span className="engage-badge engage-detail"><FileText size={10} /> Notes</span>}
                    {meta?.codeRuns && meta.codeRuns > 0 && <span className="engage-badge engage-detail"><Play size={10} /> {meta.codeRuns} run{meta.codeRuns !== 1 ? "s" : ""}</span>}
                  </div>
                  <div className="course-why">{course.why}</div>
                  <CourseTimeline
                    layer={layer}
                    layerProgress={layerProgress}
                    courseId={course.id}
                    onSave={(cid, patch) => onSaveCourseTimeline(layer.id, cid, patch)}
                  />
                </div>

                <div className="course-actions">
                  <button className="course-notes-btn" onClick={() => setOpenCourse(course)} title="Notes & Practice">
                    <FileText size={14} />
                  </button>
                  <a href={course.url} className="course-link" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                    Open <ExternalLink />
                  </a>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {openCourse && (
          <CoursePanel
            key={openCourse.id}
            course={openCourse}
            layerId={layer.id}
            isCompleted={layerProgress?.coursesCompleted.includes(openCourse.id) ?? false}
            onToggle={onToggleCourse}
            onClose={() => setOpenCourse(null)}
            onActivity={onActivity}
            onMetaChange={refreshMetas}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
