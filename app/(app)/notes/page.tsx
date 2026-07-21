import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { FileText, ExternalLink } from "lucide-react"
import { getRoadmapLayers } from "@/lib/roadmap-data"

export default async function NotesPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const layers = getRoadmapLayers("ai-engineering")

  return (
    <div>
      <div className="section-title"><FileText /> Notes</div>
      <div className="notes-grid">
        {layers.map((layer) => (
          <a
            key={layer.id}
            href={`https://github.com/kcshekar/ai-engineering-journey/tree/main/data/roadmaps/ai-engineering/layer-${layer.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="note-card"
          >
            <div className="note-header">Layer {layer.id}: {layer.title}</div>
            <div className="note-desc">{layer.description}</div>
            <div className="note-link">View on GitHub <ExternalLink size={14} /></div>
          </a>
        ))}
      </div>
    </div>
  )
}
