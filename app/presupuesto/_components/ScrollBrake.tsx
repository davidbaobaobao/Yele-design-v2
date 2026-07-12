'use client'

import { useEffect } from 'react'

/* ──────────────────────────────────────────────────────────────
   ScrollBrake — page-level fast-scroll interceptor

   When the user scrolls fast enough (accumulated deltaY > THRESHOLD
   within a short window), we intercept, find the nearest section
   boundary in the scroll direction, snap-scroll to it, and lock
   for LOCK_MS so they land cleanly on each section.

   Coordination: if #como-funciona is the dominant section in the
   viewport, that component handles scroll internally — we bail out.
────────────────────────────────────────────────────────────── */

const VELOCITY_THRESHOLD = 300  // accumulated deltaY to trigger brake
const RESET_MS           = 90   // window to accumulate deltaY
const LOCK_MS            = 1000 // lock after snapping (ms)

export default function ScrollBrake() {
  useEffect(() => {
    let locked      = false
    let accumulated = 0
    let resetTimer: ReturnType<typeof setTimeout>
    let lockTimer:  ReturnType<typeof setTimeout>

    /* All meaningful sections / snap-points on the page */
    function getSnapPoints(): HTMLElement[] {
      return Array.from(
        document.querySelectorAll<HTMLElement>(
          'section, #showcase-cards'
        )
      ).filter(el => el.offsetHeight > 80)
    }

    /* Next snap target in the scroll direction */
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

    function onWheel(e: WheelEvent) {
      /* Let ComoFunciona's own handler take over while in that section */
      if (comoFuncionaActive()) return

      /* During brake lock: consume the event so page doesn't keep scrolling */
      if (locked) {
        e.preventDefault()
        return
      }

      /* Accumulate velocity */
      accumulated += Math.abs(e.deltaY)
      clearTimeout(resetTimer)
      resetTimer = setTimeout(() => { accumulated = 0 }, RESET_MS)

      /* Fast scroll detected → brake */
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
