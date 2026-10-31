import type { Metadata } from 'next'
import localFont from 'next/font/local'
import SiguienteNivelLanding from '@/components/siguiente-nivel/SiguienteNivelLanding'

// Full-axis (weight + width) variable Archivo for the condensed
// (font-stretch: 82%) headlines. Self-hosted (app/fonts/archivo-condensed.woff2)
// rather than next/font/google so the build never depends on Google Fonts being
// reachable — same reason the site-wide fonts in app/layout.tsx are local.
const archivoCondensed = localFont({
  src: '../fonts/archivo-condensed.woff2',
  weight: '400 900',
  variable: '--font-sn-display',
  display: 'swap',
})

// Meta-ads landing (improved "Siguiente nivel" design). Meta Pixel is site-wide
// (root layout) so PageView fires automatically; the forms fire the Lead event
// via components/siguiente-nivel/leadSubmit.ts. noindex — ad destination, not
// organic.
export const metadata: Metadata = {
  title: 'Estás a un paso de subir al siguiente nivel | Yele',
  description:
    'Web nueva completa por 699€ + IVA: diseño singular, sin plantillas, optimizada para móvil y Google. Demo en 24 h, entrega en 7 días.',
  alternates: { canonical: 'https://yele.design/nuevoproyecto' },
  robots: { index: false, follow: true },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://yele.design/nuevoproyecto',
    siteName: 'Yele',
    title: 'Estás a un paso de subir al siguiente nivel | Yele',
    description: 'Web nueva completa por 699€ + IVA. Demo en 24 h, entrega en 7 días.',
    images: ['/media/siguiente-nivel/hero-desktop-poster.jpg'],
  },
}

export default function NuevoProyectoPage() {
  return (
    <div className={archivoCondensed.variable}>
      <SiguienteNivelLanding />
    </div>
  )
}
