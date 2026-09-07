import type { Metadata } from 'next'

// The survey is a private, transactional flow — keep it out of search results.
export const metadata: Metadata = {
  title: 'Design survey — Yele',
  robots: { index: false, follow: false },
}

export default function SurveyLayout({ children }: { children: React.ReactNode }) {
  return children
}
