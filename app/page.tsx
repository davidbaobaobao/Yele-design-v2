import dynamic from 'next/dynamic'
import Navigation from '@/components/Navigation'
import HeroBento from '@/app/presupuesto/_components/HeroBento'
import MissionSection from '@/components/MissionSection'
import ShowcaseFeatureCards from '@/app/presupuesto/_components/ShowcaseFeatureCards'
import ComoFunciona from '@/components/ComoFunciona'
import PreciosIndexSection from '@/components/PreciosIndexSection'
import Showcase from '@/components/Showcase'
import DiferenciaSection from '@/app/presupuesto/_components/DiferenciaSection'
import FinaleSection from '@/app/presupuesto/_components/FinaleSection'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

const Testimonios      = dynamic(() => import('@/components/Testimonios'))
const TablaComparativa = dynamic(() => import('@/components/TablaComparativa'))
const CTASection       = dynamic(() => import('@/components/CTASection'))
const ContactForm      = dynamic(() => import('@/components/ContactForm'))
const FAQ              = dynamic(() => import('@/components/FAQ'))
const Noticias         = dynamic(() => import('@/components/Noticias'))

export default function Home() {
  return (
    <>
      <Navigation heroIsDark />
      <main id="main-content">
        <HeroBento />
        <MissionSection />
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
    </>
  )
}
