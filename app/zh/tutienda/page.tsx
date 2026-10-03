import type { Metadata } from 'next'
import TuTiendaLanding from '@/components/tutienda/TuTiendaLanding'
import { getTuTienda } from '@/lib/i18n/tutienda'

// Ecommerce Meta-ads landing (Chinese). Meta Pixel is site-wide (root layout).
// noindex — ad destination.
const t = getTuTienda('zh')

export const metadata: Metadata = {
  title: t.meta.title,
  description: t.meta.description,
  alternates: { canonical: 'https://yele.design/zh/tutienda' },
  robots: { index: false, follow: true },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://yele.design/zh/tutienda',
    siteName: 'Yele',
    title: t.meta.title,
    description: t.meta.description,
  },
}

export default function TuTiendaZhPage() {
  return <TuTiendaLanding locale="zh" />
}
