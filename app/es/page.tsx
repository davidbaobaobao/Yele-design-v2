import type { Metadata } from 'next'
import HomePage from '@/components/HomePage'

export const metadata: Metadata = {
  title: 'Diseño web a medida desde 699€ | Yele',
  description:
    'Diseño web a medida para pequeños negocios — sin plantillas, entrega en menos de 4 semanas, desde 699€. Después, Yele Care desde 49€/mes lo mantiene alojado, actualizado y rediseñado cada año. Paga el 50% para empezar y el 50% al lanzar.',
  alternates: {
    canonical: 'https://yele.design/es',
    languages: {
      en: 'https://yele.design',
      es: 'https://yele.design/es',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://yele.design/es',
    siteName: 'Yele',
    title: 'Diseño web a medida desde 699€ | Yele',
    description:
      'Diseño web a medida desde 699€. Entrega en menos de 4 semanas, después Yele Care desde 49€/mes. Sin plantillas, sin precios de agencia.',
  },
}

export default function EsHome() {
  return <HomePage locale="es" />
}
