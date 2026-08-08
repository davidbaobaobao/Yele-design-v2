'use client'

import { useEffect, useRef, useState } from 'react'

// The interactive scene itself is a self-contained Three.js artifact
// (public/conveyor/index.html — loads its own three@0.184.0 from unpkg,
// depends on a custom <three-d-stage> runtime + EffectComposer) embedded
// verbatim via iframe rather than re-ported, so its visuals/behavior stay
// exactly as built. This wrapper only handles WHEN it loads: a heavy WebGL
// scene like this must not be part of the initial page weight, so the
// iframe's src is withheld entirely until the section is close to
// scrolling into view.
export default function ConveyorCards() {
  const sectionRef = useRef<HTMLElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el || !('IntersectionObserver' in window)) {
      setShouldLoad(true)
      return
    }
    const io = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) {
          setShouldLoad(true)
          io.disconnect()
        }
      },
      { rootMargin: '200px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden" style={{ backgroundColor: '#0D0E12' }}>
      {shouldLoad && (
        <iframe
          src="/conveyor/index.html"
          title="Conveyor"
          scrolling="no"
          loading="lazy"
          className="absolute inset-0 h-full w-full"
          style={{ border: 0 }}
        />
      )}

      {/* Cinematic vignette — darkens all four corners, focuses the center
          where the cards sit. pointer-events-none so it never blocks the
          iframe's own hover/click-to-connect interaction. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 65% 60% at 50% 50%, rgba(0,0,0,0) 45%, rgba(13,14,18,0.55) 82%, rgba(13,14,18,0.95) 100%)',
        }}
      />
      {/* Faint top/bottom blend into the neighboring sections' own solid
          #0D0E12 — softens the section boundary without a hard seam. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24 md:h-32"
        style={{ background: 'linear-gradient(to bottom, #0D0E12, transparent)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 md:h-32"
        style={{ background: 'linear-gradient(to top, #0D0E12, transparent)' }}
      />
    </section>
  )
}
