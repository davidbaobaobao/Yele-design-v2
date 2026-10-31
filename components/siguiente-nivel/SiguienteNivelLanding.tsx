'use client'

import { useEffect, useState } from 'react'
import MobileLanding from './MobileLanding'
import DesktopLanding from './DesktopLanding'
import './siguiente-nivel.css'

/**
 * Picks the mobile or desktop build of the landing (breakpoint 1024px).
 * Until the viewport is known, the first frame of the matching hero video is shown,
 * so there is never a black or empty screen.
 */
export default function SiguienteNivelLanding({ accent = '#D46FC8' }: { accent?: string }) {
  const [mode, setMode] = useState<'mobile' | 'desktop' | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const pick = () => setMode(mq.matches ? 'desktop' : 'mobile')
    pick()
    mq.addEventListener('change', pick)
    return () => mq.removeEventListener('change', pick)
  }, [])

  return (
    <main id="main-content" className="sn-root" lang="es">
      {mode === null && <div className="sn-boot" aria-hidden="true" />}
      {mode === 'mobile' && <MobileLanding accent={accent} />}
      {mode === 'desktop' && <DesktopLanding accent={accent} />}
    </main>
  )
}
