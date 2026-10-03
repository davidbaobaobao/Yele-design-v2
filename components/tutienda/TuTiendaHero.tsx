'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Check, ChevronDown } from 'lucide-react'
import ReputationBadge from '@/components/ReputationBadge'

// Same instant-painting poster the other funnel heroes use as the LCP bg.
const POSTER = '/media/hero_new2/hero_poster.jpg'

// Ecommerce Meta-ads hero for /es/tutienda. Text + pills + CTAs on the left,
// a Yele-vs-Shopify price-comparison table on the right (instead of the
// cubes/form the /letsbuild heroes use). CTAs scroll to Precios / the form.
export default function TuTiendaHero({ rightPanel }: { rightPanel: React.ReactNode }) {
  const points = [
    'Sin plantillas genéricas feas',
    '40% menos en comisiones',
    'Mejoramos tus fotos y vídeos de los productos',
    'Entrega en menos de 4 semanas',
    'Desde 1.199€',
  ]

  return (
    <section className="relative min-h-[calc(100svh-132px)] w-full overflow-hidden" style={{ backgroundColor: '#0D0E12' }}>
      <Image src={POSTER} alt="" fill priority quality={85} sizes="100vw" className="object-cover" aria-hidden="true" />

      {/* Feathered left→right scrim so the text stays legible over the poster. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.1) 55%, rgba(0,0,0,0) 75%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 min-h-[calc(100svh-132px)] flex items-center px-6 md:px-12 lg:px-16 xl:px-24 pt-16 pb-28 md:pb-10">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <Link href="/" className="block mb-6 md:mb-8 focus-visible:outline-none" aria-label="yele">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/logomedia/mainlogo.svg" alt="" width={120} height={38} className="h-8 md:h-10 w-auto" />
            </Link>

            <h1
              className="font-display font-bold text-white tracking-tight leading-[1.03] mb-5 md:mb-7"
              style={{ fontSize: 'clamp(1.8rem, 2.9vw, 2.3rem)' }}
            >
              Una tienda de la que presumir.
              <br />
              A un precio que no asusta.
            </h1>

            <ul className="space-y-3 md:space-y-3.5 mb-8 md:mb-9">
              {points.map(point => (
                <li key={point} className="flex items-start gap-3">
                  <Check size={22} className="text-[#D46FC8] flex-shrink-0 mt-0.5 md:mt-1" aria-hidden="true" />
                  <span className="font-body text-lg md:text-xl font-semibold text-white/90">{point}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-4 mb-8 md:mb-10">
              <a
                href="#pricing"
                className="inline-flex items-center justify-center font-body font-semibold text-base md:text-lg bg-[#F2F0EB] hover:bg-white px-8 py-4 rounded-full transition-colors active:scale-95"
                style={{ color: '#16161A' }}
              >
                Precios
              </a>
              <a
                href="#tienda-form"
                className="inline-flex items-center justify-center font-body text-base md:text-lg font-medium text-white px-7 py-4 rounded-full border border-white/30 transition-colors hover:bg-white/10 active:scale-95"
              >
                Pide demo gratis
              </a>
            </div>

            <ReputationBadge className="scale-110 origin-left" locale="es" align="left" />
          </div>

          <div className="w-full">{rightPanel}</div>
        </div>
      </div>

      <a
        href="#comparativa"
        className="absolute bottom-5 md:bottom-7 left-1/2 -translate-x-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-[#D46FC8]/60 bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-[#D46FC8]/20 hover:border-[#D46FC8] cursor-pointer focus-visible:outline-none motion-safe:animate-[heroScrollBounce_1.5s_ease-in-out_infinite]"
        aria-label="Desplázate"
      >
        <ChevronDown size={26} strokeWidth={2.5} aria-hidden="true" />
      </a>
    </section>
  )
}
