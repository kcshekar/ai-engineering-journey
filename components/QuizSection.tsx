"use client"

import { motion } from "framer-motion"
import { Lock, Unlock } from "lucide-react"
import type { Quiz } from "@/types"

interface Props {
  quiz: Quiz
  isUnlocked: boolean
  completedCount: number
  totalCourses: number
}

export default function QuizSection({ quiz, isUnlocked, completedCount, totalCourses }: Props) {
  return (
    <motion.div
      className={`quiz-section ${isUnlocked ? "quiz-unlocked" : "quiz-locked"}`}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <div className="quiz-icon">
        {isUnlocked ? <Unlock /> : <Lock />}
      </div>
      <div className="quiz-title">
        {isUnlocked ? "Quiz Unlocked" : "Layer Quiz"}
      </div>
      <div className="quiz-subtitle">
        {isUnlocked
          ? "Quiz unlocked — go to your mentor chat to take the quiz. Questions are designed for conversation, not multiple choice."
          : quiz.unlockCondition}
      </div>
      {!isUnlocked && (
        <div className="quiz-progress">
          <strong>{completedCount}</strong> / {totalCourses} courses completed
        </div>
      )}
      {isUnlocked && (
        <div className="quiz-progress">
          {quiz.questions.length} questions &middot; {quiz.passingScore}% to pass
        </div>
      )}
    </motion.div>
  )
}
