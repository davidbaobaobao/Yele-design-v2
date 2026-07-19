import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Navigation from '@/components/Navigation'
import HeroBento from './_components/HeroBento'
import MissionSection from '@/components/MissionSection'
import WeDesignSection from '@/components/WeDesignSection'
import WeCreateSection from '@/components/WeCreateSection'
import WeDeliverSection from '@/components/WeDeliverSection'
import WeEnsureSection from '@/components/WeEnsureSection'
import WeImproveSection from '@/components/WeImproveSection'
import WeHelpSection from '@/components/WeHelpSection'
import VideoSnapController from '@/components/VideoSnapController'
import ShowcaseFeatureCards from './_components/ShowcaseFeatureCards'
import DiferenciaSection from './_components/DiferenciaSection'
import ComoFunciona from '@/components/ComoFunciona'
import PreciosIndexSection from '@/components/PreciosIndexSection'
import Showcase from '@/components/Showcase'
import FinaleSection from './_components/FinaleSection'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import ClarityScript from '@/components/ClarityScript'
import { EsLangProvider } from '@/components/LangProvider'

const Testimonios      = dynamic(() => import('@/components/Testimonios'))
const TablaComparativa = dynamic(() => import('@/components/TablaComparativa'))
const ContactForm      = dynamic(() => import('@/components/ContactForm'))
const FAQ              = dynamic(() => import('@/components/FAQ'))

export const metadata: Metadata = {
  title: 'Diseño web profesional desde 49€/mes | Agencia de diseño web | Yele',
  description:
    'Diseño web profesional a medida desde 49€/mes. Tu agencia de diseño web sin pago inicial ni permanencia. Página web para tu negocio lista en 3-5 días.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://yele.design/presupuesto' },
}

export default function PresupuestoPage() {
  return (
    <EsLangProvider>
      <ClarityScript />
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
    </EsLangProvider>
  )
}
