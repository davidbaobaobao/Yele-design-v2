import Link from 'next/link'
import Image from 'next/image'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { articles } from '@/lib/articles'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog — Recursos para tu negocio web',
  description: 'Guías, comparativas y consejos prácticos sobre diseño web, SEO local y presencia digital para PYMEs y autónomos en España.',
  alternates: { canonical: 'https://yele.design/blog' },
  openGraph: {
    title: 'Blog — Recursos para tu negocio web | Yele',
    description: 'Guías y consejos prácticos sobre diseño web y SEO local para negocios españoles.',
    url: 'https://yele.design/blog',
  },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function BlogPage() {
  const [featured, ...rest] = articles

  return (
    <>
      <Navigation />
      <main id="main-content" className="min-h-screen bg-[#F5F5F7] pt-[72px]">
        {/* Header */}
        <div className="max-w-[1100px] mx-auto px-6 pt-14 pb-10">
          <p className="font-manrope text-sm font-medium text-[#86868B] tracking-wide uppercase mb-3">Blog</p>
          <h1 className="font-outfit font-bold text-4xl md:text-5xl text-[#1D1D1F] tracking-tight">
            Recursos para tu negocio
          </h1>
        </div>

        {/* Featured article */}
        <div className="max-w-[1100px] mx-auto px-6 pb-10">
          <Link
            href={`/blog/${featured.slug}`}
            className="group block md:grid md:grid-cols-2 gap-0 bg-white rounded-2xl overflow-hidden border border-black/[0.06] hover:shadow-[0_8px_40px_rgba(0,0,0,0.1)] transition-shadow duration-300"
          >
            <div className="relative aspect-[16/10] md:aspect-auto overflow-hidden">
              <Image
                src={featured.image}
                alt={featured.titleEs}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex flex-col justify-center p-8 md:p-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="font-manrope text-xs font-medium text-[#0066CC] bg-[#E8F2FF] px-2.5 py-1 rounded-full">
                  {featured.category}
                </span>
                <span className="font-manrope text-xs text-[#86868B]">{featured.readTime} min de lectura</span>
              </div>
              <h2 className="font-outfit font-semibold text-2xl md:text-3xl text-[#1D1D1F] leading-snug mb-4 group-hover:text-[#0066CC] transition-colors">
                {featured.titleEs}
              </h2>
              <p className="font-manrope text-[#86868B] leading-relaxed mb-6">
                {featured.excerptEs}
              </p>
              <div className="flex items-center justify-between">
                <p className="font-manrope text-xs text-[#ADADB8]">{formatDate(featured.date)}</p>
                <span className="font-manrope text-sm font-medium text-[#0066CC] flex items-center gap-1.5">
                  Leer artículo
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Article grid */}
        <div className="max-w-[1100px] mx-auto px-6 pb-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map(article => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-black/[0.06] hover:shadow-[0_8px_40px_rgba(0,0,0,0.1)] transition-shadow duration-300"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.titleEs}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-manrope text-xs font-medium text-[#0066CC] bg-[#E8F2FF] px-2.5 py-1 rounded-full">
                      {article.category}
                    </span>
                    <span className="font-manrope text-xs text-[#86868B]">{article.readTime} min</span>
                  </div>
                  <h3 className="font-outfit font-semibold text-[#1D1D1F] text-lg leading-snug mb-2 group-hover:text-[#0066CC] transition-colors line-clamp-2">
                    {article.titleEs}
                  </h3>
                  <p className="font-manrope text-sm text-[#86868B] leading-relaxed line-clamp-2">
                    {article.excerptEs}
                  </p>
                  <p className="font-manrope text-xs text-[#ADADB8] mt-4">{formatDate(article.date)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
