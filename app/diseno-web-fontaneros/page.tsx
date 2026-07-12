import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ComoFunciona from '@/components/ComoFunciona'
import Precios from '@/components/Precios'
import FAQClient from '@/components/FAQClient'
import type { FAQItem } from '@/components/FAQClient'

export const metadata: Metadata = {
  title: 'Diseño web para fontaneros | Yele',
  description:
    'Web profesional para fontaneros lista en 1 semana. Aparece en Google cuando te buscan en tu zona. Sin pago inicial, desde 49€/mes, sin permanencia.',
  alternates: {
    canonical: 'https://yele.design/diseno-web-fontaneros',
  },
  openGraph: {
    title: 'Diseño web para fontaneros | Yele',
    description:
      'Web profesional para fontaneros lista en 1 semana. Sin pago inicial, desde 49€/mes, sin permanencia.',
    url: 'https://yele.design/diseno-web-fontaneros',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Diseño web para fontaneros — Yele' }],
  },
}

const FAQS: FAQItem[] = [
  {
    question: 'Ya salgo en Google Maps, ¿para qué quiero web?',
    answer:
      'Google Maps te muestra, pero no convence. Una web propia enseña tus servicios, tu zona, tus reseñas y tu teléfono de forma clara, y da la confianza que hace que te llamen a ti y no al siguiente. Además, complementa tu ficha: las dos juntas funcionan mejor.',
  },
  {
    question: '¿No me llegan ya clientes por Cronoshare o Habitissimo?',
    answer:
      'Sí, pero pagando comisión por cada uno y compitiendo en precio. Con web propia esos mismos clientes te llegan directos, sin intermediario.',
  },
  {
    question: '¿Apareceré cuando busquen "fontanero en mi zona"?',
    answer:
      'Trabajamos para que aparezcas en Google de tu zona. No prometemos el primer puesto mágico, pero una web bien hecha es la base para posicionarte donde antes no estabas.',
  },
  {
    question: '¿Cuánto tarda y cuánto cuesta?',
    answer: 'Lista en 1 semana, desde 49€/mes, sin pago inicial y sin permanencia.',
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
        { '@type': 'ListItem', position: 2, name: 'Diseño web para fontaneros', item: 'https://yele.design/diseno-web-fontaneros' },
      ],
    },
  ],
}

