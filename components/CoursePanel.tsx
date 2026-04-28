"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Editor from "@monaco-editor/react"
import {
  X, FileText, Terminal, Copy, Check,
  ExternalLink, Clock, Monitor, BookOpen, Sparkles,
  Play, Trash2, Save,
} from "lucide-react"
import { api } from "@/lib/api-client"
import type { Course } from "@/types"

// ── Pyodide singleton ──────────────────────────────────────────────────────
let _pyodide: unknown = null
let _pyodideLoading: Promise<unknown> | null = null

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve()
    const s = document.createElement("script")
    s.src = src; s.onload = () => resolve(); s.onerror = reject
    document.head.appendChild(s)
  })
}

async function getPyodide() {
  if (_pyodide) return _pyodide
  if (_pyodideLoading) return _pyodideLoading
  _pyodideLoading = (async () => {
    await loadScript("https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _pyodide = await (window as any).loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/" })
    return _pyodide
  })()
  return _pyodideLoading
}

const RUNNER = `
import sys, io, traceback as _tb
__out = io.StringIO(); __err = io.StringIO()
__po, __pe = sys.stdout, sys.stderr
sys.stdout, sys.stderr = __out, __err
try:
    exec(compile(__user_code__, '<practice>', 'exec'), {'__name__': '__main__'})
except Exception:
    _tb.print_exc(file=sys.stderr)
finally:
    sys.stdout, sys.stderr = __po, __pe
`

function buildSummaryPrompt(course: Course, notes: string, code: string) {
  const parts = [
    `I just finished studying: "${course.title}"`,
    `Platform: ${course.platform} | Duration: ${course.duration}`,
    "", "## My Notes", notes.trim() || "(no notes yet)",
  ]
  if (code.trim()) parts.push("", "## Python Practice Code", "```python", code.trim(), "```")
  parts.push("", "---", "Please give me a concise summary of key concepts from this topic, highlight what I might have missed in my notes, and suggest 2-3 follow-up practice exercises.")
  return parts.join("\n")
}

