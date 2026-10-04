import type { Metadata } from 'next'
import ScheduleClient from './ScheduleClient'

export const metadata: Metadata = {
  title: 'Schedule a meeting',
  // Thin booking page — keep out of the index, let link equity flow.
  robots: { index: false, follow: true },
}

export default function SchedulePage() {
  return <ScheduleClient />
}
