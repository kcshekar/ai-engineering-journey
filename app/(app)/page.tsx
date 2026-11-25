import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { progress, activity } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import DashboardClient from "@/components/DashboardClient"
import { getRoadmapLayers } from "@/lib/roadmap-data"
import { getEffectiveCurrentLayer, getCurrentWeekNum } from "@/lib/loader"
import metaData from "@/data/roadmaps/ai-engineering/meta.json"
import type { LayerProgressEntry, ActivityDay, RoadmapData, RoadmapMeta } from "@/types"

export const metadata = { title: "Dashboard" }

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }
  const userId  = session.user.id

  const [progressRows, activityRows] = await Promise.all([
    db.select().from(progress).where(
      and(eq(progress.userId, userId), eq(progress.roadmapId, "ai-engineering"))
    ),
    db.select().from(activity).where(eq(activity.userId, userId)),
  ])

  const layerProgressMap: Record<string, LayerProgressEntry> = {}
  for (const row of progressRows) {
    layerProgressMap[String(row.layerId)] = {
      started: row.started ?? false,
      completed: row.completed ?? false,
      coursesCompleted: JSON.parse(row.coursesCompleted ?? "[]"),
      quizScore: row.quizScore ?? null,
      quizAttempts: row.quizAttempts ?? 0,
      startedDate: row.startedDate ?? null,
      completedDate: row.completedDate ?? null,
      deadline: row.deadline ?? null,
      courseTimelines: JSON.parse(row.courseTimelines ?? "{}"),
    }
  }

  const activityMap: Record<string, ActivityDay> = {}
  for (const row of activityRows) {
    activityMap[row.date] = {
      total: row.total ?? 0,
      view: row.viewCount ?? 0,
      notes: row.notesCount ?? 0,
      code: row.codeCount ?? 0,
      complete: row.completeCount ?? 0,
    }
  }

  const layers = getRoadmapLayers("ai-engineering")
  const effectiveCurrentLayer = getEffectiveCurrentLayer(layers, layerProgressMap)
  const currentWeek = getCurrentWeekNum(effectiveCurrentLayer, layerProgressMap[String(effectiveCurrentLayer.id)])

  const roadmap: RoadmapData = {
    meta: metaData as RoadmapMeta,
    layers,
    progress: {
      userId,
      roadmapId: "ai-engineering",
      overallProgress: 0,
      currentLayer: effectiveCurrentLayer.id,
      currentWeek,
      layerProgress: layerProgressMap,
      weeklyCheckins: [],
      totalHoursSpent: 0,
    },
  }

  return <DashboardClient initialRoadmap={roadmap} initialActivityMap={activityMap} />
}
