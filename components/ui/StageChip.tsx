import type { Stage } from "@/types"

export type ChipTone = Stage | "project" | "neutral"

interface Props {
  tone?: ChipTone
  className?: string
  children: React.ReactNode
}

// A stage label: colour from the --stage-* tokens, always with its text (never colour alone).
export default function StageChip({ tone = "neutral", className, children }: Props) {
  return <span className={`stage-pill stage-pill-${tone}${className ? ` ${className}` : ""}`}>{children}</span>
}
