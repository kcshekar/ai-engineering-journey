"use client"

import { useState } from "react"
import { DURATION, EASE_OUT } from "@/lib/motion"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, Unlock, CircleCheck, CircleX, RotateCcw, ArrowRight, FastForward, ListChecks, MessageSquare } from "lucide-react"
import type { Quiz, QuizQuestion } from "@/types"

interface Props {
  quiz: Quiz
  isUnlocked: boolean
  completedCount: number
  totalCourses: number
  layerId?: number
  quizScore?: number | null
  quizAttempts?: number
  // Saves the final auto-scored check to the existing quizScore / quizAttempts fields.
  onSaveQuiz?: (score: number) => void
}

type Mode = "pre" | "check" | "final"

const isMcq = (q: QuizQuestion) => Array.isArray(q.options) && typeof q.correct === "number"

function McqRunner({
  questions, passingScore, title, onFinish, onClose, finishExtra,
}: {
  questions: QuizQuestion[]
  passingScore: number
  title: string
  onFinish?: (score: number) => void
  onClose: () => void
  finishExtra?: (score: number) => React.ReactNode
}) {
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [right, setRight] = useState(0)
  const [done, setDone] = useState(false)
  const q = questions[index]

  function pick(i: number) {
    if (picked !== null) return
    setPicked(i)
    if (i === q.correct) setRight((n) => n + 1)
  }
  function next() {
    if (index + 1 < questions.length) {
      setIndex(index + 1); setPicked(null)
    } else {
      setDone(true)
      onFinish?.(Math.round((right / questions.length) * 100))
    }
  }
  function restart() { setIndex(0); setPicked(null); setRight(0); setDone(false) }

  if (done) {
    const score = Math.round((right / questions.length) * 100)
    const passed = score >= passingScore
    return (
      <div className="mcq-result" aria-live="polite">
        <div className={`mcq-score ${passed ? "pass" : "fail"}`}>{score}%</div>
        <div className="mcq-result-text">
          {right} of {questions.length} correct · {passed ? "passed" : `${passingScore}% to pass`}
        </div>
        {finishExtra?.(score)}
        <div className="mcq-actions">
          <button className="mcq-btn ghost" onClick={restart}><RotateCcw size={14} /> Try again</button>
          <button className="mcq-btn ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    )
  }

  return (
    <div className="mcq">
      <div className="mcq-top">
        <span className="mcq-title">{title}</span>
        <span className="mcq-dots" aria-label={`Question ${index + 1} of ${questions.length}`}>
          {questions.map((_, i) => <span key={i} className={`mcq-dot ${i < index ? "past" : i === index ? "now" : ""}`} />)}
        </span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={q.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: DURATION.base, ease: EASE_OUT }}>
          <p className="mcq-question">{q.question}</p>
          <div className="mcq-options" role="group" aria-label="Answers">
            {q.options!.map((opt, i) => {
              const state = picked === null ? "" : i === q.correct ? "correct" : i === picked ? "wrong" : "dim"
              return (
                <button key={i} className={`mcq-option ${state}`} onClick={() => pick(i)} disabled={picked !== null} aria-pressed={picked === i}>
                  <span className="mcq-letter">{String.fromCharCode(65 + i)}</span>
                  <span className="mcq-option-text">{opt}</span>
                  {state === "correct" && <CircleCheck size={16} />}
                  {state === "wrong" && <CircleX size={16} />}
                </button>
              )
            })}
          </div>
          {picked !== null && (
            <div className={`mcq-explain ${picked === q.correct ? "ok" : "no"}`} aria-live="polite">
              <strong>{picked === q.correct ? "Correct." : "Not quite."}</strong> {q.explanation}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="mcq-actions">
        <button className="mcq-btn ghost" onClick={onClose}>Cancel</button>
        <button className="mcq-btn" onClick={next} disabled={picked === null}>
          {index + 1 < questions.length ? "Next" : "See result"} <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}

export default function QuizSection({
  quiz, isUnlocked, completedCount, totalCourses, layerId, quizScore, quizAttempts = 0, onSaveQuiz,
}: Props) {
  const [mode, setMode] = useState<Mode | null>(null)
  const mcqs = quiz.questions.filter(isMcq)
  const chat = quiz.questions.filter((q) => !isMcq(q))
  const pre = mcqs.filter((q) => q.stage === "pre")
  const check = mcqs.filter((q) => q.stage === "check")
  const final = mcqs.filter((q) => q.stage !== "pre")

  function skipAhead() {
    const target = document.getElementById(`stage-${layerId}-intermediate`) ?? document.getElementById(`stage-${layerId}-advanced`)
    target?.scrollIntoView({ behavior: "smooth", block: "start" })
    setMode(null)
  }

  return (
    <motion.div
      className={`quiz-section ${isUnlocked ? "quiz-unlocked" : "quiz-locked"}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.slow, ease: EASE_OUT }}
    >
      <div className="quiz-icon">
        {isUnlocked ? <Unlock /> : <Lock />}
      </div>
      <div className="quiz-title">
        {isUnlocked ? (final.length > 0 ? "Final check unlocked" : "Quiz unlocked") : "Layer quiz"}
      </div>
      <div className="quiz-subtitle">
        {isUnlocked
          ? [
              final.length > 0 && "Take the final check below; your score is saved.",
              chat.length > 0 && "Then answer the mentor-chat questions in a conversation with Claude.",
            ].filter(Boolean).join(" ")
          : `${quiz.unlockCondition} to unlock the final check.${pre.length + check.length > 0 ? " The practice checks below are open now." : ""}`}
      </div>
      {!isUnlocked && (
        <div className="quiz-progress">
          <strong>{completedCount}</strong> / {totalCourses} core items done
        </div>
      )}
      {isUnlocked && (
        <div className="quiz-progress">
          {[final.length > 0 && `${final.length} final-check questions`, chat.length > 0 && `${chat.length} mentor-chat questions`, `${quiz.passingScore}% to pass`]
            .filter(Boolean).join(" · ")}
        </div>
      )}

      {mcqs.length > 0 && (
        <div className="quiz-auto">
          {mode === null ? (
            <>
              <div className="quiz-auto-head"><ListChecks size={16} /> Auto-scored checks</div>
              <div className="quiz-auto-grid">
                {pre.length > 0 && (
                  <button className="quiz-mode" onClick={() => setMode("pre")}>
                    <span className="quiz-mode-name">Pre-check</span>
                    <span className="quiz-mode-desc">{pre.length} questions · know it already? Skip ahead</span>
                  </button>
                )}
                {check.length > 0 && (
                  <button className="quiz-mode" onClick={() => setMode("check")}>
                    <span className="quiz-mode-name">Mid-layer check</span>
                    <span className="quiz-mode-desc">{check.length} questions · practice, not saved</span>
                  </button>
                )}
                {final.length > 0 && (
                  <button className="quiz-mode quiz-mode-final" onClick={() => setMode("final")} disabled={!isUnlocked}>
                    <span className="quiz-mode-name">{isUnlocked ? "Final check" : <><Lock size={12} /> Final check</>}</span>
                    <span className="quiz-mode-desc">
                      {final.length} questions · {quizScore != null ? `last score ${quizScore}% · ${quizAttempts} attempt${quizAttempts === 1 ? "" : "s"}` : "saved to your progress"}
                    </span>
                  </button>
                )}
              </div>
            </>
          ) : (
            <McqRunner
              key={mode}
              title={mode === "pre" ? "Pre-check" : mode === "check" ? "Mid-layer check" : "Final check"}
              questions={mode === "pre" ? pre : mode === "check" ? check : final}
              passingScore={quiz.passingScore}
              onClose={() => setMode(null)}
              onFinish={mode === "final" ? onSaveQuiz : undefined}
              finishExtra={(score) =>
                mode === "pre" && score >= quiz.passingScore ? (
                  <button className="mcq-btn skip" onClick={skipAhead}><FastForward size={14} /> Skip ahead to the next stage</button>
                ) : mode === "final" ? (
                  <div className="mcq-saved">Saved: {score}% (attempt {quizAttempts})</div>
                ) : null
              }
            />
          )}
        </div>
      )}

      {isUnlocked && chat.length > 0 && (
        <details className="quiz-chat-list">
          <summary><MessageSquare size={14} /> Mentor-chat questions ({chat.length})</summary>
          <ol>{chat.map((q) => <li key={q.id}>{q.question}<span className="quiz-chat-hint">Hint: {q.hint}</span></li>)}</ol>
        </details>
      )}
    </motion.div>
  )
}
