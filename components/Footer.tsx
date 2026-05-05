'use client'

import { useEffect, useState } from 'react'
import { ChevronUp } from 'lucide-react'
import { WebGLShader } from '@/components/ui/web-gl-shader'
import { InfiniteGrid } from '@/components/ui/the-infinite-grid'
import { useLang } from '@/context/LanguageContext'

const WORDS = ['Complicada', 'Cara', 'Aburrida']
const TYPING_SPEED = 80
const ERASING_SPEED = 50
const SHOW_DURATION = 1000

type Phase = 'typing' | 'showing' | 'erasing'

function useTypewriter(words: string[]) {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [phase, setPhase] = useState<Phase>('typing')
  const [cursorVisible, setCursorVisible] = useState(true)

  useEffect(() => {
    const id = setInterval(() => setCursorVisible(v => !v), 500)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const word = words[wordIndex]

    if (phase === 'typing') {
      if (displayText.length < word.length) {
        const id = setTimeout(
          () => setDisplayText(word.slice(0, displayText.length + 1)),
          TYPING_SPEED
        )
        return () => clearTimeout(id)
      } else {
        const id = setTimeout(() => setPhase('showing'), SHOW_DURATION)
        return () => clearTimeout(id)
      }
    }

    if (phase === 'showing') {
      setPhase('erasing')
    }

    if (phase === 'erasing') {
      if (displayText.length > 0) {
        const id = setTimeout(
          () => setDisplayText(displayText.slice(0, -1)),
          ERASING_SPEED
        )
        return () => clearTimeout(id)
      } else {
        setWordIndex(i => (i + 1) % words.length)
        setPhase('typing')
      }
    }
  }, [displayText, phase, wordIndex, words])

  return { displayText, cursorVisible }
}

export default function Footer() {
  const { t } = useLang()
  const { displayText, cursorVisible } = useTypewriter(WORDS)

  return (
    <footer className="relative bg-black text-white overflow-hidden">
      {/* Gradient connecting ContactForm (#1D1D1F) to black footer */}
      <div className="absolute top-0 left-0 right-0 h-[60px] bg-gradient-to-b from-[#1D1D1F] to-transparent z-20 pointer-events-none" />

      {/* WebGL background layers */}
      <InfiniteGrid />
      <WebGLShader />

      {/* Content */}
      <div className="relative z-10 pointer-events-none">
        {/* Typewriter hero area */}
        <div className="flex flex-col items-center justify-center min-h-[50vh] md:min-h-[38vh] text-center px-6 -translate-y-8">
          <h2
            className="font-outfit font-bold text-white leading-[1.05] tracking-tighter mb-10 select-none"
            style={{ fontSize: 'clamp(32px, 4vw, 56px)' }}
          >
            <span className="block">Una página web no es</span>
            <span className="block min-h-[1.1em]">
              {displayText}
              <span
                className="inline-block w-[3px] ml-[2px]"
                style={{
                  height: '0.85em',
                  background: 'rgba(255,255,255,1)',
                  opacity: cursorVisible ? 1 : 0,
                  transition: 'opacity 0.1s',
                  verticalAlign: 'middle',
                }}
                aria-hidden="true"
              />
            </span>
          </h2>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="pointer-events-auto flex items-center justify-center w-11 h-11 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            aria-label="Volver arriba"
          >
            <ChevronUp size={20} className="text-white/60" />
          </button>
        </div>

        {/* Footer links */}
        <div className="pointer-events-auto border-t border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-8 md:py-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 pb-8 border-b border-white/10">
              <div>
                <p className="font-outfit font-semibold text-2xl mb-2">Yele</p>
                <p className="font-manrope text-white/60 text-sm max-w-xs leading-relaxed">
                  {t('Diseño web para negocios españoles.', 'Web design for Spanish businesses.')}
                </p>
                <a
                  href="mailto:info@yele.design"
                  className="font-manrope text-sm text-white/60 hover:text-white transition-colors mt-3 inline-block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066CC]"
                >
                  info@yele.design
                </a>
              </div>

              <div className="flex gap-12">
                <nav aria-label="Secciones">
                  <p className="font-manrope text-xs text-white/40 uppercase tracking-[0.12em] mb-3">
                    {t('Secciones', 'Sections')}
                  </p>
                  <div className="flex flex-col gap-2">
                    {[
                      { id: '#trabajos',      es: 'Trabajos',       en: 'Portfolio' },
                      { id: '#como-funciona', es: 'Cómo funciona',  en: 'How it works' },
                      { id: '#precios',       es: 'Precios',        en: 'Pricing' },
                      { id: '#contacto',      es: 'Contacto',       en: 'Contact' },
                    ].map(({ id, es, en }) => (
                      <button
                        key={id}
                        onClick={() => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })}
                        className="text-left font-manrope text-sm text-white/60 hover:text-white transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066CC]"
                      >
                        {t(es, en)}
                      </button>
                    ))}
                  </div>
                </nav>

                <nav aria-label="Legal">
                  <p className="font-manrope text-xs text-white/40 uppercase tracking-[0.12em] mb-3">
                    Legal
                  </p>
                  <div className="flex flex-col gap-2">
                    <a
                      href="/aviso-legal"
                      className="font-manrope text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066CC]"
                    >
                      {t('Aviso Legal', 'Legal Notice')}
                    </a>
                    <a
                      href="/politica-privacidad"
                      className="font-manrope text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066CC]"
                    >
                      {t('Política de Privacidad', 'Privacy Policy')}
                    </a>
                  </div>
                </nav>
              </div>
            </div>

            <p className="font-manrope text-xs text-white/40 mt-6">
              {t(
                '© 2026 Yele. Todos los derechos reservados.',
                '© 2026 Yele. All rights reserved.'
              )}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
