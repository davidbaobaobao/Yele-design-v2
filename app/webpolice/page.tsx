import type { Metadata } from 'next'
import WebPoliceClient from './WebPoliceClient'
import { webPoliceJsonLd } from '@/lib/i18n/webpolice'

const OG_TITLE = 'IS MY WEBSITE UGLY?'
const OG_DESC = 'Paste your website and the Web Police judge if it’s ugly, generic, or made by ChatGPT in 10 minutes — a comprehensive design score out of 100.'
const OG_IMG = 'https://yele.design/media/webpolice/og.jpg'

export const metadata: Metadata = {
  title: 'Is my website ugly? Comprehensive & accurate website design analysis',
  description: OG_DESC,
  alternates: {
    canonical: 'https://yele.design/webpolice',
    languages: { en: 'https://yele.design/webpolice', es: 'https://yele.design/es/webpolice', zh: 'https://yele.design/zh/webpolice' },
  },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    url: 'https://yele.design/webpolice',
    siteName: 'Yele',
    title: OG_TITLE,
    description: OG_DESC,
    images: [{ url: OG_IMG, width: 1200, height: 630, alt: OG_TITLE }],
  },
  twitter: { card: 'summary_large_image', title: OG_TITLE, description: OG_DESC, images: [OG_IMG] },
}

export default function WebPolicePage({ searchParams }: { searchParams?: { mode?: string } }) {
  const mode = searchParams?.mode === 'fun' ? 'fun' : 'serious'
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPoliceJsonLd('en', 'https://yele.design/webpolice', 'Web Police — Website design checker')) }}
      />
      <WebPoliceClient locale="en" mode={mode} />
    </>
  )
}
