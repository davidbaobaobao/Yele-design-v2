'use client'

import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '@/context/LanguageContext'
import type * as THREE_TYPES from 'three'

// ── Card data ─────────────────────────────────────────────────────────────────

const PALETTE = [
  '#C9BFE0', // 0 Lilac mist
  '#A98FC4', // 1 Deep lavender
  '#D9A0C4', // 2 Orchid pink
  '#E8B4B8', // 3 Blush rose
  '#F0AE83', // 4 Soft coral
  '#F6D3AE', // 5 Peach cream
  '#FBEFDF', // 6 Ivory white
]

// Cards with light backgrounds → dark ink; deep lavender card (1) → white ink
const DARK_INK = new Set([0, 2, 3, 4, 5, 6])

const CARDS = [
  {
    en: { title: 'Fixed monthly price', desc: 'No hidden fees, no end-of-month surprises. Design, marketing, and maintenance — all in one flat rate.' },
    es: { title: 'Precio mensual fijo',  desc: 'Sin tarifas ocultas ni sorpresas a final de mes. Diseño, marketing y mantenimiento en una cuota plana.' },
  },
  {
    en: { title: 'No lock-in',           desc: "Cancel whenever you want — no penalties, no fine print. You stay because you want to, not because you're stuck." },
    es: { title: 'Sin permanencia',      desc: 'Cancela cuando quieras, sin penalizaciones ni letra pequeña. Te quedas porque quieres, no porque estás atado.' },
  },
  {
    en: { title: 'Content generation',   desc: 'Stunning photos, videos, and copy that make your site stand out from the competition — not blend into it.' },
    es: { title: 'Creación de contenido', desc: 'Fotos, vídeos y textos impactantes que hacen que tu web destaque sobre la competencia.' },
  },
  {
    en: { title: 'Changes included',     desc: 'Request the changes you need and we make them — no extra invoice every time you want to tweak something.' },
    es: { title: 'Cambios incluidos',    desc: 'Solicita los cambios que necesitas y los hacemos, sin factura extra cada vez que quieras modificar algo.' },
  },
  {
    en: { title: 'Maintenance always on', desc: 'Hosting, domain, security, and updates covered continuously — not just on launch day.' },
    es: { title: 'Mantenimiento activo', desc: 'Hosting, dominio, seguridad y actualizaciones cubiertos de forma continua, no solo el día del lanzamiento.' },
  },
  {
    en: { title: 'Marketing month after month', desc: "We don't disappear after delivering the site — content, SEO, and conversion improvements, ongoing." },
    es: { title: 'Marketing mes a mes', desc: 'No desaparecemos tras entregar la web: contenido, SEO y mejoras de conversión, de forma continua.' },
  },
  {
    en: { title: 'Fast delivery',        desc: 'Your site ready in days, not months. And future updates, just as fast.' },
    es: { title: 'Entrega rápida',       desc: 'Tu web lista en días, no en meses. Y las actualizaciones futuras, igual de rápidas.' },
  },
]

// ── Inline icons (one per card) ───────────────────────────────────────────────

const ICONS = [
  // tag — fixed price
  <svg key="tag" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>,
  // unlock — no lock-in
  <svg key="unlock" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 019.9-1"/>
  </svg>,
  // camera — content
  <svg key="camera" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>
  </svg>,
  // pencil — changes
  <svg key="pencil" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z"/>
  </svg>,
  // shield — maintenance
  <svg key="shield" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>,
  // trending-up — marketing
  <svg key="trend" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>,
  // zap — fast delivery
  <svg key="zap" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>,
]

// ── Card fan layout ────────────────────────────────────────────────────────────

const CARD_W = 330
const CARD_H = 470

