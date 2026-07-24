import Link from 'next/link'
import Image from 'next/image'
import { getRecentArticles } from '@/lib/articles'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function Noticias() {
  const articles = getRecentArticles(3)

  return (
    <section className="bg-base py-20 px-6">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="font-body text-sm font-medium text-muted tracking-wide uppercase mb-2">Blog</p>
            <h2 className="font-display font-semibold text-3xl md:text-4xl text-ink tracking-tight">
              Recursos para tu negocio
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden md:flex items-center gap-1.5 font-body text-sm text-[#0066CC] hover:underline"
          >
            Ver todos
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {articles.map(article => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group bg-white rounded-2xl overflow-hidden border border-hairline"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.titleEs}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-body text-xs font-medium text-[#0066CC] bg-[#E8F2FF] px-2.5 py-1 rounded-full">
                    {article.category}
                  </span>
                  <span className="font-body text-xs text-muted">{article.readTime} min</span>
                </div>
                <h3 className="font-display font-semibold text-ink text-lg leading-snug mb-2 group-hover:text-[#0066CC] transition-colors line-clamp-2">
                  {article.titleEs}
                </h3>
                <p className="font-body text-sm text-muted leading-relaxed line-clamp-2">
                  {article.excerptEs}
                </p>
                <p className="font-body text-xs text-[#ADADB8] mt-4">{formatDate(article.date)}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 md:hidden text-center">
          <Link
            href="/blog"
            className="font-body text-sm text-[#0066CC] hover:underline"
          >
            Ver todos los artículos →
          </Link>
        </div>
      </div>
    </section>
  )
}
