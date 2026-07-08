import dynamic from 'next/dynamic'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import ShowcaseHero from '@/components/ShowcaseHero'
import Beneficios from '@/components/Beneficios'
import Showcase from '@/components/Showcase'
import Precios from '@/components/Precios'
import ShowcaseLarge from '@/components/ShowcaseLarge'
import ComoFunciona from '@/components/ComoFunciona'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import SandHelixBackground from '@/components/SandHelixBackground'

// Below-fold client components — defer their JS until needed
const TablaComparativa = dynamic(() => import('@/components/TablaComparativa'))
const CTASection       = dynamic(() => import('@/components/CTASection'))
const Testimonios      = dynamic(() => import('@/components/Testimonios'))
const FAQ              = dynamic(() => import('@/components/FAQ'))
const ContactForm      = dynamic(() => import('@/components/ContactForm'))
const Noticias         = dynamic(() => import('@/components/Noticias'))

export default function Home() {
  return (
    <>
      <SandHelixBackground />
      <Navigation />
      <main id="main-content">
        <Hero />
        <ShowcaseHero noBg />
        <Beneficios sectionClassName="pt-12 pb-24 md:pt-16 md:pb-32" />
        <Showcase noBg />
        <ComoFunciona noBg />
        <Precios noBg />
        <ShowcaseLarge />
        <TablaComparativa />
        <CTASection />
        <Testimonios noBg />
        <FAQ noBg />
        <ContactForm />
        <Noticias />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
