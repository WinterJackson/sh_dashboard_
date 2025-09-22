import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <h2>Chats Not Found</h2>
      <p>Could not find any messages</p>
      <Link href="/dashboard/messaging">Return to Messaging</Link>
    </div>
  )
}
