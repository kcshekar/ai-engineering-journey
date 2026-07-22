import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { FileText, ArrowRight } from "lucide-react"
import { getLayerNotes } from "@/lib/notes-data"

export default async function NotesPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const notes = getLayerNotes("ai-engineering")

  return (
    <div>
      <div className="section-title"><FileText /> Notes</div>
      <div className="notes-grid">
        {notes.map((note) => (
          <Link key={note.layerId} href={`/notes/${note.layerId}`} className="note-card">
            <div className="card-icon cyan"><FileText /></div>
            <div className="card-name">Layer {note.layerId}: {note.title}</div>
            <div className="card-desc">{note.description}</div>
            <div className="card-link">
              {note.wordCount > 0 ? `${note.wordCount.toLocaleString()} words` : "Empty"} · Read notes <ArrowRight />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
