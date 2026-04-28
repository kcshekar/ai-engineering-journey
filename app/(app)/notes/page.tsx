import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { FileText, ExternalLink } from "lucide-react"
import layersData from "@/data/roadmaps/ai-engineering/layers.json"

export default async function NotesPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  return (
    <div>
      <div className="section-title"><FileText /> Notes</div>
      <div className="notes-grid">
        {(layersData.layers as any[]).map((layer) => (
          <a
            key={layer.id}
            href={`https://github.com/kcshekar/ai-engineering-journey/tree/main/notes/layer-${layer.id}`}
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
