import type { Metadata } from 'next'

// Post-signup welcome — user-specific, keep out of the index.
export const metadata: Metadata = { robots: { index: false, follow: true } }

export default function BienvenidoLayout({ children }: { children: React.ReactNode }) {
  return children
}
