import type { Metadata } from 'next'
import HomePage from '@/components/HomePage'

// Google Ads landing page — pixel-identical to / (see components/HomePage),
// kept as a separate route so ad campaigns can target /agency directly.
// noindexed + canonical back to / so Google treats it as the same content,
// not a duplicate.
export const metadata: Metadata = {
  title: 'Professional website design from $99/mo',
  description:
    'Professional website design for SMBs and freelancers. Live in 1 week, maintenance included, from $99/mo. No setup fee, no commitment.',
  alternates: {
    canonical: 'https://yele.design',
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yele.design',
    siteName: 'Yele',
    title: 'Professional website design from $99/mo | Yele',
    description:
      'Professional website design for SMBs and freelancers. Live in 1 week, from $99/mo. No setup fee.',
  },
}

export default function Agency() {
  return <HomePage />
}
