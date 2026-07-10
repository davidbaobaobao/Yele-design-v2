'use client'

import { useEffect, useRef } from 'react'

export default function SandHelixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    document.documentElement.classList.add('sand-helix-page')
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    const TWO_PI = Math.PI * 2
    const mobile = window.innerWidth < 768

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.remove('sand-helix-page')
      return
    }

    let W = 0, H = 0, dpr = 1
    let fX = 0, fY = 0

    function findFocal() {
      const el = document.getElementById('scroll-hint-arrow')
      if (el) {
        const r = el.getBoundingClientRect()
        fX = r.left + r.width  / 2
        fY = r.top  + r.height / 2
      } else {
        fX = W / 2
        fY = H * 0.60
      }
    }

    // — particle pool —
    const N       = mobile ? 55 : 110
    const N_GREEN = Math.floor(N * 0.09)   // ~9% brand green
    const GREEN   = '#34C759'
    const GRAY    = 'rgb(105,105,100)'

    type P = {
      angle:    number   // base direction from focal
      noiseOff: number   // static angular noise baked at birth
      noiseF:   number   // dynamic noise oscillation frequency
      maxR:     number   // max radius at pulse peak
      // spiral
      sAng: number; sRad: number; sT: number; sSpd: number
      green: boolean
      sz:   number       // solid circle radius px
    }

    const pts: P[] = Array.from({ length: N }, (_, i) => ({
      angle:    Math.random() * TWO_PI,
      noiseOff: (Math.random() - 0.5) * 1.6,
      noiseF:   0.3 + Math.random() * 0.9,
      // wide range → irregular cloud shape at peak
      maxR:     10 + Math.pow(Math.random(), 0.42) * 230,

      sAng: (i / N) * TWO_PI * 3.5 + Math.random() * 0.6,
      sRad: 18 + Math.random() * 90,
      sT:   Math.random(),
      sSpd: (0.5 + Math.random() * 1.0) * 0.00011,

      green: i < N_GREEN,
      sz:    1.1 + Math.random() * 2.1,
    }))

    // — pulse waveform 0..1 → 0..1 —
    // shape: sharp rise 13% | hold 27% | fall 18% | dark pause 42%
    function pulse(t: number): number {
      if (t < 0.13) return t / 0.13
      if (t < 0.40) return 1
      if (t < 0.58) return 1 - (t - 0.40) / 0.18
      return 0
    }
    const PERIOD = 2400   // ms

    // — scroll state —
    let triggered = false, trigTime = 0
    let flow = 0, last = performance.now(), raf = 0
    const t0 = performance.now()

    // +40% colour strength over previous baseline
    const BASE = (mobile ? 0.10 : 0.14) * 1.4

    const s3   = (t: number) => t * t * (3 - 2 * t)
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    function trigger() {
      if (triggered) return
      triggered = true; trigTime = performance.now()
    }

    function resize() {
      if (!canvas) return
      dpr = Math.min(devicePixelRatio || 1, 2)
      W = innerWidth; H = innerHeight
      canvas.width  = W * dpr; canvas.height = H * dpr
      canvas.style.width  = W + 'px'; canvas.style.height = H + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      findFocal()
    }

    function frame(now: number) {
      const dt = Math.min(50, now - last); last = now
      flow += dt * 0.000085

      // Current pulse intensity (0 when invisible between beats)
      const pv = pulse(((now - t0) % PERIOD) / PERIOD)

      // Scroll phases: 0.55s swarm-out, then 1.7s spiral (overlapping start)
      const el      = triggered ? now - trigTime : 0
      const swarmPh = s3(Math.min(1,                    el / 550))
      const spirPh  = s3(Math.max(0, Math.min(1, (el - 380) / 1700)))

      ctx.clearRect(0, 0, W, H)

      for (let i = 0; i < N; i++) {
        const p = pts[i]

        // —— PULSE position ——
        // living noise on angle → unique shape each beat
        const dn = Math.sin(now * 0.00065 * p.noiseF + p.angle * 1.7) * 0.24
        const a  = p.angle + p.noiseOff * 0.52 + dn
        const bx = fX + Math.cos(a) * p.maxR * pv
        const by = fY + Math.sin(a) * p.maxR * pv

        // —— SWARM position (fully extended from focal) ——
        const ex = fX + Math.cos(a) * p.maxR
        const ey = fY + Math.sin(a) * p.maxR

        // —— SPIRAL position ——
        p.sT = (p.sT + p.sSpd * dt) % 1
        const sa = p.sAng + flow * TWO_PI * 2.3
        const sx = W * 0.5 + Math.cos(sa) * p.sRad
        const sy = p.sT * (H + 60) - 30

        // —— BLEND: pulse → swarm → spiral ——
        const mx = lerp(bx, ex, swarmPh)
        const my = lerp(by, ey, swarmPh)
        const x  = lerp(mx, sx, spirPh)
        const y  = lerp(my, sy, spirPh)

        // —— ALPHA ——
        // before scroll: tied to pulse (invisible between beats)
        // after swarm:   fully on
        const alpha = triggered
          ? lerp(pv * BASE, BASE, swarmPh)
          : pv * BASE

        if (alpha < 0.006) continue   // skip invisible dots cheaply

        // —— DRAW: solid circle, zero blur ——
        ctx.globalAlpha = alpha
        ctx.fillStyle   = p.green ? GREEN : GRAY
        ctx.beginPath()
        ctx.arc(x, y, p.sz, 0, TWO_PI)
        ctx.fill()
      }

      ctx.globalAlpha = 1
      raf = requestAnimationFrame(frame)
    }

    window.addEventListener('wheel',     trigger,                    { passive: true })
    window.addEventListener('scroll',    trigger,                    { passive: true })
    window.addEventListener('touchmove', trigger,                    { passive: true })
    window.addEventListener('keydown',   (e: KeyboardEvent) => {
      if ([' ', 'ArrowDown', 'PageDown'].includes(e.key)) trigger()
    },                                                               { passive: true })
    window.addEventListener('resize',    resize,                     { passive: true })

    resize()
    setTimeout(findFocal, 180)
    raf = requestAnimationFrame(frame)

    return () => {
      document.documentElement.classList.remove('sand-helix-page')
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none' }}
    />
  )
}
