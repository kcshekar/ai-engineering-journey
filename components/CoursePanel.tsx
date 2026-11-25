"use client"

import { useState, useEffect, useEffectEvent, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Editor from "@monaco-editor/react"
import {
  X, FileText, Terminal, Copy, Check,
  ExternalLink, Clock, Monitor, BookOpen, Sparkles,
  Play, Trash2, Save, ListChecks, Lightbulb,
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

// Runs the learner's code, then each top-level statement of the challenge tests in the same
// namespace. Every assert is reported as one check; other statements are setup.
const CHECKER = `
import ast, io, json, sys, traceback as _tb
__ns = {'__name__': '__main__'}
__results = []
__setup = []
__out = io.StringIO(); __err = io.StringIO()
__po, __pe = sys.stdout, sys.stderr
sys.stdout, sys.stderr = __out, __err
__user_ok = True
try:
    try:
        exec(compile(__user_code__, '<practice>', 'exec'), __ns)
    except BaseException:
        __user_ok = False
        _tb.print_exc(limit=-1, file=sys.stderr)
    # Checks still run after a crash: functions defined before it can be checked.
    for __node in ast.parse(__tests__).body:
        __src = ast.get_source_segment(__tests__, __node) or ''
        __is_check = isinstance(__node, ast.Assert)
        __label = __src
        if __is_check and isinstance(__node.msg, ast.Constant) and isinstance(__node.msg.value, str):
            __label = __node.msg.value
        try:
            exec(compile(ast.Module(body=[__node], type_ignores=[]), '<check>', 'exec'), __ns)
            if __is_check:
                __results.append({'label': __label, 'ok': True, 'error': ''})
        except BaseException as __e:
            __msg = type(__e).__name__ + ': ' + str(__e)
            if not __is_check:
                __setup.append(__src.splitlines()[0][:80] + ' -> ' + __msg)
            elif isinstance(__e, AssertionError):
                __results.append({'label': __label, 'ok': False, 'error': '' if str(__e) in ('', __label) else str(__e)})
            else:
                __results.append({'label': __label, 'ok': False, 'error': __msg})
finally:
    sys.stdout, sys.stderr = __po, __pe
__results_json = json.dumps({'userOk': __user_ok, 'results': __results, 'setup': __setup, 'stdout': __out.getvalue(), 'stderr': __err.getvalue()})
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
  const [hintsShown, setHintsShown] = useState(0)
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
      {challenge.hints && challenge.hints.length > 0 && (
        <div className="challenge-hints">
          {challenge.hints.slice(0, hintsShown).map((h, i) => (
            <div key={i} className="challenge-hint challenge-hint-step"><span className="hint-step-num">{i + 1}</span>{h}</div>
          ))}
          {hintsShown < challenge.hints.length && (
            <button className="challenge-hint-btn" onClick={() => setHintsShown((n) => n + 1)}>
              <Lightbulb size={13} /> {hintsShown === 0 ? "Stuck? Show a hint" : "Show next hint"} ({hintsShown}/{challenge.hints.length})
            </button>
          )}
        </div>
      )}
      <div className="challenge-code-header">
        <span className="challenge-section-label" style={{ marginBottom: 0 }}>Starter Code</span>
        <button className="challenge-copy-btn" onClick={handleCopy}>
          {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
        </button>
      </div>
      <pre className="challenge-starter-code">{challenge.starterCode}</pre>
      <div className="challenge-cta">
        Switch to the <strong>Python Practice</strong> tab to write and run your solution.
        {challenge.tests && <> Press <strong>Check</strong> there to run {countChecks(challenge.tests)} automatic checks.</>}
      </div>
    </div>
  )
}

function countChecks(tests: string) {
  return tests.split("\n").filter((l) => /^assert\b/.test(l)).length
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
  const [loadedKey, setLoadedKey]       = useState<string | null>(null)
  const [failedKey, setFailedKey]       = useState<string | null>(null)
  const [attempt, setAttempt]           = useState(0)
  const [isDirty, setIsDirty]           = useState(false)
  const [saveStatus, setSaveStatus]     = useState<"idle"|"saving"|"saved"|"error">("idle")
  const [closeBlocked, setCloseBlocked] = useState(false)
  const [copied, setCopied]             = useState(false)
  const [output, setOutput]             = useState<{type:string;text:string}[]>([])
  const [isRunning, setIsRunning]       = useState(false)
  const outputRef                       = useRef<HTMLDivElement>(null)
  const activityTimer                   = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  // Latest text and edit counters for saving: a save writes what was typed up to its start and
  // only marks the panel clean if nothing was typed while it ran.
  const notesRef                        = useRef("")
  const codeRef                         = useRef("")
  const editVersion                     = useRef(0)
  const savedVersion                    = useRef(0)
  const saveChain                       = useRef<Promise<boolean>>(Promise.resolve(true))

  // Load state is derived from keys, so no state is set synchronously in the effect.
  // A failed load blocks editing and saving: saving an empty editor would overwrite the real notes.
  const loadKey   = `${layerId}:${course.id}:${attempt}`
  const loadError = failedKey === loadKey
  const loading   = loadedKey !== loadKey && !loadError
  const onViewed = useEffectEvent(() => onMetaChange())

  useEffect(() => {
    let cancelled = false
    const key = `${layerId}:${course.id}:${attempt}`
    Promise.all([api.getNotes(course.id, layerId), api.getCode(course.id, layerId)])
      .then(([n, c]) => {
        if (cancelled) return
        notesRef.current = n.content ?? ""
        codeRef.current = c.content ?? ""
        savedVersion.current = editVersion.current
        setNotes(notesRef.current)
        setCode(codeRef.current)
        setIsDirty(false); setLoadedKey(key)
      })
      .catch(() => { if (!cancelled) setFailedKey(key) })
    return () => { cancelled = true }
  }, [course.id, layerId, attempt])

  useEffect(() => {
    api.logActivity("view")
    api.updateCourseMeta(course.id, { views: "__inc__" }).then(() => onViewed())
  }, [course.id])

  // Warn before leaving the page with unsaved notes or code.
  useEffect(() => {
    if (!isDirty) return
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault() }
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [isDirty])

  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight
  }, [output])

  const markEdited = useCallback(() => {
    editVersion.current += 1
    setIsDirty(true); setCloseBlocked(false)
    if (saveStatus === "error") setSaveStatus("idle")
  }, [saveStatus])

  const handleNotesChange = useCallback((val: string) => {
    notesRef.current = val
    setNotes(val); markEdited()
    clearTimeout(activityTimer.current)
    activityTimer.current = setTimeout(() => api.logActivity("notes").then(onActivity), 3000)
  }, [onActivity, markEdited])

  const handleCodeChange = useCallback((val: string | undefined) => {
    codeRef.current = val ?? ""
    setCode(val ?? ""); markEdited()
    clearTimeout(activityTimer.current)
    activityTimer.current = setTimeout(() => api.logActivity("code").then(onActivity), 3000)
  }, [onActivity, markEdited])

  // One save of the latest text. Edits only happen after a successful load (the editors are hidden
  // otherwise), so with no new edits nothing is written. Edits typed while it runs stay unsaved.
  const runSave = useCallback(async (): Promise<boolean> => {
    const version = editVersion.current
    if (version === savedVersion.current) {
      setSaveStatus((s) => (s === "saving" ? "idle" : s))
      return true
    }
    const notesNow = notesRef.current, codeNow = codeRef.current
    const [notesOk, codeOk] = await Promise.all([
      api.saveNotes(course.id, layerId, notesNow),
      api.saveCode(course.id, layerId, codeNow),
    ])
    if (!notesOk || !codeOk) { setSaveStatus("error"); return false }
    savedVersion.current = Math.max(savedVersion.current, version)
    api.updateCourseMeta(course.id, {
      hasNotes: notesNow.trim().length > 0, noteChars: notesNow.trim().length,
      hasCode: codeNow.trim().length > 0,  codeChars: codeNow.trim().length,
    }).then(onMetaChange)
    api.logActivity("notes")
    onActivity?.()
    const clean = editVersion.current === savedVersion.current
    if (clean) {
      setIsDirty(false); setSaveStatus("saved"); setCloseBlocked(false)
      setTimeout(() => setSaveStatus((s) => (s === "saved" ? "idle" : s)), 2000)
    } else {
      setSaveStatus("idle")
    }
    return clean
  }, [course.id, layerId, onActivity, onMetaChange])

  // Saves run one after another, so an older save can never land after a newer one.
  // Resolves true when nothing is left unsaved.
  const handleSave = useCallback((): Promise<boolean> => {
    setSaveStatus("saving")
    const job = saveChain.current.then(runSave, runSave)
    saveChain.current = job.catch(() => false)
    return job
  }, [runSave])

  // Closing saves unsaved work first. If that save fails, the panel stays open; closing again
  // without new edits discards them.
  const requestClose = useCallback(async () => {
    if (closeBlocked) { onClose(); return }
    if (await handleSave()) onClose()
    else setCloseBlocked(true)
  }, [closeBlocked, handleSave, onClose])

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

  const tests = course.pythonChallenge?.tests
  const handleCheck = useCallback(async () => {
    if (isRunning || !code.trim() || !tests) return
    setIsRunning(true)
    setOutput([{ type: "info", text: _pyodide ? "▶ Checking…" : "⏳ Loading Python runtime…" }])
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const py = await getPyodide() as any
      py.globals.set("__user_code__", code)
      py.globals.set("__tests__", tests)
      await py.runPythonAsync(CHECKER)
      const res = JSON.parse(py.globals.get("__results_json")) as {
        userOk: boolean; stdout: string; stderr: string; setup: string[]
        results: { label: string; ok: boolean; error: string }[]
      }
      const lines: { type: string; text: string }[] = []
      if (res.stdout) res.stdout.trimEnd().split("\n").forEach((t) => lines.push({ type: "stdout", text: t }))
      if (!res.userOk) {
        res.stderr.trimEnd().split("\n").forEach((t) => lines.push({ type: "stderr", text: t }))
        lines.push({ type: "info", text: "Your code raised an error. Checks ran on what was defined before it:" })
      }
      res.setup.forEach((t) => lines.push({ type: "stderr", text: `⚠ setup: ${t}` }))
      for (const r of res.results) {
        lines.push(r.ok ? { type: "pass", text: `✓ ${r.label}` } : { type: "fail", text: `✗ ${r.label}${r.error ? ` (${r.error})` : ""}` })
      }
      const passed = res.results.filter((r) => r.ok).length
      const total = res.results.length
      if (total === 0) lines.push({ type: "info", text: "This challenge has no checks yet." })
      else lines.push({
        type: passed === total ? "summary-pass" : "summary-fail",
        text: passed === total ? `All ${total} checks passed 🎉` : `${passed} of ${total} checks passed`,
      })
      setOutput(lines)
      api.logActivity("code")
      api.updateCourseMeta(course.id, { codeRuns: "__inc__", hasCode: true, codeChars: code.trim().length }).then(onMetaChange)
    } catch (e) {
      setOutput([{ type: "stderr", text: String(e) }])
    } finally {
      setIsRunning(false)
    }
  }, [code, isRunning, tests, course.id, onMetaChange])

  // Ctrl/Cmd+S saves, Ctrl/Cmd+Enter runs code. The effect event always sees the latest handlers.
  const onShortcut = useEffectEvent((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "s") { e.preventDefault(); handleSave() }
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && activeTab === "code") { e.preventDefault(); handleRun() }
  })
  useEffect(() => {
    const handler = (e: KeyboardEvent) => onShortcut(e)
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  const handleCopySummary = useCallback(async () => {
    await navigator.clipboard.writeText(buildSummaryPrompt(course, notes, code))
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }, [course, notes, code])

  return (
    <AnimatePresence>
      <motion.div key="backdrop" className="panel-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={requestClose} />
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
            <button className="panel-btn panel-btn-close" onClick={requestClose} aria-label="Close" title="Close"><X size={16} /></button>
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
          {loadError ? (
            <div className="panel-load-error" role="alert">
              <p>Couldn&apos;t load your notes and code for this item. Editing is off, so nothing gets overwritten.</p>
              <button type="button" className="panel-btn" onClick={() => setAttempt((a) => a + 1)}>Retry</button>
            </div>
          ) : loading ? (
            <div className="panel-loading" role="status">Loading…</div>
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
                    {tests && (
                      <button className="output-check-btn" onClick={handleCheck} disabled={isRunning || !code.trim()} title="Run your code, then the challenge checks">
                        <ListChecks size={13} /> Check
                      </button>
                    )}
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
              disabled={!isDirty || saveStatus === "saving" || loading || loadError}
              title="Save (⌘S)"
            >
              {saveStatus === "saved"
                ? <><Check size={13} /> Saved</>
                : <><Save size={13} /> {saveStatus === "saving" ? "Saving…" : isDirty ? "Save ⌘S" : "No changes"}</>}
            </button>
            <span className="unsaved-hint" role="status">
              {saveStatus === "error"
                ? closeBlocked
                  ? "Not saved. Close again to discard your changes, or press Save to retry."
                  : "Not saved. Check your connection and press Save to retry."
                : isDirty ? "Unsaved changes" : ""}
            </span>
          </div>
          <button className="panel-btn panel-btn-summary" onClick={handleCopySummary}>
            {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy summary prompt</>}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
