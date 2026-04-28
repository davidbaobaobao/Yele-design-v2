import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Beneficios from '@/components/Beneficios'
import Showcase from '@/components/Showcase'
import Precios from '@/components/Precios'
import TablaComparativa from '@/components/TablaComparativa'
import ComoFunciona from '@/components/ComoFunciona'
import CTASection from '@/components/CTASection'
import Testimonios from '@/components/Testimonios'
import FAQ from '@/components/FAQ'
import ContactForm from '@/components/ContactForm'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navigation />
      <main id="main-content">
        <Hero />
        <Beneficios />
        <Showcase />
        <Precios />
        <TablaComparativa />
        <ComoFunciona />
        <CTASection />
        <Testimonios />
        <FAQ />
        <ContactForm />
      </main>
      <Footer />
    </>
  )
}
