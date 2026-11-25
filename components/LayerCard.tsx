"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Check, ExternalLink, Clock, Monitor, BookOpen, FileText, Play, Pencil, X, AlertTriangle, AlertCircle, Lightbulb,
  GraduationCap, CirclePlay, Newspaper, BookMarked, Book, FolderGit2, Hammer, Star, ChevronDown, Compass, Trophy, Target, Layers as LayersIcon,
} from "lucide-react"
import ProgressBar from "./ProgressBar"
import CoursePanel from "./CoursePanel"
import { api } from "@/lib/api-client"
import { getLayerDeadline, getDeadlineStatus, getCourseTimeline, getCourseWeekNum, countDoneUnits, getRequiredCount, getLayerHours, isLayerWorkDone } from "@/lib/loader"
import type { Layer, RoadmapProgress, LayerProgressEntry, CourseMetaEntry, Course, ItemKind, Stage } from "@/types"

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

function HoursChip({ layer }: { layer: Layer }) {
  const { required, optional } = getLayerHours(layer)
  if (!required && !optional) return null
  return (
    <div className="hours-chip" title="Estimated study time">
      <Clock size={13} />
      {required > 0 && <span>~{required}h core</span>}
      {optional > 0 && <span className="hours-chip-optional">+{optional}h optional</span>}
    </div>
  )
}