function PythonChallenge({ challenge }: { challenge: Course["pythonChallenge"] }) {
  const [copied, setCopied] = useState(false)
  if (!challenge) return (
    <div className="panel-empty-state">
      <span className="panel-empty-icon">🐍</span>
      <span className="panel-empty-title">No challenge for this course yet</span>
    </div>
  )
  const handleCopy = async () => {
    await navigator.clipboard.writeText(challenge.starterCode)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="panel-challenge">
      <div className="challenge-meta">
        <span className="challenge-difficulty-badge">{challenge.difficulty}</span>
        <span className="challenge-level-pill">Level {challenge.level}</span>
      </div>
      <h3 className="challenge-title">{challenge.title}</h3>
      <div className="challenge-section-label">Task</div>
      <div className="challenge-question">{challenge.question}</div>
      <div className="challenge-section-label">Hint</div>
      <div className="challenge-hint">{challenge.hint}</div>
      <div className="challenge-code-header">
        <span className="challenge-section-label" style={{ marginBottom: 0 }}>Starter Code</span>
        <button className="challenge-copy-btn" onClick={handleCopy}>
          {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
        </button>
      </div>
      <pre className="challenge-starter-code">{challenge.starterCode}</pre>
      <div className="challenge-cta">Switch to the <strong>Python Practice</strong> tab to write and run your solution.</div>
    </div>
  )
}

interface Props {
  course: Course
  layerId: number
  isCompleted: boolean
  onToggle: (layerId: number, courseId: string) => void
  onClose: () => void
  onActivity: () => void
  onMetaChange: () => void
}

export default function CoursePanel({ course, layerId, isCompleted, onToggle, onClose, onActivity, onMetaChange }: Props) {
  const [activeTab, setActiveTab]       = useState("notes")
  const [notes, setNotes]               = useState("")
  const [code, setCode]                 = useState("")
  const [loading, setLoading]           = useState(true)
  const [isDirty, setIsDirty]           = useState(false)
  const [saveStatus, setSaveStatus]     = useState<"idle"|"saving"|"saved">("idle")
  const [copied, setCopied]             = useState(false)
  const [output, setOutput]             = useState<{type:string;text:string}[]>([])
  const [isRunning, setIsRunning]       = useState(false)
  const outputRef                       = useRef<HTMLDivElement>(null)
  const activityTimer                   = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([
      api.getNotes(course.id, layerId).catch(() => ({ content: "" })),
      api.getCode(course.id, layerId).catch(() => ({ content: "" })),
    ]).then(([n, c]) => {
      if (cancelled) return
      setNotes((n as {content:string}).content ?? "")
      setCode((c as {content:string}).content ?? "")
      setIsDirty(false); setLoading(false)
    })
    api.logActivity("view")
    api.updateCourseMeta(course.id, { views: "__inc__" }).then(onMetaChange)
    return () => { cancelled = true }
  }, [course.id, layerId])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") { e.preventDefault(); handleSave() }
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && activeTab === "code") { e.preventDefault(); handleRun() }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [activeTab, notes, code, isDirty])

  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight
  }, [output])

  const handleNotesChange = useCallback((val: string) => {
    setNotes(val); setIsDirty(true)
    clearTimeout(activityTimer.current)
    activityTimer.current = setTimeout(() => api.logActivity("notes").then(onActivity), 3000)
  }, [onActivity])

  const handleCodeChange = useCallback((val: string | undefined) => {
    setCode(val ?? ""); setIsDirty(true)
    clearTimeout(activityTimer.current)
    activityTimer.current = setTimeout(() => api.logActivity("code").then(onActivity), 3000)
  }, [onActivity])

  const handleSave = useCallback(async () => {
    if (!isDirty) return
    setSaveStatus("saving")
    await Promise.all([
      api.saveNotes(course.id, layerId, notes),
      api.saveCode(course.id, layerId, code),
      api.updateCourseMeta(course.id, {
        hasNotes: notes.trim().length > 0, noteChars: notes.trim().length,
        hasCode: code.trim().length > 0,  codeChars: code.trim().length,
      }).then(onMetaChange),
    ])
    api.logActivity("notes")
    setIsDirty(false); setSaveStatus("saved")
    onActivity?.()
    setTimeout(() => setSaveStatus("idle"), 2000)
  }, [course.id, layerId, notes, code, isDirty, onActivity, onMetaChange])

  const handleRun = useCallback(async () => {
    if (isRunning || !code.trim()) return
    setIsRunning(true)
    const firstRun = !_pyodide
    setOutput([{ type: "info", text: firstRun ? "⏳ Loading Python runtime…" : "▶ Running…" }])
    const start = Date.now()
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const py = await getPyodide() as any
      py.globals.set("__user_code__", code)
      await py.runPythonAsync(RUNNER)
      const stdout = py.runPython("__out.getvalue()")
      const stderr = py.runPython("__err.getvalue()")
      const elapsed = ((Date.now() - start) / 1000).toFixed(2)
      const lines: {type:string;text:string}[] = []
      if (stdout) stdout.trimEnd().split("\n").forEach((t: string) => lines.push({ type: "stdout", text: t }))
      if (stderr) stderr.trimEnd().split("\n").forEach((t: string) => lines.push({ type: "stderr", text: t }))
      if (!stdout && !stderr) lines.push({ type: "info", text: "(no output)" })
      lines.push({ type: "info", text: `✓ Done in ${elapsed}s` })
      setOutput(lines)
      api.logActivity("code")
      api.updateCourseMeta(course.id, { codeRuns: "__inc__", hasCode: code.trim().length > 0, codeChars: code.trim().length }).then(onMetaChange)
    } catch (e) {
      setOutput([{ type: "stderr", text: String(e) }])
    } finally {
      setIsRunning(false)
    }
  }, [code, isRunning, course.id, onMetaChange])

  const handleCopySummary = useCallback(async () => {
    await navigator.clipboard.writeText(buildSummaryPrompt(course, notes, code))
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }, [course, notes, code])

  return (
    <AnimatePresence>
      <motion.div key="backdrop" className="panel-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div key="panel" className="course-panel"
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
      >
        <div className="panel-header">
          <div className="panel-header-info">
            <div className="panel-course-title">{course.title}</div>
            <div className="panel-course-meta">
              <span><Monitor size={12} /> {course.platform}</span>
              <span><Clock size={12} /> {course.duration}</span>
              {course.videos && <span><BookOpen size={12} /> {course.videos} videos</span>}
              <span>{course.cost}</span>
            </div>
          </div>
          <div className="panel-header-actions">
            <a href={course.url} target="_blank" rel="noopener noreferrer" className="panel-btn panel-btn-open">
              Open course <ExternalLink size={13} />
            </a>
            <button className={`panel-btn ${isCompleted ? "panel-btn-done" : "panel-btn-mark"}`} onClick={() => onToggle(layerId, course.id)}>
              <Check size={13} /> {isCompleted ? "Completed" : "Mark done"}
            </button>
            <button className="panel-btn panel-btn-close" onClick={onClose}><X size={16} /></button>
          </div>
        </div>

        <div className="panel-tabs">
          <button className={`panel-tab ${activeTab === "notes" ? "active" : ""}`} onClick={() => setActiveTab("notes")}>
            <FileText size={14} /> Notes
            {isDirty && activeTab === "notes" && <span className="tab-dirty-dot" />}
          </button>
          <button className={`panel-tab ${activeTab === "code" ? "active" : ""}`} onClick={() => setActiveTab("code")}>
            <Terminal size={14} /> Python Practice
            {isDirty && activeTab === "code" && <span className="tab-dirty-dot" />}
          </button>
          {course.pythonChallenge && (
            <button className={`panel-tab panel-tab-challenge ${activeTab === "challenge" ? "active" : ""}`} onClick={() => setActiveTab("challenge")}>
              <Sparkles size={14} /> Challenge
              <span className="challenge-level-badge">Lv {course.pythonChallenge.level}</span>
            </button>
          )}
        </div>

        <div className="panel-body">
          {loading ? (
            <div className="panel-loading">Loading…</div>
          ) : activeTab === "challenge" ? (
            <PythonChallenge challenge={course.pythonChallenge} />
          ) : activeTab === "notes" ? (
            <div className="panel-notes-area">
              <textarea
                className="panel-notes-input"
                value={notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder={`What did you learn in "${course.title}"?\n\nWrite in plain text or markdown:\n- Key concepts\n- Things that surprised you\n- Questions to follow up`}
                spellCheck={false}
              />
            </div>
          ) : (
            <div className="code-tab-wrapper">
              <div className="panel-editor-area">
                <Editor
                  height="100%"
                  language="python"
                  theme="vs-dark"
                  value={code}
                  onChange={handleCodeChange}
                  options={{
                    fontSize: 13,
                    fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                    fontLigatures: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    lineNumbers: "on",
                    tabSize: 4,
                    wordWrap: "on",
                    padding: { top: 16, bottom: 16 },
                  }}
                />
              </div>
              <div className="output-panel">
                <div className="output-panel-header">
                  <span className="output-panel-title">Output</span>
                  <div className="output-panel-actions">
                    <button className="output-action-btn" onClick={() => setOutput([])} disabled={output.length === 0}>
                      <Trash2 size={13} /> Clear
                    </button>
                    <button className={`output-run-btn ${isRunning ? "running" : ""}`} onClick={handleRun} disabled={isRunning || !code.trim()} title="Run (Ctrl+Enter)">
                      <Play size={13} /> {isRunning ? "Running…" : "Run"}
                    </button>
                  </div>
                </div>
                <div className="output-panel-body" ref={outputRef}>
                  {output.length === 0 ? (
                    <span className="output-empty">Press Run or Ctrl+Enter to execute</span>
                  ) : output.map((line, i) => (
                    <div key={i} className={`output-line output-line-${line.type}`}>{line.text}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="panel-footer">
          <div className="panel-footer-left">
            <button
              className={`panel-btn panel-btn-save ${saveStatus}`}
              onClick={handleSave}
              disabled={!isDirty || saveStatus === "saving"}
              title="Save (⌘S)"
            >
              {saveStatus === "saved"
                ? <><Check size={13} /> Saved</>
                : <><Save size={13} /> {isDirty ? "Save ⌘S" : "No changes"}</>}
            </button>
            {isDirty && <span className="unsaved-hint">Unsaved changes</span>}
          </div>
          <button className="panel-btn panel-btn-summary" onClick={handleCopySummary}>
            {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy summary prompt</>}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
