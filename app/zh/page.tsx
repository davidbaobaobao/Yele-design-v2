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
import { ZhLangProvider } from '@/components/LangProvider'

const Testimonios      = dynamic(() => import('@/components/Testimonios'))
const TablaComparativa = dynamic(() => import('@/components/TablaComparativa'))
const ContactForm      = dynamic(() => import('@/components/ContactForm'))
const FAQ              = dynamic(() => import('@/components/FAQ'))
const Noticias         = dynamic(() => import('@/components/Noticias'))

export const metadata: Metadata = {
  title: '专业网页设计，€49/月起 | Yele',
  description: '为中小企业和个体户打造的专业网页设计。一周交付，含维护，€49/月起。无预付款，无合约绑定。',
  robots: { index: false, follow: false },
  alternates: {
    canonical: 'https://yele.design/zh',
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://yele.design/zh',
    siteName: 'Yele',
    title: '专业网页设计，€49/月起 | Yele',
    description: '为中小企业打造的专业网页设计。€49/月起，无预付款。',
  },
}

export default function ZhHome() {
  return (
    <ZhLangProvider>
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
    </ZhLangProvider>
  )
}
