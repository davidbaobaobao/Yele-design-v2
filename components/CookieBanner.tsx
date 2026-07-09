'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

type Prefs = { analytics: boolean; marketing: boolean }

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [prefs, setPrefs] = useState<Prefs>({ analytics: true, marketing: false })

  useEffect(() => {
    if (!localStorage.getItem('cookie-consent')) setVisible(true)
  }, [])

  const save = (p: Prefs) => {
    localStorage.setItem('cookie-consent', JSON.stringify({ essential: true, ...p }))
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-white/96 backdrop-blur-md border-t border-black/[0.07] shadow-[0_-2px_20px_rgba(0,0,0,0.06)]">
      {expanded ? (
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <p className="font-manrope text-sm font-semibold text-[#1D1D1F]">Preferencias de cookies</p>
            <button
              onClick={() => setExpanded(false)}
              aria-label="Colapsar"
              className="text-[#6B7280] hover:text-[#1D1D1F] transition-colors"
            >
              <ChevronDown size={15} />
            </button>
          </div>

          <div className="space-y-0 mb-4 rounded-xl border border-black/[0.07] overflow-hidden">
            {/* Essential */}
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-black/[0.06] bg-black/[0.01]">
              <div>
                <p className="font-manrope text-xs font-medium text-[#1D1D1F]">Esenciales</p>
                <p className="font-manrope text-[11px] text-[#6B7280]">Necesarias para el funcionamiento del sitio.</p>
              </div>
              <span className="font-manrope text-[11px] text-[#34C759] font-medium shrink-0 ml-4">Siempre activas</span>
            </div>

            {/* Analytics */}
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-black/[0.06]">
              <div>
                <p className="font-manrope text-xs font-medium text-[#1D1D1F]">Análisis</p>
                <p className="font-manrope text-[11px] text-[#6B7280]">Nos ayudan a mejorar el sitio web.</p>
              </div>
              <button
                role="switch"
                aria-checked={prefs.analytics}
                onClick={() => setPrefs(p => ({ ...p, analytics: !p.analytics }))}
                className={`relative ml-4 w-9 h-5 rounded-full shrink-0 transition-colors duration-200 ${prefs.analytics ? 'bg-[#1D1D1F]' : 'bg-black/15'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${prefs.analytics ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Marketing */}
            <div className="flex items-center justify-between px-3 py-2.5">
              <div>
                <p className="font-manrope text-xs font-medium text-[#1D1D1F]">Marketing</p>
                <p className="font-manrope text-[11px] text-[#6B7280]">Publicidad personalizada.</p>
              </div>
              <button
                role="switch"
                aria-checked={prefs.marketing}
                onClick={() => setPrefs(p => ({ ...p, marketing: !p.marketing }))}
                className={`relative ml-4 w-9 h-5 rounded-full shrink-0 transition-colors duration-200 ${prefs.marketing ? 'bg-[#1D1D1F]' : 'bg-black/15'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${prefs.marketing ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <a href="/politica-privacidad" className="font-manrope text-[11px] text-[#6B7280] hover:text-[#1D1D1F] transition-colors underline underline-offset-2">
              Política de privacidad
            </a>
            <div className="flex gap-2">
              <button
                onClick={() => save(prefs)}
                className="font-manrope text-xs text-[#6B7280] hover:text-[#1D1D1F] transition-colors px-3 py-1.5 rounded-lg border border-black/10 hover:border-black/20"
              >
                Guardar selección
              </button>
              <button
                onClick={() => save({ analytics: true, marketing: true })}
                className="font-manrope text-xs font-medium bg-[#1D1D1F] text-white px-3 py-1.5 rounded-lg hover:bg-black transition-colors"
              >
                Aceptar todo
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center gap-3">
          <p className="font-manrope text-xs text-[#6B7280] flex-1 min-w-0 truncate">
            Usamos cookies para mejorar tu experiencia.{' '}
            <a href="/politica-privacidad" className="underline underline-offset-2 hover:text-[#1D1D1F] transition-colors">
              Más info
            </a>
          </p>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setExpanded(true)}
              className="font-manrope text-xs text-[#6B7280] hover:text-[#1D1D1F] transition-colors flex items-center gap-0.5 px-2 py-1.5"
            >
              Personalizar <ChevronUp size={11} />
            </button>
            <button
              onClick={() => save({ analytics: false, marketing: false })}
              className="font-manrope text-xs text-[#6B7280] hover:text-[#1D1D1F] transition-colors px-2 py-1.5"
            >
              Solo esenciales
            </button>
            <button
              onClick={() => save({ analytics: true, marketing: true })}
              className="font-manrope text-xs font-medium bg-[#1D1D1F] text-white px-3 py-1.5 rounded-lg hover:bg-black transition-colors"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
