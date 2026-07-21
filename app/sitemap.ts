import { MetadataRoute } from 'next'
import { articles } from '@/lib/articles'

const STATIC_LAST_MOD = new Date('2026-07-20')

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://yele.design'

  const articleEntries: MetadataRoute.Sitemap = articles
    .filter(a => a.lang === 'en')
    .map(a => ({
      url: `${baseUrl}/blog/${a.slug}`,
      lastModified: new Date(a.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

  return [
    {
      url: baseUrl,
      lastModified: STATIC_LAST_MOD,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/quote`,
      lastModified: STATIC_LAST_MOD,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: STATIC_LAST_MOD,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/web-design-plumbers`,
      lastModified: STATIC_LAST_MOD,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/web-design-electricians`,
      lastModified: STATIC_LAST_MOD,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/web-design-contractors`,
      lastModified: STATIC_LAST_MOD,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/web-design-movers`,
      lastModified: STATIC_LAST_MOD,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: STATIC_LAST_MOD,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...articleEntries,
  ]
}
