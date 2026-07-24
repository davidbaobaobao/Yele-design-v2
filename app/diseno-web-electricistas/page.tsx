import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ComoFunciona from '@/components/ComoFunciona'
import Precios from '@/components/Precios'
import FAQClient from '@/components/FAQClient'
import type { FAQItem } from '@/components/FAQClient'

export const metadata: Metadata = {
  title: 'Diseño web para electricistas — más clientes desde Google',
  description:
    'Web profesional para electricistas lista en 1 semana. Aparece en Google cuando te buscan en tu zona. Sin pago inicial, desde 49€/mes, sin permanencia.',
  robots: { index: false, follow: false },
  alternates: {
    canonical: 'https://yele.design/diseno-web-electricistas',
  },
  openGraph: {
    title: 'Diseño web para electricistas — más clientes desde Google | Yele',
    description:
      'Web profesional para electricistas lista en 1 semana. Sin pago inicial, desde 49€/mes, sin permanencia.',
    url: 'https://yele.design/diseno-web-electricistas',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Diseño web para electricistas — Yele' }],
  },
}

const FAQS: FAQItem[] = [
  {
    question: 'Ya salgo en Google Maps, ¿necesito web?',
    answer:
      'Maps te muestra, pero una web propia es la que transmite que eres un profesional serio: enseña tus servicios, tu zona, tus reseñas y da la confianza que hace que te llamen a ti.',
  },
  {
    question: '¿No me llegan ya avisos por Cronoshare?',
    answer:
      'Sí, pero pagando comisión y compitiendo en precio. Con web propia esos clientes te llegan directos, sin intermediario.',
  },
  {
    question: '¿Apareceré cuando busquen "electricista en mi zona"?',
    answer:
      'Trabajamos para que aparezcas en Google de tu zona. No prometemos el primer puesto, pero una web bien hecha es la base para posicionarte donde antes no estabas.',
  },
  {
    question: '¿Cuánto tarda y cuánto cuesta?',
    answer: 'Lista en 1 semana, desde 49€/mes, sin pago inicial ni permanencia.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'FAQPage',
      mainEntity: FAQS.map(f => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://yele.design' },
        { '@type': 'ListItem', position: 2, name: 'Diseño web para electricistas', item: 'https://yele.design/diseno-web-electricistas' },
      ],
    },
  ],
}

export default function ElectricistasPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />
      <main id="main-content" className="bg-white">

        {/* Hero */}
        <section className="pt-32 pb-20 md:pt-44 md:pb-28 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <h1
              className="font-display font-bold text-ink tracking-tighter leading-[1.05] mb-6"
              style={{ fontSize: 'clamp(40px, 5.5vw, 72px)' }}
            >
              Diseño web para electricistas
              <span className="mt-4 block">
                <span className="inline-flex font-body text-sm font-semibold tracking-wide bg-[#34C759]/[0.12] text-[#1A7A33] px-4 py-1.5 rounded-full">
                  Desde 49€/mes
                </span>
              </span>
            </h1>
            <p className="font-body text-muted text-xl leading-relaxed max-w-2xl mb-10">
              Cuando a alguien se le va la luz o le salta el cuadro, busca un electricista en Google y llama al primero que le da confianza. Aparece tú — con una web profesional lista en 1 semana. Desde 49€/mes, sin pago inicial, sin permanencia.
            </p>
            <Link
              href="/registro"
              className="inline-flex items-center gap-2 font-body font-medium text-base bg-ink text-white px-7 py-3.5 rounded-2xl hover:bg-black transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0066CC]"
            >
              Pedir mi web <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* Pilar 1 — Urgencia + confianza */}
        <section className="py-20 md:py-28 bg-base">
          <div className="max-w-6xl mx-auto px-6">
            <span className="font-body text-xs tracking-[0.15em] uppercase text-muted mb-4 block">
              Por qué importa
            </span>
            <h2 className="font-display font-semibold text-4xl md:text-5xl text-ink tracking-tight mb-6 leading-tight">
              Te buscan con prisa y con dudas
            </h2>
            <p className="font-body text-muted text-lg leading-relaxed max-w-2xl">
              Un problema eléctrico asusta. El cliente no quiere al más barato: quiere a alguien que se vea serio y profesional, porque un trabajo mal hecho es un riesgo en su casa. Si te encuentra en Google con una web clara — tu zona, tus servicios, tu teléfono, tus reseñas — transmites esa seriedad antes de descolgar el teléfono. Sin web, ese cliente llama al de al lado.
            </p>
          </div>
        </section>

        {/* Pilar 2 — Sin comisión */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <span className="font-body text-xs tracking-[0.15em] uppercase text-muted mb-4 block">
              La trampa de los portales
            </span>
            <h2 className="font-display font-semibold text-4xl md:text-5xl text-ink tracking-tight mb-6 leading-tight">
              Deja de pagar comisión<br />por cada aviso
            </h2>
            <p className="font-body text-muted text-lg leading-relaxed max-w-2xl">
              En Cronoshare y similares pagas por cada contacto y compites en precio con otros cinco electricistas en el mismo aviso. Con web propia el cliente te encuentra y te llama a ti directamente, sin intermediario y sin comisión.
            </p>
          </div>
        </section>

        {/* Cómo funciona — reused from homepage */}
        <ComoFunciona />

        {/* Por qué Yele */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <span className="font-body text-xs tracking-[0.15em] uppercase text-muted mb-4 block">
              Por qué Yele
            </span>
            <h2 className="font-display font-semibold text-4xl md:text-5xl text-ink tracking-tight mb-10 leading-tight">
              Es básicamente probar<br className="hidden md:block" /> sin riesgo.
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {([
                { title: 'Sin pago inicial', desc: 'Empiezas sin desembolsar nada. La primera mensualidad es cuando tienes la web.' },
                { title: 'Sin permanencia', desc: 'Cancelas cuando quieras, sin penalización.' },
                { title: 'Todo incluido', desc: 'Dominio, hosting, mantenimiento y soporte. Sin facturas sorpresa.' },
                { title: 'Lista en 1 semana', desc: 'No en dos meses. En menos de una semana tu web está en marcha.' },
              ] as const).map(item => (
                <div key={item.title} className="bg-base rounded-2xl p-6">
                  <p className="font-display font-semibold text-ink text-lg mb-2">{item.title}</p>
                  <p className="font-body text-muted text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Precios — reused from homepage */}
        <Precios />

        {/* FAQ — custom Q&As for electricistas */}
        <FAQClient faqs={FAQS} />

        {/* Final CTA */}
        <section className="py-24 md:py-32 bg-ink">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="font-display font-semibold text-4xl md:text-5xl text-white tracking-tight mb-5 leading-tight">
              Que te encuentren cuando<br />más te necesitan.
            </h2>
            <p className="font-body text-muted text-lg mb-10">
              Sin pago inicial. Lista en 1 semana.
            </p>
            <Link
              href="/registro"
              className="inline-flex items-center gap-2 font-body font-medium text-base bg-white text-ink px-8 py-4 rounded-2xl hover:bg-base transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0066CC]"
            >
              Pedir mi web <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
