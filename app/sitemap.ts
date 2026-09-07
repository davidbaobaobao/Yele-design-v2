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
      url: `${baseUrl}/letsbuild`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/start`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: STATIC_LAST_MOD,
      changeFrequency: 'weekly',
      priority: 0.9,
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
