import type { Metadata } from 'next'
import LetsBuildLanding from '@/components/letsbuild/LetsBuildLanding'

// Meta-ads landing: same page as /zh/letsbuild but with a lead form in the
// hero (instead of the cubes) and 价格 / 作品 CTAs. Meta Pixel is site-wide
// (root layout), so tracking is identical. noindex — it's an ad destination.
export const metadata: Metadata = {
  title: '€699 起打造你的定制网站 | Yele',
  description:
    '定制设计与图像，4 周内交付，一切由我们的团队负责。网站 €699 起 + Yele Care €29/月起。50% 起步，上线时再付 50%。',
  alternates: { canonical: 'https://yele.design/zh/letsbuild' },
  robots: { index: false, follow: true },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://yele.design/zh/letsbuildnow',
    siteName: 'Yele',
    title: '€699 起打造你的定制网站 | Yele',
    description: '定制设计。4 周内交付。€699 起 + Yele Care €29/月起。',
  },
}

export default function LetsBuildNowZhPage() {
  return (
    <LetsBuildLanding
      leadSource="Let's Build Now (ZH)"
      locale="zh"
      trackPage="letsbuildnow"
      heroForm
    />
  )
}
