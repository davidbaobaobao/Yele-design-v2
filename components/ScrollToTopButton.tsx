'use client'

import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Volver al inicio"
      className="fixed bottom-6 right-6 z-50 w-10 h-10 bg-[#1D1D1F] text-white rounded-full flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.18)] hover:bg-black active:scale-95 transition-all duration-200"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.9)',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
      }}
    >
      <ArrowUp size={16} />
    </button>
  )
}
