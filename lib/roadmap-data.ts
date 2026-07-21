import fs from "node:fs"
import path from "node:path"
import type { Layer } from "@/types"

export function getRoadmapLayers(roadmapId: string): Layer[] {
  const baseDir = path.join(process.cwd(), "data", "roadmaps", roadmapId)
  const layerDirs = fs
    .readdirSync(baseDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("layer-"))

  const layers = layerDirs.map((entry) => {
    const dir = path.join(baseDir, entry.name)
    const layer = JSON.parse(fs.readFileSync(path.join(dir, "layer.json"), "utf8"))
    const planning = JSON.parse(fs.readFileSync(path.join(dir, "planning.json"), "utf8"))
    return { ...layer, weeklyPlan: planning.weeklyPlan } as Layer
  })

  return layers.sort((a, b) => a.id - b.id)
}
