import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { ArrowLeft, FileText } from "lucide-react"
import { getLayerNote } from "@/lib/notes-data"
import MarkdownView from "@/components/MarkdownView"
import EmptyState from "@/components/ui/EmptyState"

interface Props { params: Promise<{ layerId: string }> }

export async function generateMetadata({ params }: Props) {
  const { layerId } = await params
  return { title: `Notes: layer ${parseInt(layerId) || "?"}` }
}

export default async function NoteDetailPage({ params }: Props) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const { layerId } = await params
  const note = getLayerNote("ai-engineering", parseInt(layerId))
  if (!note) notFound()

  return (
    <div className="note-detail">
      <Link href="/notes" className="note-detail-back">
        <ArrowLeft size={14} /> Back to Notes
      </Link>
      <div className="note-detail-header">
        <div className="card-icon cyan"><FileText /></div>
        <div>
          <div className="note-detail-eyebrow">Layer {note.layerId}</div>
          <h1 className="note-detail-title">{note.title}</h1>
        </div>
      </div>
      {note.content ? (
        <MarkdownView content={note.content} />
      ) : (
        <EmptyState icon="📝" title="No notes yet">This layer doesn&apos;t have any notes written yet.</EmptyState>
      )}
    </div>
  )
}
