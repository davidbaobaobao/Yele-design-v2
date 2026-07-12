'use client'

import { useEffect } from 'react'

const VELOCITY_THRESHOLD = 300
const RESET_MS           = 90
const LOCK_MS            = 1000

export default function ScrollBrake() {
  useEffect(() => {
    let locked      = false
    let accumulated = 0
    let resetTimer: ReturnType<typeof setTimeout>
    let lockTimer:  ReturnType<typeof setTimeout>

    function getSnapPoints(): HTMLElement[] {
      return Array.from(
        document.querySelectorAll<HTMLElement>('section, #showcase-cards')
      ).filter(el => el.offsetHeight > 80)
    }

    function findTarget(goingDown: boolean): HTMLElement | null {
      const pts = getSnapPoints()
      if (goingDown) {
        return pts.find(el => el.getBoundingClientRect().top > 80) ?? null
      }
      const above = pts.filter(el => el.getBoundingClientRect().top < -80)
      return above[above.length - 1] ?? null
    }

    /* Is #como-funciona filling >50% of viewport? It manages itself. */
    function comoFuncionaActive(): boolean {
      const el = document.getElementById('como-funciona')
      if (!el) return false
      const { top, bottom } = el.getBoundingClientRect()
      const vh = window.innerHeight
      return (Math.min(bottom, vh) - Math.max(top, 0)) / vh > 0.5
    }

    /* Is #precios filling >60% of viewport? PrecioCard manages its own lock. */
    function preciosActive(): boolean {
      const el = document.getElementById('precios')
      if (!el) return false
      const { top, bottom } = el.getBoundingClientRect()
      const vh = window.innerHeight
      return (Math.min(bottom, vh) - Math.max(top, 0)) / vh > 0.6
    }

    function onWheel(e: WheelEvent) {
      if (comoFuncionaActive()) return
      if (preciosActive()) return

      if (locked) {
        e.preventDefault()
        return
      }

      accumulated += Math.abs(e.deltaY)
      clearTimeout(resetTimer)
      resetTimer = setTimeout(() => { accumulated = 0 }, RESET_MS)

      if (accumulated >= VELOCITY_THRESHOLD) {
        const target = findTarget(e.deltaY > 0)
        if (target) {
          e.preventDefault()
          accumulated = 0
          locked = true
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
          clearTimeout(lockTimer)
          lockTimer = setTimeout(() => { locked = false }, LOCK_MS)
        }
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      window.removeEventListener('wheel', onWheel)
      clearTimeout(resetTimer)
      clearTimeout(lockTimer)
    }
  }, [])

  return null
}
