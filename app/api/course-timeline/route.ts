import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { progress } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const userId = session.user.id

  const { layerId, courseId, patch } = await req.json()
  const lid = parseInt(String(layerId))
  const id  = `${userId}-ai-engineering-${lid}`

  const existing = await db.select().from(progress).where(eq(progress.id, id)).then((r) => r[0])
  const timelines = JSON.parse(existing?.courseTimelines ?? "{}")
  timelines[courseId] = { ...(timelines[courseId] || {}), ...patch }

  if (existing) {
    await db.update(progress).set({ courseTimelines: JSON.stringify(timelines) }).where(eq(progress.id, id))
  } else {
    await db.insert(progress).values({
      id, userId, roadmapId: "ai-engineering", layerId: lid,
      courseTimelines: JSON.stringify(timelines),
    } as never)
  }

  return NextResponse.json({ ok: true })
}
