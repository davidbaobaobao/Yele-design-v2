import type { Metadata } from 'next'
import HomePage from '@/components/HomePage'

export const metadata: Metadata = {
  title: 'Custom website design from $699 | Yele',
  description:
    'Custom website design for small businesses — no templates, delivery under 4 weeks, from $699. Then Yele Care from $49/month keeps it hosted, updated and redesigned every year. Pay 50% to start, 50% at launch.',
  alternates: {
    canonical: 'https://yele.design',
    languages: { 'x-default': 'https://yele.design' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yele.design',
    siteName: 'Yele',
    title: 'Custom website design from $699 | Yele',
    description:
      'Custom website design from $699. Delivery under 4 weeks, then Yele Care from $49/month. No templates, no agency prices.',
  },
}

export default function Home() {
  return <HomePage />
}
