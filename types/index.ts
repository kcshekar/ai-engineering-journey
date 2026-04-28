export interface Course {
  id: string
  title: string
  platform: string
  url: string
  cost: string
  duration: string
  videos?: number
  status: string
  order: number
  why: string
  pythonChallenge?: {
    level: number
    difficulty: string
    title: string
    question: string
    hint: string
    starterCode: string
  }
}

export interface WeekPlan {
  week: number
  focus: string
  courses: string[]
  dailyMinutes: number
  buildTask: string
  pythonTask: string
}

export interface QuizQuestion {
  id: string
  type: string
  question: string
  hint: string
}

export interface Quiz {
  status: string
  unlockCondition: string
  passingScore: number
  questions: QuizQuestion[]
}

export interface Layer {
  id: number
  title: string
  status: string
  weeks: string
  description: string
  appliesTo: string[]
  courses: Course[]
  weeklyPlan: WeekPlan[]
  quiz: Quiz
}

export interface CourseTimeline {
  startDate: string | null
  endDate: string | null
}

export interface LayerProgressEntry {
  started: boolean
  completed: boolean
  coursesCompleted: string[]
  quizScore: number | null
  quizAttempts: number
  startedDate: string | null
  completedDate: string | null
  deadline: string | null
  courseTimelines: Record<string, CourseTimeline>
}

export interface RoadmapProgress {
  userId: string
  roadmapId: string
  overallProgress: number
  currentLayer: number
  currentWeek: number
  layerProgress: Record<string, LayerProgressEntry>
  weeklyCheckins: unknown[]
  totalHoursSpent: number
}

export interface RoadmapMeta {
  id: string
  title: string
  description: string
  author: string
  totalLayers: number
  estimatedMonths: number
  currentLayer: number
  startDate: string
  targetRole: string
}

export interface ActivityDay {
  total: number
  view: number
  notes: number
  code: number
  complete: number
}

export interface CourseMetaEntry {
  views: number
  lastEngaged: string | null
  hasNotes: boolean
  noteChars: number
  hasCode: boolean
  codeChars: number
  codeRuns: number
}

export interface RoadmapData {
  meta: RoadmapMeta
  layers: Layer[]
  progress: RoadmapProgress
}
