import type { Metadata } from 'next'
import LetsBuildLanding from '@/components/letsbuild/LetsBuildLanding'

// Meta-ads landing: same page as /letsbuild but with a lead form in the hero
// (instead of the cubes) and Pricing / Projects CTAs. Meta Pixel is site-wide
// (root layout), so tracking is identical. noindex — it's an ad destination,
// not organic, and would otherwise duplicate /letsbuild.
export const metadata: Metadata = {
  title: 'Get a custom website from $699 | Yele',
  description:
    'Custom design and imagery, delivery under 4 weeks, our agency takes care of everything. Websites from $699 + Yele Care from $49/month. Pay 50% to start, 50% at launch.',
  alternates: { canonical: 'https://yele.design/letsbuild' },
  robots: { index: false, follow: true },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yele.design/letsbuildnow',
    siteName: 'Yele',
    title: 'Get a custom website from $699 | Yele',
    description: 'Custom design. Delivery under 4 weeks. From $699 + $49/mo Yele Care. 50% to start.',
  },
}

export default function LetsBuildNowPage() {
  return (
    <LetsBuildLanding
      leadSource="Let's Build Now (direct)"
      trackPage="letsbuildnow"
      heroForm
    />
  )
}
