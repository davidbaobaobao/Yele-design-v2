import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Mission from '@/components/Mission'
import { EnLangProvider } from '@/components/LangProvider'

// Below-fold sections — code-split into separate chunks to reduce initial JS
const WhatWeDo             = dynamic(() => import('@/components/WhatWeDo'))
const WhyYele              = dynamic(() => import('@/components/WhyYele'))
const HowWeWork            = dynamic(() => import('@/components/HowWeWork'))
const BeyondWebsite        = dynamic(() => import('@/components/BeyondWebsite'))
const VideoSnapController  = dynamic(() => import('@/components/VideoSnapController'))
const Showcase             = dynamic(() => import('@/components/Showcase'))
const PreciosIndexSection  = dynamic(() => import('@/components/PreciosIndexSection'))
const WhySubs              = dynamic(() => import('@/components/WhySubs'))
const Testimonios          = dynamic(() => import('@/components/Testimonios'))
const TablaComparativa     = dynamic(() => import('@/components/TablaComparativa'))
const ContactForm          = dynamic(() => import('@/components/ContactForm'))
const FAQ                  = dynamic(() => import('@/components/FAQ'))
const FinaleSection        = dynamic(() => import('@/app/presupuesto/_components/FinaleSection'))
const Footer               = dynamic(() => import('@/components/Footer'))
const WhatsAppButton       = dynamic(() => import('@/components/WhatsAppButton'))

export const metadata: Metadata = {
  title: 'Professional website design from $99/mo | Yele',
  description:
    'Professional website design for SMBs and freelancers. Live in 1 week, maintenance included, from $99/mo. No setup fee, no commitment.',
  alternates: {
    canonical: 'https://yele.design',
    languages: { 'x-default': 'https://yele.design' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yele.design',
    siteName: 'Yele',
    title: 'Professional website design from $99/mo | Yele',
    description:
      'Professional website design for SMBs and freelancers. Live in 1 week, from $99/mo. No setup fee.',
  },
}

export default function Home() {
  return (
    <EnLangProvider>
      <Nav />
      <main id="main-content">
        <div id="dark-zone">
          <Hero />
        </div>
        <Mission />
        <WhatWeDo />
        <WhyYele />
        <div id="trabajos" data-nav-dark>
          <Showcase noHeader noBg fullScreen dark />
        </div>
        <HowWeWork />
        <BeyondWebsite />
        <PreciosIndexSection />
        <WhySubs />
        <VideoSnapController />
        <Testimonios noBg />
        <TablaComparativa />
        <ContactForm />
        <FAQ noBg />
        <FinaleSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </EnLangProvider>
  )
}
