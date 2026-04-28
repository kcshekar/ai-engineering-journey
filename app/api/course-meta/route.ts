import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { courseMeta } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { sql } from "drizzle-orm"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const userId = session.user.id

  const { courseId, patch } = await req.json() as { courseId: string; patch: Record<string, unknown> }
  const id = `${userId}-${courseId}`
  const today = new Date().toISOString().split("T")[0]

  const existing = await db.select().from(courseMeta).where(eq(courseMeta.id, id)).then((r) => r[0])

  if (existing) {
    const setObj: Record<string, unknown> = { lastEngaged: today }
    for (const [k, v] of Object.entries(patch)) {
      if (v === "__inc__") {
        const colMap: Record<string, unknown> = {
          views:    sql`${courseMeta.views} + 1`,
          codeRuns: sql`${courseMeta.codeRuns} + 1`,
        }
        if (colMap[k]) setObj[k] = colMap[k]
      } else {
        setObj[k] = v
      }
    }
    await db.update(courseMeta).set(setObj as never).where(eq(courseMeta.id, id))
  } else {
    const vals: Record<string, unknown> = { id, userId, courseId, lastEngaged: today, views: 0, noteChars: 0, codeChars: 0, codeRuns: 0, hasNotes: false, hasCode: false }
    for (const [k, v] of Object.entries(patch)) {
      vals[k] = v === "__inc__" ? 1 : v
    }
    await db.insert(courseMeta).values(vals as never)
  }

  const updated = await db.select().from(courseMeta).where(eq(courseMeta.id, id)).then((r) => r[0])
  return NextResponse.json(updated)
}
