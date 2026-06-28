import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ComoFunciona from '@/components/ComoFunciona'
import Precios from '@/components/Precios'
import FAQClient from '@/components/FAQClient'
import type { FAQItem } from '@/components/FAQClient'

export const metadata: Metadata = {
  title: 'Diseño web para reformas — gana más presupuestos | Yele',
  description:
    'Web profesional para empresas de reformas lista en 5 días. Enseña tus proyectos, gana presupuestos y consigue clientes directos sin comisión. Desde 29€/mes.',
  alternates: {
    canonical: 'https://yele.design/diseno-web-reformas',
  },
  openGraph: {
    title: 'Diseño web para reformas — gana más presupuestos | Yele',
    description:
      'Enseña tu galería de proyectos y gana presupuestos sin pagar comisión. Lista en 5 días, desde 29€/mes, sin permanencia.',
    url: 'https://yele.design/diseno-web-reformas',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Diseño web para empresas de reformas — Yele' }],
  },
}

const FAQS: FAQItem[] = [
  {
    question: '¿Puedo enseñar fotos de mis reformas?',
    answer:
      'Sí, la web incluye una galería para tus proyectos, con antes y después. Es justo lo que convence al cliente que está comparando.',
  },
  {
    question: 'Ya tengo perfil en Habitissimo, ¿para qué web propia?',
    answer:
      'En esos portales pagas comisión y compites en precio. Con web propia el cliente te elige por tu trabajo y te contacta directo, sin intermediario.',
  },
  {
    question: '¿Puedo actualizar la galería yo mismo?',
    answer:
      'Sí, desde tu panel subes fotos de nuevos proyectos cuando quieras, sin tocar código.',
  },
  {
    question: '¿Cuánto tarda y cuánto cuesta?',
    answer: 'Lista en 3-5 días, desde 29€/mes, sin pago inicial ni permanencia.',
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
        { '@type': 'ListItem', position: 2, name: 'Diseño web para reformas', item: 'https://yele.design/diseno-web-reformas' },
      ],
    },
  ],
}

const GALLERY_PROJECTS = [
  { label: 'Reforma cocina abierta', location: 'Madrid' },
  { label: 'Baño completo', location: 'Barcelona' },
  { label: 'Reforma integral piso', location: 'Valencia' },
]

