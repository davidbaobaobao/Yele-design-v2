import dynamic from 'next/dynamic'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
// Mission is disabled for now (see below) — component kept in the codebase,
// just not imported/rendered. Re-add this import when it's wanted again.
// import Mission from '@/components/Mission'
import { EnLangProvider } from '@/components/LangProvider'
import { DealFadeProvider } from '@/components/DealFadeContext'

// Below-fold sections — code-split into separate chunks to reduce initial JS
const LogoMarquee          = dynamic(() => import('@/components/LogoMarquee'))
const WhatWeDo             = dynamic(() => import('@/components/WhatWeDo'))
const WhyYele              = dynamic(() => import('@/components/WhyYele'))
const AgencyIntro          = dynamic(() => import('@/components/AgencyIntro'))
const HowWeWork            = dynamic(() => import('@/components/HowWeWork'))
const BeyondWebsite        = dynamic(() => import('@/components/BeyondWebsite'))
const LatestFeaturedWork   = dynamic(() => import('@/components/LatestFeaturedWork'))
const ContentShowcase      = dynamic(() => import('@/components/ContentShowcase'))
const ConveyorVideoSection = dynamic(() => import('@/components/ConveyorVideoSection'))
const DealStatement        = dynamic(() => import('@/components/DealStatement'))
const StatsBold            = dynamic(() => import('@/components/StatsBold'))
const VideoSnapController  = dynamic(() => import('@/components/VideoSnapController'))
const Showcase             = dynamic(() => import('@/components/Showcase'))
const WebsiteWordsVideo    = dynamic(() => import('@/components/WebsiteWordsVideo'))
const TryForFreeSection    = dynamic(() => import('@/components/TryForFreeSection'))
const CubeFollowSection    = dynamic(() => import('@/components/CubeFollowSection'))
const KeepImprovingSection = dynamic(() => import('@/components/KeepImprovingSection'))
const FloatingStartFreeCTA = dynamic(() => import('@/components/FloatingStartFreeCTA'))
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
        {/* Mission disabled for now — component kept in the codebase, just
            not rendered. Re-enable by uncommenting when it's wanted again. */}
        {/* <Mission /> */}
        <LogoMarquee />
        <WhyYele />
        <PreciosIndexSection />
        <AgencyIntro />
        <div id="trabajos" data-nav-dark className="scroll-mt-24">
          <Showcase noHeader noBg fullScreen dark />
        </div>
        <HowWeWork />
        <DealFadeProvider>
          <BeyondWebsite />
          <LatestFeaturedWork />
          <DealStatement />
          <StatsBold />
        </DealFadeProvider>
        <TryForFreeSection />
        <CubeFollowSection />
        <ContentShowcase />
        <ConveyorVideoSection />
        <KeepImprovingSection />
        <WebsiteWordsVideo />
        {/* Both this and WhatWeDo are solid #0D0E12 — this is pure breathing
            room between the animation section's video grid and Contact,
            not a color transition. */}
        <div style={{ backgroundColor: '#0D0E12' }} className="h-20 md:h-32" aria-hidden="true" />
        <ContactForm />
        <WhatWeDo />
        <TablaComparativa />
        <Testimonios noBg />
        <WhySubs />
        <FAQ dark />
        <VideoSnapController />
      </main>
      <Footer />
      <FloatingStartFreeCTA />
    </EnLangProvider>
  )
}
