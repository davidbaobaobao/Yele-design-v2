import type { Metadata } from 'next'
import Link from 'next/link'
import { InfiniteGrid } from '@/components/ui/the-infinite-grid'
import Beneficios from '@/components/Beneficios'
import ComoFunciona from '@/components/ComoFunciona'
import Showcase from '@/components/Showcase'
import TablaComparativa from '@/components/TablaComparativa'
import Testimonios from '@/components/Testimonios'
import Precios from '@/components/Precios'
import ContactForm from '@/components/ContactForm'
import FAQClient from '@/components/FAQClient'
import type { FAQItem } from '@/components/FAQClient'
import { WAButton, RegistroButton, WA_LINK } from './_components/CTAButtons'
import ClarityScript from '@/components/ClarityScript'

export const metadata: Metadata = {
  title: 'Presupuesto web profesional — desde 29€/mes | Yele',
  description:
    'Calidad de agencia, precio de suscripción. Tu web lista en 3–5 días, desde 29€/mes. Sin pago inicial, sin permanencia.',
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://yele.design/presupuesto' },
}

const LP_FAQS: FAQItem[] = [
  {
    question: '¿Qué incluye el precio de 29€/mes?',
    answer: 'Diseño personalizado a medida, dominio, hosting, SSL, mantenimiento, soporte y cambios de contenido. Sin coste extra ni facturas sorpresa.',
  },
  {
    question: '¿Qué pasa si quiero cambiar algo de mi web?',
    answer: 'Puedes cambiarlo tú mismo en nuestro portal o nos escribes y lo cambiamos. Sin coste extra.',
  },
  {
    question: '¿Puedo cancelar cuando quiera?',
    answer: 'Sí. Sin permanencia, sin penalización. Si en algún momento no lo necesitas, cancelas y listo.',
  },
  {
    question: '¿Necesito saber de tecnología?',
    answer: 'No. Tú nos dices qué quieres y nosotros lo construimos. Para actualizar contenido tienes un panel sencillo, sin código.',
  },
  {
    question: '¿El dominio y el hosting están incluidos?',
    answer: 'El hosting sí. El dominio se puede gestionar con nosotros o tú puedes traer el tuyo propio.',
  },
  {
    question: '¿Cuánto tarda en estar lista mi web?',
    answer: 'Entre 3 y 5 días desde que nos das tu contenido. Sin esperas de semanas ni reuniones interminables.',
  },
]