export default function ReformasPage() {
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
              Diseño web para empresas de reformas
            </h1>
            <p className="font-manrope text-[#86868B] text-xl leading-relaxed max-w-2xl mb-10">
              Quien va a gastarse miles de euros en reformar su casa investiga mucho antes de decidir. Si no ve tu trabajo, elige a otro. Enseña tus proyectos con una web profesional lista en 5 días. Desde 29€/mes, sin pago inicial, sin permanencia.
            </p>
            <Link
              href="/registro"
              className="inline-flex items-center gap-2 font-manrope font-medium text-base bg-[#1D1D1F] text-white px-7 py-3.5 rounded-2xl hover:bg-black transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0066CC]"
            >
              Pedir mi web <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* Pilar 1 — Prueba + confianza */}
        <section className="py-20 md:py-28 bg-[#F5F5F7]">
          <div className="max-w-6xl mx-auto px-6">
            <span className="font-manrope text-xs tracking-[0.15em] uppercase text-[#86868B] mb-4 block">
              Por qué importa
            </span>
            <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-[#1D1D1F] tracking-tight mb-6 leading-tight">
              Una reforma no se decide<br className="hidden md:block" /> por teléfono
            </h2>
            <p className="font-manrope text-[#86868B] text-lg leading-relaxed max-w-2xl">
              Antes de contratar una reforma, el cliente compara durante semanas: mira fotos de trabajos anteriores, lee reseñas, juzga si puede confiarte su casa y su dinero. Si solo tienes un Instagram o un perfil en un portal, no puede juzgarte bien. Una web con tu galería de proyectos — antes y después — es lo que convierte a un curioso en un presupuesto pedido.
            </p>
          </div>
        </section>

        {/* Galería de proyectos — placeholder spine */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <span className="font-manrope text-xs tracking-[0.15em] uppercase text-[#86868B] mb-4 block">
              Tu trabajo habla por ti
            </span>
            <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-[#1D1D1F] tracking-tight mb-4 leading-tight">
              Galería de proyectos
            </h2>
            <p className="font-manrope text-[#86868B] text-base mb-10 max-w-xl">
              Antes y después de cada reforma. Tus clientes ven exactamente lo que pueden esperar.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {GALLERY_PROJECTS.map(project => (
                <div key={project.label} className="rounded-2xl overflow-hidden border border-black/[0.06]">
                  {/* Before */}
                  <div className="relative">
                    <div className="aspect-[4/3] bg-[#F5F5F7] flex items-center justify-center">
                      <span className="font-manrope text-xs text-[#86868B]">Foto antes</span>
                    </div>
                    <span className="absolute top-3 left-3 font-manrope text-[10px] font-semibold tracking-widest uppercase bg-white/90 text-[#86868B] px-2.5 py-1 rounded-full">
                      Antes
                    </span>
                  </div>
                  {/* After */}
                  <div className="relative">
                    <div className="aspect-[4/3] bg-[#E8E8ED] flex items-center justify-center">
                      <span className="font-manrope text-xs text-[#86868B]">Foto después</span>
                    </div>
                    <span className="absolute top-3 left-3 font-manrope text-[10px] font-semibold tracking-widest uppercase bg-[#1D1D1F]/80 text-white px-2.5 py-1 rounded-full">
                      Después
                    </span>
                  </div>
                  {/* Label */}
                  <div className="px-4 py-3 bg-white">
                    <p className="font-outfit font-medium text-sm text-[#1D1D1F]">{project.label}</p>
                    <p className="font-manrope text-xs text-[#86868B] mt-0.5">{project.location}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="font-manrope text-xs text-[#86868B] mt-6 text-center">
              Estas tarjetas se rellenan con tus fotos reales antes de publicar la web.
            </p>
          </div>
        </section>

        {/* Pilar 2 — Sin comisión */}
        <section className="py-20 md:py-28 bg-[#F5F5F7]">
          <div className="max-w-6xl mx-auto px-6">
            <span className="font-manrope text-xs tracking-[0.15em] uppercase text-[#86868B] mb-4 block">
              La trampa de los portales
            </span>
            <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-[#1D1D1F] tracking-tight mb-6 leading-tight">
              Deja de competir<br className="hidden md:block" /> solo por precio
            </h2>
            <p className="font-manrope text-[#86868B] text-lg leading-relaxed max-w-2xl">
              En Habitissimo o Reformas.com pagas por cada contacto y entras en una guerra de precios con otras cinco empresas. Con tu propia web y tu galería, el cliente te elige por tu trabajo, no por ser el más barato — y te contacta directo, sin comisión de por medio.
            </p>
          </div>
        </section>

        {/* Cómo funciona — reused from homepage */}
        <ComoFunciona />

        {/* Por qué Yele */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <span className="font-manrope text-xs tracking-[0.15em] uppercase text-[#86868B] mb-4 block">
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
                { title: 'Lista en 3–5 días', desc: 'No en dos meses. En menos de una semana tu web está en marcha.' },
              ] as const).map(item => (
                <div key={item.title} className="bg-[#F5F5F7] rounded-2xl p-6">
                  <p className="font-outfit font-semibold text-[#1D1D1F] text-lg mb-2">{item.title}</p>
                  <p className="font-manrope text-[#86868B] text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Precios — reused from homepage */}
        <Precios />

        {/* FAQ — custom Q&As for reformas */}
        <FAQClient faqs={FAQS} />

        {/* Final CTA */}
        <section className="py-24 md:py-32 bg-[#1D1D1F]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="font-outfit font-semibold text-4xl md:text-5xl text-white tracking-tight mb-5 leading-tight">
              Deja que tu trabajo<br />hable por ti.
            </h2>
            <p className="font-manrope text-[#86868B] text-lg mb-10">
              Sin pago inicial. Lista en 3–5 días.
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
