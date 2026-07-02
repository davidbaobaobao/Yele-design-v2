import type { Metadata } from 'next'
import Link from 'next/link'
import TablaComparativa from '@/components/TablaComparativa'
import ComoFunciona from '@/components/ComoFunciona'
import Testimonios from '@/components/Testimonios'
import FAQClient from '@/components/FAQClient'
import type { FAQItem } from '@/components/FAQClient'
import Showcase from '@/components/Showcase'
import { WAButton, RegistroButton, WA_LINK } from './_components/CTAButtons'

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

      {/* ── 0 · HEADER MÍNIMO ────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/[0.06]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-outfit font-semibold text-[#1D1D1F] text-lg tracking-tight select-none">
            <span className="text-[#34C759]">·</span> yele.design
          </span>
          <WAButton className="inline-flex items-center gap-2 font-manrope font-medium text-sm bg-[#25D366] text-white px-4 py-2 rounded-xl hover:bg-[#20B858] transition-colors">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            WhatsApp
          </WAButton>
        </div>
      </header>

      <main id="main-content">

        {/* ── 1 · HERO ─────────────────────────────────────────── */}
        <section className="min-h-[80vh] flex items-center justify-center py-24 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1
              className="font-outfit font-bold text-[#1D1D1F] leading-[1.05] tracking-tighter mb-7"
              style={{ fontSize: 'clamp(32px, 4vw, 56px)' }}
            >
              <span className="block">Tu presupuesto:</span>
              <span className="block text-[#86868B]">29€ al mes.</span>
              <span className="block">Sin complicaciones.</span>
            </h1>

            {/* Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              {['Sin pago inicial', 'Sin permanencia', 'Precio fijo', 'Sin letra pequeña', 'Lista en una semana'].map(pill => (
                <span key={pill} className="font-manrope text-sm text-[#86868B] bg-[#F5F5F7] px-3.5 py-1.5 rounded-full border border-black/[0.06]">
                  {pill}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <RegistroButton
                href="/registro"
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
          </div>
        </section>

        {/* ── 2 · ¿POR QUÉ TAN BARATO? ────────────────────────── */}
        <section className="py-20 md:py-28 bg-[#F5F5F7]">
          <div className="max-w-6xl mx-auto px-6">
            <span className="font-manrope text-xs tracking-[0.15em] uppercase text-[#86868B] mb-4 block">
              La pregunta lógica
            </span>
            <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-[#1D1D1F] tracking-tight mb-6 leading-tight">
              ¿Por qué 29€ y no 2.000€?<br className="hidden md:block" /> No es lo que crees.
            </h2>
            <p className="font-manrope text-[#86868B] text-lg leading-relaxed max-w-2xl mb-12">
              No es más barata por ser peor. Es una <strong className="text-[#1D1D1F] font-semibold">suscripción, no un pago único de agencia</strong>. Repartimos el coste en cuotas pequeñas y la mantenemos nosotros — por eso pagas 29€ al mes en lugar de soltar 2.000€ de golpe.
            </p>
            <div className="grid sm:grid-cols-3 gap-5">
              {([
                { icon: '◎', title: 'Sin pago inicial', desc: 'Nada de presupuestos de 1.500–2.000€ por adelantado. Empiezas a pagar cuando tienes la web.' },
                { icon: '✦', title: 'Diseño a medida', desc: 'Sin plantillas. Tu web desde cero, pensada para tu negocio y tus clientes.' },
                { icon: '↻', title: 'Siempre al día', desc: 'La mantenemos y mejoramos mientras seas cliente. Sin coste extra, sin volver a pagar.' },
              ] as const).map(item => (
                <div key={item.title} className="bg-white rounded-2xl p-7 border border-black/[0.06]">
                  <span className="font-outfit text-2xl text-[#34C759] block mb-4" aria-hidden="true">{item.icon}</span>
                  <p className="font-outfit font-semibold text-[#1D1D1F] text-lg mb-2">{item.title}</p>
                  <p className="font-manrope text-[#86868B] text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3 · TABLA COMPARATIVA ────────────────────────────── */}
        <TablaComparativa />

        {/* ── 4 · DIFERENCIADOR ────────────────────────────────── */}
        <section className="py-20 md:py-28 bg-[#1D1D1F]">
          <div className="max-w-6xl mx-auto px-6">
            <span className="font-manrope text-xs tracking-[0.15em] uppercase text-[#86868B] mb-4 block">
              Lo que la agencia no puede darte
            </span>
            <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-white tracking-tight mb-6 leading-tight">
              Tu web nunca se queda<br className="hidden md:block" /> anclada en 2019.
            </h2>
            <p className="font-manrope text-white/60 text-lg leading-relaxed max-w-2xl mb-10">
              Una web de agencia se entrega… y ahí se queda, congelada en el año que la hiciste. La tuya está en <strong className="text-white font-semibold">mejora constante</strong>: la mantenemos, la actualizamos y la adaptamos mientras seas cliente. Sin coste extra, sin volver a pagar.
            </p>
            <WAButton className="inline-flex items-center gap-2 font-manrope font-semibold text-base bg-[#25D366] text-white px-7 py-4 rounded-2xl hover:bg-[#20B858] transition-colors">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Pregúntanos por WhatsApp
            </WAButton>
          </div>
        </section>

        {/* ── 5 · EJEMPLOS ─────────────────────────────────────── */}
        <section id="ejemplos" className="py-20 md:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-6 mb-10">
            <span className="font-manrope text-xs tracking-[0.15em] uppercase text-[#86868B] mb-4 block">
              Portfolio
            </span>
            <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-[#1D1D1F] tracking-tight leading-tight">
              Webs que hemos construido.<br className="hidden md:block" /> Para negocios reales.
            </h2>
          </div>
          <Showcase />
          <div className="max-w-6xl mx-auto px-6 mt-8 text-center">
            <Link
              href="/ejemplos"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-manrope text-sm text-[#0066CC] hover:text-[#004D99] transition-colors"
            >
              Ver más ejemplos <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </section>

        {/* ── 6 · CÓMO FUNCIONA ────────────────────────────────── */}
        <ComoFunciona />

        {/* ── 7 · TESTIMONIOS ──────────────────────────────────── */}
        <Testimonios />

        {/* ── 8 · PRECIO — SOLO STARTER ────────────────────────── */}
        <section className="py-20 md:py-28 bg-[#F5F5F7]">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <span className="font-manrope text-xs tracking-[0.15em] uppercase text-[#86868B] mb-4 block">
              Precio
            </span>
            <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-[#1D1D1F] tracking-tight mb-10 leading-tight">
              Sin letra pequeña.<br /> Empieza por 29€/mes.
            </h2>

            <div className="bg-white rounded-3xl border-2 border-[#1D1D1F] p-8 md:p-10 text-left shadow-[0_8px_40px_rgba(0,0,0,0.08)]">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="font-outfit font-bold text-[#1D1D1F] text-2xl">Starter</p>
                  <p className="font-manrope text-[#86868B] text-sm mt-1">o 299€/año — ahorras 49€</p>
                </div>
                <div className="text-right">
                  <p className="font-outfit font-bold text-[#1D1D1F] text-4xl">29€</p>
                  <p className="font-manrope text-[#86868B] text-sm">/mes</p>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  'Diseño personalizado, a medida',
                  'Dominio y hosting incluidos',
                  'Adaptada a móvil',
                  'Panel de control',
                  'Mantenimiento y soporte',
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 font-manrope text-[#1D1D1F] text-sm">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <circle cx="8" cy="8" r="7.5" stroke="#34C759"/>
                      <path d="M5 8l2.5 2.5L11 5.5" stroke="#34C759" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-3">
                <WAButton className="flex-1 inline-flex items-center justify-center gap-2 font-manrope font-semibold text-base bg-[#25D366] text-white px-6 py-4 rounded-2xl hover:bg-[#20B858] transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Pídelo por WhatsApp
                </WAButton>
                <RegistroButton
                  href="/registro?plan=starter"
                  className="flex-1 inline-flex items-center justify-center font-manrope font-medium text-base text-[#1D1D1F] border border-black/[0.12] px-6 py-4 rounded-2xl hover:bg-[#F5F5F7] transition-colors"
                >
                  Empezar ahora →
                </RegistroButton>
              </div>
            </div>

            <p className="font-manrope text-sm text-[#86868B] mt-5">
              ¿Necesitas reservas online o SEO avanzado?{' '}
              <WAButton className="text-[#0066CC] hover:underline">Pregúntanos por el plan Pro.</WAButton>
            </p>
          </div>
        </section>

        {/* ── 9 · FAQ ──────────────────────────────────────────── */}
        <FAQClient faqs={LP_FAQS} />

        {/* ── 10 · CONTACTO / BANDA CTA FINAL ─────────────────── */}
        <section id="contacto" className="py-24 md:py-32 bg-[#1D1D1F]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-white tracking-tight mb-5 leading-tight">
              Cuéntanos tu negocio y ten<br />tu web esta semana.
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <WAButton className="inline-flex items-center justify-center gap-2 font-manrope font-semibold text-base bg-[#25D366] text-white px-8 py-4 rounded-2xl hover:bg-[#20B858] transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Escríbenos por WhatsApp
              </WAButton>
              <RegistroButton
                href="/registro"
                className="inline-flex items-center justify-center font-manrope font-medium text-base bg-white text-[#1D1D1F] px-8 py-4 rounded-2xl hover:bg-[#F5F5F7] transition-colors"
              >
                Empezar ahora →
              </RegistroButton>
            </div>
            <p className="font-manrope text-sm text-[#86868B]">
              Sin pago inicial · Sin permanencia · Lista en 3–5 días
            </p>
          </div>
        </section>

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
