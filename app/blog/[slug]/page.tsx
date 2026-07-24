import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { articles, getArticleBySlug } from '@/lib/articles'
import type { Metadata } from 'next'

// Retired slugs return 410 Gone via middleware.ts (lib/retired-slugs.ts).
// notFound() below is a safety fallback for slugs that are neither active nor retired.

// No active articles — suppress dynamic rendering for unknown slugs (→ 404)
export const dynamicParams = false

export function generateStaticParams() {
  return articles.map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return {}
  return {
    title: article.titleEn,
    description: article.excerptEn,
    alternates: { canonical: `https://yele.design/blog/${article.slug}` },
    openGraph: {
      title: `${article.titleEn} | Yele`,
      description: article.excerptEn,
      url: `https://yele.design/blog/${article.slug}`,
      images: [{ url: article.image, width: 1200, height: 630, alt: article.titleEn }],
    },
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
}

function renderInline(raw: string): string {
  return raw
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#0066CC] underline underline-offset-2 hover:text-[#004D99] font-medium">$1</a>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-ink font-semibold">$1</strong>')
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
        <h2 key={key++} className="font-display font-semibold text-2xl text-ink mt-10 mb-4 tracking-tight">
          {line.slice(3)}
        </h2>
      )
      i++
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={key++} className="font-display font-semibold text-lg text-ink mt-7 mb-3">
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
                <tr key={ri} className={ri === 0 ? 'bg-base' : ri % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}>
                  {cells.map((cell, ci) => (
                    <Tag key={ci} className="font-body px-4 py-2.5 text-left border border-hairline text-ink">
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
          <img key={key++} src={src} alt={alt} className="w-full rounded-xl my-8 border border-hairline" />
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
        <ul key={key++} className="list-disc list-inside space-y-2 text-muted font-body leading-relaxed my-4 ml-2">
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
          className="font-body text-muted leading-relaxed text-[17px] my-4"
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
        '@type': 'BlogPosting',
        '@id': `${pageUrl}#article`,
        headline: article.titleEn,
        description: article.excerptEn,
        inLanguage: article.lang,
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
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://yele.design' },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://yele.design/blog' },
          { '@type': 'ListItem', position: 3, name: article.titleEn, item: pageUrl },
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
      <main id="main-content" className="min-h-screen bg-base pt-[72px]">
        {/* Hero image */}
        <div className={`relative w-full aspect-[21/8] overflow-hidden ${article.image.endsWith('.svg') ? 'bg-ink' : 'bg-base'}`}>
          <Image
            src={article.image}
            alt={article.titleEn}
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
            className="inline-flex items-center gap-1.5 font-body text-sm text-muted hover:text-ink transition-colors mb-8"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M11.5 7h-9M6 3.5L2.5 7 6 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to blog
          </Link>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-5">
            <span className="font-body text-xs font-medium text-[#0066CC] bg-[#E8F2FF] px-2.5 py-1 rounded-full">
              {article.category}
            </span>
            <span className="font-body text-xs text-muted">{article.readTime} min read</span>
            <span className="font-body text-xs text-[#ADADB8]">{formatDate(article.date)}</span>
          </div>

          <h1 className="font-display font-bold text-3xl md:text-4xl text-ink tracking-tight leading-tight mb-6">
            {article.titleEn}
          </h1>

          <p className="font-body text-xl text-muted leading-relaxed mb-10 pb-10 border-b border-hairline">
            {article.excerptEn}
          </p>

          {/* Content */}
          <div>
            {renderMarkdown(article.contentEn)}
          </div>
        </div>

        {/* CTA box */}
        <div className="max-w-[720px] mx-auto px-6 pb-16">
          <div className="bg-ink rounded-2xl p-8 md:p-10">
            <p className="font-body text-xs font-medium text-muted uppercase tracking-wide mb-3">Yele</p>
            <h2 className="font-display font-semibold text-2xl text-white mb-3 leading-snug">
              Your website live in 1 week.<br />From $99/mo, no commitment.
            </h2>
            <p className="font-body text-muted text-sm leading-relaxed mb-6">
              Professional design, hosting, SSL and maintenance included. No setup fee.
            </p>
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 font-body text-sm font-medium bg-white text-ink px-5 py-2.5 rounded-xl hover:bg-base transition-colors"
            >
              Get my website
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <div className="bg-base py-14">
            <div className="max-w-[1100px] mx-auto px-6">
              <h2 className="font-display font-semibold text-2xl text-ink mb-7">More articles</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {related.map(a => (
                  <Link
                    key={a.slug}
                    href={`/blog/${a.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-hairline"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={a.image}
                        alt={a.titleEn}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <span className="font-body text-xs font-medium text-[#0066CC] bg-[#E8F2FF] px-2.5 py-1 rounded-full">
                        {a.category}
                      </span>
                      <h3 className="font-display font-semibold text-ink text-base leading-snug mt-3 group-hover:text-[#0066CC] transition-colors line-clamp-2">
                        {a.titleEn}
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
