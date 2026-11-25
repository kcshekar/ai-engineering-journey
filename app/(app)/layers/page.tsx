import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { progress } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { Layers } from "lucide-react"
import SegmentedBar from "@/components/ui/SegmentedBar"
import { getRoadmapLayers } from "@/lib/roadmap-data"
import { getLayerStatus, getEffectiveCurrentLayer, getStageProgress, getLayerHours } from "@/lib/loader"
import type { LayerProgressEntry } from "@/types"

export const metadata = { title: "Layers" }

const STAGE_LABEL = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" } as const

export default async function LayersPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
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

  const layers = getRoadmapLayers("ai-engineering")
  const currentLayerId = getEffectiveCurrentLayer(layers, layerProgressMap).id

  return (
    <div className="layers-overview">
      <div className="section-title"><Layers /> All Layers</div>
      <div className="layers-grid">
        {layers.map((layer) => {
          const lp = layerProgressMap[String(layer.id)]
          const stages = getStageProgress(layer, lp?.coursesCompleted ?? [])
          const isCurrent = layer.id === currentLayerId
          const status = getLayerStatus(layer, layerProgressMap)
          return (
            <Link
              key={layer.id}
              href={`/layers/${layer.id}`}
              className={`layer-row-card ${isCurrent ? "current" : ""}`}
            >
              <div className="layer-row-num">{layer.id}</div>
              <div className="layer-row-info">
                <div className="layer-row-title">{layer.title}</div>
                <div className="layer-row-desc">{layer.description}</div>
                <div className="layer-row-progress">
                  <SegmentedBar
                    label="Core items by stage"
                    segments={stages.map((st) => ({ key: st.stage, label: STAGE_LABEL[st.stage], done: st.done, total: st.required, tone: st.stage }))}
                  />
                </div>
                {getLayerHours(layer).required > 0 && (
                  <div className="layer-row-hours">
                    ~{getLayerHours(layer).required}h core · weeks {layer.weeks}
                  </div>
                )}
              </div>
              <div className="layer-row-meta">
                <span className={`layer-row-badge ${status}`}>
                  {status.replace("-", " ")}
                </span>
                {isCurrent && (
                  <span className="layer-row-badge current-badge">
                    Current
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
