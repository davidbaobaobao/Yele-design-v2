'use client'

import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'

const LOGO_DIR = '/media/logosmarquee'
const LOGO_COUNT = 10
const LOGOS = Array.from({ length: LOGO_COUNT }, (_, i) => i + 1)

// Plain <img>, not next/image — these are SVGs, and Next's image optimizer
// refuses to serve SVGs at all unless dangerouslyAllowSVG is set globally
// (a security tradeoff not worth making for one decorative marquee). The
// brightness(0) invert(1) filter turns any solid-color logo pure white
// regardless of its own internal fill values, then opacity dims it to sit
// quietly on the dark strip until hovered.
function LogoImg({ n }: { n: number }) {
  return (
    <img
      src={`${LOGO_DIR}/${n}.svg`}
      alt=""
      className="h-8 md:h-10 w-auto shrink-0 object-contain opacity-70 transition-opacity duration-300 hover:opacity-100"
      style={{ filter: 'brightness(0) invert(1)' }}
    />
  )
}

export default function LogoMarquee() {
  const reduceMotion = !!useHydratedReducedMotion()

  if (reduceMotion) {
    return (
      <section data-nav-dark className="px-6 py-12" style={{ backgroundColor: '#0D0E12' }}>
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {LOGOS.map(n => (
            <LogoImg key={n} n={n} />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section
      data-nav-dark
      className="logo-marquee-wrap relative overflow-hidden py-12"
      style={{ backgroundColor: '#0D0E12' }}
    >
      {/* Two identical copies back-to-back so translateX(-50%) — exactly
          half the track's total width — loops seamlessly. Each rep carries
          its OWN trailing spacer (an empty flex child, gapped the same
          gap-16 as every logo-to-logo space) instead of a separate gap on
          the outer track: with an even number of logos, a gap directly
          between the two reps only accounts for HALF a gap-width once the
          track is split down the middle for the -50% jump, leaving a small
          leftover offset that reads as a visible stutter/blank flash right
          at the loop point — most noticeable on narrow (mobile) viewports.
          Folding the connecting gap into each rep's own trailing spacer
          makes both halves of the track exactly equal, so -50% always lands
          precisely on the seam with nothing left over. */}
      <div className="logo-marquee-track flex items-center" style={{ width: 'max-content' }}>
        {[0, 1].map(rep => (
          <div key={rep} className="flex shrink-0 items-center gap-16" aria-hidden={rep === 1}>
            {LOGOS.map(n => (
              <LogoImg key={n} n={n} />
            ))}
            <div aria-hidden="true" />
          </div>
        ))}
      </div>
    </section>
  )
}
