import type { Metadata } from 'next'
import { Archivo, Instrument_Sans, IBM_Plex_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { LanguageProvider } from '@/context/LanguageContext'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import CookieBanner from '@/components/CookieBanner'
// Floating AI chatbot disabled for now.
// import YelebotGate from '@/components/YelebotGate'
import MetaPixelScript from '@/components/MetaPixelScript'

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-display',
  display: 'swap',
})

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://yele.design'),

  title: {
    default: 'Custom website design from $699 | Yele',
    template: '%s | Yele',
  },

  description:
    'Custom website design for small businesses — bespoke design and imagery, delivery under 4 weeks, from $699 one-time. Then Yele Care from $49/month keeps it hosted, updated and redesigned every year. Pay 50% to start, 50% at launch.',

  authors: [{ name: 'Yele', url: 'https://yele.design' }],
  creator: 'Yele',
  publisher: 'Yele',

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yele.design',
    siteName: 'Yele',
    title: 'Custom website design from $699 | Yele',
    description:
      'Custom website design from $699 one-time. Delivery under 4 weeks, then Yele Care from $49/month. No agency prices.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Yele — Custom website design from $699',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Custom website design from $699 | Yele',
    description:
      'Custom website design from $699 one-time. Delivery under 4 weeks, then Yele Care from $49/month.',
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

  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.ico',
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
        telephone: '+1-888-264-8656',
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
      description: 'Custom website design and maintenance for small businesses — from $699 one-time, then Yele Care from $49/month',
      publisher: { '@id': 'https://yele.design/#organization' },
      inLanguage: ['en'],
    },
    {
      '@type': 'Service',
      '@id': 'https://yele.design/#service',
      serviceType: 'Custom website design',
      name: 'Custom website design',
      provider: { '@id': 'https://yele.design/#organization' },
      description:
        'Custom website design for small businesses — bespoke design and imagery, delivery under 4 weeks, from $699 one-time. Then Yele Care from $49/month keeps the site hosted, secure, updated and redesigned every year.',
      areaServed: { '@type': 'Country', name: 'United States' },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Yele website packages',
        itemListElement: [
          {
            '@type': 'Offer',
            name: 'Launch',
            price: '699',
            priceCurrency: 'USD',
            description:
              'One-time custom website — custom design, mobile optimization, own domain, contact forms, and SEO indexing. Then Yele Care from $49/month.',
          },
          {
            '@type': 'Offer',
            name: 'Business',
            price: '1199',
            priceCurrency: 'USD',
            description:
              'One-time custom website with calendar booking, payments, small e-commerce, conversion optimization, advanced SEO and analytics. Then Yele Care from $49/month.',
          },
          {
            '@type': 'Offer',
            name: 'Pro',
            price: '2799',
            priceCurrency: 'USD',
            description:
              'One-time custom website with high-performance e-commerce, custom dashboards, integrations, multiple locations and complex workflows. Then Yele Care from $99/month.',
          },
          {
            '@type': 'Offer',
            name: 'Yele Care',
            price: '49',
            priceCurrency: 'USD',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: '49',
              priceCurrency: 'USD',
              unitText: 'MONTH',
            },
            description:
              'Monthly maintenance: hosting, security, backups, updates, support, and a full website redesign every year.',
          },
        ],
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How much does a website cost?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yele websites are a one-time build starting at $699 (Launch). Business is $1,199 and Pro from $2,799. Then Yele Care keeps everything running from $49/month.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long until my website is ready?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Our delivery goal is under 4 weeks from when you complete your onboarding form.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do I pay everything upfront?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. You pay 50% to start and the remaining 50% when your website is approved for launch.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is Yele Care and is it compulsory?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yele Care is our maintenance plan, from $29/month, in three tiers: Yele Care Lite ($29/mo) — hosting, security and backups; Yele Care ($49/mo) — a yearly redesign, we update your content, plus monitoring; and Yele Care+ ($99/mo) — advanced security, backups, monitoring and services. It is not compulsory — you can host the site yourself — but we recommend it so your website stays fast, secure and never looks dated.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do I own the design?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. You own the design files and hold the copyright to all the content we create for you.',
          },
        },
        {
          '@type': 'Question',
          name: 'Are domain and hosting included?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Hosting is included with Yele Care. For your domain, we can manage a standard domain for you, or you can bring your own.',
          },
        },
      ],
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${instrumentSans.variable} ${ibmPlexMono.variable}`}>
      <head>
        {/* ConveyorCards (the WebGL embed this warmed the connection for —
            it pulls three.js from unpkg itself) was replaced by
            ConveyorVideoSection, a recorded video of the same scene — see
            components/HomePage.tsx. No longer needed; component + its
            public/conveyor/index.html asset are still in the codebase,
            just unreferenced. */}
        {/* <link rel="preconnect" href="https://unpkg.com" crossOrigin="anonymous" /> */}
        {/* Warms the connection ahead of the afterInteractive tags below —
            saves the DNS/TLS handshake time off the critical path once
            those scripts actually start loading. */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://e.clarity.ms" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body className="font-body bg-base text-ink antialiased">
        <LanguageProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:rounded"
          >
            Skip to main content
          </a>
          {children}
          <CookieBanner />
          {/* Floating AI chatbot disabled for now. */}
          {/* <YelebotGate /> */}
        </LanguageProvider>
        <Analytics />
        <SpeedInsights />
        {/* Meta Pixel — site-wide for full-funnel attribution, gated behind
            Marketing consent (opt-out default-granted — see lib/metaPixel.ts). */}
        <MetaPixelScript />
        {/* Google Ads tag — afterInteractive (not lazyOnload): loads right
            after hydration, off the critical rendering path, but early
            enough that gtag is reliably ready by the time a real user
            submits a form (always at least several seconds into the visit),
            so onboarding_form_submit + enhanced conversions keep firing. */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18281072925"
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18281072925');
            gtag('config', 'G-970LSR5GJ4');
          `}
        </Script>
        {/* Microsoft Clarity — the consentv2 call right after the bootstrap
            IIFE is safe even though the real clarity.js hasn't loaded yet:
            c[a] is already the queue-stub function at this point (assigned
            synchronously above), so the call just queues until the real
            script processes it. Without this, Clarity runs cookieless (no
            _clck/_clsk) and treats every pageview as a new session — this
            site's cookie banner already treats consent as granted on
            continued use ("by continuing you agree..."), so this mirrors
            that same implied-consent model. CookieBanner.tsx re-fires this
            with the user's actual analytics/marketing choice once they
            interact with the banner. */}
        <Script id="ms-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window,document,"clarity","script","xhor841289");
            window.clarity("consentv2", {
              ad_Storage: "granted",
              analytics_Storage: "granted"
            });
          `}
        </Script>
      </body>
    </html>
  )
}
