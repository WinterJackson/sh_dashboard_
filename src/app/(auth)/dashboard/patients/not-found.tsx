import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <h2>Patient Not Found</h2>
      <p>Could not find the requested patient</p>
      <Link href="/dashboard/patients">Return to Patients</Link>
    </div>
  )
}
