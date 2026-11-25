// Motion rules (DS-05, docs/research/04-modern-ux.md §2): short, ease-out, transform and opacity only.
// <MotionConfig reducedMotion="user"> in components/Providers.tsx turns these off when the OS asks.
export const DURATION = { fast: 0.12, base: 0.2, slow: 0.32, ring: 0.7 } as const
export const EASE_OUT = [0.2, 0.8, 0.2, 1] as const
export const SPRING = { type: "spring", stiffness: 300, damping: 30 } as const

// Lists enter 30 ms apart, and the last item never waits more than 8 steps (240 ms), so long lists don't trickle in.
const STAGGER = 0.03
const STAGGER_CAP = 8
export const staggerDelay = (index: number) => Math.min(index, STAGGER_CAP) * STAGGER

export const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE_OUT } },
}
// Framer staggers children linearly with no cap, so a long list gets a smaller step instead.
export const staggerList = (count: number) => ({
  hidden: {},
  show: { transition: { staggerChildren: count > STAGGER_CAP + 1 ? (STAGGER * STAGGER_CAP) / (count - 1) : STAGGER } },
})
