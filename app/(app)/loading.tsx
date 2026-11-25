import Skeleton from "@/components/ui/Skeleton"

// Shown while a page's server data (progress, activity) loads.
export default function Loading() {
  return (
    <div className="route-state" role="status" aria-label="Loading" style={{ maxWidth: "none", justifyItems: "stretch" }}>
      <Skeleton variant="title" />
      <Skeleton />
      <Skeleton />
    </div>
  )
}
