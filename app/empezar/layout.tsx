import type { Metadata } from 'next'

// Account-creation funnel step — not a content page, keep out of the index.
export const metadata: Metadata = { robots: { index: false, follow: true } }

export default function EmpezarLayout({ children }: { children: React.ReactNode }) {
  return children
}
