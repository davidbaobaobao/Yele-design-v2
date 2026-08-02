'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useLang } from '@/context/LanguageContext'
import { CTAButton } from '@/components/ui/cta-button'
import { scrollToSection } from '@/lib/nav-scroll'

const LINKS = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Work', href: '#trabajos' },
  { label: 'Pricing', href: '#precios' },
  { label: 'FAQ', href: '#faq' },
]

// hasHero: whether this page renders dark sections (the hero's
// <div id="dark-zone"> plus any other section marked `data-nav-dark`, e.g.
// "Beyond the website") for the nav to watch. Pages without any (or once
// they've all scrolled past) render the solid/blurred nav state. Mission
// isn't part of this — it's a light (bg-base) section now.
export default function Nav({ hasHero = true }: { hasHero?: boolean }) {
  const { t } = useLang()
  const [open, setOpen] = useState(false)
  const [overHero, setOverHero] = useState(hasHero)
  // HowWeWork's Mercury background fade isn't uniformly dark — only the
  // first half of its scroll range is — so it reports its own current
  // dark/light mode via a custom event instead of the plain always-dark
  // [data-nav-dark] boolean below. fadeIntersecting gates it: while
  // HowWeWork isn't on screen at all, fadeDark has no say and overHero
  // (from the OTHER, uniformly-dark zones) decides as usual.
  const [fadeIntersecting, setFadeIntersecting] = useState(false)
  const [fadeDark, setFadeDark] = useState(true)
  // Sections that want the nav fully out of the way (currently just
  // ContentShowcase's pinned scroll-jack) mark themselves with
  // data-nav-hide; the header hides while any of them is on screen and
  // reappears once they've scrolled past.
  const [navHidden, setNavHidden] = useState(false)

  useEffect(() => {
    if (!hasHero) return
    const darkZones = document.querySelectorAll('#dark-zone, [data-nav-dark]')
    if (darkZones.length === 0 || !('IntersectionObserver' in window)) {
      setOverHero(false)
      return
    }
    // Several dark sections can appear down the page (hero, "Beyond the
    // website", ...) — the nav stays light-text as long as ANY of them is
    // intersecting the viewport, not just the first one.
    const intersecting = new Set<Element>()
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) intersecting.add(entry.target)
          else intersecting.delete(entry.target)
        })
        setOverHero(intersecting.size > 0)
      },
      { threshold: 0 }
    )
    darkZones.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [hasHero])

  useEffect(() => {
    const fadeZones = document.querySelectorAll('[data-nav-fade]')
    if (fadeZones.length === 0 || !('IntersectionObserver' in window)) return

    const intersecting = new Set<Element>()
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) intersecting.add(entry.target)
          else intersecting.delete(entry.target)
        })
        setFadeIntersecting(intersecting.size > 0)
      },
      { threshold: 0 }
    )
    fadeZones.forEach(el => io.observe(el))

    const onFadeMode = (e: Event) => {
      const detail = (e as CustomEvent<{ dark: boolean }>).detail
      setFadeDark(detail.dark)
    }
    window.addEventListener('howwework:navmode', onFadeMode)

    return () => {
      io.disconnect()
      window.removeEventListener('howwework:navmode', onFadeMode)
    }
  }, [])

  useEffect(() => {
    const hideZones = document.querySelectorAll('[data-nav-hide]')
    if (hideZones.length === 0 || !('IntersectionObserver' in window)) return

    const intersecting = new Set<Element>()
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) intersecting.add(entry.target)
          else intersecting.delete(entry.target)
        })
        setNavHidden(intersecting.size > 0)
      },
      { threshold: 0 }
    )
    hideZones.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  const showBoneText = fadeIntersecting ? fadeDark : overHero

  const scrollTo = (href: string) => {
    setOpen(false)
    scrollToSection(href)
  }

  const ctaHref = t('/registro?lang=es', '/registro')

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
          showBoneText ? 'bg-transparent' : 'backdrop-blur-xl bg-base/70'
        } ${navHidden ? 'opacity-0 pointer-events-none transition-opacity duration-300' : 'opacity-100 transition-opacity duration-300'}`}
      >
        <nav className="relative flex items-center justify-between h-20 px-6 md:px-10">
          <Link
            href="/"
            className={`font-display font-bold text-lg lowercase tracking-tight transition-colors focus-visible:outline-none ${
              showBoneText ? 'text-bone' : 'text-ink'
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
                  showBoneText ? 'text-bone/80 hover:text-bone' : 'text-muted hover:text-ink'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://app.yele.design"
              className={`font-body text-sm transition-colors focus-visible:outline-none ${
                showBoneText ? 'text-bone/80 hover:text-bone' : 'text-muted hover:text-ink'
              }`}
            >
              {t('Iniciar sesión', 'Log in')}
            </a>
            <CTAButton href={ctaHref} prefetch={false} variant="light" className="text-xs px-5 py-2.5">
              {t('Empezar gratis', 'Start for free')}
            </CTAButton>
          </div>

          <button
            className={`md:hidden p-1 cursor-pointer transition-colors ${showBoneText ? 'text-bone' : 'text-ink'}`}
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
              <a href="https://app.yele.design" className="font-body text-sm text-muted cursor-pointer">
                {t('Iniciar sesión', 'Log in')}
              </a>
              <CTAButton
                href={ctaHref}
                prefetch={false}
                onClick={() => setOpen(false)}
                variant="dark"
                className="flex-1 text-xs px-4 py-2.5"
              >
                {t('Empezar gratis', 'Start for free')}
              </CTAButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
