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
import ShowcaseFeatureCards from '@/app/presupuesto/_components/ShowcaseFeatureCards'
import ComoFunciona from '@/components/ComoFunciona'
import PreciosIndexSection from '@/components/PreciosIndexSection'
import Showcase from '@/components/Showcase'
import DiferenciaSection from '@/app/presupuesto/_components/DiferenciaSection'
import FinaleSection from '@/app/presupuesto/_components/FinaleSection'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { EsLangProvider } from '@/components/LangProvider'

const Testimonios      = dynamic(() => import('@/components/Testimonios'))
const TablaComparativa = dynamic(() => import('@/components/TablaComparativa'))
const CTASection       = dynamic(() => import('@/components/CTASection'))
const ContactForm      = dynamic(() => import('@/components/ContactForm'))
const FAQ              = dynamic(() => import('@/components/FAQ'))
const Noticias         = dynamic(() => import('@/components/Noticias'))

export const metadata: Metadata = {
  title: 'Diseño web profesional desde 49€/mes | Yele',
  description:
    'Diseño web profesional para PYMEs y autónomos. Entrega en 1 semana, mantenimiento incluido, desde €49/mes. Sin pago inicial, sin permanencia.',
  alternates: {
    canonical: 'https://yele.design/es',
    languages: { en: 'https://yele.design' },
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://yele.design/es',
    siteName: 'Yele',
    title: 'Diseño web profesional desde 49€/mes | Yele',
    description:
      'Diseño web profesional para PYMEs y autónomos. Desde €49/mes. Sin pago inicial.',
  },
}

export default function EsHome() {
  return (
    <EsLangProvider>
      <Navigation heroIsDark />
      <main id="main-content">
        <HeroBento />
        <MissionSection />
        <WeDesignSection />
        <WeCreateSection />
        <WeDeliverSection />
        <WeEnsureSection />
        <WeImproveSection />
        <ShowcaseFeatureCards />
        <ComoFunciona noBg />
        <PreciosIndexSection />
        <Showcase noHeader noBg fullScreen />
        <DiferenciaSection />
        <Testimonios noBg />
        <TablaComparativa />
        <CTASection />
        <ContactForm />
        <FAQ noBg />
        <FinaleSection />
        <Noticias />
      </main>
      <Footer />
      <WhatsAppButton />
    </EsLangProvider>
  )
}