function MustKnowCard({ layer }: { layer: Layer }) {
  const terms = layer.mustKnow ?? []
  if (!terms.length) return null
  return (
    <section className="must-know" aria-labelledby={`must-know-${layer.id}`}>
      <div className="must-know-head">
        <h3 id={`must-know-${layer.id}`}><Lightbulb size={16} /> Must know</h3>
        <span className="must-know-count">{terms.length} terms</span>
      </div>
      <ul className="must-know-grid">
        {terms.map((t) => (
          <li key={t.term} className="must-know-term">
            <span className="must-know-name">{t.term}</span>
            <p>{t.oneLiner}</p>
            {t.misconception && (
              <details className="must-know-trap">
                <summary>Common trap</summary>
                <p>{t.misconception}</p>
              </details>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

const KIND_ICON: Record<ItemKind, typeof Book> = {
  course: GraduationCap, video: CirclePlay, article: Newspaper, docs: BookMarked,
  book: Book, repo: FolderGit2, project: Hammer,
}
const STAGES: { id: Stage; label: string }[] = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
]
const PRICE_LABEL = { free: "Free", freemium: "Freemium", paid: "Paid" } as const

function fmtHours(h: number) {
  return Number.isInteger(h) ? `${h}h` : `${h.toFixed(1).replace(/\.0$/, "")}h`
}

interface ItemCardProps {
  course: Course
  layer: Layer
  layerProgress: LayerProgressEntry | undefined
  meta: CourseMetaEntry | undefined
  titleById: Map<string, string>
  doneEverywhere: Set<string>
  onToggle: (courseId: string) => void
  onOpen: (course: Course) => void
  onSaveTimeline: (courseId: string, patch: Record<string, string | null>) => void
  compact?: boolean
}

function ItemCard({ course, layer, layerProgress, meta, titleById, doneEverywhere, onToggle, onOpen, onSaveTimeline, compact }: ItemCardProps) {
  const doneIds = layerProgress?.coursesCompleted ?? []
  const done  = doneIds.includes(course.id)
  const level = done ? 5 : engagementLevel(meta)
  const borderColor = done ? undefined : LEVEL_BORDER[level]
  const optional = course.track === "optional"
  const KindIcon = KIND_ICON[course.kind ?? "course"] ?? GraduationCap
  // Soft prerequisite hint: only prereqs that are not done yet (any layer; ids are unique per roadmap).
  const missing = (course.prereqs ?? []).filter((id) => !doneEverywhere.has(id) && titleById.has(id))

  return (
    <motion.div
      className={`course-card ${done ? "completed" : ""} ${level > 0 && !done ? `engaged-${level}` : ""} ${optional ? "is-optional" : ""} ${compact ? "is-compact" : ""}`}
      style={borderColor ? { borderLeftColor: borderColor, borderLeftWidth: 3 } : undefined}
      variants={fadeUp}
    >
      <button
        className="course-checkbox"
        onClick={(e) => { e.stopPropagation(); onToggle(course.id) }}
        aria-label={done ? `Mark ${course.title} incomplete` : `Mark ${course.title} complete`}
      >
        <Check />
      </button>

      <div
        className="course-info course-info-clickable"
        role="button"
        tabIndex={0}
        onClick={() => onOpen(course)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(course) } }}
      >
        <div className="course-title-row">
          {course.kind && <span className={`kind-icon kind-${course.kind}`} title={course.kind}><KindIcon size={14} /></span>}
          <div className="course-title">{course.title}</div>
          {course.recommended && <span className="badge-star" title="Recommended"><Star size={11} /> Top pick</span>}
        </div>
        <div className="course-meta">
          <span className="course-meta-item"><Monitor />{course.platform}</span>
          {course.hours ? (
            <span className="course-meta-item"><Clock />{fmtHours(course.hours)}</span>
          ) : (
            <span className="course-meta-item"><Clock />{course.duration}</span>
          )}
          {course.videos && <span className="course-meta-item"><BookOpen />{course.videos} videos</span>}
          {course.price
            ? <span className={`badge-price price-${course.price}`}>{PRICE_LABEL[course.price]}</span>
            : <span className="course-meta-item">{course.cost}</span>}
          {optional && <span className="badge-optional">Optional</span>}
          {!done && level > 0 && <span className={`engage-badge engage-level-${level}`}>{LEVEL_LABEL[level]}</span>}
          {meta?.hasNotes && <span className="engage-badge engage-detail"><FileText size={10} /> Notes</span>}
          {meta?.codeRuns && meta.codeRuns > 0 && <span className="engage-badge engage-detail"><Play size={10} /> {meta.codeRuns} run{meta.codeRuns !== 1 ? "s" : ""}</span>}
        </div>
        {!compact && <div className="course-why">{course.why}</div>}
        {missing.length > 0 && !done && (
          <div className="prereq-hint">Needs first: {missing.map((id) => titleById.get(id)).join(", ")}</div>
        )}
        {course.skills && course.skills.length > 0 && !compact && (
          <div className="skill-tags">{course.skills.map((s) => <span key={s} className="skill-tag">{s}</span>)}</div>
        )}
        {course.kind === "project" && course.keep && course.keep.length > 0 && (
          <div className="project-keep">
            <span className="project-keep-label">Keep as evidence</span>
            <ul>{course.keep.map((k) => <li key={k}>{k}</li>)}</ul>
          </div>
        )}
        {!compact && (
          <CourseTimeline layer={layer} layerProgress={layerProgress} courseId={course.id} onSave={onSaveTimeline} />
        )}
      </div>

      <div className="course-actions">
        <button className="course-notes-btn" onClick={() => onOpen(course)} title="Notes & Practice" aria-label={`Notes and practice for ${course.title}`}>
          <FileText size={14} />
        </button>
        <a href={course.url} className="course-link" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
          Open <ExternalLink />
        </a>
      </div>
    </motion.div>
  )
}

function StartHere({ text }: { text?: string }) {
  if (!text) return null
  return <div className="start-here"><Compass size={15} /><span><strong>Start here:</strong> {text}</span></div>
}

function OutcomesPanel({ layer, complete }: { layer: Layer; complete: boolean }) {
  const outcomes = layer.outcomes ?? []
  if (!outcomes.length && !layer.portfolioProof) return null
  return (
    <section className={`outcomes-panel ${complete ? "is-complete" : ""}`} aria-label="Layer outcomes">
      <div className="outcomes-head">
        {complete ? <Trophy size={18} /> : <Target size={18} />}
        <h3>{complete ? "You can now…" : "By the end of this layer you can…"}</h3>
      </div>
      {outcomes.length > 0 && <ul className="outcomes-list">{outcomes.map((o) => <li key={o}><Check size={14} />{o}</li>)}</ul>}
      {layer.portfolioProof && (
        <div className="portfolio-proof">
          <div className="portfolio-proof-title">Portfolio proof: {layer.portfolioProof.title}</div>
          <ul>{layer.portfolioProof.evidence.map((e) => <li key={e}>{e}</li>)}</ul>
        </div>
      )}
    </section>
  )
}

interface Props {
  layer: Layer
  progress: RoadmapProgress
  onToggleCourse: (layerId: number, courseId: string) => void
  onActivity: () => void
  onSaveDates: (layerId: number, patch: Record<string, unknown>) => void
  onSaveCourseTimeline: (layerId: number, courseId: string, patch: Record<string, unknown>) => void
  // Items from every layer, so prerequisite hints can name items in earlier layers.
  allCourses?: Course[]
}

export default function LayerCard({ layer, progress, onToggleCourse, onActivity, onSaveDates, onSaveCourseTimeline, allCourses = layer.courses }: Props) {
  const [openCourse, setOpenCourse]       = useState<typeof layer.courses[0] | null>(null)
  const [courseMetas, setCourseMetas]     = useState<Record<string, CourseMetaEntry>>({})
  const [editingStart, setEditingStart]   = useState(false)
  const [editingDeadline, setEditingDeadline] = useState(false)
  const startInputRef    = useRef<HTMLInputElement>(null)
  const deadlineInputRef = useRef<HTMLInputElement>(null)

  const layerProgress = progress.layerProgress[String(layer.id)] as LayerProgressEntry | undefined
  const deadline = getLayerDeadline(layer, layerProgress)
  const isCustomDeadline = !!layerProgress?.deadline
  // A finished layer has no deadline pressure, so hide the countdown and the overdue banner.
  const layerDone = !!layerProgress?.completed || isLayerWorkDone(layer, layerProgress?.coursesCompleted ?? [])
  const { daysRemaining, status: deadlineStatus } = layerDone
    ? { daysRemaining: null, status: "none" as const }
    : getDeadlineStatus(deadline)
  const titleById = new Map(allCourses.map((c) => [c.id, c.title]))
  const doneEverywhere = new Set(Object.values(progress.layerProgress).flatMap((lp) => (lp as LayerProgressEntry).coursesCompleted ?? []))

  useEffect(() => { if (editingStart && startInputRef.current) startInputRef.current.focus() }, [editingStart])
  useEffect(() => { if (editingDeadline && deadlineInputRef.current) deadlineInputRef.current.focus() }, [editingDeadline])

  const refreshMetas = useCallback(() => {
    api.getAllCourseMetas().then((m) => setCourseMetas(m as Record<string, CourseMetaEntry>))
  }, [])
  useEffect(() => { refreshMetas() }, [refreshMetas])

  const openCoursePanel = useCallback((course: Course) => {
    setOpenCourse(course)
    if (!layerProgress?.started) {
      onSaveDates(layer.id, {
        started: true,
        startedDate: layerProgress?.startedDate ?? new Date().toISOString().split("T")[0],
      })
    }
  }, [layer.id, layerProgress?.started, layerProgress?.startedDate, onSaveDates])

  return (
    <div className="layer-view">
      <div className="layer-header">
        <div className="layer-title-area">
          <h2>Layer {layer.id}: {layer.title}</h2>
          <p>{layer.description}</p>
          <HoursChip layer={layer} />
        </div>
        <div className="layer-progress-bar">
          <ProgressBar
            label="Core items done"
            value={countDoneUnits(layer, layerProgress?.coursesCompleted ?? [])}
            max={getRequiredCount(layer)}
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

      <MustKnowCard layer={layer} />

      {(deadlineStatus === "danger" || deadlineStatus === "overdue") && (
        <div className={`deadline-banner deadline-banner-${deadlineStatus}`}>
          {deadlineStatus === "danger"
            ? <><AlertTriangle size={14} /> Deadline in {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} — keep pushing!</>
            : <><AlertCircle size={14} /> Deadline passed {Math.abs(daysRemaining!)} day{Math.abs(daysRemaining!) !== 1 ? "s" : ""} ago — time to catch up!</>}
        </div>
      )}

      <StartHere text={layer.startHere} />

      {(() => {
        const renderCard = (c: Course, compact = false) => (
          <ItemCard
            key={c.id}
            course={c}
            layer={layer}
            layerProgress={layerProgress}
            meta={courseMetas[c.id]}
            titleById={titleById}
            doneEverywhere={doneEverywhere}
            onToggle={(id) => onToggleCourse(layer.id, id)}
            onOpen={openCoursePanel}
            onSaveTimeline={(cid, patch) => onSaveCourseTimeline(layer.id, cid, patch)}
            compact={compact}
          />
        )
        // Pick-one groups render as one grouped card, at the position of their first member.
        const renderList = (items: Course[]) => {
          const seen = new Set<string>()
          const core = items.filter((c) => c.track !== "optional")
          const optional = items.filter((c) => c.track === "optional")
          const out: React.ReactNode[] = []
          for (const c of core) {
            if (!c.pickGroup) { out.push(renderCard(c)); continue }
            if (seen.has(c.pickGroup)) continue
            seen.add(c.pickGroup)
            const members = core.filter((m) => m.pickGroup === c.pickGroup)
            const label = layer.pickGroups?.find((g) => g.id === c.pickGroup)?.label ?? "Pick one"
            const doneIds = layerProgress?.coursesCompleted ?? []
            const picked = members.some((m) => doneIds.includes(m.id))
            out.push(
              <motion.div key={`group-${c.pickGroup}`} className={`pick-group ${picked ? "is-picked" : ""}`} variants={fadeUp}>
                <div className="pick-group-head">
                  <LayersIcon size={15} />
                  <span className="pick-group-label">{label}</span>
                  <span className="pick-group-note">{picked ? "Done: one is enough" : `Finish any 1 of ${members.length}`}</span>
                </div>
                <div className="pick-group-items">{members.map((m) => renderCard(m, true))}</div>
              </motion.div>
            )
          }
          return (
            <>
              <motion.div className="courses-grid" variants={stagger} initial="hidden" animate="show">{out}</motion.div>
              {optional.length > 0 && (
                <details className="optional-extras">
                  <summary><ChevronDown size={14} /> Optional extras ({optional.length})</summary>
                  <motion.div className="courses-grid" variants={stagger} initial="hidden" animate="show">
                    {optional.map((c) => renderCard(c))}
                  </motion.div>
                </details>
              )}
            </>
          )
        }

        const learning = layer.courses.filter((c) => c.kind !== "project")
        const projects = layer.courses.filter((c) => c.kind === "project")
        const hasStages = learning.some((c) => c.stage)
        return (
          <>
            {hasStages ? (
              <>
                {STAGES.map(({ id, label }) => {
                  const items = learning.filter((c) => c.stage === id)
                  if (!items.length) return null
                  const h = items.filter((c) => c.track !== "optional").reduce((n, c) => n + (c.hours ?? 0), 0)
                  return (
                    <section key={id} id={`stage-${layer.id}-${id}`} className={`stage-section stage-${id}`}>
                      <div className="stage-head">
                        <span className={`stage-pill stage-pill-${id}`}>{label}</span>
                        {h > 0 && <span className="stage-hours">~{fmtHours(h)}</span>}
                      </div>
                      {layer.stageGoals?.[id] && <p className="stage-goal">{layer.stageGoals[id]}</p>}
                      {renderList(items)}
                    </section>
                  )
                })}
                {learning.some((c) => !c.stage) && (
                  <section className="stage-section">
                    <div className="stage-head"><span className="stage-pill">More</span></div>
                    {renderList(learning.filter((c) => !c.stage))}
                  </section>
                )}
              </>
            ) : (
              renderList(learning)
            )}
            {projects.length > 0 && (
              <section className="stage-section projects-section" aria-label="Projects">
                <div className="stage-head">
                  <span className="stage-pill stage-pill-project"><Hammer size={12} /> Projects</span>
                  <span className="stage-hours">Build it, keep the evidence</span>
                </div>
                <motion.div className="projects-grid" variants={stagger} initial="hidden" animate="show">
                  {projects.map((p) => (
                    <div key={p.id} className="project-wrap">
                      {p.stage && <span className={`stage-pill stage-pill-${p.stage} project-level`}>{STAGES.find((s) => s.id === p.stage)?.label}</span>}
                      {renderCard(p)}
                    </div>
                  ))}
                </motion.div>
              </section>
            )}
            <OutcomesPanel layer={layer} complete={layerDone} />
          </>
        )
      })()}

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
