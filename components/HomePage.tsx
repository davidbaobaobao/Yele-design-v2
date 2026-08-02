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
const ContentShowcase      = dynamic(() => import('@/components/ContentShowcase'))
const DealStatement        = dynamic(() => import('@/components/DealStatement'))
const StatsBold            = dynamic(() => import('@/components/StatsBold'))
const VideoSnapController  = dynamic(() => import('@/components/VideoSnapController'))
const Showcase             = dynamic(() => import('@/components/Showcase'))
const PreciosIndexSection  = dynamic(() => import('@/components/PreciosIndexSection'))
const WhySubs              = dynamic(() => import('@/components/WhySubs'))
const Testimonios          = dynamic(() => import('@/components/Testimonios'))
const TablaComparativa     = dynamic(() => import('@/components/TablaComparativa'))
const ContactForm          = dynamic(() => import('@/components/ContactForm'))
const FAQ                  = dynamic(() => import('@/components/FAQ'))
const Footer               = dynamic(() => import('@/components/Footer'))

// Single source of truth for the homepage's section composition — rendered
// by both app/page.tsx (/) and app/agency/page.tsx (/agency, a noindexed
// Google Ads landing duplicate) so the two stay pixel-identical without
// copy-pasting section markup.
export default function HomePage() {
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
        <div id="trabajos" data-nav-dark className="scroll-mt-24">
          <Showcase noHeader noBg fullScreen dark />
        </div>
        <HowWeWork />
        <BeyondWebsite />
        <ContentShowcase />
        <DealStatement />
        <StatsBold />
        <PreciosIndexSection />
        <WhySubs />
        <VideoSnapController />
        <Testimonios noBg />
        <TablaComparativa />
        <ContactForm />
        <FAQ dark />
      </main>
      <Footer />
    </EnLangProvider>
  )
}
