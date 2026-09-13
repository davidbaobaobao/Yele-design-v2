import type { Metadata } from 'next'
import LetsBuildLanding from '@/components/letsbuild/LetsBuildLanding'

export const metadata: Metadata = {
  title: 'Consigue una web a medida desde 699€ | Yele',
  description:
    'Diseño e imágenes a medida, entrega en menos de 4 semanas, nuestra agencia se encarga de todo. Webs desde 699€ + Yele Care desde 29€/mes. 50% para empezar, 50% al lanzar.',
  alternates: { canonical: 'https://yele.design/es/letsbuild' },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://yele.design/es/letsbuild',
    siteName: 'Yele',
    title: 'Consigue una web a medida desde 699€ | Yele',
    description: 'Diseño a medida. Entrega en menos de 4 semanas. Desde 699€ + Yele Care desde 29€/mes.',
  },
}

export default function LetsBuildEsPage() {
  return <LetsBuildLanding leadSource="Let's Build (ES)" locale="es" />
}
