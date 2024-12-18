import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <h2>Hospital Not Found</h2>
      <p>Could not find the requested hospital</p>
      <Link href="/dashboard/hospitals">Return to Hospitals</Link>
    </div>
  )
}
