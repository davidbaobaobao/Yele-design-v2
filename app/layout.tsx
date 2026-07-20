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
    default: 'Professional website design from $99/mo | Yele',
    template: '%s | Yele',
  },

  description:
    'Professional website design for US small businesses and freelancers. Live in 1 week, maintenance included, from $99/mo. No setup fee, no commitment.',

  authors: [{ name: 'Yele', url: 'https://yele.design' }],
  creator: 'Yele',
  publisher: 'Yele',

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yele.design',
    siteName: 'Yele',
    title: 'Professional website design from $99/mo | Yele',
    description:
      'Professional website design for US small businesses and freelancers. From $99/mo. No setup fee.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Yele — Professional website design for US small businesses',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Professional website design from $99/mo | Yele',
    description:
      'Professional website design for US small businesses and freelancers. From $99/mo.',
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
        availableLanguage: ['English'],
      },
      areaServed: {
        '@type': 'Country',
        name: 'United States',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://yele.design/#website',
      url: 'https://yele.design',
      name: 'Yele',
      description: 'Subscription-based professional website design for US small businesses and freelancers',
      publisher: { '@id': 'https://yele.design/#organization' },
      inLanguage: ['en'],
    },
    {
      '@type': 'Service',
      '@id': 'https://yele.design/#service',
      name: 'Subscription website design',
      provider: { '@id': 'https://yele.design/#organization' },
      description:
        'Professional website design and maintenance for US small businesses and freelancers. Live in 1 week, from $99/mo.',
      areaServed: { '@type': 'Country', name: 'United States' },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Yele Plans',
        itemListElement: [
          {
            '@type': 'Offer',
            name: 'Starter',
            price: '99',
            priceCurrency: 'USD',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: '99',
              priceCurrency: 'USD',
              unitText: 'MONTH',
            },
            description:
              'Functional website, custom domain, control panel, on-page SEO, custom email, 24/7 support',
          },
          {
            '@type': 'Offer',
            name: 'Pro',
            price: '169',
            priceCurrency: 'USD',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: '169',
              priceCurrency: 'USD',
              unitText: 'MONTH',
            },
            description:
              'Branding, payment system, booking calendar, Google Business Profile, AI chat assistant',
          },
          {
            '@type': 'Offer',
            name: 'Frontier',
            price: '699',
            priceCurrency: 'USD',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: '699',
              priceCurrency: 'USD',
              unitText: 'MONTH',
            },
            description:
              'Active monthly marketing, advanced SEO & backlinks, weekly content, Google Ads management, press releases',
          },
        ],
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Do I need to be tech-savvy?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Not at all. You tell us what you want and we build it. For updating content, you get a simple dashboard — no code needed.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long until my website is live?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Less than 1 week from the time you complete your onboarding form. No waiting around.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I cancel anytime?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. No contracts, no cancellation fees. If you ever decide you don\'t need it, just cancel.',
          },
        },
        {
          '@type': 'Question',
          name: 'What if I want to make changes to my site?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Just message us and we\'ll handle it. Depending on your plan, updates are done within 12, 24, or 48 hours. No extra quotes.',
          },
        },
        {
          '@type': 'Question',
          name: 'Are domain and hosting included?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Hosting is included. For your domain, we can manage it for you or you can bring your own.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I see examples of websites you\'ve built?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes — check out the Portfolio section on this page for real client projects.',
          },
        },
      ],
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${manrope.variable} ${archivo.variable}`}>
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
            Skip to main content
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
