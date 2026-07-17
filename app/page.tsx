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
import ComoFunciona from '@/components/ComoFunciona'
import PreciosIndexSection from '@/components/PreciosIndexSection'
import Showcase from '@/components/Showcase'
import DiferenciaSection from '@/app/presupuesto/_components/DiferenciaSection'
import FinaleSection from '@/app/presupuesto/_components/FinaleSection'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { EnLangProvider } from '@/components/LangProvider'

const Testimonios      = dynamic(() => import('@/components/Testimonios'))
const TablaComparativa = dynamic(() => import('@/components/TablaComparativa'))
const ContactForm      = dynamic(() => import('@/components/ContactForm'))
const FAQ              = dynamic(() => import('@/components/FAQ'))
const Noticias         = dynamic(() => import('@/components/Noticias'))

export const metadata: Metadata = {
  title: 'Professional website design from €49/mo | Yele',
  description:
    'Professional website design for SMBs and freelancers. Live in 1 week, maintenance included, from €49/mo. No setup fee, no commitment.',
  alternates: {
    canonical: 'https://yele.design',
    languages: { es: 'https://yele.design/es' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://yele.design',
    siteName: 'Yele',
    title: 'Professional website design from €49/mo | Yele',
    description:
      'Professional website design for SMBs and freelancers. Live in 1 week, from €49/mo. No setup fee.',
  },
}

export default function Home() {
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
        <Noticias />
      </main>
      <Footer />
      <WhatsAppButton />
    </EnLangProvider>
  )
}
