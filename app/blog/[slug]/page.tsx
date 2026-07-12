import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { articles, getArticleBySlug } from '@/lib/articles'
import type { Metadata } from 'next'

const SECTOR_CTAS: Record<string, { href: string; heading: string; body: string; button: string }> = {
  'web-para-fontanero-como-conseguir-mas-clientes': {
    href: '/diseno-web-fontaneros',
    heading: '¿Eres fontanero y buscas una web que te traiga clientes?',
    body: 'Diseñamos webs específicamente pensadas para fontaneros autónomos: número visible, área de servicio, servicios detallados y SEO local. Listas en 1 semana.',
    button: 'Ver diseño web para fontaneros →',
  },
  'web-clinica-dental-como-atraer-pacientes': {
    href: '/diseno-web-clinicas-dentales',
    heading: '¿Tienes una clínica dental y quieres más pacientes?',
    body: 'Diseñamos webs para clínicas dentales que transmiten confianza, muestran tus tratamientos y convierten visitas en citas. Desde 49 €/mes.',
    button: 'Ver diseño web para clínicas dentales →',
  },
  'como-una-web-impulsa-tu-negocio-de-fontaneria': {
    href: '/diseno-web-fontaneros',
    heading: '¿Eres fontanero y buscas una web que traiga trabajo?',
    body: 'Webs para fontaneros con teléfono visible, zona de cobertura y SEO local. Listas en 1 semana, desde 49 €/mes, sin pago inicial.',
    button: 'Ver diseño web para fontaneros →',
  },
  'fontanero-en-espana-numeros-y-estadisticas': {
    href: '/diseno-web-fontaneros',
    heading: '¿Eres fontanero y quieres captar esas búsquedas?',
    body: 'Diseñamos tu web con los cinco elementos que convierten búsquedas en llamadas. Lista en 1 semana, desde 49 €/mes, sin pago inicial.',
    button: 'Ver diseño web para fontaneros →',
  },
}

