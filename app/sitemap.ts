import { MetadataRoute } from 'next'
import { articles } from '@/lib/articles'

const STATIC_LAST_MOD = new Date('2026-07-20')
const base = 'https://yele.design'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const articleEntries: MetadataRoute.Sitemap = articles
    .filter(a => a.lang === 'en')
    .map(a => ({
      url: `${base}/blog/${a.slug}`,
      lastModified: new Date(a.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

  return [
    // Home (EN) — with hreflang to the Spanish home. (ZH home is noindex.)
    {
      url: base,
      lastModified: STATIC_LAST_MOD,
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: { languages: { es: `${base}/es`, 'x-default': base } },
    },
    {
      url: `${base}/es`,
      lastModified: STATIC_LAST_MOD,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: { languages: { en: base, 'x-default': base } },
    },
    // letsbuild — EN / ES / ZH cluster.
    {
      url: `${base}/letsbuild`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
      alternates: { languages: { es: `${base}/es/letsbuild`, zh: `${base}/zh/letsbuild`, 'x-default': `${base}/letsbuild` } },
    },
    {
      url: `${base}/es/letsbuild`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: { languages: { en: `${base}/letsbuild`, zh: `${base}/zh/letsbuild`, 'x-default': `${base}/letsbuild` } },
    },
    {
      url: `${base}/zh/letsbuild`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
      alternates: { languages: { en: `${base}/letsbuild`, es: `${base}/es/letsbuild`, 'x-default': `${base}/letsbuild` } },
    },
    {
      url: `${base}/start`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${base}/services`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${base}/portfolio`,
      lastModified: STATIC_LAST_MOD,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${base}/blog`,
      lastModified: STATIC_LAST_MOD,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Web Police — EN / ES / ZH cluster.
    {
      url: `${base}/webpolice`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: { languages: { es: `${base}/es/webpolice`, zh: `${base}/zh/webpolice`, 'x-default': `${base}/webpolice` } },
    },
    {
      url: `${base}/es/webpolice`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
      alternates: { languages: { en: `${base}/webpolice`, zh: `${base}/zh/webpolice`, 'x-default': `${base}/webpolice` } },
    },
    {
      url: `${base}/zh/webpolice`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
      alternates: { languages: { en: `${base}/webpolice`, es: `${base}/es/webpolice`, 'x-default': `${base}/webpolice` } },
    },
    // Legal — Terms (EN / ES). Privacy/cookie/legal-notice stay noindex.
    {
      url: `${base}/terms`,
      lastModified: STATIC_LAST_MOD,
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: { languages: { es: `${base}/es/terms`, 'x-default': `${base}/terms` } },
    },
    {
      url: `${base}/es/terms`,
      lastModified: STATIC_LAST_MOD,
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: { languages: { en: `${base}/terms`, 'x-default': `${base}/terms` } },
    },
    ...articleEntries,
  ]
}
