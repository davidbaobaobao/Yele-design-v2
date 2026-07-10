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

    // — soft gray radial dot sprite —
    const SR = 13
    const spr = document.createElement('canvas')
    spr.width = spr.height = SR * 2
    const sc = spr.getContext('2d')!
    const g = sc.createRadialGradient(SR, SR, 0, SR, SR, SR)
    g.addColorStop(0,    'rgba(105,105,100,1)')
    g.addColorStop(0.5,  'rgba(105,105,100,0.75)')
    g.addColorStop(1,    'rgba(105,105,100,0)')
    sc.fillStyle = g
    sc.beginPath(); sc.arc(SR, SR, SR, 0, TWO_PI); sc.fill()

    let W = 0, H = 0, dpr = 1
    let fX = 0, fY = 0   // focal = center of down arrow

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
    const N = mobile ? 60 : 120
    type P = {
      // swarm
      ang: number; rad: number; angV: number; no: number; esc: boolean
      // spiral
      sa: number; sr: number; st: number; sv: number
      // render
      sz: number
    }

    const pts: P[] = Array.from({ length: N }, (_, i) => {
      const esc = i < N * 0.20           // 20% escape particles
      const ang = (i / N) * TWO_PI + Math.random() * 0.5
      const rad = esc
        ? 130 + Math.random() * 300
        : 8   + Math.pow(Math.random(), 0.65) * 165

      return {
        ang, rad,
        angV: (0.07 + Math.random() * 0.18) * (Math.random() > .5 ? 1 : -1) * 0.001,
        no:   Math.random() * TWO_PI,
        esc,
        sa:   (i / N) * TWO_PI * 3.5 + Math.random(),
        sr:   esc ? 70 + Math.random() * 130 : 18 + Math.random() * 85,
        st:   Math.random(),
        sv:   (0.5 + Math.random() * 0.9) * 0.00013,
        sz:   0.65 + Math.random() * 1.05,
      }
    })

    // — state —
    let triggered = false, trigTime = 0, spiralPh = 0
    let flow = 0, last = performance.now(), raf = 0

    const s3  = (t: number) => t * t * (3 - 2 * t)
    const mix = (a: number, b: number, t: number) => a + (b - a) * t

    function trigger() {
      if (triggered) return
      triggered = true; trigTime = performance.now()
    }

    function resize() {
      dpr = Math.min(devicePixelRatio || 1, 2)
      W = innerWidth; H = innerHeight
      canvas.width = W * dpr; canvas.height = H * dpr
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      findFocal()
    }

    function frame(now: number) {
      const dt = Math.min(50, now - last); last = now
      flow += dt * 0.000085

      if (triggered) spiralPh = Math.min(1, (now - trigTime) / 1700)
      const ph = s3(spiralPh)

      ctx.clearRect(0, 0, W, H)

      for (let i = 0; i < N; i++) {
        const p = pts[i]

        // —— SWARM ——
        p.ang += p.angV * dt
        p.no  += dt * 0.00021
        const nx = Math.sin(p.no * 2.1 + 0.6) * 13
        const ny = Math.cos(p.no * 1.7 + 2.3) * 8
        // elliptical: wide X, narrow Y keeps particles in the hero band
        const sx = fX + Math.cos(p.ang) * p.rad + nx
        const sy = fY + Math.sin(p.ang) * p.rad * 0.42 + ny

        // —— SPIRAL ——
        p.st = (p.st + p.sv * dt) % 1
        const sa = p.sa + flow * TWO_PI * 2.2
        const rx = W * 0.5 + Math.cos(sa) * p.sr
        const ry = p.st * (H + 60) - 30   // continuous downward flow

        // —— BLEND ——
        const x = mix(sx, rx, ph)
        const y = mix(sy, ry, ph)

        // —— ALPHA ——
        const dist = Math.hypot(x - fX, y - fY)
        const glow = Math.max(0, 1 - dist / (Math.max(W, H) * 0.42))
        const base = mobile ? 0.095 : 0.12
        const alpha = base * (ph < 0.5 ? 0.55 + glow * 0.45 : 0.8 + glow * 0.2)

        ctx.globalAlpha = alpha
        const rs = p.sz * SR
        ctx.drawImage(spr, x - rs, y - rs, rs * 2, rs * 2)
      }

      ctx.globalAlpha = 1
      raf = requestAnimationFrame(frame)
    }

    window.addEventListener('wheel',      trigger,                    { passive: true })
    window.addEventListener('scroll',     trigger,                    { passive: true })
    window.addEventListener('touchmove',  trigger,                    { passive: true })
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if ([' ', 'ArrowDown', 'PageDown'].includes(e.key)) trigger()
    },                                                                 { passive: true })
    window.addEventListener('resize',     resize,                     { passive: true })

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
