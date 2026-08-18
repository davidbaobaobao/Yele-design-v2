'use client'

import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'
import { TypewriterWord } from '@/components/ui/typewriter-word'

const WORDS = ['Fast', 'Secure', 'Reliable', 'Responsive']

// Light-weight closing beat — same rotating-word idea as the homepage's
// WebsiteWordsVideo, but text-only (no video/WebGL) so this stays a fast
// ad-landing page. Isolated into its own tiny client component so the rest
// of /websites/page.tsx stays a server component.
export default function ClosingWords() {
  const reduceMotion = !!useHydratedReducedMotion()

  return (
    <h2 className="font-display font-bold leading-tight" style={{ fontSize: 'clamp(1.85rem, 6vw, 3rem)', color: '#F2F0EB' }}>
      <span className="sr-only">We make your website fast, secure, reliable, and responsive.</span>
      <span aria-hidden="true">
        We make your website
        <br />
        <TypewriterWord words={WORDS} reduceMotion={reduceMotion} />
      </span>
    </h2>
  )
}
