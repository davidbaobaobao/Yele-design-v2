'use client'

import { useEffect, useRef, useState } from 'react'
import { useIsMobile } from '@/hooks/useIsMobile'

/* eslint-disable @typescript-eslint/no-explicit-any -- reaching into the
   iframe's own <three-d-stage> custom element internals (stage._controls
   etc.), which aren't ours to type; see public/conveyor/index.html. */

// Same-origin only (public/conveyor/index.html is served from yele.design
// itself) — reaches into iframe.contentWindow/contentDocument directly
// rather than postMessage. Polls (the artifact's OrbitControls/shadowRoot
// aren't ready the instant the iframe fires load — the scene boots itself
// async after that, up to ~10s) until the stage exists, then:
//   (a) locks the camera — this is a static embedded section, not a 3D
//       viewer, so no zoom/pan/rotate; card hover/click is untouched.
//   (b) strips the artifact's own download-model button + hover hint,
//       neither relevant embedded on a marketing page (kept watched via
//       MutationObserver in case either is added back after the initial
//       poll window closes).
//   (c) forwards wheel events to the parent so the section scrolls like
//       any other rather than trapping the scroll wheel.
function tuneConveyor(iframe: HTMLIFrameElement) {
  const w = iframe.contentWindow as any
  const d = iframe.contentDocument
  if (!w || !d) return

  const stripDownloadUI = () => {
    const stage = d.querySelector('three-d-stage') as any
    const roots: (Document | ShadowRoot)[] = [d, stage && stage.shadowRoot].filter(Boolean)
    roots.forEach(r => {
      r.querySelectorAll('.hint').forEach(e => e.remove())
      r.querySelectorAll('a,button').forEach(e => {
        if (/download|obj|mtl|export|\.glb|\.gltf/i.test(e.textContent || '')) e.remove()
      })
    })
    return stage
  }

  let tries = 0
  const iv = setInterval(() => {
    tries++
    const stage = stripDownloadUI()
    if (stage && stage._controls) {
      stage._controls.enableZoom = false
      stage._controls.enablePan = false
      stage._controls.enableRotate = false
      // enabled stays true — its own fixed-target update loop still runs
    }
    if ((stage && stage._controls) || tries > 40) clearInterval(iv) // stop ~10s
  }, 250)

  w.addEventListener(
    'wheel',
    (e: WheelEvent) => {
      window.scrollBy(0, e.deltaY)
    },
    { passive: true }
  )

  const mo = new MutationObserver(stripDownloadUI)
  mo.observe(d.documentElement, { childList: true, subtree: true })
}

// The interactive scene itself is a self-contained Three.js artifact
// (public/conveyor/index.html — loads its own three@0.184.0 from unpkg,
// depends on a custom <three-d-stage> runtime + EffectComposer) embedded
// verbatim via iframe rather than re-ported, so its visuals/behavior stay
// exactly as built — the byte-fragile embedded base64/JSON blobs mean
// tuning it happens from here, not by editing that file. This wrapper
// handles WHEN it loads (a heavy WebGL scene like this must not be part
// of the initial page weight, so the iframe's src is withheld until the
// section is close to scrolling into view) and tunes its embedded
// behavior on load (see tuneConveyor above).
export default function ConveyorCards() {
  const sectionRef = useRef<HTMLElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)
  const isMobile = useIsMobile()

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
          onLoad={e => tuneConveyor(e.currentTarget)}
          className="absolute inset-0 h-full w-full"
          // Mobile: wheel-forwarding doesn't apply to touch, so instead of
          // trapping scroll gestures the iframe is simply excluded from
          // hit-testing there — native scroll passes straight through.
          // Card hover/click is a desktop nice-to-have, not the point of
          // the section on a phone.
          style={{ border: 0, pointerEvents: isMobile ? 'none' : 'auto' }}
        />
      )}

      {/* Cinematic vignette — strong, moody: corners near-black, only the
          center (the cards) and the headline stay lit. pointer-events-none
          so it never blocks the iframe's own hover/click-to-connect. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 48% 46% at 50% 50%, rgba(0,0,0,0) 32%, rgba(6,6,9,0.72) 74%, rgba(6,6,9,0.97) 100%)',
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
