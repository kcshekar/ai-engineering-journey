import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { progress } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { badRequest, readBody, isObject, layerIdOf, courseIdOf, invalidFields, TIMELINE_FIELDS } from "@/lib/api-input"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const userId = session.user.id

  const body = await readBody(req)
  const lid = layerIdOf(body?.layerId)
  const courseId = courseIdOf(body?.courseId)
  const patch = body?.patch
  if (!lid || !courseId || !isObject(patch)) return badRequest("layerId, courseId and a patch object are required")
  const wrong = invalidFields(TIMELINE_FIELDS, patch)
  if (wrong.length) return badRequest(`invalid patch fields: ${wrong.join(", ")}`)
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
