import type { Metadata } from 'next'
import WebPoliceClient from '@/app/webpolice/WebPoliceClient'

const OG_TITLE = '¿MI WEB ES FEA?'
const OG_DESC = 'Pega tu web y la Policía Web juzga si es fea, genérica o hecha con ChatGPT en 10 minutos — una puntuación de diseño sobre 100.'
const OG_IMG = 'https://yele.design/media/webpolice/og.jpg'

export const metadata: Metadata = {
  title: '¿Mi web es fea? Análisis de diseño web completo y preciso',
  description: OG_DESC,
  alternates: { canonical: 'https://yele.design/es/webpolice' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://yele.design/es/webpolice',
    siteName: 'Yele',
    title: OG_TITLE,
    description: OG_DESC,
    images: [{ url: OG_IMG, width: 1200, height: 630, alt: OG_TITLE }],
  },
  twitter: { card: 'summary_large_image', title: OG_TITLE, description: OG_DESC, images: [OG_IMG] },
}

export default function WebPoliceEsPage() {
  return <WebPoliceClient locale="es" />
}
