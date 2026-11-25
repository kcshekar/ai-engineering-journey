// Shown while a page's server data (progress, activity) loads.
export default function Loading() {
  return (
    <div className="route-state" role="status" aria-label="Loading" style={{ maxWidth: "none", justifyItems: "stretch" }}>
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-block" />
      <div className="skeleton skeleton-block" />
    </div>
  )
}
