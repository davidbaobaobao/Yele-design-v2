import type { Metadata } from 'next'
import WebPoliceClient from './WebPoliceClient'

const OG_TITLE = 'IS MY WEBSITE UGLY?'
const OG_DESC = 'Paste your website. The Web Police judge if it’s ugly, generic, or made by ChatGPT in 10 minutes. Get a score out of 100.'

export const metadata: Metadata = {
  title: 'Is my website ugly? — Web Police',
  description: OG_DESC,
  alternates: { canonical: 'https://yele.design/webpolice' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    url: 'https://yele.design/webpolice',
    siteName: 'Yele',
    title: OG_TITLE,
    description: OG_DESC,
  },
  twitter: {
    card: 'summary_large_image',
    title: OG_TITLE,
    description: OG_DESC,
  },
}

export default function WebPolicePage() {
  return <WebPoliceClient />
}
