'use client'

import { useEffect, useRef } from 'react'

export default function SandHelixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Make body transparent so the z-index:-1 canvas is visible
    document.documentElement.classList.add('sand-helix-page')

    const canvas = canvasRef.current
    if (!canvas) return
    // Non-null assertion: getContext('2d') is always non-null on a valid canvas element
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const TWO_PI = Math.PI * 2
    const N = 780
    const NV = 620
    const COLOR = [110, 110, 106] as const

    let W = 0, H = 0, dpr = 1

    // Pre-rendered dot sprite (drawImage is cheaper than arc+fill per particle)
    const SPRITE_R = 16
    const sprite = document.createElement('canvas')
    sprite.width = sprite.height = SPRITE_R * 2
    const sc = sprite.getContext('2d')!
    const grd = sc.createRadialGradient(SPRITE_R, SPRITE_R, 0, SPRITE_R, SPRITE_R, SPRITE_R)
    const cStr = `${COLOR[0]},${COLOR[1]},${COLOR[2]}`
    grd.addColorStop(0,    `rgba(${cStr},1)`)
    grd.addColorStop(0.55, `rgba(${cStr},1)`)
    grd.addColorStop(1,    `rgba(${cStr},0)`)
    sc.fillStyle = grd
    sc.beginPath()
    sc.arc(SPRITE_R, SPRITE_R, SPRITE_R, 0, TWO_PI)
    sc.fill()

    let triggered = false
    let phase = 0
    let trigTime = 0
    const DUR = reduce ? 900 : 1900

    let flowH = Math.random()
    let flowV = Math.random()

    const grand = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5

    type P = {
      s: number; s2: number; ph: number; freq: number
      band: number; band2: number; sdir: number; smag: number
      sspin: number; rBase: number
    }

    function mk(order: number): P {
      return {
        s:     (order + (Math.random() - 0.5) * 0.02 + 1) % 1,
        s2:    Math.random(),
        ph:    Math.random() * TWO_PI,
        freq:  0.85 + Math.random() * 0.35,
        band:  grand(),
        band2: grand(),
        sdir:  Math.random() * TWO_PI,
        smag:  90 + Math.random() * 230,
        sspin: (Math.random() - 0.5) * 6,
        rBase: 0.9 + Math.random() * 1.0,
      }
    }

    const pool: P[] = []
    for (let i = 0; i < N; i++) pool.push(mk(i / N))
    const vPool: P[] = []
    for (let i = 0; i < NV; i++) vPool.push(mk(Math.random()))

    function wave(t: number) {
      return (Math.sin(t) * 0.7 + Math.sin(t * 1.73 + 1.3) * 0.24 + Math.sin(t * 0.51 + 4.0) * 0.18) / 1.12
    }

    let cyH = 0, ampH = 0, bandH = 0, turnsH = 0
    let cxV = 0, ampV = 0, bandV = 0, turnsV = 0

    function geometry() {
      cyH    = H * 0.5
      ampH   = H * 0.22
      bandH  = H * 0.08
      turnsH = Math.max(3, Math.round(W / 300))
      cxV    = W * 0.5
      ampV   = W * 0.26
      bandV  = W * 0.09
      turnsV = Math.max(3, Math.round(H / 240))
    }

    function resize() {
      if (!canvas || !ctx) return
      dpr = Math.min(devicePixelRatio || 1, 2)
      W = innerWidth; H = innerHeight
      canvas.width  = W * dpr; canvas.height = H * dpr
      canvas.style.width  = W + 'px'
      canvas.style.height = H + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      geometry()
    }

    let vVel = 0
    const V_BASE = -0.00006

    function trigger() {
      if (triggered) return
      triggered = true
      trigTime = performance.now()
    }

    function pushScroll(deltaY: number) {
      trigger()
      vVel += -deltaY * 0.0000075
    }

    const onWheel      = (e: WheelEvent)    => pushScroll(e.deltaY)
    const onKeydown    = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', ' ', 'Spacebar'].includes(e.key)) pushScroll(60)
      else if (['ArrowUp', 'PageUp'].includes(e.key)) pushScroll(-60)
    }
    let touchY: number | null = null
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY }
    const onTouchMove  = (e: TouchEvent) => {
      const y = e.touches[0].clientY
      if (touchY !== null) pushScroll((touchY - y) * 1.4)
      touchY = y
    }

    const smooth = (t: number) => t * t * (3 - 2 * t)
    const lerp   = (a: number, b: number, t: number) => a + (b - a) * t

    let last = performance.now()
    let rafId = 0

    function frame(now: number) {
      const dt = Math.min(50, now - last); last = now

      flowH  = (flowH + dt * 0.00007) % 1
      vVel  += (V_BASE - vVel) * 0.03
      flowV  = (flowV + vVel * dt + 1) % 1

      if (triggered) phase = Math.min(1, (now - trigTime) / DUR)
      const ph    = smooth(phase)
      const burst = reduce ? 0 : Math.pow(Math.sin(phase * Math.PI), 0.85)

      ctx.clearRect(0, 0, W, H)

      const mX = 40, mY = 40
      for (let i = 0; i < N; i++) {
        const p = pool[i]

        const hs   = (p.s + flowH) % 1
        const thH  = hs * turnsH * TWO_PI * p.freq + p.ph
        const hx   = -mX + hs * (W + mX * 2) + p.band2 * 22
        const hy   = cyH + wave(thH) * ampH + p.band * bandH
        const hDep = Math.cos(thH)

        const vs   = (p.s2 + flowV) % 1
        const thV  = vs * turnsV * TWO_PI * p.freq + p.ph
        const vy   = -mY + vs * (H + mY * 2) + p.band2 * 22
        const vx   = cxV + wave(thV) * ampV + p.band * bandV
        const vDep = Math.cos(thV)

        let x = lerp(hx, vx, ph)
        let y = lerp(hy, vy, ph)
        const depth = lerp(hDep, vDep, ph)

        if (burst > 0.001) {
          const a = p.sdir + burst * p.sspin
          x += Math.cos(a) * p.smag * burst
          y += Math.sin(a) * p.smag * burst
        }

        const d = depth * 0.5 + 0.5
        const r = p.rBase * (0.55 + d * 0.85)
        ctx.globalAlpha = (0.22 + d * 0.55) * (1 - burst * 0.35)
        ctx.drawImage(sprite, x - r, y - r, r * 2, r * 2)
      }

      if (ph > 0.001) {
        for (let i = 0; i < NV; i++) {
          const p = vPool[i]
          const vs  = (p.s2 + flowV) % 1
          const thV = vs * turnsV * TWO_PI * p.freq + p.ph
          let x = cxV + wave(thV) * ampV + p.band * bandV
          let y = -mY + vs * (H + mY * 2) + p.band2 * 22
          if (burst > 0.001) {
            const a = p.sdir + burst * p.sspin
            x += Math.cos(a) * p.smag * burst
            y += Math.sin(a) * p.smag * burst
          }
          const d = Math.cos(thV) * 0.5 + 0.5
          const r = p.rBase * (0.55 + d * 0.85)
          ctx.globalAlpha = (0.22 + d * 0.55) * ph * (1 - burst * 0.35)
          ctx.drawImage(sprite, x - r, y - r, r * 2, r * 2)
        }
      }

      ctx.globalAlpha = 1
      rafId = requestAnimationFrame(frame)
    }

    window.addEventListener('wheel',      onWheel,      { passive: true })
    window.addEventListener('keydown',    onKeydown,    { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove',  onTouchMove,  { passive: true })
    window.addEventListener('scroll',     trigger,      { passive: true })
    window.addEventListener('resize',     resize,       { passive: true })

    resize()
    rafId = requestAnimationFrame(frame)

    return () => {
      document.documentElement.classList.remove('sand-helix-page')
      cancelAnimationFrame(rafId)
      window.removeEventListener('wheel',      onWheel)
      window.removeEventListener('keydown',    onKeydown)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove',  onTouchMove)
      window.removeEventListener('scroll',     trigger)
      window.removeEventListener('resize',     resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  )
}
