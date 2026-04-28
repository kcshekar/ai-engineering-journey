import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { progress } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { Layers } from "lucide-react"
import ProgressBar from "@/components/ProgressBar"
import layersData from "@/data/roadmaps/ai-engineering/layers.json"
import metaData from "@/data/roadmaps/ai-engineering/meta.json"
import type { LayerProgressEntry } from "@/types"

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

  const layers = layersData.layers
  const currentLayerId = metaData.currentLayer

  return (
    <div className="layers-overview">
      <div className="section-title"><Layers /> All Layers</div>
      <div className="layers-grid">
        {layers.map((layer) => {
          const lp = layerProgressMap[String(layer.id)]
          const completed = lp?.coursesCompleted.length ?? 0
          const isCurrent = layer.id === currentLayerId
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
                <div style={{ marginTop: 10, maxWidth: 240 }}>
                  <ProgressBar label="Courses" value={completed} max={layer.courses.length} />
                </div>
              </div>
              <div className="layer-row-meta">
                <span className={`layer-row-badge ${layer.status.replace("-", "-")}`}>
                  {layer.status.replace("-", " ")}
                </span>
                {isCurrent && (
                  <span className="layer-row-badge in-progress" style={{ background: "var(--accent-dim)", color: "var(--accent)" }}>
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
