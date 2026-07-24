import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ComoFunciona from '@/components/ComoFunciona'
import Precios from '@/components/Precios'
import FAQClient from '@/components/FAQClient'
import type { FAQItem } from '@/components/FAQClient'

export const metadata: Metadata = {
  title: 'Diseño web para mudanzas — más presupuestos directos',
  description:
    'Web profesional para empresas de mudanzas lista en 1 semana. Formulario de presupuesto, zona de cobertura y confianza para que el cliente te elija a ti. Desde 49€/mes.',
  robots: { index: false, follow: false },
  alternates: {
    canonical: 'https://yele.design/diseno-web-mudanzas',
  },
  openGraph: {
    title: 'Diseño web para mudanzas — más presupuestos directos | Yele',
    description:
      'Consigue más presupuestos directos sin intermediarios. Web lista en 1 semana, desde 49€/mes, sin pago inicial ni permanencia.',
    url: 'https://yele.design/diseno-web-mudanzas',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Diseño web para empresas de mudanzas — Yele' }],
  },
}

const FAQS: FAQItem[] = [
  {
    question: '¿La web puede mostrar las zonas donde trabajo?',
    answer:
      'Sí, incluimos una sección con tu zona de cobertura para que el cliente sepa de un vistazo si le cubres.',
  },
  {
    question: '¿Pueden pedirme presupuesto desde la web?',
    answer:
      'Sí, la web lleva un formulario de solicitud de presupuesto que te llega directo, sin intermediarios ni comisiones.',
  },
  {
    question: 'Ya salgo en los comparadores, ¿para qué web propia?',
    answer:
      'En los comparadores compites solo por precio y pagas por cada contacto. Con web propia el cliente te elige y te contacta directo.',
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
        { '@type': 'ListItem', position: 2, name: 'Diseño web para mudanzas', item: 'https://yele.design/diseno-web-mudanzas' },
      ],
    },
  ],
}

const TRUST_SIGNALS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Seguro y garantía visibles',
    desc: 'Mostrar que trabajas con seguro de transporte convierte dudas en llamadas.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    title: 'Reseñas de clientes reales',
    desc: 'Las valoraciones de Google y testimonios hacen que el cliente te confíe sus pertenencias.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    title: 'Zona de cobertura clara',
    desc: 'El cliente ve de un vistazo si le cubres — sin tener que llamar para preguntar.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
    title: 'Presupuesto en 24 h',
    desc: 'Un formulario directo en tu web — sin pasar por intermediarios ni pagar comisión.',
  },
]

