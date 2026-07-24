'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useLang } from '@/context/LanguageContext'

const LINKS = [
  { label: 'How it works', href: '#como-funciona' },
  { label: 'Work', href: '#trabajos' },
  { label: 'Pricing', href: '#precios' },
  { label: 'FAQ', href: '#faq' },
]

// hasHero: whether this page renders a <div id="dark-zone"> (hero + mission,
// both dark sections) for the nav to watch. Pages without one (or once the
// dark zone has fully scrolled past) render the solid/blurred nav state.
export default function Nav({ hasHero = true }: { hasHero?: boolean }) {
  const { t } = useLang()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [overHero, setOverHero] = useState(hasHero)

  useEffect(() => {
    if (!hasHero) return
    const darkZone = document.getElementById('dark-zone')
    if (!darkZone || !('IntersectionObserver' in window)) {
      setOverHero(false)
      return
    }
    // The dark zone spans the hero's full 250vh block plus the mission
    // section, so this stays true for that whole stretch and flips false
    // only once its bottom edge passes the top of the viewport.
    const io = new IntersectionObserver(
      ([entry]) => setOverHero(entry.isIntersecting),
      { threshold: 0 }
    )
    io.observe(darkZone)
    return () => io.disconnect()
  }, [hasHero])

  const scrollTo = (href: string) => {
    setOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const langHref = pathname === '/' ? '/es' : '/'
  const ctaHref = t('/registro?lang=es', '/registro')

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
          overHero ? 'bg-transparent' : 'backdrop-blur-xl bg-base/70 border-b border-hairline'
        }`}
      >
        <nav className="relative flex items-center justify-between h-20 px-6 md:px-10">
          <Link
            href="/"
            className={`font-display font-bold text-lg lowercase tracking-tight transition-colors focus-visible:outline-none ${
              overHero ? 'text-bone' : 'text-ink'
            }`}
          >
            yele
          </Link>

          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {LINKS.map(link => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className={`font-body text-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:underline ${
                  overHero ? 'text-bone/80 hover:text-bone' : 'text-muted hover:text-ink'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href={langHref}
              className={`font-body text-xs font-medium px-2.5 py-1 rounded-lg transition-colors focus-visible:outline-none ${
                overHero ? 'text-bone/80 hover:text-bone bg-white/10' : 'text-muted hover:text-ink bg-ink/5'
              }`}
              aria-label={pathname === '/' ? 'Versión en español' : 'English version'}
            >
              {pathname === '/' ? 'ES' : 'EN'}
            </Link>
            <Link
              href={ctaHref}
              prefetch={false}
              className="font-body text-sm font-medium bg-bone text-ink px-5 py-2.5 rounded-full cursor-pointer transition-transform active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066CC]"
            >
              {t('Empezar gratis', 'Start for free')}
            </Link>
          </div>

          <button
            className={`md:hidden p-1 cursor-pointer transition-colors ${overHero ? 'text-bone' : 'text-ink'}`}
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-4 right-4 z-40 bg-base/95 backdrop-blur-xl rounded-2xl border border-hairline p-4 md:hidden"
          >
            {LINKS.map(link => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="w-full text-left font-body text-base text-ink py-3 border-b border-hairline last:border-0 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            <div className="flex items-center gap-3 pt-3">
              <Link href={langHref} className="font-body text-xs text-muted cursor-pointer">
                {pathname === '/' ? 'ES' : 'EN'}
              </Link>
              <Link
                href={ctaHref}
                prefetch={false}
                onClick={() => setOpen(false)}
                className="flex-1 text-center font-body text-sm font-medium bg-ink text-white px-4 py-2.5 rounded-full cursor-pointer"
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
