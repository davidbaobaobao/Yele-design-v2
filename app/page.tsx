import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Navigation from '@/components/Navigation'
import HeroBento from '@/app/presupuesto/_components/HeroBento'
import MissionSection from '@/components/MissionSection'
import { EnLangProvider } from '@/components/LangProvider'

// Below-fold sections — code-split into separate chunks to reduce initial JS
const WeStackSection       = dynamic(() => import('@/components/WeStackSection'))
const VideoSnapController  = dynamic(() => import('@/components/VideoSnapController'))
const ComoFunciona         = dynamic(() => import('@/components/ComoFunciona'))
const Showcase             = dynamic(() => import('@/components/Showcase'))
const PreciosIndexSection  = dynamic(() => import('@/components/PreciosIndexSection'))
const ShowcaseFeatureCards = dynamic(() => import('@/app/presupuesto/_components/ShowcaseFeatureCards'))
const DiferenciaSection    = dynamic(() => import('@/app/presupuesto/_components/DiferenciaSection'))
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
      <Navigation heroIsDark />
      <main id="main-content">
        <HeroBento />
        <MissionSection />
        <WeStackSection />
        <VideoSnapController />
        <ComoFunciona noBg />
        <Showcase noHeader noBg fullScreen />
        <PreciosIndexSection />
        <ShowcaseFeatureCards />
        <DiferenciaSection />
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
