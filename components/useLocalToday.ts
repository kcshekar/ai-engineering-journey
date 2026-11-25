"use client"

import { useSyncExternalStore } from "react"
import { localDateKey } from "@/lib/loader"

const subscribe = () => () => {}
const today = () => localDateKey()
const onServer = () => null

/**
 * The learner's local "YYYY-MM-DD", or null while server-rendering. The server's day is UTC and can
 * differ from the learner's, so anything that depends on "today" renders after hydration instead.
 */
export function useLocalToday(): string | null {
  return useSyncExternalStore(subscribe, today, onServer)
}
