'use client'

import { useEffect, useRef, useState } from 'react'
import { useIsMobile } from '@/hooks/useIsMobile'

/* eslint-disable @typescript-eslint/no-explicit-any -- reaching into the
   iframe's own <three-d-stage> custom element internals (stage._controls
   etc.), which aren't ours to type; see public/conveyor/index.html. */

// Same-origin only (public/conveyor/index.html is served from yele.design
// itself) — reaches into iframe.contentWindow/contentDocument directly
// rather than postMessage. Polls (the artifact's OrbitControls/renderer
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
//   (d) best-effort pixelRatio cap — see the comment at that line for why
//       this alone isn't the real fill-rate win (the CSS downscale on the
//       iframe itself, below, is).
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
    // Cheap best-effort: this composer's post-processing passes (bokeh,
    // film-look shader, output) are fixed-resolution render targets sized
    // by the artifact's own closure-scoped composer.setSize() call, which
    // isn't reachable from outside its module scope — a bare
    // setPixelRatio() can't force them to reallocate. The real fill-rate
    // win is the iframe's own CSS size below, which the artifact's
    // existing ResizeObserver->sizeComposer() chain already picks up
    // correctly on its own, no extra triggering needed.
    if (stage && stage._renderer && stage._renderer.getPixelRatio() !== 1) {
      stage._renderer.setPixelRatio(1)
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

// Mobile poster — reuses the artifact's own lightweight loading-thumbnail
// SVG (a stylized approximation of the scene, straight from public/
// conveyor/index.html's own #__bundler_thumbnail fallback) rather than a
// real WebGL scene. Phones can't afford a second full 3D scene alongside
// the hero cubes; this is the "static poster" without needing a
// screenshot asset that doesn't exist yet.
function ConveyorPoster() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <svg viewBox="0 0 1200 675" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="675" fill="#0D0E12" />
        <g transform="translate(600,340) rotate(-18)">
          <rect x="-260" y="60" width="520" height="150" rx="18" fill="#3a3c42" />
          <rect x="-120" y="-60" width="220" height="150" rx="14" fill="#565963" opacity="0.9" />
          <rect x="-15" y="-135" width="200" height="140" rx="14" fill="#7d818c" />
          <circle cx="-60" cy="10" r="9" fill="#ff9fc4" />
        </g>
      </svg>
      <div
        className="absolute left-[7%] top-[34%] pr-6"
        style={{
          fontFamily: '"Courier New", ui-monospace, monospace',
          fontWeight: 500,
          fontSize: 'clamp(20px, 5.5vw, 32px)',
          lineHeight: 1.25,
          letterSpacing: '.06em',
          color: '#c9ccd4',
          opacity: 0.82,
          textShadow: '0 0 18px rgba(238,240,244,.5), 0 0 46px rgba(238,240,244,.22)',
        }}
      >
        We make your website<br />Fast.<br />Secure.
      </div>
    </div>
  )
}

// The interactive scene itself is a self-contained Three.js artifact
// (public/conveyor/index.html — loads its own three@0.184.0 from unpkg,
// depends on a custom <three-d-stage> runtime + EffectComposer) embedded
// verbatim via iframe rather than re-ported, so its visuals/behavior stay
// exactly as built — the byte-fragile embedded base64/JSON blobs mean
// tuning and unloading it happens from here, not by editing that file.
export default function ConveyorCards() {
  const sectionRef = useRef<HTMLElement>(null)
  const [inViewport, setInViewport] = useState(false)
  const [tabHidden, setTabHidden] = useState(false)
  const isMobile = useIsMobile()

  // A running render loop + full WebGL context off-screen is what was
  // lagging the whole page — not just deferring the FIRST load (previous
  // behavior), but fully unmounting whenever it's not actually visible,
  // freeing the GPU context each time. Two observers rather than one give
  // it asymmetric hysteresis: mounts early (300px approach) but only
  // unmounts once genuinely far away (a full viewport-height past the
  // edge) — a single symmetric margin would remount/unmount repeatedly on
  // small scrolls right at one boundary.
  useEffect(() => {
    const el = sectionRef.current
    if (!el || !('IntersectionObserver' in window)) {
      setInViewport(true)
      return
    }
    const loadIO = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) setInViewport(true)
      },
      { rootMargin: '300px 0px' }
    )
    const unloadIO = new IntersectionObserver(
      entries => {
        if (!entries[0]?.isIntersecting) setInViewport(false)
      },
      { rootMargin: '100% 0px' }
    )
    loadIO.observe(el)
    unloadIO.observe(el)
    return () => {
      loadIO.disconnect()
      unloadIO.disconnect()
    }
  }, [])

  // No reason to render a hidden tab either.
  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden)
    onVisibility()
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const showScene = !isMobile && inViewport && !tabHidden

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden" style={{ backgroundColor: '#0D0E12' }}>
      {isMobile ? (
        <ConveyorPoster />
      ) : (
        showScene && (
          <iframe
            src="/conveyor/index.html"
            title="Conveyor"
            scrolling="no"
            loading="lazy"
            onLoad={e => tuneConveyor(e.currentTarget)}
            style={{
              border: 0,
              position: 'absolute',
              top: 0,
              left: 0,
              // Rendered at 70% of its real box, then scaled back up to
              // fill it — the artifact's own ResizeObserver->composer
              // chain picks up the smaller CSS size on its own (this is
              // an actual smaller viewport, not a paint-time transform),
              // so every pass genuinely does less work, not just the
              // final blit. The heavy DoF blur + our vignette mask the
              // softness from the compensating upscale.
              width: '70%',
              height: '70%',
              transform: 'scale(1.42857)',
              transformOrigin: 'top left',
            }}
          />
        )
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
