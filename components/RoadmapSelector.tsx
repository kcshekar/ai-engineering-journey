import type { RoadmapMeta } from "@/types"

export default function RoadmapSelector({ meta }: { meta: RoadmapMeta }) {
  return (
    <div className="roadmap-selector">
      <span>roadmap://</span>
      <select defaultValue={meta.id} aria-label="Select roadmap">
        <option value={meta.id}>{meta.title}</option>
      </select>
    </div>
  )
}
