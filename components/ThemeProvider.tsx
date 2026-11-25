"use client"

import { createContext, useContext, useEffect, useCallback, useSyncExternalStore } from "react"

type ThemeMode = "dark" | "light" | "system"

interface ThemeContextValue {
  mode: ThemeMode
  resolved: "dark" | "light"
  setMode: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = "theme"

export const THEME_INIT_SCRIPT = `
(function() {
  try {
    var stored = localStorage.getItem('${STORAGE_KEY}') || 'system';
    var resolved = stored === 'system'
      ? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
      : stored;
    document.documentElement.setAttribute('data-theme', resolved);
  } catch (e) {}
})();
`

// The saved mode lives in localStorage and "system" follows the OS setting; both are read as
// external stores, so the server renders the defaults and the browser switches without an effect.
const modeListeners = new Set<() => void>()
let memoryMode: ThemeMode = "system" // used when localStorage is blocked
const LIGHT_QUERY = "(prefers-color-scheme: light)"

function subscribeMode(onChange: () => void) {
  modeListeners.add(onChange)
  window.addEventListener("storage", onChange)
  return () => { modeListeners.delete(onChange); window.removeEventListener("storage", onChange) }
}

function readMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === "dark" || stored === "light" ? stored : "system"
  } catch {
    return memoryMode
  }
}

function subscribeSystem(onChange: () => void) {
  const mq = window.matchMedia(LIGHT_QUERY)
  mq.addEventListener("change", onChange)
  return () => mq.removeEventListener("change", onChange)
}

const readSystemLight = () => window.matchMedia(LIGHT_QUERY).matches

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mode = useSyncExternalStore(subscribeMode, readMode, () => "system" as ThemeMode)
  const systemLight = useSyncExternalStore(subscribeSystem, readSystemLight, () => false)
  const resolved: "dark" | "light" = mode === "system" ? (systemLight ? "light" : "dark") : mode

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", resolved)
  }, [resolved])

  const setMode = useCallback((next: ThemeMode) => {
    memoryMode = next
    try { localStorage.setItem(STORAGE_KEY, next) } catch {}
    modeListeners.forEach((notify) => notify())
  }, [])

  return (
    <ThemeContext.Provider value={{ mode, resolved, setMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}
