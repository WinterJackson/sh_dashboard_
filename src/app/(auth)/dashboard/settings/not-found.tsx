import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <h2>Page Not Found</h2>
      <p>Could not find the requested page</p>
      <Link href="/dashboard">Return to dashboard</Link>
    </div>
  )
}
