// src/app/(auth)/dashboard/appointments/[appointmentId]/not-found.tsx

import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <h2>Appointment Not Found</h2>
      <p>Could not find the requested appointment</p>
      <Link href="/dashboard/appointments">Return to Appointments</Link>
    </div>
  )
}
