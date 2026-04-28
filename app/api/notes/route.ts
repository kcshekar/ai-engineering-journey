import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { notes } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const userId = session.user.id

  const { searchParams } = new URL(req.url)
  const courseId = searchParams.get("courseId")!
  const layerId  = parseInt(searchParams.get("layerId")!)

  const row = await db.select().from(notes).where(
    and(eq(notes.userId, userId), eq(notes.layerId, layerId), eq(notes.courseId, courseId))
  ).then((r) => r[0])

  return NextResponse.json({ content: row?.content ?? "" })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const userId = session.user.id

  const { courseId, layerId, content } = await req.json()
  const id = `${userId}-${layerId}-${courseId}`
  const updatedAt = new Date().toISOString().split("T")[0]

  await db.insert(notes)
    .values({ id, userId, layerId: parseInt(layerId), courseId, content, updatedAt })
    .onConflictDoUpdate({ target: notes.id, set: { content, updatedAt } })

  return NextResponse.json({ ok: true })
}
