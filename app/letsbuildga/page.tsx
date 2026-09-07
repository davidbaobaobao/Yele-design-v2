import type { Metadata } from 'next'
import LetsBuildLanding from '@/components/letsbuild/LetsBuildLanding'

// Google Ads landing — identical to /letsbuild, but leads are stamped
// "Google Ads" in the email so their source is unmistakable. The Google Ads
// gtag + onboarding_form_submit conversion already fire site-wide (see
// app/layout.tsx and components/LeadForm.tsx, platform 'google').
export const metadata: Metadata = {
  title: 'Get a custom website from $699 | Yele',
  description:
    'Custom design and imagery, delivery under 4 weeks, our agency takes care of everything. Websites from $699 + Yele Care from $49/month. Pay 50% to start, 50% at launch.',
  alternates: { canonical: 'https://yele.design/letsbuildga' },
  // Ad landing — keep it out of the organic index so it doesn't compete with
  // /letsbuild for the same queries.
  robots: { index: false, follow: true },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yele.design/letsbuildga',
    siteName: 'Yele',
    title: 'Get a custom website from $699 | Yele',
    description: 'Custom design. Delivery under 4 weeks. From $699 + $49/mo Yele Care. 50% to start.',
  },
}

export default function LetsBuildGaPage() {
  return <LetsBuildLanding leadSource="Google Ads" />
}
