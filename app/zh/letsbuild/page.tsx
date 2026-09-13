import type { Metadata } from 'next'
import LetsBuildLanding from '@/components/letsbuild/LetsBuildLanding'

export const metadata: Metadata = {
  title: '€699 起打造你的定制网站 | Yele',
  description:
    '定制设计与图像，4 周内交付，一切由我们的团队负责。网站 €699 起 + Yele Care €29/月起。50% 起步，上线时再付 50%。',
  alternates: { canonical: 'https://yele.design/zh/letsbuild' },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://yele.design/zh/letsbuild',
    siteName: 'Yele',
    title: '€699 起打造你的定制网站 | Yele',
    description: '定制设计。4 周内交付。€699 起 + Yele Care €29/月起。',
  },
}

export default function LetsBuildZhPage() {
  return <LetsBuildLanding leadSource="Let's Build (ZH)" locale="zh" />
}
