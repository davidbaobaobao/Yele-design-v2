import type { Metadata } from 'next'
import LetsBuildLanding from '@/components/letsbuild/LetsBuildLanding'

// Meta-ads landing: same page as /es/letsbuild but with a lead form in the
// hero (instead of the cubes) and Precios / Proyectos CTAs. Meta Pixel is
// site-wide (root layout), so tracking is identical. noindex — it's an ad
// destination, not organic, and would otherwise duplicate /es/letsbuild.
export const metadata: Metadata = {
  title: 'Consigue una web a medida desde 699€ | Yele',
  description:
    'Diseño e imágenes a medida, entrega en menos de 4 semanas, nuestra agencia se encarga de todo. Webs desde 699€ + Yele Care desde 29€/mes. 50% para empezar, 50% al lanzar.',
  alternates: { canonical: 'https://yele.design/es/letsbuild' },
  robots: { index: false, follow: true },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://yele.design/es/letsbuildnow',
    siteName: 'Yele',
    title: 'Consigue una web a medida desde 699€ | Yele',
    description: 'Diseño a medida. Entrega en menos de 4 semanas. Desde 699€ + Yele Care desde 29€/mes.',
  },
}

export default function LetsBuildNowEsPage() {
  return (
    <LetsBuildLanding
      leadSource="Let's Build Now (ES)"
      locale="es"
      trackPage="letsbuildnow"
      heroForm
      heroTitle={'Una web de la que presumir.\nA un precio que no asusta.'}
    />
  )
}
