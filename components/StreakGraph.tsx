"use client"

import { useMemo } from "react"
import { Flame } from "lucide-react"
import { addDays, parseDateKey } from "@/lib/loader"
import { useLocalToday } from "./useLocalToday"
import type { ActivityDay } from "@/types"

const WEEKS = 26
const DAYS  = 7

// Cells use local day keys (toISOString() would key them by UTC, a day early east of UTC), and the
// grid is built only in the browser, where "today" is the learner's day (null while server-rendering).
function buildGrid(activityMap: Record<string, ActivityDay>, today: string | null) {
  if (!today) return []
  const back = WEEKS * DAYS - 1
  const first = addDays(today, -back)
  const start = addDays(first, -parseDateKey(first).getDay()) // align Sunday

  return Array.from({ length: WEEKS }, (_, w) =>
    Array.from({ length: DAYS }, (_, d) => {
      const key = addDays(start, w * 7 + d)
      const e = activityMap[key] || {}
      return {
        date: key,
        total: e.total || 0,
        types: { view: e.view || 0, notes: e.notes || 0, code: e.code || 0, complete: e.complete || 0 },
        isFuture: key > today,
        isToday: key === today,
      }
    })
  )
}

// Heatmap ramp tokens (DS-03), per theme in app/globals.css.
function cellColor(total: number) {
  if (total === 0) return "var(--heat-0)"
  if (total <= 2)  return "var(--heat-1)"
  if (total <= 5)  return "var(--heat-2)"
  if (total <= 9)  return "var(--heat-3)"
  return "var(--heat-4)"
}

function tooltip(cell: ReturnType<typeof buildGrid>[0][0]) {
  if (cell.isFuture || cell.total === 0) return cell.date
  const { view, notes, code, complete } = cell.types
  const parts = [`${cell.date} — ${cell.total} action${cell.total !== 1 ? "s" : ""}`]
  if (view)     parts.push(`${view} view${view !== 1 ? "s" : ""}`)
  if (notes)    parts.push(`${notes} note save${notes !== 1 ? "s" : ""}`)
  if (code)     parts.push(`${code} code save${code !== 1 ? "s" : ""}`)
  if (complete) parts.push(`${complete} course${complete !== 1 ? "s" : ""} completed`)
  return parts.join(" · ")
}

interface Props { activityMap: Record<string, ActivityDay> }

export default function StreakGraph({ activityMap }: Props) {
  const today       = useLocalToday()
  const columns     = useMemo(() => buildGrid(activityMap, today), [activityMap, today])
  const monthLabels = useMemo(() => {
    const labels: { col: number; label: string }[] = []
    let last: number | null = null
    columns.forEach((col, i) => {
      const m = parseDateKey(col[0].date).getMonth()
      if (m === last) return
      last = m
      // A label is wider than one 16px column, so skip one that would touch the previous label.
      const prev = labels[labels.length - 1]
      if (prev && i - prev.col < 2) return
      labels.push({ col: i, label: parseDateKey(col[0].date).toLocaleString("default", { month: "short" }) })
    })
    return labels
  }, [columns])

  const totalDays = useMemo(() => Object.values(activityMap).filter((v) => v.total > 0).length, [activityMap])

  const streak = useMemo(() => {
    if (!today) return null
    let count = 0
    while (activityMap[addDays(today, -count)]?.total) count++
    return count
  }, [activityMap, today])

  return (
    <div className="streak-card">
      <div className="streak-header">
        <div className="streak-title"><Flame size={16} /> Study Activity</div>
        <div className="streak-stats">
          <span className="streak-badge"><Flame size={12} /> {streak ?? "–"} day streak</span>
          <span className="streak-total">{totalDays} active days</span>
        </div>
      </div>
      <div className="streak-graph-wrapper">
        <div className="streak-days-labels">
          {["Su","Mo","Tu","We","Th","Fr","Sa"].map((d, i) => (
            <span key={d} style={{ visibility: i % 2 === 0 ? "visible" : "hidden" }}>{d}</span>
          ))}
        </div>
        <div className="streak-graph-scroll">
          <div className="streak-months">
            {monthLabels.map(({ col, label }) => (
              <span key={label + col} style={{ position: "absolute", left: col * 16 }}>{label}</span>
            ))}
          </div>
          <div className="streak-grid">
            {columns.map((col, wi) => (
              <div key={wi} className="streak-col">
                {col.map((cell) => (
                  <div
                    key={cell.date}
                    className={`streak-cell${cell.isToday ? " today" : ""}`}
                    style={{
                      background: cell.isFuture ? "transparent" : cellColor(cell.total),
                      border: cell.isToday ? "1px solid var(--text-primary)" : "1px solid transparent",
                    }}
                    title={tooltip(cell)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="streak-legend">
        <span>Less</span>
        {[0,2,4,7,10].map((n) => (
          <div key={n} className="streak-cell" style={{ background: cellColor(n), border: "1px solid transparent" }} />
        ))}
        <span>More</span>
        <span className="streak-legend-types">view · notes · code · complete</span>
      </div>
    </div>
  )
}
