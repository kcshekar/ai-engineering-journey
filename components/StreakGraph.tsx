"use client"

import { useMemo } from "react"
import { Flame } from "lucide-react"
import type { ActivityDay } from "@/types"

const WEEKS = 26
const DAYS  = 7

function dateStr(d: Date) { return d.toISOString().split("T")[0] }

function buildGrid(activityMap: Record<string, ActivityDay>) {
  const today = new Date(); today.setHours(0,0,0,0)
  const start = new Date(today)
  start.setDate(today.getDate() - WEEKS * DAYS + 1)
  start.setDate(start.getDate() - start.getDay()) // align Sunday

  return Array.from({ length: WEEKS }, (_, w) =>
    Array.from({ length: DAYS }, (_, d) => {
      const date = new Date(start)
      date.setDate(start.getDate() + w * 7 + d)
      const key = dateStr(date)
      const e = activityMap[key] || {}
      return {
        date: key,
        total: e.total || 0,
        types: { view: e.view || 0, notes: e.notes || 0, code: e.code || 0, complete: e.complete || 0 },
        isFuture: date > today,
        isToday: key === dateStr(today),
      }
    })
  )
}

function cellColor(total: number) {
  if (total === 0) return "var(--bg-elevated)"
  if (total <= 2)  return "rgba(34,197,94,0.3)"
  if (total <= 5)  return "rgba(34,197,94,0.55)"
  return "var(--accent)"
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
  const columns     = useMemo(() => buildGrid(activityMap), [activityMap])
  const monthLabels = useMemo(() => {
    const labels: { col: number; label: string }[] = []
    let last: number | null = null
    columns.forEach((col, i) => {
      const m = new Date(col[0].date).getMonth()
      if (m !== last) { labels.push({ col: i, label: new Date(col[0].date).toLocaleString("default", { month: "short" }) }); last = m }
    })
    return labels
  }, [columns])

  const totalDays = useMemo(() => Object.values(activityMap).filter((v) => v.total > 0).length, [activityMap])

  const streak = useMemo(() => {
    const today = new Date(); today.setHours(0,0,0,0)
    let count = 0; const d = new Date(today)
    while (activityMap[dateStr(d)]?.total) { count++; d.setDate(d.getDate() - 1) }
    return count
  }, [activityMap])

  return (
    <div className="streak-card">
      <div className="streak-header">
        <div className="streak-title"><Flame size={16} /> Study Activity</div>
        <div className="streak-stats">
          <span className="streak-badge"><Flame size={12} /> {streak} day streak</span>
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
                      border: cell.isToday ? "1px solid var(--accent)" : "1px solid transparent",
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
        {[0,2,4,6].map((n) => (
          <div key={n} className="streak-cell" style={{ background: cellColor(n), border: "1px solid transparent" }} />
        ))}
        <span>More</span>
        <span className="streak-legend-types">view · notes · code · complete</span>
      </div>
    </div>
  )
}