export default function FontanerosPage() {
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
              className="font-outfit font-bold text-[#1D1D1F] tracking-tighter leading-[1.05] mb-6"
              style={{ fontSize: 'clamp(40px, 5.5vw, 72px)' }}
            >
              Diseño web para fontaneros
            </h1>
            <p className="font-manrope text-[#6B7280] text-xl leading-relaxed max-w-2xl mb-10">
              Tu web profesional lista en 1 semana. Aparece en Google cuando alguien de tu zona busca un fontanero — y consigue trabajos nuevos sin pagar comisión por cada cliente. Desde 49€/mes, sin pago inicial, sin permanencia.
            </p>
            <Link
              href="/registro"
              className="inline-flex items-center gap-2 font-manrope font-medium text-base bg-[#1D1D1F] text-white px-7 py-3.5 rounded-2xl hover:bg-black transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0066CC]"
            >
              Pedir mi web <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* Pilar 1 — El cliente te busca con urgencia */}
        <section className="py-20 md:py-28 bg-[#F5F5F7]">
          <div className="max-w-6xl mx-auto px-6">
            <span className="font-manrope text-xs tracking-[0.15em] uppercase text-[#6B7280] mb-4 block">
              Por qué importa
            </span>
            <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-[#1D1D1F] tracking-tight mb-6 leading-tight">
              El cliente te busca con urgencia
            </h2>
            <p className="font-manrope text-[#6B7280] text-lg leading-relaxed max-w-2xl">
              Cuando a alguien se le revienta una tubería o se queda sin agua caliente, no pregunta a un amigo: abre Google y escribe &ldquo;fontanero&rdquo; más su barrio. Llama al primero que le da confianza. Si no apareces con una web seria — horarios, zona, teléfono, reseñas a la vista — ese trabajo se lo lleva otro. No es perder un cliente: es trabajo nuevo que podrías coger y que ahora mismo no estás cogiendo.
            </p>
          </div>
        </section>

        {/* Pilar 2 — Sin comisión */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <span className="font-manrope text-xs tracking-[0.15em] uppercase text-[#6B7280] mb-4 block">
              La trampa de los portales
            </span>
            <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-[#1D1D1F] tracking-tight mb-6 leading-tight">
              Deja de pagar comisión<br />por cada cliente
            </h2>
            <p className="font-manrope text-[#6B7280] text-lg leading-relaxed max-w-2xl">
              Cronoshare, Habitissimo y los demás portales te cobran por cada contacto, y te ponen a competir en precio con otros cinco fontaneros en el mismo aviso. Con web propia, el cliente te encuentra a ti directamente y te llama a ti — sin intermediario y sin comisión. La web se paga sola con un par de trabajos al mes que antes se iban al portal.
            </p>
          </div>
        </section>

        {/* Infografía — 5 elementos clave */}
        <section className="py-20 md:py-28 bg-[#F5F5F7]">
          <div className="max-w-6xl mx-auto px-6">
            <span className="font-manrope text-xs tracking-[0.15em] uppercase text-[#6B7280] mb-4 block">
              De un vistazo
            </span>
            <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-[#1D1D1F] tracking-tight mb-4 leading-tight">
              Lo que necesita<br className="hidden md:block" /> tu web para traer trabajo
            </h2>
            <p className="font-manrope text-[#6B7280] text-base mb-10 max-w-xl">
              Cinco elementos concretos que marcan la diferencia entre una web que rellena y una que hace sonar el teléfono.
            </p>
            <Image
              src="/blog/images/fontaneros-web-infografia.svg"
              alt="Los 5 elementos que necesita la web de un fontanero: teléfono visible, zona de cobertura, servicios, reseñas y SEO local"
              width={1200}
              height={680}
              className="w-full rounded-2xl border border-black/[0.06]"
              unoptimized
            />
          </div>
        </section>

        {/* Cómo funciona — reused from homepage */}
        <ComoFunciona />

        {/* Por qué Yele y no una agencia */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <span className="font-manrope text-xs tracking-[0.15em] uppercase text-[#6B7280] mb-4 block">
              Por qué Yele
            </span>
            <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-[#1D1D1F] tracking-tight mb-10 leading-tight">
              Es básicamente probar<br className="hidden md:block" /> sin riesgo.
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {([
                { title: 'Sin pago inicial', desc: 'Empiezas sin desembolsar nada. La primera mensualidad es cuando tienes la web.' },
                { title: 'Sin permanencia', desc: 'Cancelas cuando quieras, sin penalización.' },
                { title: 'Todo incluido', desc: 'Dominio, hosting, mantenimiento y soporte. Sin facturas sorpresa.' },
                { title: 'Lista en 1 semana', desc: 'No en dos meses. En menos de una semana tu web está en marcha.' },
              ] as const).map(item => (
                <div key={item.title} className="bg-[#F5F5F7] rounded-2xl p-6">
                  <p className="font-outfit font-semibold text-[#1D1D1F] text-lg mb-2">{item.title}</p>
                  <p className="font-manrope text-[#6B7280] text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Precios — reused from homepage */}
        <Precios />

        {/* FAQ — custom Q&As for fontaneros */}
        <FAQClient faqs={FAQS} />

        {/* Final CTA */}
        <section className="py-24 md:py-32 bg-[#1D1D1F]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-white tracking-tight mb-5 leading-tight">
              Empieza a coger los trabajos<br />que ahora se te escapan.
            </h2>
            <p className="font-manrope text-[#6B7280] text-lg mb-10">
              Sin pago inicial. Lista en 1 semana.
            </p>
            <Link
              href="/registro"
              className="inline-flex items-center gap-2 font-manrope font-medium text-base bg-white text-[#1D1D1F] px-8 py-4 rounded-2xl hover:bg-[#F5F5F7] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0066CC]"
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
