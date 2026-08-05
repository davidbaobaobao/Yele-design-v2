'use client'

import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'

const LOGO_DIR = '/media/logosmarquee'
const LOGO_COUNT = 10
const LOGOS = Array.from({ length: LOGO_COUNT }, (_, i) => i + 1)

// Fades the strip's own left/right edges to transparent instead of hard-
// cutting logos mid-shape as they scroll past the section boundary.
const EDGE_FADE_MASK = 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)'

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
      style={{ backgroundColor: '#0D0E12', WebkitMaskImage: EDGE_FADE_MASK, maskImage: EDGE_FADE_MASK }}
    >
      {/* Two identical copies back-to-back so translateX(-50%) — one full
          copy's width — loops seamlessly with no visible seam or jump. */}
      <div className="logo-marquee-track flex items-center gap-16" style={{ width: 'max-content' }}>
        {[0, 1].map(rep => (
          <div key={rep} className="flex shrink-0 items-center gap-16" aria-hidden={rep === 1}>
            {LOGOS.map(n => (
              <LogoImg key={n} n={n} />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
