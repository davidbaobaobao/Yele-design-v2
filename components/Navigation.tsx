'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLang } from '@/context/LanguageContext'
import { X, Menu } from 'lucide-react'

export default function Navigation({ heroIsDark }: { heroIsDark?: boolean } = {}) {
  const { lang, toggleLang, t } = useLang()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const isHomePage = pathname === '/' || pathname === '/es'
  const langHref   = pathname === '/' ? '/es' : '/'
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isDark = heroIsDark && !scrolled

  const links = [
    { label: t('Cómo funciona', 'How it works'), href: '#como-funciona' },
    { label: t('Proyectos', 'Projects'), href: '/ejemplos' },
    { label: t('Precios', 'Pricing'), href: '#precios' },
    { label: 'FAQ', href: '#faq' },
  ]

  const scroll = (href: string) => {
    setOpen(false)
    if (href.startsWith('/')) {
      window.location.href = href
    } else if (isHomePage) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.location.href = `/${href}`
    }
  }

  return (
    <>
      <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
        <motion.nav
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`flex items-center gap-6 px-5 py-2.5 rounded-2xl transition-all duration-300 ${
            isDark
              ? 'bg-transparent border border-white/10'
              : scrolled
                ? 'bg-white/90 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-black/[0.06]'
                : 'bg-white/70 backdrop-blur-md border border-black/[0.04]'
          }`}
        >
          {/* Wordmark */}
          <Link href="/" className="flex items-center gap-1.5 flex-shrink-0 focus-visible:outline-none">
            <span className="w-2 h-2 rounded-full bg-[#34C759] flex-shrink-0" aria-hidden="true" />
            <span className={`font-outfit font-semibold text-sm ${isDark ? 'text-white' : 'text-[#1D1D1F]'}`}>
              yele<span className={`font-normal ${isDark ? 'text-white/50' : 'text-[#6B7280]'}`}>.design</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-5">
            {links.map(link => (
              <button
                key={link.href}
                onClick={() => scroll(link.href)}
                className={`font-manrope text-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:underline ${
                  isDark ? 'text-white/70 hover:text-white' : 'text-[#6B7280] hover:text-[#1D1D1F]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <span className={`hidden md:block w-px h-4 flex-shrink-0 ${isDark ? 'bg-white/15' : 'bg-black/10'}`} aria-hidden="true" />

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {isHomePage ? (
              <Link
                href={langHref}
                className={`font-manrope text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none px-2.5 py-1 rounded-lg ${
                  isDark ? 'text-white/60 hover:text-white bg-white/10' : 'text-[#6B7280] hover:text-[#1D1D1F] bg-[#F2F2F5]'
                }`}
                aria-label={pathname === '/' ? 'Versión en español' : 'English version'}
              >
                {pathname === '/' ? 'ES' : 'EN'}
              </Link>
            ) : (
              <button
                onClick={toggleLang}
                className={`font-manrope text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none px-2.5 py-1 rounded-lg ${
                  isDark ? 'text-white/60 hover:text-white bg-white/10' : 'text-[#6B7280] hover:text-[#1D1D1F] bg-[#F2F2F5]'
                }`}
                aria-label={`Cambiar a ${lang === 'es' ? 'inglés' : 'español'}`}
              >
                {lang === 'es' ? 'EN' : 'ES'}
              </button>
            )}

            <a
              href="https://app.yele.design/login"
              className={`font-manrope text-sm transition-colors cursor-pointer focus-visible:outline-none ${
                isDark ? 'text-white/60 hover:text-white' : 'text-[#6B7280] hover:text-[#1D1D1F]'
              }`}
            >
              {t('Ingresar', 'Log in')}
            </a>

            <Link
              href={t('/presupuesto#precios', '/#precios')}
              prefetch={false}
              className={`flex items-center gap-1.5 font-manrope text-sm font-medium px-4 py-2 rounded-xl transition-colors active:scale-95 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066CC] ${
                isDark ? 'bg-white text-[#1D1D1F] hover:bg-[#F5F5F7]' : 'bg-[#1D1D1F] text-white hover:bg-black'
              }`}
            >
              {t('Empezar gratis', 'Start for free')}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className={`md:hidden p-1 cursor-pointer ${isDark ? 'text-white' : 'text-[#1D1D1F]'}`}
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </motion.nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-4 right-4 z-40 bg-white/95 backdrop-blur-xl rounded-2xl border border-black/[0.06] shadow-[0_8px_40px_rgba(0,0,0,0.12)] p-4"
          >
            {links.map((link) => (
              <button
                key={link.href}
                onClick={() => scroll(link.href)}
                className="w-full text-left font-manrope text-base text-[#1D1D1F] py-3 border-b border-black/[0.04] last:border-0 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            <div className="flex items-center gap-3 pt-3">
              {isHomePage ? (
                <Link href={langHref} className="font-manrope text-xs text-[#6B7280] cursor-pointer">
                  {pathname === '/' ? 'ES' : 'EN'}
                </Link>
              ) : (
                <button onClick={toggleLang} className="font-manrope text-xs text-[#6B7280] cursor-pointer">
                  {lang === 'es' ? 'EN' : 'ES'}
                </button>
              )}
              <a
                href="https://app.yele.design/login"
                className="font-manrope text-sm text-[#6B7280] cursor-pointer"
              >
                {t('Ingresar', 'Log in')}
              </a>
              <Link
                href={t('/presupuesto#precios', '/#precios')}
                prefetch={false}
                onClick={() => setOpen(false)}
                className="flex items-center gap-1.5 font-manrope text-sm font-medium bg-[#1D1D1F] text-white px-4 py-2 rounded-xl cursor-pointer"
              >
                {t('Empezar gratis', 'Start for free')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
