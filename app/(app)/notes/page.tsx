import { BookOpen, ExternalLink } from "lucide-react"
import layersData from "@/data/roadmaps/ai-engineering/layers.json"

export default function NotesPage() {
  return (
    <div>
      <div className="section-title"><BookOpen /> Notes</div>
      <div className="notes-grid">
        {layersData.layers.map((layer) => (
          <a
            key={layer.id}
            className="note-card"
            href={`https://github.com/kcshekar/ai-engineering-journey/tree/main/notes/layer-${layer.id}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="card-icon green"><BookOpen /></div>
            <div className="card-name">Layer {layer.id}: {layer.title}</div>
            <div className="card-desc">{layer.description}</div>
            <div className="card-link">View notes on GitHub <ExternalLink /></div>
          </a>
        ))}
      </div>
    </div>
  )
}
