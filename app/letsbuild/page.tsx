import type { Metadata } from 'next'
import LetsBuildLanding from '@/components/letsbuild/LetsBuildLanding'

export const metadata: Metadata = {
  title: 'Get a custom website from $699 | Yele',
  description:
    'Custom design and imagery, delivery under 4 weeks, our agency takes care of everything. Websites from $699 + Yele Care from $49/month. Pay 50% to start, 50% at launch.',
  alternates: { canonical: 'https://yele.design/letsbuild' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yele.design/letsbuild',
    siteName: 'Yele',
    title: 'Get a custom website from $699 | Yele',
    description: 'Custom design. Delivery under 4 weeks. From $699 + $49/mo Yele Care. 50% to start.',
  },
}

export default function LetsBuildPage() {
  return <LetsBuildLanding leadSource="Let's Build (direct)" />
}
