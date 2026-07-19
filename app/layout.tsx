import type { Metadata } from 'next'
import { Outfit, Manrope, Archivo } from 'next/font/google'
import Script from 'next/script'
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

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-archivo',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://yele.design'),

  title: {
    default: 'Desde 49€/mes. Tu página web profesional, sin complicaciones',
    template: '%s | Yele',
  },

  description:
    'Diseño web profesional para PYMEs y autónomos españoles. Entrega en 1 semana, mantenimiento incluido, desde €49/mes. Sin pago inicial, sin permanencia.',

  authors: [{ name: 'Yele', url: 'https://yele.design' }],
  creator: 'Yele',
  publisher: 'Yele',

  openGraph: {
    type: 'website',
    locale: 'es_ES',
    alternateLocale: 'en_GB',
    url: 'https://yele.design',
    siteName: 'Yele',
    title: 'Desde 49€/mes. Tu página web profesional, sin complicaciones',
    description:
      'Diseño web profesional para PYMEs y autónomos españoles. Desde €49/mes. Sin pago inicial.',
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
    title: 'Desde 49€/mes. Tu página web profesional, sin complicaciones',
    description:
      'Diseño web profesional para PYMEs y autónomos españoles. Desde €49/mes.',
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
        'Diseño y mantenimiento de páginas web profesionales para PYMEs y autónomos en España. Entrega en 1 semana, desde €49/mes.',
      areaServed: { '@type': 'Country', name: 'España' },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Planes Yele',
        itemListElement: [
          {
            '@type': 'Offer',
            name: 'Starter',
            price: '49',
            priceCurrency: 'EUR',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: '49',
              priceCurrency: 'EUR',
              unitText: 'MONTH',
            },
            description:
              'Web funcional, dominio personalizado, panel de control, SEO on-page, email personalizado, soporte 24/7',
          },
          {
            '@type': 'Offer',
            name: 'Pro',
            price: '79',
            priceCurrency: 'EUR',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: '79',
              priceCurrency: 'EUR',
              unitText: 'MONTH',
            },
            description:
              'Branding, sistema de pagos, calendario y reservas, Google Business Profile, asistente de chat IA',
          },
          {
            '@type': 'Offer',
            name: 'Frontier',
            price: '599',
            priceCurrency: 'EUR',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: '599',
              priceCurrency: 'EUR',
              unitText: 'MONTH',
            },
            description:
              'Marketing activo mensual, SEO avanzado backlinks, contenido semanal, Google Ads, notas de prensa',
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
            text: 'En menos de 1 semana desde que recibes tu formulario completado. Sin esperas.',
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
    <html lang="es" className={`${outfit.variable} ${manrope.variable} ${archivo.variable}`}>
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
        {/* Google Ads tag */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18281072925"
          strategy="lazyOnload"
        />
        <Script id="google-ads" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18281072925');
            gtag('config', 'G-970LSR5GJ4');
          `}
        </Script>
      </body>
    </html>
  )
}
