'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronUp } from 'lucide-react'
import { WebGLShader } from '@/components/ui/web-gl-shader'
import { useLang } from '@/context/LanguageContext'
import { scrollToSection } from '@/lib/nav-scroll'

const WORDS = ['Expensive', 'Ugly', 'Slow', 'Complicated', 'Outdated']
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
  const pathname = usePathname()
  // Same as Nav.tsx: only / and /agency actually render these section ids
  // (both render HomePage.tsx) — everywhere else (e.g. /services) they
  // navigate to "/#id" instead of silently no-oping.
  const isSectionsPage = pathname === '/' || pathname === '/agency'
  const { displayText, cursorVisible } = useTypewriter(WORDS)

  return (
    <footer className="relative text-white overflow-hidden" style={{ backgroundColor: '#0D0E12' }}>
      {/* Light-beams shader only — the grid layer that used to sit behind
          it is gone. */}
      <WebGLShader />

      {/* Both this section and ContactForm above share the same flat
          #0D0E12, but the shader washes the footer's own top edge with
          light/color, so the seam still reads as a hard cut. This fades a
          solid #0D0E12 block into transparent over the shader so the
          transition blends instead — sits above the canvas (DOM order,
          no shader content behind it in the meantime) but below the
          z-10 content. */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, #0D0E12 0%, transparent 100%)', height: '200px' }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 pointer-events-none">
        {/* Typewriter hero area */}
        <div className="flex flex-col items-center justify-center min-h-[50vh] md:min-h-[38vh] text-center px-6 pt-20 -translate-y-8">
          <h2
            className="font-display font-bold text-white leading-[1.05] tracking-tighter mb-10 select-none"
            style={{ fontSize: 'clamp(32px, 4vw, 56px)' }}
          >
            <span className="block">Your website should not be</span>
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
            aria-label="Back to top"
          >
            <ChevronUp size={20} className="text-white/60" />
          </button>
        </div>

        {/* Footer links */}
        <div className="pointer-events-auto border-t border-hairlineDark">
          <div className="max-w-6xl mx-auto px-6 py-8 md:py-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 pb-8 border-b border-hairlineDark">
              <div>
                <p className="font-display font-semibold text-2xl mb-2">Yele</p>
                <p className="font-body text-white/60 text-sm max-w-xs leading-relaxed">
                  {t('Agencia de diseño web y marketing por suscripción.', 'Web design and marketing subscription Agency.')}
                </p>
                <a
                  href="mailto:info@yele.design"
                  className="font-body text-sm text-white/60 hover:text-white transition-colors mt-3 inline-block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066CC]"
                >
                  info@yele.design
                </a>
                <a
                  href="tel:+12138458604"
                  className="font-body text-sm text-white/60 hover:text-white transition-colors mt-1 block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066CC]"
                >
                  +1 (213) 845-8604
                </a>
              </div>

              <div className="flex gap-12">
                <nav aria-label="Sections">
                  <p className="font-body text-xs text-white/40 uppercase tracking-[0.12em] mb-3">
                    {t('Secciones', 'Sections')}
                  </p>
                  <div className="flex flex-col gap-2">
                    {[
                      { id: '#trabajos',      es: 'Trabajos',       en: 'Portfolio' },
                      { id: '#how-it-works',  es: 'Cómo funciona',  en: 'How it works' },
                      { id: '#precios',       es: 'Precios',        en: 'Pricing' },
                      { id: '#contacto',      es: 'Contacto',       en: 'Contact' },
                    ].map(({ id, es, en }) =>
                      isSectionsPage ? (
                        <button
                          key={id}
                          onClick={() => scrollToSection(id)}
                          className="text-left font-body text-sm text-white/60 hover:text-white transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066CC]"
                        >
                          {t(es, en)}
                        </button>
                      ) : (
                        <Link
                          key={id}
                          href={`/${id}`}
                          className="text-left font-body text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066CC]"
                        >
                          {t(es, en)}
                        </Link>
                      )
                    )}
                    {/* Real route, not a same-page scroll anchor — services
                        packages/add-ons page (app/services/page.tsx). */}
                    <a
                      href="/services"
                      className="text-left font-body text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066CC]"
                    >
                      {t('Servicios', 'Services')}
                    </a>
                  </div>
                </nav>

                <nav aria-label="Legal">
                  <p className="font-body text-xs text-white/40 uppercase tracking-[0.12em] mb-3">
                    Legal
                  </p>
                  <div className="flex flex-col gap-2">
                    <a
                      href="/legal-notice"
                      className="font-body text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066CC]"
                    >
                      Legal Notice
                    </a>
                    <a
                      href="/privacy-policy"
                      className="font-body text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066CC]"
                    >
                      Privacy Policy
                    </a>
                    <a
                      href="/terms"
                      className="font-body text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066CC]"
                    >
                      Terms and Conditions
                    </a>
                  </div>
                </nav>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-6">
              <p className="font-body text-xs text-white/70">
                {t(
                  '© 2026 Yele. Todos los derechos reservados.',
                  '© 2026 Yele. All rights reserved.'
                )}
              </p>

              {/* Payment security + methods */}
              <div className="flex items-center gap-2 flex-wrap">

                {/* Safe payment with Stripe */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-hairlineDark bg-white/5">
                  {/* Lock icon */}
                  <svg width="10" height="11" viewBox="0 0 10 11" fill="none" aria-hidden="true">
                    <rect x="1" y="4.5" width="8" height="6" rx="1.2" fill="white" fillOpacity="0.45"/>
                    <path d="M3 4.5V3a2 2 0 1 1 4 0v1.5" stroke="white" strokeOpacity="0.45" strokeWidth="1.2"/>
                  </svg>
                  <span className="font-body text-[10px] text-white/40 leading-none">Safe payment with</span>
                  {/* Stripe wordmark */}
                  <svg viewBox="0 0 60 25" height="11" aria-label="Stripe" fill="none">
                    <path d="M13.5 8.3c0-1 .8-1.4 2.2-1.4 2 0 4.4.6 6.4 1.6V3.3C20 2.5 17.8 2 15.7 2 10.8 2 7.5 4.5 7.5 8.6c0 6.3 8.7 5.3 8.7 8 0 1.2-1 1.6-2.5 1.6-2.2 0-5-.9-7.2-2.1v5.3c2.4 1 4.9 1.5 7.2 1.5 5 0 8.5-2.5 8.5-6.7-.1-6.8-8.7-5.6-8.7-7.9zM38 2.3l-3.3.7-.1 14.7c0 2.7 2 4.7 4.7 4.7 1.5 0 2.6-.3 3.2-.6v-4.2c-.6.2-3.4 1-3.4-1.6V11h3.4V6.8H39L38 2.3zm9.8 4.5l-.3-1.5H43v16.4h5V12c1.2-1.5 3.1-1.2 3.7-1v-4.7c-.7-.3-3-.8-3.9.5zM28.5 5.3c-1.6 0-2.6.7-3.2 1.2l-.2-1H21v22l5-1.1V20c.6.4 1.4 1 2.8 1 2.8 0 5.4-2.3 5.4-7.9-.1-5.1-2.7-7.8-5.7-7.8zm-1 12c-.9 0-1.5-.3-1.8-.8V11c.4-.5 1-.8 1.8-.8 1.4 0 2.4 1.6 2.4 3.6 0 2-.9 3.5-2.4 3.5z" fill="white" fillOpacity="0.75"/>
                  </svg>
                </div>

                {/* Divider */}
                <div className="h-4 w-px bg-white/15" aria-hidden="true" />

                {/* Visa */}
                <div className="flex items-center justify-center h-5 px-2 rounded bg-white/[0.06] border border-hairlineDark">
                  <svg viewBox="0 0 50 16" height="10" aria-label="Visa">
                    <text x="0" y="13" fontFamily="Arial" fontWeight="bold" fontSize="15" fill="white" opacity="0.7" letterSpacing="1">VISA</text>
                  </svg>
                </div>

                {/* Mastercard */}
                <div className="flex items-center justify-center h-5 px-2 rounded bg-white/[0.06] border border-hairlineDark">
                  <svg viewBox="0 0 36 22" height="13" aria-label="Mastercard">
                    <circle cx="13" cy="11" r="10" fill="#EB001B" opacity="0.8"/>
                    <circle cx="23" cy="11" r="10" fill="#F79E1B" opacity="0.8"/>
                    <path d="M18 4.8a10 10 0 0 1 0 12.4A10 10 0 0 1 18 4.8z" fill="#FF5F00" opacity="0.8"/>
                  </svg>
                </div>

                {/* Amex */}
                <div className="flex items-center justify-center h-5 px-2 rounded bg-white/[0.06] border border-hairlineDark">
                  <svg viewBox="0 0 46 16" height="9" aria-label="American Express">
                    <text x="0" y="12" fontFamily="Arial" fontWeight="bold" fontSize="10" fill="white" opacity="0.7" letterSpacing="0.5">AMEX</text>
                  </svg>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