function cardAnim(off: number) {
  const abs = Math.abs(off)
  if (abs > 2) return { x: Math.sign(off) * 920, opacity: 0, scale: 0.55, rotateZ: -Math.sign(off) * 26 }
  return {
    x:       off * 308,
    rotateZ: -off * 10,
    scale:   1 - abs * 0.09,
    opacity: 1 - abs * 0.30,
  }
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function WhySubscription() {
  const { t }       = useLang()
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const sectionRef  = useRef<HTMLElement>(null)
  const [active, setActive] = useState(3)
  const dragStart   = useRef(0)
  const N = CARDS.length

  function goTo(i: number) { setActive(Math.max(0, Math.min(N - 1, i))) }

  // ── Three.js low-poly crystal background ──────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let animId = 0
    let disposeAll: (() => void) | null = null

    import('three').then((THREE) => {
      const w = canvas.clientWidth  || window.innerWidth
      const h = canvas.clientHeight || window.innerHeight

      // Renderer
      const renderer: THREE_TYPES.WebGLRenderer = new THREE.WebGLRenderer({ canvas, antialias: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
      renderer.setSize(w, h, false)
      renderer.outputColorSpace = THREE.SRGBColorSpace

      // Scene
      const scene = new THREE.Scene()
      scene.background = new THREE.Color('#0a0a0a')

      // Fixed camera — close, slightly low angle, crops tight to the surface
      const camera = new THREE.PerspectiveCamera(52, w / h, 0.1, 100)
      camera.position.set(3, 17, 18)
      camera.lookAt(0, 1, 0)

      // ── Geometry: low-poly terrain with diagonal seam ─────────────────────
      const seg = window.innerWidth < 768 ? 22 : 36
      const geo = new THREE.PlaneGeometry(34, 34, seg, seg)
      const rawPos = geo.attributes.position as THREE_TYPES.BufferAttribute

      // Displace Z (before rotation): chaotic upper-left, smooth lower-right.
      // In PlaneGeometry space: x ∈ [-17,17], y ∈ [-17,17].
      // After rotateX(-PI/2): x→x, y→worldZ, displaced Z→worldY (height).
      // Diagonal d=0 at (-17,+17) [top-left screen], d=1 at (+17,-17) [bottom-right].
      for (let i = 0; i < rawPos.count; i++) {
        const x = rawPos.getX(i)
        const y = rawPos.getY(i)
        const d = Math.max(0, Math.min(1, (x - y + 34) / 68))
        const chaos = Math.pow(1 - d, 2.4)
        rawPos.setZ(i, (Math.random() * 2 - 1) * 4.8 * chaos)
      }
      rawPos.needsUpdate = true
      geo.rotateX(-Math.PI / 2)

      // Non-indexed geometry → flat shading assigns one normal per face
      const flatGeo = geo.toNonIndexed()

      // Vertex colors — one color per face (set all 3 verts to face centroid color)
      const fp = flatGeo.attributes.position as THREE_TYPES.BufferAttribute
      const colBuf = new Float32Array(fp.count * 3)
      const colorStops = [
        new THREE.Color('#08060e'),
        new THREE.Color('#1a1030'),
        new THREE.Color('#A98FC4'),
        new THREE.Color('#D9A0C4'),
        new THREE.Color('#E8B4B8'),
        new THREE.Color('#F0AE83'),
        new THREE.Color('#FBEFDF'),
      ]
      const tmp = new THREE.Color()

      for (let i = 0; i < fp.count; i += 3) {
        // Face centroid in world space (post-rotation: world x, world z)
        const cx = (fp.getX(i) + fp.getX(i+1) + fp.getX(i+2)) / 3
        const cz = (fp.getZ(i) + fp.getZ(i+1) + fp.getZ(i+2)) / 3
        // Same diagonal mapping (world x = orig x, world z = orig y after rotation)
        const d   = Math.max(0, Math.min(1, (cx - cz + 34) / 68))
        const raw = d * (colorStops.length - 1)
        const lo  = Math.floor(raw)
        const hi  = Math.min(colorStops.length - 1, lo + 1)
        tmp.lerpColors(colorStops[lo], colorStops[hi], raw - lo)
        for (let j = 0; j < 3; j++) {
          colBuf[(i+j)*3]   = tmp.r
          colBuf[(i+j)*3+1] = tmp.g
          colBuf[(i+j)*3+2] = tmp.b
        }
      }
      flatGeo.setAttribute('color', new THREE.BufferAttribute(colBuf, 3))
      flatGeo.computeVertexNormals()

      const mat = new THREE.MeshStandardMaterial({
        vertexColors: true,
        flatShading:  true,
        roughness:    0.42,
        metalness:    0.06,
      })

      scene.add(new THREE.Mesh(flatGeo, mat))

      // ── Lights ────────────────────────────────────────────────────────────
      scene.add(new THREE.AmbientLight(0x1a1828, 2.2))

      const main = new THREE.DirectionalLight(0xe2482f, 3.8)
      main.position.set(7, 13, 5)
      scene.add(main)

      const cool = new THREE.DirectionalLight(0x8898cc, 0.9)
      cool.position.set(-9, 7, -5)
      scene.add(cool)

      // ── Continuous light sweep (Math.sin/cos — no reset jump) ─────────────
      let timer = 0
      function tick() {
        animId = requestAnimationFrame(tick)
        timer += 0.0038
        main.position.set(
          Math.cos(timer) * 14,
          12 + Math.sin(timer * 0.44) * 3.5,
          Math.sin(timer * 0.72) * 10,
        )
        renderer.render(scene, camera)
      }
      tick()

      // ── Resize ────────────────────────────────────────────────────────────
      function onResize() {
        const nw = canvas.clientWidth
        const nh = canvas.clientHeight
        camera.aspect = nw / nh
        camera.updateProjectionMatrix()
        renderer.setSize(nw, nh, false)
      }
      window.addEventListener('resize', onResize)

      disposeAll = () => {
        window.removeEventListener('resize', onResize)
        flatGeo.dispose()
        mat.dispose()
        renderer.dispose()
      }
    })

    return () => {
      cancelAnimationFrame(animId)
      disposeAll?.()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="why-subscription"
      className="relative min-h-screen overflow-hidden bg-[#0a0a0a]"
    >
      {/* Three.js crystal canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block' }}
      />

      {/* Gradient scrim — readability without fully blocking the animation */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.18) 42%, rgba(0,0,0,0.60) 100%)',
        }}
      />

      {/* Page content */}
      <div className="relative z-10 flex flex-col items-center px-4 pt-20 pb-20">

        {/* Section heading */}
        <div className="text-center mb-14 max-w-xl">
          <p
            className="font-manrope text-white/45 uppercase tracking-widest mb-4"
            style={{ fontSize: 11, letterSpacing: '0.18em' }}
          >
            {t('Por qué elegirnos', 'Why choose us')}
          </p>
          <h2
            className="font-outfit font-semibold text-white leading-tight"
            style={{ fontSize: 'clamp(30px, 4.5vw, 54px)' }}
          >
            {t('¿Por qué suscripción', 'Why subscription')}<br />
            <span className="we-subtitle-orange">{t('es mejor?', 'is better?')}</span>
          </h2>
        </div>

        {/* ── Card fan carousel ── */}
        <div
          className="relative w-full flex items-center justify-center select-none"
          style={{ height: CARD_H + 32, perspective: 1100 }}
          onPointerDown={(e) => { dragStart.current = e.clientX }}
          onPointerUp={(e) => {
            const dx = dragStart.current - e.clientX
            if (Math.abs(dx) > 48) goTo(active + (dx > 0 ? 1 : -1))
          }}
        >
          {CARDS.map((card, i) => {
            const off      = i - active
            const anim     = cardAnim(off)
            const darkInk  = DARK_INK.has(i)
            const fg       = darkInk ? '#1a0a2e' : '#ffffff'
            const fgMuted  = darkInk ? 'rgba(15,5,25,0.58)' : 'rgba(255,255,255,0.60)'
            const iconRing = darkInk ? 'rgba(0,0,0,0.13)' : 'rgba(255,255,255,0.20)'

            return (
              <motion.div
                key={i}
                animate={anim}
                transition={{ type: 'spring', stiffness: 290, damping: 32 }}
                onClick={() => off !== 0 && goTo(i)}
                style={{
                  position:         'absolute',
                  width:            CARD_W,
                  height:           CARD_H,
                  borderRadius:     24,
                  background:       PALETTE[i],
                  padding:          32,
                  display:          'flex',
                  flexDirection:    'column',
                  cursor:           off !== 0 ? 'pointer' : 'default',
                  zIndex:           20 - Math.abs(off),
                  userSelect:       'none',
                  WebkitUserSelect: 'none',
                  boxShadow:        off === 0
                    ? '0 32px 80px rgba(0,0,0,0.60), 0 8px 24px rgba(0,0,0,0.35)'
                    : '0 12px 36px rgba(0,0,0,0.35)',
                }}
              >
                {/* Icon badge */}
                <div style={{
                  width: 50, height: 50, borderRadius: 15,
                  background: iconRing,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: fg, marginBottom: 28, flexShrink: 0,
                }}>
                  {ICONS[i]}
                </div>

                {/* Counter */}
                <p style={{
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: fgMuted, marginBottom: 12,
                }}>
                  {String(i + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
                </p>

                {/* Title */}
                <h3 style={{
                  fontFamily:  'var(--font-outfit), sans-serif',
                  fontSize:    26,
                  fontWeight:  700,
                  lineHeight:  1.18,
                  color:       fg,
                  marginBottom: 18,
                  flexShrink:  0,
                }}>
                  {t(card.es.title, card.en.title)}
                </h3>

                {/* Description */}
                <p style={{
                  fontFamily: 'var(--font-manrope), sans-serif',
                  fontSize:   14.5,
                  lineHeight: 1.68,
                  color:      fgMuted,
                  flex:       1,
                }}>
                  {t(card.es.desc, card.en.desc)}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* Dot indicators */}
        <div className="flex items-center gap-2.5 mt-10" role="tablist" aria-label="Card navigation">
          {CARDS.map((_, i) => (
            <motion.button
              key={i}
              role="tab"
              aria-selected={i === active}
              aria-label={`Card ${i + 1}`}
              onClick={() => goTo(i)}
              animate={{
                width:           i === active ? 28 : 8,
                backgroundColor: i === active ? PALETTE[active] : 'rgba(255,255,255,0.22)',
              }}
              transition={{ duration: 0.28 }}
              className="h-2 rounded-full"
            />
          ))}
        </div>

        {/* Arrow buttons */}
        <div className="flex gap-3 mt-5">
          {[
            { label: 'Previous', dir: -1, d: 'M15 18 9 12 15 6' },
            { label: 'Next',     dir:  1, d: 'M9 18 15 12 9 6' },
          ].map(({ label, dir, d }) => (
            <button
              key={label}
              onClick={() => goTo(active + dir)}
              disabled={dir === -1 ? active === 0 : active === N - 1}
              aria-label={label}
              className="w-11 h-11 rounded-full flex items-center justify-center text-white/55 border border-white/18 hover:text-white hover:border-white/45 disabled:opacity-25 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points={d} />
              </svg>
            </button>
          ))}
        </div>

      </div>
    </section>
  )
}
