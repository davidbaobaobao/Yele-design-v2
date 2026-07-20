import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Navigation from '@/components/Navigation'
import HeroBento from '@/app/presupuesto/_components/HeroBento'
import MissionSection from '@/components/MissionSection'
import WeDesignSection from '@/components/WeDesignSection'
import WeCreateSection from '@/components/WeCreateSection'
import WeDeliverSection from '@/components/WeDeliverSection'
import WeEnsureSection from '@/components/WeEnsureSection'
import WeImproveSection from '@/components/WeImproveSection'
import WeHelpSection from '@/components/WeHelpSection'
import VideoSnapController from '@/components/VideoSnapController'
import ShowcaseFeatureCards from '@/app/presupuesto/_components/ShowcaseFeatureCards'
import DiferenciaSection from '@/app/presupuesto/_components/DiferenciaSection'
import ComoFunciona from '@/components/ComoFunciona'
import PreciosIndexSection from '@/components/PreciosIndexSection'
import Showcase from '@/components/Showcase'
import FinaleSection from '@/app/presupuesto/_components/FinaleSection'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { EnLangProvider } from '@/components/LangProvider'

const Testimonios      = dynamic(() => import('@/components/Testimonios'))
const TablaComparativa = dynamic(() => import('@/components/TablaComparativa'))
const ContactForm      = dynamic(() => import('@/components/ContactForm'))
const FAQ              = dynamic(() => import('@/components/FAQ'))

export const metadata: Metadata = {
  title: 'Get a free quote — Professional web design from $99/mo',
  description:
    'Get a professional website for your US small business from $99/mo. Live in 1 week, no setup fee, no commitment. Tell us what you need and we\'ll build it.',
  robots: { index: true, follow: true },
  alternates: {
    canonical: 'https://yele.design/quote',
    languages: { 'x-default': 'https://yele.design' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yele.design/quote',
    siteName: 'Yele',
    title: 'Get a free quote — Professional web design from $99/mo | Yele',
    description:
      'Professional website for your US small business from $99/mo. Live in 1 week, no setup fee.',
  },
}

export default function QuotePage() {
  return (
    <EnLangProvider>
      <Navigation heroIsDark />
      <main id="main-content">
        <HeroBento />
        <MissionSection />
        <WeDesignSection />
        <WeCreateSection />
        <WeDeliverSection />
        <WeEnsureSection />
        <WeImproveSection />
        <WeHelpSection />
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
