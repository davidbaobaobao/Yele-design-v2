'use client'

import { useEffect } from 'react'

export default function VideoSnapController() {
  useEffect(() => {
    // Small delay so page-load scroll position doesn't trigger snaps
    const init = setTimeout(() => {
      const sections = Array.from(document.querySelectorAll('[data-snap-section]'))
      if (!sections.length) return

      let locked = false

      const preventScroll = (e: WheelEvent | TouchEvent) => {
        if (locked) e.preventDefault()
      }

      window.addEventListener('wheel', preventScroll, { passive: false })
      window.addEventListener('touchmove', preventScroll as EventListener, { passive: false })

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.45 && !locked) {
              locked = true
              entry.target.scrollIntoView({ behavior: 'smooth', block: 'start' })
              setTimeout(() => { locked = false }, 750)
            }
          })
        },
        { threshold: 0.45 }
      )

      sections.forEach((s) => observer.observe(s))

      return () => {
        observer.disconnect()
        window.removeEventListener('wheel', preventScroll)
        window.removeEventListener('touchmove', preventScroll as EventListener)
      }
    }, 600)

    return () => clearTimeout(init)
  }, [])

  return null
}
