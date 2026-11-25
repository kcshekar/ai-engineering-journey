import { Book, BookMarked, CirclePlay, FolderGit2, GraduationCap, Hammer, Newspaper, type LucideIcon } from "lucide-react"
import type { ItemKind } from "@/types"

const ICON: Record<ItemKind, LucideIcon> = {
  course: GraduationCap, video: CirclePlay, article: Newspaper, docs: BookMarked,
  book: Book, repo: FolderGit2, project: Hammer,
}

interface Props {
  kind: ItemKind
  size?: number
}

export default function KindIcon({ kind, size = 14 }: Props) {
  const Icon = ICON[kind] ?? GraduationCap
  return (
    <span className={`kind-icon kind-${kind}`} role="img" aria-label={kind} title={kind}>
      <Icon size={size} aria-hidden="true" />
    </span>
  )
}
