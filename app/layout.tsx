import type { Metadata } from 'next'
import { Outfit, Manrope } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/context/LanguageContext'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import CookieBanner from '@/components/CookieBanner'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://yele.design'),

  title: {
    default: 'Yele — Tu web lista en 3 días | Diseño web por suscripción',
    template: '%s | Yele',
  },

  description:
    'Diseño web profesional para PYMEs y autónomos españoles. Entrega en 3–5 días, mantenimiento incluido, desde €29/mes. Sin pago inicial, sin permanencia.',

  keywords: [
    'diseño web pymes españa',
    'página web autónomos',
    'web profesional sin agencia',
    'diseño web suscripción mensual',
    'web para negocio local españa',
    'alternativa squarespace españa',
    'diseño web barcelona barato',
    'web profesional 29 euros mes',
  ],

  authors: [{ name: 'Yele', url: 'https://yele.design' }],
  creator: 'Yele',
  publisher: 'Yele',

  openGraph: {
    type: 'website',
    locale: 'es_ES',
    alternateLocale: 'en_GB',
    url: 'https://yele.design',
    siteName: 'Yele',
    title: 'Yele — Tu web lista en 3 días',
    description:
      'Diseño web profesional para PYMEs y autónomos españoles. Desde €29/mes. Sin pago inicial.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Yele — Diseño web por suscripción para negocios españoles',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Yele — Tu web lista en 3 días',
    description:
      'Diseño web profesional para PYMEs y autónomos españoles. Desde €29/mes.',
    images: ['/opengraph-image'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  alternates: {
    canonical: 'https://yele.design',
    languages: {
      es: 'https://yele.design',
      en: 'https://yele.design/en',
    },
  },

}

const schemaOrg = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://yele.design/#organization',
      name: 'Yele',
      url: 'https://yele.design',
      logo: {
        '@type': 'ImageObject',
        url: 'https://yele.design/logo.png',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'info@yele.design',
        contactType: 'customer service',
        availableLanguage: ['Spanish', 'English'],
      },
      areaServed: {
        '@type': 'Country',
        name: 'España',
      },
      sameAs: [],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://yele.design/#website',
      url: 'https://yele.design',
      name: 'Yele',
      description: 'Diseño web por suscripción para PYMEs y autónomos españoles',
      publisher: { '@id': 'https://yele.design/#organization' },
      inLanguage: ['es', 'en'],
    },
    {
      '@type': 'Service',
      '@id': 'https://yele.design/#service',
      name: 'Diseño web por suscripción',
      provider: { '@id': 'https://yele.design/#organization' },
      description:
        'Diseño y mantenimiento de páginas web profesionales para PYMEs y autónomos en España. Entrega en 3-5 días, desde €29/mes.',
      areaServed: { '@type': 'Country', name: 'España' },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Planes Yele',
        itemListElement: [
          {
            '@type': 'Offer',
            name: 'Plan Básica',
            price: '29',
            priceCurrency: 'EUR',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: '29',
              priceCurrency: 'EUR',
              unitText: 'MONTH',
            },
            description:
              'Web hasta 5 secciones, diseño personalizado, mobile-first, mantenimiento incluido',
          },
          {
            '@type': 'Offer',
            name: 'Plan Profesional',
            price: '49',
            priceCurrency: 'EUR',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: '49',
              priceCurrency: 'EUR',
              unitText: 'MONTH',
            },
            description:
              'Web hasta 10 secciones, blog, SEO local, cambios prioritarios en 24h',
          },
          {
            '@type': 'Offer',
            name: 'Plan Avanzada',
            price: '89',
            priceCurrency: 'EUR',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: '89',
              priceCurrency: 'EUR',
              unitText: 'MONTH',
            },
            description:
              'Funcionalidades a medida, tienda online, reservas, soporte prioritario',
          },
        ],
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Necesito saber de tecnología?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Tú nos dices qué quieres y nosotros lo construimos. Para actualizar contenido tienes un panel sencillo, sin código.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Cuánto tarda en estar lista mi web?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Entre 3 y 5 días desde que recibes tu formulario completado. Sin esperas de semanas.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Puedo cancelar cuando quiera?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sí. Sin permanencia, sin penalizaciones. Si en algún momento no lo necesitas, cancelas y listo.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Qué pasa si quiero cambiar algo de mi web?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Nos escribes y lo cambiamos. Según tu plan, en 12, 24 o 48 horas. Sin presupuestos extra.',
          },
        },
        {
          '@type': 'Question',
          name: '¿El dominio y el hosting están incluidos?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'El hosting sí. El dominio se puede gestionar con nosotros o tú puedes traer el tuyo propio.',
          },
        },
        {
          '@type': 'Question',
          name: '¿Puedo ver ejemplos de webs que hayáis hecho?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sí, en la sección Trabajos de esta misma página puedes ver proyectos reales.',
          },
        },
      ],
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${outfit.variable} ${manrope.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body className="font-manrope bg-white text-[#1D1D1F] antialiased">
        <LanguageProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:rounded"
          >
            Saltar al contenido principal
          </a>
          {children}
          <CookieBanner />
        </LanguageProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
