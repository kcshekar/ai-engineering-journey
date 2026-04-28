import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { courseMeta } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const userId = session.user.id

  const rows = await db.select().from(courseMeta).where(eq(courseMeta.userId, userId))
  const map: Record<string, object> = {}
  for (const row of rows) {
    map[row.courseId] = {
      views: row.views ?? 0,
      lastEngaged: row.lastEngaged ?? null,
      hasNotes: row.hasNotes ?? false,
      noteChars: row.noteChars ?? 0,
      hasCode: row.hasCode ?? false,
      codeChars: row.codeChars ?? 0,
      codeRuns: row.codeRuns ?? 0,
    }
  }
  return NextResponse.json(map)
}
