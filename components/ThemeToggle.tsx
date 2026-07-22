"use client"

import { Sun, Moon, Monitor } from "lucide-react"
import { useTheme } from "@/components/ThemeProvider"

const options = [
  { mode: "light" as const, icon: Sun, label: "Light theme" },
  { mode: "system" as const, icon: Monitor, label: "System theme" },
  { mode: "dark" as const, icon: Moon, label: "Dark theme" },
]

export default function ThemeToggle() {
  const { mode, setMode } = useTheme()

  return (
    <div className="theme-toggle" role="group" aria-label="Theme">
      {options.map(({ mode: optionMode, icon: Icon, label }) => (
        <button
          key={optionMode}
          type="button"
          className={`theme-toggle-btn ${mode === optionMode ? "active" : ""}`}
          onClick={() => setMode(optionMode)}
          title={label}
          aria-label={label}
          aria-pressed={mode === optionMode}
        >
          <Icon />
        </button>
      ))}
    </div>
  )
}
