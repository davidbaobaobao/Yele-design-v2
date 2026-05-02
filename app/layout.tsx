import type { Metadata } from 'next'
import { Outfit, Manrope } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/context/LanguageContext'
import LenisProvider from '@/components/LenisProvider'
import { Analytics } from '@vercel/analytics/react'

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
  title: 'Yele — Tu web lista en 3 días | Diseño web por suscripción',
  description:
    'Diseño web profesional para PYMEs y autónomos españoles. Entrega en 3–5 días, mantenimiento incluido, desde €29/mes. Sin permanencia.',
  openGraph: {
    title: 'Yele — Tu web lista en 3 días',
    description: 'Diseño web por suscripción para negocios españoles. Desde €29/mes.',
    url: 'https://yele.design',
    siteName: 'Yele',
    locale: 'es_ES',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${outfit.variable} ${manrope.variable}`}>
      <body className="font-manrope bg-white text-[#1D1D1F] antialiased">
        <LanguageProvider>
          <LenisProvider>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:rounded"
            >
              Saltar al contenido principal
            </a>
            {children}
          </LenisProvider>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
