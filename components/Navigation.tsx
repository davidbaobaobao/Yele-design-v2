'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useLang } from '@/context/LanguageContext'
import { X, Menu } from 'lucide-react'

export default function Navigation() {
  const { lang, toggleLang, t } = useLang()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: t('Cómo funciona', 'How it works'), href: '#como-funciona' },
    { label: t('Ejemplos', 'Examples'), href: '#trabajos' },
    { label: t('Precios', 'Pricing'), href: '#precios' },
    { label: 'FAQ', href: '#faq' },
  ]

  const scroll = (href: string) => {
    setOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
        <motion.nav
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`flex items-center gap-6 px-5 py-2.5 rounded-2xl transition-all duration-300 ${
            scrolled
              ? 'bg-white/90 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-black/[0.06]'
              : 'bg-white/70 backdrop-blur-md border border-black/[0.04]'
          }`}
        >
          {/* Wordmark */}
          <Link href="/" className="flex items-center gap-1.5 flex-shrink-0 focus-visible:outline-none">
            <span className="w-2 h-2 rounded-full bg-[#34C759] flex-shrink-0" aria-hidden="true" />
            <span className="font-outfit font-semibold text-sm text-[#1D1D1F]">
              yele<span className="text-[#86868B] font-normal">.design</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-5">
            {links.map(link => (
              <button
                key={link.href}
                onClick={() => scroll(link.href)}
                className="font-manrope text-sm text-[#86868B] hover:text-[#1D1D1F] transition-colors cursor-pointer focus-visible:outline-none focus-visible:underline"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="font-manrope text-xs font-medium text-[#86868B] hover:text-[#1D1D1F] transition-colors cursor-pointer focus-visible:outline-none"
              aria-label={`Cambiar a ${lang === 'es' ? 'inglés' : 'español'}`}
            >
              {lang === 'es' ? 'EN' : 'ES'}
            </button>

            {/* Ingresar → always goes to dashboard login */}
            <a
              href="https://app.yele.design/login"
              className="font-manrope text-sm text-[#86868B] hover:text-[#1D1D1F] transition-colors cursor-pointer focus-visible:outline-none"
            >
              {t('Ingresar', 'Log in')}
            </a>

            {/* Pedir mi web → registration flow */}
            <Link
              href="/registro"
              className="flex items-center gap-1.5 font-manrope text-sm font-medium bg-[#1D1D1F] text-white px-4 py-2 rounded-xl hover:bg-black transition-colors active:scale-95 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066CC]"
            >
              {t('Pedir mi web', 'Get my website')}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1 text-[#1D1D1F] cursor-pointer"
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
              <button onClick={toggleLang} className="font-manrope text-xs text-[#86868B] cursor-pointer">
                {lang === 'es' ? 'EN' : 'ES'}
              </button>
              <a
                href="https://app.yele.design/login"
                className="font-manrope text-sm text-[#86868B] cursor-pointer"
              >
                {t('Ingresar', 'Log in')}
              </a>
              <Link
                href="/registro"
                onClick={() => setOpen(false)}
                className="flex items-center gap-1.5 font-manrope text-sm font-medium bg-[#1D1D1F] text-white px-4 py-2 rounded-xl cursor-pointer"
              >
                {t('Pedir mi web', 'Get my website')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
