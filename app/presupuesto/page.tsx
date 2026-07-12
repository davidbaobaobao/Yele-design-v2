import type { Metadata } from 'next'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import ShowcaseFeatureCards from './_components/ShowcaseFeatureCards'
import DiferenciaSection from './_components/DiferenciaSection'
import ComoFunciona from '@/components/ComoFunciona'
import Showcase from '@/components/Showcase'
import Testimonios from '@/components/Testimonios'
import type { FAQItem } from '@/components/FAQClient'
import { WAButton, RegistroButton, WA_LINK } from './_components/CTAButtons'
import ClarityScript from '@/components/ClarityScript'
import HeroBento from './_components/HeroBento'
import ScrollBrake from './_components/ScrollBrake'
import PrecioCard from './_components/PrecioCard'

const TablaComparativa = dynamic(() => import('@/components/TablaComparativa'))
const ContactForm      = dynamic(() => import('@/components/ContactForm'))
const FAQClient        = dynamic(() => import('@/components/FAQClient'))

export const metadata: Metadata = {
  title: 'Diseño web profesional desde 49€/mes | Agencia de diseño web | Yele',
  description:
    'Diseño web profesional a medida desde 49€/mes. Tu agencia de diseño web sin pago inicial ni permanencia. Página web para tu negocio lista en 3-5 días.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://yele.design/presupuesto' },
}

const LP_FAQS: FAQItem[] = [
  {
    question: '¿Qué incluye el precio de 49€/mes?',
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
    answer: 'El hosting y Dominio todo incluido. También puedes traer tu dominio.',
  },
  {
    question: '¿Cuánto tarda en estar lista mi web?',
    answer: 'En menos de 1 semana desde que nos das tu contenido. Sin esperas ni reuniones interminables.',
  },
]


export default function PresupuestoPage() {
  return (
    <div>
      <ClarityScript />

      {/* ── 0 · HEADER MÍNIMO ────────────────────────────────── */}
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-outfit font-semibold text-white text-lg tracking-tight select-none">
            <span className="text-[#34C759]">·</span> yele.design
          </span>
          <div className="flex items-center gap-2">
            <RegistroButton
              href="/registro?plan=starter"
              className="inline-flex items-center gap-1.5 font-manrope font-medium text-sm bg-white text-[#1D1D1F] px-4 py-2 rounded-xl hover:bg-[#F5F5F7] transition-colors"
              aria-label="Empezar con el plan Starter"
            >
              Empezar por 0€
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
        <ScrollBrake />

        {/* ── 1 · HERO BENTO ───────────────────────────────────── */}
        <HeroBento />

        <ShowcaseFeatureCards />

        {/* ── 3 · CÓMO FUNCIONA ────────────────────────────────── */}
        <ComoFunciona noBg />

        {/* ── 4 · PRECIO ───────────────────────────────────────── */}
        <PrecioCard />

        {/* ── 5 · PORTFOLIO ────────────────────────────────────── */}
        <section className="min-h-screen flex flex-col justify-center overflow-hidden py-10">
          <div className="max-w-6xl mx-auto px-6 mb-6">
            <h2
              className="font-outfit font-semibold text-[#1D1D1F] tracking-tight"
              style={{ fontSize: 'clamp(26px, 3.5vw, 48px)' }}
            >
              Así puede lucir tu página web
            </h2>
          </div>
          <Showcase noHeader noBg fullScreen />
        </section>

        {/* ── 6 · DIFERENCIADOR ────────────────────────────────── */}
        <DiferenciaSection />

        {/* ── 7 · TESTIMONIOS ──────────────────────────────────── */}
        <Testimonios noBg />

        {/* ── 8 · TABLA COMPARATIVA ────────────────────────────── */}
        <TablaComparativa
          headingLine1="¿Por qué Yele como"
          headingLine2="agencia de diseño web?"
          agencyLabel="Otras agencias"
          noBg
        />

        {/* ── 9 · CONTACTO ─────────────────────────────────────── */}
        <ContactForm waLink={WA_LINK} />

        {/* ── 10 · FAQ ─────────────────────────────────────────── */}
        <FAQClient faqs={LP_FAQS} noBg />

      </main>

      {/* ── 11 · FOOTER MÍNIMO ───────────────────────────────── */}
      <footer className="border-t border-black/[0.06] py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-manrope text-[#6B7280]">
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
