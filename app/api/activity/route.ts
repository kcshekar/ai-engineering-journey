import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { activity } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { sql } from "drizzle-orm"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const userId = session.user.id

  const rows = await db.select().from(activity).where(eq(activity.userId, userId))
  const map: Record<string, object> = {}
  for (const row of rows) {
    map[row.date] = {
      total: row.total ?? 0,
      view: row.viewCount ?? 0,
      notes: row.notesCount ?? 0,
      code: row.codeCount ?? 0,
      complete: row.completeCount ?? 0,
    }
  }
  return NextResponse.json(map)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const userId = session.user.id

  const { type } = await req.json()
  const today = new Date().toISOString().split("T")[0]
  const id = `${userId}-${today}`

  const countCol = type === "view" ? "viewCount" : type === "notes" ? "notesCount" : type === "code" ? "codeCount" : "completeCount"

  const existing = await db.select().from(activity).where(eq(activity.id, id)).then((r) => r[0])

  if (existing) {
    const base = { total: sql`${activity.total} + 1` } as Record<string, unknown>
    if (type === "view")     base.viewCount     = sql`${activity.viewCount} + 1`
    if (type === "notes")    base.notesCount    = sql`${activity.notesCount} + 1`
    if (type === "code")     base.codeCount     = sql`${activity.codeCount} + 1`
    if (type === "complete") base.completeCount = sql`${activity.completeCount} + 1`
    await db.update(activity).set(base as never).where(eq(activity.id, id))
  } else {
    const vals = { id, userId, date: today, total: 1, viewCount: 0, notesCount: 0, codeCount: 0, completeCount: 0 }
    if (type === "view")     vals.viewCount = 1
    if (type === "notes")    vals.notesCount = 1
    if (type === "code")     vals.codeCount = 1
    if (type === "complete") vals.completeCount = 1
    await db.insert(activity).values(vals)
  }

  return NextResponse.json({ ok: true })
}
