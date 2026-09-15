import type { Metadata } from 'next'
import WebPoliceClient from '@/app/webpolice/WebPoliceClient'
import { webPoliceJsonLd } from '@/lib/i18n/webpolice'

const OG_TITLE = '我的网站丑吗？'
const OG_DESC = '粘贴你的网站，网页警察来评判它是否丑陋、普通，或是用 ChatGPT 十分钟做出来的 —— 给出百分制的设计评分。'
const OG_IMG = 'https://yele.design/media/webpolice/og.jpg'

export const metadata: Metadata = {
  title: '我的网站丑吗？全面且精准的网站设计分析',
  description: OG_DESC,
  alternates: {
    canonical: 'https://yele.design/zh/webpolice',
    languages: { en: 'https://yele.design/webpolice', es: 'https://yele.design/es/webpolice', zh: 'https://yele.design/zh/webpolice' },
  },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://yele.design/zh/webpolice',
    siteName: 'Yele',
    title: OG_TITLE,
    description: OG_DESC,
    images: [{ url: OG_IMG, width: 1200, height: 630, alt: OG_TITLE }],
  },
  twitter: { card: 'summary_large_image', title: OG_TITLE, description: OG_DESC, images: [OG_IMG] },
}

export default function WebPoliceZhPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPoliceJsonLd('zh', 'https://yele.design/zh/webpolice', 'Web Police — 网站设计检查器')) }}
      />
      <WebPoliceClient locale="zh" />
    </>
  )
}
