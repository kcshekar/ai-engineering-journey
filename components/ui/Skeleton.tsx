interface Props {
  variant?: "title" | "block" | "line"
}

// A placeholder shape; the pulse is off under reduced motion (app/globals.css).
export default function Skeleton({ variant = "block" }: Props) {
  return <div className={`skeleton skeleton-${variant}`} aria-hidden="true" />
}
