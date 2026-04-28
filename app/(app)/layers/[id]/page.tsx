import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { progress } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import LayerDetailClient from "@/components/LayerDetailClient"
import layersData from "@/data/roadmaps/ai-engineering/layers.json"
import type { LayerProgressEntry, RoadmapProgress, Layer } from "@/types"

interface Props { params: Promise<{ id: string }> }

export default async function LayerDetailPage({ params }: Props) {
  const { id } = await params
  const layerId = parseInt(id)

  const layer = (layersData.layers as Layer[]).find((l) => l.id === layerId)
  if (!layer) notFound()

  const session = await auth()
  if (!session?.user?.id) {
    notFound()
  }
  const userId  = session.user.id

  const progressRows = await db.select().from(progress).where(
    and(eq(progress.userId, userId), eq(progress.roadmapId, "ai-engineering"))
  )

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

  const initialProgress: RoadmapProgress = {
    userId,
    roadmapId: "ai-engineering",
    overallProgress: 0,
    currentLayer: layerId,
    currentWeek: 1,
    layerProgress: layerProgressMap,
    weeklyCheckins: [],
    totalHoursSpent: 0,
  }

  return <LayerDetailClient layer={layer} initialProgress={initialProgress} />
}
