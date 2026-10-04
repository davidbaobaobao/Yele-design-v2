import type { Metadata } from 'next'

// Plan-selection funnel step — not a content page, keep out of the index.
export const metadata: Metadata = { robots: { index: false, follow: true } }

export default function ElegirPlanLayout({ children }: { children: React.ReactNode }) {
  return children
}
