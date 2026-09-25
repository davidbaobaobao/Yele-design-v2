import ReceivedContent from '@/components/received/ReceivedContent'

export const metadata = {
  title: 'Welcome — Yele',
  robots: { index: false, follow: false },
}

// Same as /received but without the booking calendar — only payments + instructions.
export default function Received2Page({
  searchParams,
}: {
  searchParams: { name?: string; email?: string; company?: string; plan?: string }
}) {
  return <ReceivedContent locale="en" searchParams={searchParams} hideCalendar />
}
