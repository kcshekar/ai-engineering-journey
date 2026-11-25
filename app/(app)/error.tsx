"use client" // Error boundaries must be Client Components

import Link from "next/link"

// Next 16: error boundaries get retry() (stable since 16.3) to re-fetch and re-render the page.
export default function ErrorPage({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div className="route-state" role="alert">
      <h1>This page didn&apos;t load</h1>
      <p>The data behind it could not be read, often because the connection or the database dropped for a moment. Your saved progress is not affected.</p>
      <div className="route-state-actions">
        <button type="button" className="route-state-btn" onClick={() => retry()}>Try again</button>
        <Link href="/" className="route-state-btn">Go to the dashboard</Link>
      </div>
    </div>
  )
}
