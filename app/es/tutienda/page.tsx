import type { Metadata } from 'next'
import TuTiendaLanding from '@/components/tutienda/TuTiendaLanding'

// Ecommerce Meta-ads landing (Spanish only). Meta Pixel is site-wide (root
// layout), so tracking is identical to the other funnel pages. noindex — ad
// destination, not organic.
export const metadata: Metadata = {
  title: 'Crea tu tienda online a medida desde 1.199€ | Yele',
  description:
    'Una tienda online diseñada a medida, optimizada para vender y con comisiones hasta un 60% más bajas que Shopify. Fotos y vídeos de tus productos incluidos. Desde 1.199€ + Yele Care desde 29€/mes.',
  alternates: { canonical: 'https://yele.design/es/tutienda' },
  robots: { index: false, follow: true },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://yele.design/es/tutienda',
    siteName: 'Yele',
    title: 'Crea tu tienda online a medida desde 1.199€ | Yele',
    description: 'Tienda online a medida, optimizada para vender, con comisiones mucho más bajas que Shopify. Desde 1.199€.',
  },
}

export default function TuTiendaEsPage() {
  return <TuTiendaLanding />
}
