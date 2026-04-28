import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { progress } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const userId = session.user.id

  const layerId = parseInt(new URL(req.url).searchParams.get("layerId")!)
  const row = await db.select().from(progress).where(
    and(eq(progress.userId, userId), eq(progress.roadmapId, "ai-engineering"), eq(progress.layerId, layerId))
  ).then((r) => r[0])

  if (!row) return NextResponse.json({})
  return NextResponse.json({
    started: row.started,
    completed: row.completed,
    coursesCompleted: JSON.parse(row.coursesCompleted ?? "[]"),
    quizScore: row.quizScore,
    quizAttempts: row.quizAttempts,
    startedDate: row.startedDate,
    completedDate: row.completedDate,
    deadline: row.deadline,
    courseTimelines: JSON.parse(row.courseTimelines ?? "{}"),
  })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const userId = session.user.id

  const { layerId, patch } = await req.json()
  const lid = parseInt(String(layerId))
  const id  = `${userId}-ai-engineering-${lid}`

  const existing = await db.select().from(progress).where(eq(progress.id, id)).then((r) => r[0])

  if (existing) {
    const setObj: Record<string, unknown> = {}
    if ("started" in patch)           setObj.started = patch.started
    if ("completed" in patch)         setObj.completed = patch.completed
    if ("coursesCompleted" in patch)  setObj.coursesCompleted = JSON.stringify(patch.coursesCompleted)
    if ("quizScore" in patch)         setObj.quizScore = patch.quizScore
    if ("quizAttempts" in patch)      setObj.quizAttempts = patch.quizAttempts
    if ("startedDate" in patch)       setObj.startedDate = patch.startedDate
    if ("completedDate" in patch)     setObj.completedDate = patch.completedDate
    if ("deadline" in patch)          setObj.deadline = patch.deadline
    if ("courseTimelines" in patch)   setObj.courseTimelines = JSON.stringify(patch.courseTimelines)
    await db.update(progress).set(setObj as never).where(eq(progress.id, id))
  } else {
    await db.insert(progress).values({
      id, userId, roadmapId: "ai-engineering", layerId: lid,
      started: patch.started ?? false,
      completed: patch.completed ?? false,
      coursesCompleted: JSON.stringify(patch.coursesCompleted ?? []),
      quizScore: patch.quizScore ?? null,
      quizAttempts: patch.quizAttempts ?? 0,
      startedDate: patch.startedDate ?? null,
      completedDate: patch.completedDate ?? null,
      deadline: patch.deadline ?? null,
      courseTimelines: JSON.stringify(patch.courseTimelines ?? {}),
    } as never)
  }

  return NextResponse.json({ ok: true })
}