export function generateStaticParams() {
  return articles.map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return {}
  return {
    title: article.titleEs,
    description: article.excerptEs,
    alternates: { canonical: `https://yele.design/blog/${article.slug}` },
    openGraph: {
      title: `${article.titleEs} | Yele`,
      description: article.excerptEs,
      url: `https://yele.design/blog/${article.slug}`,
      images: [{ url: article.image, width: 1200, height: 630, alt: article.titleEs }],
    },
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

function renderInline(raw: string): string {
  return raw
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#0066CC] underline underline-offset-2 hover:text-[#004D99] font-medium">$1</a>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-[#1D1D1F] font-semibold">$1</strong>')
}

function renderMarkdown(md: string) {
  const lines = md.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0
  let key = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="font-outfit font-semibold text-2xl text-[#1D1D1F] mt-10 mb-4 tracking-tight">
          {line.slice(3)}
        </h2>
      )
      i++
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={key++} className="font-outfit font-semibold text-lg text-[#1D1D1F] mt-7 mb-3">
          {line.slice(4)}
        </h3>
      )
      i++
    } else if (line.startsWith('| ')) {
      // Table
      const tableLines: string[] = []
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i])
        i++
      }
      const rows = tableLines.filter(l => !l.match(/^\|[-| ]+\|$/))
      elements.push(
        <div key={key++} className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            {rows.map((row, ri) => {
              const cells = row.split('|').filter((_, ci) => ci > 0 && ci < row.split('|').length - 1).map(c => c.trim())
              const Tag = ri === 0 ? 'th' : 'td'
              return (
                <tr key={ri} className={ri === 0 ? 'bg-[#F5F5F7]' : ri % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}>
                  {cells.map((cell, ci) => (
                    <Tag key={ci} className="font-manrope px-4 py-2.5 text-left border border-black/[0.08] text-[#1D1D1F]">
                      {cell}
                    </Tag>
                  ))}
                </tr>
              )
            })}
          </table>
        </div>
      )
    } else if (line.startsWith('![')) {
      const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
      if (imgMatch) {
        const [, alt, src] = imgMatch
        elements.push(
          // eslint-disable-next-line @next/next/no-img-element
          <img key={key++} src={src} alt={alt} className="w-full rounded-xl my-8 border border-black/[0.06]" />
        )
      }
      i++
    } else if (line.startsWith('- ')) {
      const items: string[] = []
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(lines[i].slice(2))
        i++
      }
      elements.push(
        <ul key={key++} className="list-disc list-inside space-y-2 text-[#6B7280] font-manrope leading-relaxed my-4 ml-2">
          {items.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: renderInline(item) }} />
          ))}
        </ul>
      )
    } else if (line.trim() === '') {
      i++
    } else {
      // Regular paragraph
      const paras: string[] = []
      while (i < lines.length && lines[i].trim() !== '' && !lines[i].startsWith('## ') && !lines[i].startsWith('### ') && !lines[i].startsWith('- ') && !lines[i].startsWith('| ')) {
        paras.push(lines[i])
        i++
      }
      const text = paras.join(' ')
      elements.push(
        <p
          key={key++}
          className="font-manrope text-[#6B7280] leading-relaxed text-[17px] my-4"
          dangerouslySetInnerHTML={{ __html: renderInline(text) }}
        />
      )
    }
  }

  return elements
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) notFound()

  const related = articles
    .filter(a => a.slug !== article.slug && (a.category === article.category || true))
    .slice(0, 3)

  const pageUrl = `https://yele.design/blog/${article.slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${pageUrl}#article`,
        headline: article.titleEs,
        description: article.excerptEs,
        datePublished: article.date,
        dateModified: article.date,
        url: pageUrl,
        author: {
          '@type': 'Organization',
          '@id': 'https://yele.design/#organization',
          name: 'Yele',
        },
        publisher: {
          '@id': 'https://yele.design/#organization',
        },
        image: {
          '@type': 'ImageObject',
          url: article.image,
          width: 1200,
          height: 630,
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': pageUrl,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://yele.design' },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://yele.design/blog' },
          { '@type': 'ListItem', position: 3, name: article.titleEs, item: pageUrl },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />
      <main id="main-content" className="min-h-screen bg-white pt-[72px]">
        {/* Hero image */}
        <div className={`relative w-full aspect-[21/8] overflow-hidden ${article.image.endsWith('.svg') ? 'bg-[#1D1D1F]' : 'bg-[#F5F5F7]'}`}>
          <Image
            src={article.image}
            alt={article.titleEs}
            fill
            sizes="100vw"
            priority
            unoptimized={article.image.endsWith('.svg')}
            className={article.image.endsWith('.svg') ? 'object-contain' : 'object-cover'}
          />
        </div>

        {/* Article content */}
        <div className="max-w-[720px] mx-auto px-6 py-12">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 font-manrope text-sm text-[#6B7280] hover:text-[#1D1D1F] transition-colors mb-8"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M11.5 7h-9M6 3.5L2.5 7 6 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Volver al blog
          </Link>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-5">
            <span className="font-manrope text-xs font-medium text-[#0066CC] bg-[#E8F2FF] px-2.5 py-1 rounded-full">
              {article.category}
            </span>
            <span className="font-manrope text-xs text-[#6B7280]">{article.readTime} min de lectura</span>
            <span className="font-manrope text-xs text-[#ADADB8]">{formatDate(article.date)}</span>
          </div>

          <h1 className="font-outfit font-bold text-3xl md:text-4xl text-[#1D1D1F] tracking-tight leading-tight mb-6">
            {article.titleEs}
          </h1>

          <p className="font-manrope text-xl text-[#6B7280] leading-relaxed mb-10 pb-10 border-b border-black/[0.08]">
            {article.excerptEs}
          </p>

          {/* Content */}
          <div>
            {renderMarkdown(article.contentEs)}
          </div>
        </div>

        {/* Sector landing CTA — pending landing page */}
        {SECTOR_CTAS[article.slug] && (() => {
          const cta = SECTOR_CTAS[article.slug]!
          return (
            <div className="max-w-[720px] mx-auto px-6 pb-8">
              <div className="border border-[#0066CC]/20 bg-[#E8F2FF] rounded-2xl p-7">
                <p className="font-outfit font-semibold text-[#1D1D1F] text-lg mb-2">{cta.heading}</p>
                <p className="font-manrope text-sm text-[#6B7280] leading-relaxed mb-5">{cta.body}</p>
                <Link
                  href={cta.href}
                  className="inline-flex items-center font-manrope text-sm font-medium text-[#0066CC] hover:text-[#004D99] transition-colors"
                >
                  {cta.button}
                </Link>
              </div>
            </div>
          )
        })()}

        {/* CTA box */}
        <div className="max-w-[720px] mx-auto px-6 pb-16">
          <div className="bg-[#1D1D1F] rounded-2xl p-8 md:p-10">
            <p className="font-manrope text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-3">Yele</p>
            <h2 className="font-outfit font-semibold text-2xl text-white mb-3 leading-snug">
              Tu web lista en 1 semana.<br />Desde 49 €/mes, sin permanencia.
            </h2>
            <p className="font-manrope text-[#6B7280] text-sm leading-relaxed mb-6">
              Diseño profesional, hosting, SSL y mantenimiento incluidos. Sin pago inicial.
            </p>
            <Link
              href="/registro"
              className="inline-flex items-center gap-2 font-manrope text-sm font-medium bg-white text-[#1D1D1F] px-5 py-2.5 rounded-xl hover:bg-[#F5F5F7] transition-colors"
            >
              Pedir mi web
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <div className="bg-[#F5F5F7] py-14">
            <div className="max-w-[1100px] mx-auto px-6">
              <h2 className="font-outfit font-semibold text-2xl text-[#1D1D1F] mb-7">Más artículos</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {related.map(a => (
                  <Link
                    key={a.slug}
                    href={`/blog/${a.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-black/[0.06] hover:shadow-[0_8px_40px_rgba(0,0,0,0.1)] transition-shadow duration-300"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={a.image}
                        alt={a.titleEs}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <span className="font-manrope text-xs font-medium text-[#0066CC] bg-[#E8F2FF] px-2.5 py-1 rounded-full">
                        {a.category}
                      </span>
                      <h3 className="font-outfit font-semibold text-[#1D1D1F] text-base leading-snug mt-3 group-hover:text-[#0066CC] transition-colors line-clamp-2">
                        {a.titleEs}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
