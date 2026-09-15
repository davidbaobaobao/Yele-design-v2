import type { Metadata } from 'next'
import WebPoliceClient from './WebPoliceClient'

export const metadata: Metadata = {
  title: 'Web Police — was your site made by a robot in 10 minutes?',
  description:
    'Paste a website URL and the Web Police run a background check: AI-builder & template detection, generic-font offenses, design slop, plus speed and mobile. Just for fun.',
  alternates: { canonical: 'https://yele.design/webpolice' },
  robots: { index: true, follow: true },
}

export default function WebPolicePage() {
  return <WebPoliceClient />
}
