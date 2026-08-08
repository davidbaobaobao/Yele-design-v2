'use client'

import { useEffect, useRef, useState } from 'react'
import { useIsLowPowerDevice } from '@/hooks/useIsLowPowerDevice'
import { useWebglSlot } from '@/hooks/useWebglSlot'

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
//   (d) raises pixelRatio + maxes texture anisotropy once visible — see
//       the comments at those lines for what this can and can't reach.
//   (e) brightens the "We make your website / Fast. / Secure." headline —
//       the dark vignette sits right over its corner, so it needs a
//       slightly stronger glow to still read clearly.
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

  const boostHeadline = () => {
    const h = d.querySelector('.headline') as HTMLElement | null
    if (h) {
      h.style.opacity = '0.96' // was ~0.82
      h.style.color = '#e6e8ee' // slightly brighter
      h.style.textShadow = '0 0 22px rgba(238,240,244,0.75), 0 0 60px rgba(238,240,244,0.4)' // stronger glow
    }
  }

  // Desktop cap — mobile never reaches this at all (poster only, see
  // ConveyorCards below), so there's no separate mobile branch to handle
  // here.
  const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
  let anisotropyApplied = false
  let tries = 0
  const iv = setInterval(() => {
    tries++
    const stage = stripDownloadUI()
    boostHeadline()
    if (stage && stage._controls) {
      stage._controls.enableZoom = false
      stage._controls.enablePan = false
      stage._controls.enableRotate = false
      // enabled stays true — its own fixed-target update loop still runs
    }
    if (stage && stage._renderer) {
      if (stage._renderer.getPixelRatio() !== dpr) {
        stage._renderer.setPixelRatio(dpr)
        // Real effect here is genuinely uncertain: this composer's
        // post-processing passes (bokeh, film-look shader, output) are
        // fixed-resolution render targets whose OWN pixelRatio is cached
        // once at construction by EffectComposer itself and only
        // re-read via composer.setPixelRatio() — a method on the
        // closure-scoped `composer` instance, not reachable from outside
        // the artifact's module scope. Dispatching resize is cheap and
        // harmless (in case the stage runtime's own internal resize
        // handling re-reads pixelRatio on a real resize), so it's kept
        // as a best-effort nudge — but the change verified to actually
        // raise visible resolution is the iframe's own CSS size below,
        // since the artifact's ResizeObserver->sizeComposer()->
        // composer.setSize() chain runs on THAT unconditionally.
        d.defaultView?.dispatchEvent(new Event('resize'))
      }
      // Texture anisotropy is a live GPU sampler setting, independent of
      // the composer's cached pixelRatio above — this reliably sharpens
      // grazing-angle sampling (the belt tiles, mainly) regardless of
      // that uncertainty. Runs once — the scene's textures are all
      // created during initial boot, never replaced afterward.
      if (!anisotropyApplied && stage._scene && stage._renderer.capabilities) {
        const maxAniso = stage._renderer.capabilities.getMaxAnisotropy()
        const mapKeys = [
          'map', 'roughnessMap', 'normalMap', 'bumpMap', 'emissiveMap',
          'metalnessMap', 'aoMap', 'alphaMap', 'clearcoatMap', 'clearcoatRoughnessMap',
        ]
        stage._scene.traverse((obj: any) => {
          if (!obj.isMesh || !obj.material) return
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
          mats.forEach((mat: any) => {
            mapKeys.forEach(key => {
              const tex = mat[key]
              if (tex && tex.isTexture) {
                tex.anisotropy = maxAniso
                tex.needsUpdate = true
              }
            })
          })
        })
        anisotropyApplied = true
      }
    }
    if ((stage && stage._controls && anisotropyApplied) || tries > 40) clearInterval(iv) // stop ~10s
  }, 250)

  w.addEventListener(
    'wheel',
    (e: WheelEvent) => {
      window.scrollBy(0, e.deltaY)
    },
    { passive: true }
  )

  const mo = new MutationObserver(() => {
    stripDownloadUI()
    boostHeadline()
  })
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
  const [tabHidden, setTabHidden] = useState(false)
  const isLowPower = useIsLowPowerDevice()

  // No reason to render a hidden tab either.
  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden)
    onVisibility()
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  // Only mounts while this section is the PRIMARY thing on screen (>=50%
  // visible) AND nothing else currently holds the shared one-live-scene
  // slot (lib/webglLock.ts) — this used to run its own independent lazy-
  // load/unload IntersectionObservers, but with the hero cubes and now
  // two more WebGL-hosting sections on the page, each with its own
  // hysteresis margins, those windows could legitimately overlap and put
  // two heavy contexts (this one has post-processing + transmission-style
  // materials) live at once, which is what was freezing the tab.
  const isHolder = useWebglSlot('conveyor', sectionRef, !isLowPower && !tabHidden)
  const showScene = isHolder && !isLowPower && !tabHidden

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden" style={{ backgroundColor: '#0D0E12' }}>
      {isLowPower ? (
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
              // Rendered at 85% of its real box, then scaled back up to
              // fill it — the artifact's own ResizeObserver->composer
              // chain picks up the smaller CSS size on its own (this is
              // an actual smaller viewport, not a paint-time transform),
              // so every pass genuinely does less work, not just the
              // final blit. This is also the one lever verified to
              // actually reach the composer's render targets (unlike the
              // pixelRatio call above), so it's the real "sharpen" knob —
              // eased up from 70% now that off-screen unloading covers
              // most of the perf win, per the same tradeoff this task's
              // own pixelRatio increase makes. The heavy DoF blur + our
              // vignette mask the softness from the compensating upscale.
              width: '85%',
              height: '85%',
              transform: 'scale(1.17647)',
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
