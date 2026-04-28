import { sqliteTable, text, integer, real, uniqueIndex } from "drizzle-orm/sqlite-core"

export const progress = sqliteTable("progress", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  roadmapId: text("roadmap_id").notNull().default("ai-engineering"),
  layerId: integer("layer_id").notNull(),
  started: integer("started", { mode: "boolean" }).default(false),
  completed: integer("completed", { mode: "boolean" }).default(false),
  coursesCompleted: text("courses_completed").default("[]"),
  quizScore: real("quiz_score"),
  quizAttempts: integer("quiz_attempts").default(0),
  startedDate: text("started_date"),
  completedDate: text("completed_date"),
  deadline: text("deadline"),
  courseTimelines: text("course_timelines").default("{}"),
}, (t) => [
  uniqueIndex("progress_user_layer").on(t.userId, t.roadmapId, t.layerId),
])

export const activity = sqliteTable("activity", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  date: text("date").notNull(),
  total: integer("total").default(0),
  viewCount: integer("view_count").default(0),
  notesCount: integer("notes_count").default(0),
  codeCount: integer("code_count").default(0),
  completeCount: integer("complete_count").default(0),
}, (t) => [
  uniqueIndex("activity_user_date").on(t.userId, t.date),
])

export const courseMeta = sqliteTable("course_meta", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  courseId: text("course_id").notNull(),
  views: integer("views").default(0),
  lastEngaged: text("last_engaged"),
  hasNotes: integer("has_notes", { mode: "boolean" }).default(false),
  noteChars: integer("note_chars").default(0),
  hasCode: integer("has_code", { mode: "boolean" }).default(false),
  codeChars: integer("code_chars").default(0),
  codeRuns: integer("code_runs").default(0),
}, (t) => [
  uniqueIndex("course_meta_user_course").on(t.userId, t.courseId),
])

export const notes = sqliteTable("notes", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  layerId: integer("layer_id").notNull(),
  courseId: text("course_id").notNull(),
  content: text("content").default(""),
  updatedAt: text("updated_at"),
}, (t) => [
  uniqueIndex("notes_user_layer_course").on(t.userId, t.layerId, t.courseId),
])

export const exercises = sqliteTable("exercises", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  layerId: integer("layer_id").notNull(),
  courseId: text("course_id").notNull(),
  content: text("content").default(""),
  updatedAt: text("updated_at"),
}, (t) => [
  uniqueIndex("exercises_user_layer_course").on(t.userId, t.layerId, t.courseId),
])