export default function MudanzasPage() {
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
              Diseño web para empresas de mudanzas
              <span className="mt-4 block">
                <span className="inline-flex font-body text-sm font-semibold tracking-wide bg-[#34C759]/[0.12] text-[#1A7A33] px-4 py-1.5 rounded-full">
                  Desde 49€/mes
                </span>
              </span>
            </h1>
            <p className="font-body text-muted text-xl leading-relaxed max-w-2xl mb-10">
              Quien se muda pide presupuesto a varias empresas el mismo día y elige rápido. Si no te encuentra fácil en Google ni puede pedirte presupuesto sin esfuerzo, ni entras en la lista. Web profesional lista en 1 semana. Desde 49€/mes, sin pago inicial, sin permanencia.
            </p>
            <Link
              href="/registro"
              className="inline-flex items-center gap-2 font-body font-medium text-base bg-ink text-white px-7 py-3.5 rounded-2xl hover:bg-black transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0066CC]"
            >
              Pedir mi web <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* Pilar 1 — Rapidez + confianza */}
        <section className="py-20 md:py-28 bg-base">
          <div className="max-w-6xl mx-auto px-6">
            <span className="font-body text-xs tracking-[0.15em] uppercase text-muted mb-4 block">
              Por qué importa
            </span>
            <h2 className="font-display font-semibold text-4xl md:text-5xl text-ink tracking-tight mb-6 leading-tight">
              La mudanza se decide<br className="hidden md:block" /> en un día
            </h2>
            <p className="font-body text-muted text-lg leading-relaxed max-w-2xl">
              Cuando alguien tiene fecha de mudanza, busca &ldquo;mudanzas&rdquo; más su ciudad en Google y pide presupuesto a las primeras empresas que le dan confianza. Decide por dos cosas: precio claro y la tranquilidad de que no le van a romper sus cosas. Una web con tu zona de cobertura, lo que incluye el servicio y un botón fácil de pedir presupuesto te mete en esa lista corta. Sin web, ni te llaman.
            </p>
          </div>
        </section>

        {/* Presupuesto + Zona de cobertura — feature showcase */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <span className="font-body text-xs tracking-[0.15em] uppercase text-muted mb-4 block">
              Funcionalidades clave
            </span>
            <h2 className="font-display font-semibold text-4xl md:text-5xl text-ink tracking-tight mb-4 leading-tight">
              Presupuesto fácil<br className="hidden md:block" /> + zona de cobertura
            </h2>
            <p className="font-body text-muted text-base mb-12 max-w-xl">
              Dos elementos que convierten visitas en contactos: un formulario directo y un mapa claro de dónde trabajas.
            </p>

            <div className="grid md:grid-cols-2 gap-8">

              {/* Formulario de presupuesto */}
              <div className="bg-base rounded-2xl p-8">
                <p className="font-display font-semibold text-ink text-lg mb-6">
                  Solicitud de presupuesto
                </p>
                <div className="flex flex-col gap-3">
                  {[
                    { label: 'Ciudad de origen', placeholder: 'p. ej. Madrid' },
                    { label: 'Ciudad de destino', placeholder: 'p. ej. Barcelona' },
                    { label: 'Fecha aproximada', placeholder: 'p. ej. 15 de julio' },
                    { label: 'Metros cuadrados aprox.', placeholder: 'p. ej. 80 m²' },
                  ].map(field => (
                    <div key={field.label}>
                      <label className="font-body text-[10px] font-semibold uppercase tracking-widest text-muted block mb-1">
                        {field.label}
                      </label>
                      <div className="w-full bg-white border border-hairline rounded-xl px-4 py-3 font-body text-sm text-muted">
                        {field.placeholder}
                      </div>
                    </div>
                  ))}
                  <div className="mt-2 bg-ink text-white font-body font-medium text-sm rounded-xl px-5 py-3.5 text-center">
                    Pedir presupuesto →
                  </div>
                </div>
                <p className="font-body text-[10px] text-muted mt-4 text-center">
                  Te llega directo por email — sin intermediarios.
                </p>
              </div>

              {/* Zona de cobertura */}
              <div className="bg-base rounded-2xl p-8">
                <p className="font-display font-semibold text-ink text-lg mb-2">
                  Zona de cobertura
                </p>
                <p className="font-body text-sm text-muted mb-6">
                  El cliente ve al momento si le cubres — sin llamar para preguntar.
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Madrid capital', 'Alcalá de Henares', 'Móstoles', 'Leganés',
                    'Getafe', 'Alcorcón', 'Fuenlabrada', 'Torrejón de Ardoz',
                    'Coslada', 'Pozuelo de Alarcón',
                  ].map(city => (
                    <span
                      key={city}
                      className="font-body text-xs font-medium bg-white border border-hairline text-ink px-3 py-1.5 rounded-full"
                    >
                      {city}
                    </span>
                  ))}
                  <span className="font-body text-xs text-muted px-3 py-1.5">
                    + tus zonas propias
                  </span>
                </div>
                <p className="font-body text-[10px] text-muted mt-6">
                  Estas ciudades se personalizan con las zonas reales donde operas.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Pilar 2 — Sin comparadores */}
        <section className="py-20 md:py-28 bg-base">
          <div className="max-w-6xl mx-auto px-6">
            <span className="font-body text-xs tracking-[0.15em] uppercase text-muted mb-4 block">
              La trampa de los comparadores
            </span>
            <h2 className="font-display font-semibold text-4xl md:text-5xl text-ink tracking-tight mb-6 leading-tight">
              Deja de depender<br className="hidden md:block" /> de los comparadores
            </h2>
            <p className="font-body text-muted text-lg leading-relaxed max-w-2xl">
              Los portales comparadores te ponen en una guerra de precios y te cobran por cada contacto. Con web propia, el cliente te pide presupuesto a ti directamente, sin intermediario y sin comisión, y tú controlas la relación desde el primer mensaje.
            </p>
          </div>
        </section>

        {/* Confianza */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <span className="font-body text-xs tracking-[0.15em] uppercase text-muted mb-4 block">
              Genera confianza antes de la llamada
            </span>
            <h2 className="font-display font-semibold text-4xl md:text-5xl text-ink tracking-tight mb-10 leading-tight">
              Enseña que eres<br className="hidden md:block" /> la elección segura
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {TRUST_SIGNALS.map(signal => (
                <div key={signal.title} className="bg-base rounded-2xl p-6">
                  <div className="text-ink mb-3">{signal.icon}</div>
                  <p className="font-display font-semibold text-ink text-base mb-2">{signal.title}</p>
                  <p className="font-body text-muted text-sm leading-relaxed">{signal.desc}</p>
                </div>
              ))}
            </div>
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

        {/* FAQ — custom Q&As for mudanzas */}
        <FAQClient faqs={FAQS} />

        {/* Final CTA */}
        <section className="py-24 md:py-32 bg-ink">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="font-display font-semibold text-4xl md:text-5xl text-white tracking-tight mb-5 leading-tight">
              Entra en la lista corta<br />de cada mudanza de tu zona.
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
