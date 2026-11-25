import Link from "next/link"

export const metadata = { title: "Not found" }

export default function NotFound() {
  return (
    <main className="main">
      <div className="route-state">
        <h1>Nothing here</h1>
        <p>That layer or page doesn&apos;t exist. The roadmap has the layers that do.</p>
        <div className="route-state-actions">
          <Link href="/layers" className="route-state-btn">See all layers</Link>
          <Link href="/" className="route-state-btn">Go to the dashboard</Link>
        </div>
      </div>
    </main>
  )
}
