import fs from "node:fs"
import path from "node:path"

export interface LayerNote {
  layerId: number
  title: string
  description: string
  content: string
  wordCount: number
}

export function getLayerNotes(roadmapId: string): LayerNote[] {
  const baseDir = path.join(process.cwd(), "data", "roadmaps", roadmapId)
  const layerDirs = fs
    .readdirSync(baseDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("layer-"))

  const notes = layerDirs.map((entry) => {
    const dir = path.join(baseDir, entry.name)
    const layer = JSON.parse(fs.readFileSync(path.join(dir, "layer.json"), "utf8"))
    const notesPath = path.join(dir, "notes.md")
    const content = fs.existsSync(notesPath) ? fs.readFileSync(notesPath, "utf8") : ""
    return {
      layerId: layer.id as number,
      title: layer.title as string,
      description: layer.description as string,
      content,
      wordCount: content.split(/\s+/).filter(Boolean).length,
    }
  })

  return notes.sort((a, b) => a.layerId - b.layerId)
}

export function getLayerNote(roadmapId: string, layerId: number): LayerNote | undefined {
  return getLayerNotes(roadmapId).find((note) => note.layerId === layerId)
}
