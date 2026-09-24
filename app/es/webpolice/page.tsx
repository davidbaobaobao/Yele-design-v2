import type { Metadata } from 'next'
import WebPoliceClient from '@/app/webpolice/WebPoliceClient'
import { webPoliceJsonLd } from '@/lib/i18n/webpolice'

const OG_TITLE = '¿MI WEB ES FEA?'
const OG_DESC = 'Pega tu web y la Policía Web juzga si es fea, genérica o hecha con ChatGPT en 10 minutos — una puntuación de diseño sobre 100.'
const OG_IMG = 'https://yele.design/media/webpolice/og.jpg'

export const metadata: Metadata = {
  title: '¿Mi web es fea? Análisis de diseño web completo y preciso',
  description: OG_DESC,
  alternates: {
    canonical: 'https://yele.design/es/webpolice',
    languages: { en: 'https://yele.design/webpolice', es: 'https://yele.design/es/webpolice', zh: 'https://yele.design/zh/webpolice' },
  },
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

export default function WebPoliceEsPage({ searchParams }: { searchParams?: { mode?: string } }) {
  const mode = searchParams?.mode === 'fun' ? 'fun' : 'serious'
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPoliceJsonLd('es', 'https://yele.design/es/webpolice', 'Web Police — Analizador de diseño web')) }}
      />
      <WebPoliceClient locale="es" mode={mode} />
    </>
  )
}
