import type { Stage } from "@/types"

export interface Segment {
  key: string
  label: string
  done: number
  total: number
  tone: Stage | "project"
}

interface Props {
  label: string
  segments: Segment[]
}

// One bar split by stage, each part filled to its own share. Colour is never the only cue: the legend names
// every part, and screen readers get the same text.
export default function SegmentedBar({ label, segments }: Props) {
  const shown = segments.filter((s) => s.total > 0)
  const done = shown.reduce((n, s) => n + s.done, 0)
  const total = shown.reduce((n, s) => n + s.total, 0)
  const summary = shown.map((s) => `${s.label} ${s.done} of ${s.total}`).join(", ")

  return (
    <div className="segbar">
      {/* The track's label already says all of this, so screen readers skip the visible head and legend. */}
      <div className="segbar-head" aria-hidden="true">
        <span className="segbar-label">{label}</span>
        <span className="segbar-value">{done}/{total}</span>
      </div>
      <div className="segbar-track" role="img" aria-label={`${label}: ${summary}`}>
        {shown.map((s) => (
          <div key={s.key} className={`segbar-seg tone-${s.tone}`} style={{ flexGrow: s.total }}>
            <div className="segbar-fill" style={{ transform: `scaleX(${s.done / s.total})` }} />
          </div>
        ))}
      </div>
      <div className="segbar-legend" aria-hidden="true">
        {shown.map((s) => (
          <span key={s.key} className={`segbar-key tone-${s.tone}`}>
            {s.label} {s.done}/{s.total}
          </span>
        ))}
      </div>
    </div>
  )
}