export default function PresupuestoPage() {
  return (
    <div className="bg-white">
      <ClarityScript />

      {/* ── 0 · HEADER MÍNIMO ────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/[0.06]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-outfit font-semibold text-[#1D1D1F] text-lg tracking-tight select-none">
            <span className="text-[#34C759]">·</span> yele.design
          </span>
          <div className="flex items-center gap-2">
            <RegistroButton
              href="/registro?plan=starter"
              className="inline-flex items-center gap-1.5 font-manrope font-medium text-sm bg-[#1D1D1F] text-white px-4 py-2 rounded-xl hover:bg-black transition-colors"
            >
              Empezar →
            </RegistroButton>
            <WAButton className="inline-flex items-center gap-2 font-manrope font-medium text-sm bg-[#25D366] text-white px-4 py-2 rounded-xl hover:bg-[#20B858] transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              WhatsApp
            </WAButton>
          </div>
        </div>
      </header>

      <main id="main-content">

        {/* ── 1 + 2 · HERO + BENEFICIOS (merged) ───────────────── */}
        <section className="relative bg-white pt-20 pb-0">
          <div className="max-w-4xl mx-auto px-6 text-center pb-10">
            <h1
              className="font-outfit font-bold leading-[1.05] tracking-tighter mb-7"
              style={{ fontSize: 'clamp(32px, 4vw, 56px)' }}
            >
              <span className="block text-[#86868B]">Tu página web</span>
              <span className="block text-[#1D1D1F]">29€ al mes.</span>
              <span className="block text-[#86868B]">Sin complicaciones.</span>
            </h1>

            {/* CTAs */}
            <div className="flex items-center justify-center gap-3 flex-wrap mb-7">
              <RegistroButton
                href="/registro?plan=starter"
                className="inline-flex items-center gap-2 font-manrope font-medium text-base bg-[#1D1D1F] text-white px-7 py-3.5 rounded-2xl hover:bg-black transition-colors"
              >
                Empezar →
              </RegistroButton>
              <a
                href="#contacto"
                className="inline-flex items-center gap-2 font-manrope font-medium text-base text-[#1D1D1F] border border-black/[0.12] bg-white px-7 py-3.5 rounded-2xl hover:bg-[#F5F5F7] transition-colors"
              >
                Pregúntanos
              </a>
            </div>

            {/* Green checkmark bullets */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {['Sin pago inicial', 'Sin permanencia', 'Precio fijo', 'Sin letra pequeña', 'Lista en una semana'].map(item => (
                <span key={item} className="flex items-center gap-1.5 font-manrope text-sm text-[#86868B]">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <circle cx="7" cy="7" r="6.5" stroke="#34C759" strokeWidth="1"/>
                    <path d="M4.5 7l2 2 3-3" stroke="#34C759" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {item}
                </span>
              ))}
            </div>
          </div>

        </section>

        <Beneficios
          noHeader
          sectionClassName="pt-6 pb-16 md:pt-8 md:pb-20 bg-[#F5F5F7]"
        />

        {/* Scroll hint arrow — below pills, clear of content */}
        <div className="flex justify-center pb-8 -mt-12 bg-[#F5F5F7]">
          <div className="animate-bounce opacity-60">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1D1D1F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </div>



        {/* ── 3 · PORTFOLIO ────────────────────────────────────── */}
        <Showcase noHeader />

        {/* ── 4 · CÓMO FUNCIONA ────────────────────────────────── */}
        <ComoFunciona />

        {/* ── 5 · DIFERENCIADOR ────────────────────────────────── */}
        <section className="relative overflow-hidden py-20 md:py-28 bg-[#16161a]">
          <style>{`
            @media (prefers-reduced-motion: no-preference) {
              .orb-cw  { transform-box: fill-box; transform-origin: center; animation: orbSpin 26s linear infinite; }
              .orb-cw2 { transform-box: fill-box; transform-origin: center; animation: orbSpin 18s linear infinite; }
              .orb-ccw { transform-box: fill-box; transform-origin: center; animation: orbSpin 34s linear infinite reverse; }
              .orb-pulse { transform-box: fill-box; transform-origin: center; animation: orbPulse 3.4s ease-in-out infinite; }
              .orb-ring { transform-box: fill-box; transform-origin: center; animation: orbRing 3.6s ease-out infinite; }
              .orb-ring.d2 { animation-delay: 1.2s; }
              .orb-ring.d3 { animation-delay: 2.4s; }
            }
            @keyframes orbSpin { to { transform: rotate(360deg); } }
            @keyframes orbPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.14); } }
            @keyframes orbRing {
              0%   { transform: scale(0.55); opacity: 0.7; }
              80%  { opacity: 0; }
              100% { transform: scale(1.5); opacity: 0; }
            }
          `}</style>
          <InfiniteGrid />
          <div className="relative z-10 max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">

              {/* ── Left: copy ── */}
              <div>
                <div
                  className="font-outfit font-extrabold uppercase tracking-tight text-white leading-none mb-5"
                  style={{ fontSize: 'clamp(34px, 5vw, 58px)' }}
                >
                  La diferencia
                </div>
                <p
                  className="font-manrope font-semibold text-white/55 mb-8 leading-snug"
                  style={{ fontSize: 'clamp(17px, 2vw, 22px)' }}
                >
                  Lo que otras agencias<br className="hidden md:block" /> no pueden darte.
                </p>
                <div className="font-manrope text-white/60 text-base leading-relaxed max-w-[460px] mb-9 space-y-4">
                  <p>Otras agencias te entregan la web… y ahí se queda, congelada en el año que la hiciste.</p>
                  <p>La tuya está en{' '}
                    <span className="text-[#34C759] font-bold">mejora constante</span>
                    : la mantenemos, la actualizamos y la adaptamos.
                  </p>
                  <p className="text-white/90 font-medium">Sin costes extra. Siempre.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <RegistroButton
                    href="/registro?plan=starter"
                    className="inline-flex items-center gap-2 font-manrope font-semibold text-sm bg-[#34C759] text-white px-6 py-3.5 rounded-full hover:opacity-90 transition-opacity"
                  >
                    Empezar →
                  </RegistroButton>
                  <a
                    href="#contacto"
                    className="inline-flex items-center gap-2 font-manrope font-semibold text-sm text-white border border-white/20 px-6 py-3.5 rounded-full hover:bg-white/[0.06] transition-colors"
                  >
                    Contactar
                  </a>
                </div>
              </div>

              {/* ── Right: orbital SVG ── */}
              <div className="relative w-full max-w-[400px] mx-auto aspect-square order-first md:order-last">
                <svg viewBox="0 0 400 400" aria-hidden="true" className="w-full h-full overflow-visible">
                  <defs>
                    <radialGradient id="orbGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%"   stopColor="#34C759" stopOpacity="0.45" />
                      <stop offset="60%"  stopColor="#34C759" stopOpacity="0.10" />
                      <stop offset="100%" stopColor="#34C759" stopOpacity="0"    />
                    </radialGradient>
                  </defs>

                  {/* Glow halo */}
                  <circle cx="200" cy="200" r="150" fill="url(#orbGlow)" />

                  {/* Pulse rings */}
                  <circle className="orb-ring"    cx="200" cy="200" r="120" fill="none" stroke="#34C759" strokeWidth="1.2" opacity="0" />
                  <circle className="orb-ring d2" cx="200" cy="200" r="120" fill="none" stroke="#34C759" strokeWidth="1.2" opacity="0" />
                  <circle className="orb-ring d3" cx="200" cy="200" r="120" fill="none" stroke="#34C759" strokeWidth="1.2" opacity="0" />

                  {/* Outer orbit — counter-clockwise, dashed */}
                  <g className="orb-ccw">
                    <circle cx="200" cy="200" r="164" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1.4" strokeDasharray="3 9" />
                    <circle cx="200" cy="36"  r="7"  fill="#34C759" />
                    <circle cx="200" cy="36"  r="13" fill="none" stroke="#34C759" strokeWidth="1.3" opacity="0.4" />
                    <circle cx="364" cy="200" r="4"  fill="rgba(255,255,255,0.55)" />
                  </g>

                  {/* Mid orbit — clockwise */}
                  <g className="orb-cw">
                    <circle cx="200" cy="200" r="118" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.4" />
                    <circle cx="200" cy="82"  r="6"  fill="#fff" />
                    <circle cx="200" cy="318" r="5"  fill="#34C759" />
                    <circle cx="82"  cy="200" r="3.5" fill="rgba(255,255,255,0.5)" />
                  </g>

                  {/* Inner orbit — fast clockwise, dashed */}
                  <g className="orb-cw2">
                    <circle cx="200" cy="200" r="74" fill="none" stroke="#34C759" strokeWidth="1.4" opacity="0.5" strokeDasharray="2 7" />
                    <circle cx="274" cy="200" r="5"  fill="#34C759" />
                  </g>

                  {/* Pulsing center */}
                  <g className="orb-pulse">
                    <circle cx="200" cy="200" r="30" fill="none" stroke="#34C759" strokeWidth="1.6" opacity="0.45" />
                    <circle cx="200" cy="200" r="19" fill="none" stroke="#34C759" strokeWidth="1.6" opacity="0.7" />
                    <circle cx="200" cy="200" r="9"  fill="#34C759" />
                  </g>
                </svg>
              </div>

            </div>
          </div>
        </section>

        {/* ── 6 · TABLA COMPARATIVA ────────────────────────────── */}
        <TablaComparativa
          headingLine1="¿Por qué no otra agencia"
          headingLine2="o hacerlo tú mismo?"
          agencyLabel="Otras agencias"
        />

        {/* ── 7 · TESTIMONIOS ──────────────────────────────────── */}
        <Testimonios />

        {/* ── 8 · PRECIO ───────────────────────────────────────── */}
        <Precios singlePlan="starter" />

        {/* ── 9 · CONTACTO ─────────────────────────────────────── */}
        <ContactForm waLink={WA_LINK} />

        {/* ── 10 · FAQ ─────────────────────────────────────────── */}
        <FAQClient faqs={LP_FAQS} />

        {/* ── 11 · PORTFOLIO 3 ─────────────────────────────────── */}
        <Showcase noHeader />

      </main>

      {/* ── 11 · FOOTER MÍNIMO ───────────────────────────────── */}
      <footer className="bg-white border-t border-black/[0.06] py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-manrope text-[#86868B]">
            <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
              <span>Yele · Diseño web para negocios españoles</span>
              <a href="mailto:info@yele.design" className="hover:text-[#1D1D1F] transition-colors">
                info@yele.design
              </a>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-[#1D1D1F] transition-colors">
                WhatsApp
              </a>
            </div>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <Link href="/aviso-legal" className="hover:text-[#1D1D1F] transition-colors">Aviso Legal</Link>
              <Link href="/politica-privacidad" className="hover:text-[#1D1D1F] transition-colors">Privacidad</Link>
              <Link href="/condiciones-uso" className="hover:text-[#1D1D1F] transition-colors">Condiciones</Link>
              <span>© 2026 Yele</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
