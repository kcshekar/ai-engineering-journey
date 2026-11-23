export type ItemKind = "course" | "video" | "article" | "docs" | "book" | "repo" | "project"
export type ItemPrice = "free" | "freemium" | "paid"
export type ItemTrack = "core" | "optional"
export type Stage = "beginner" | "intermediate" | "advanced"
export type QuizStage = "pre" | "check" | "post"

export interface PythonChallenge {
  level: number
  difficulty: string
  title: string
  question: string
  hint: string
  starterCode: string
  // Python run after the learner's code in Pyodide; an AssertionError means a failed check.
  tests?: string
  hints?: string[]
}

// "Course" means any learning item (course, video, article, docs, book, repo or project).
// The name is kept because progress, notes and code in the DB are keyed by courseId.
// Never rename or remove an existing id (decision 0001).
export interface Course {
  id: string
  title: string
  platform: string
  url: string
  cost: string
  duration: string
  videos?: number
  order: number
  why: string
  pythonChallenge?: PythonChallenge
  kind?: ItemKind
  price?: ItemPrice
  recommended?: boolean
  hours?: number
  // Missing track means "core", so older layer.json files behave as before.
  track?: ItemTrack
  stage?: Stage
  pickGroup?: string
  prereqs?: string[]
  skills?: string[]
  // For kind "project": the evidence to keep when it is done.
  keep?: string[]
}

export interface MustKnowTerm {
  term: string
  oneLiner: string
  misconception?: string
}

export interface PickGroup {
  id: string
  label: string
}

export interface PortfolioProof {
  title: string
  evidence: string[]
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
  // With options set, the question is also auto-scored; without them it stays mentor-chat only.
  options?: string[]
  correct?: number
  explanation?: string
  stage?: QuizStage
}

export interface Quiz {
  unlockCondition: string
  passingScore: number
  questions: QuizQuestion[]
}

export interface Layer {
  id: number
  title: string
  weeks: string
  description: string
  appliesTo: string[]
  courses: Course[]
  weeklyPlan: WeekPlan[]
  quiz: Quiz
  mustKnow?: MustKnowTerm[]
  stageGoals?: Partial<Record<Stage, string>>
  pickGroups?: PickGroup[]
  outcomes?: string[]
  startHere?: string
  portfolioProof?: PortfolioProof
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
  totalLayers: number
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
