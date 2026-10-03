import type { Metadata } from 'next'
import TuTiendaLanding from '@/components/tutienda/TuTiendaLanding'
import { getTuTienda } from '@/lib/i18n/tutienda'

// Ecommerce Meta-ads landing (English). Meta Pixel is site-wide (root layout).
// noindex — ad destination.
const t = getTuTienda('en')

export const metadata: Metadata = {
  title: t.meta.title,
  description: t.meta.description,
  alternates: { canonical: 'https://yele.design/tutienda' },
  robots: { index: false, follow: true },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yele.design/tutienda',
    siteName: 'Yele',
    title: t.meta.title,
    description: t.meta.description,
  },
}

export default function TuTiendaEnPage() {
  return <TuTiendaLanding locale="en" />
}
