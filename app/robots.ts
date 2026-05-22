import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/_next/'],
      },
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'Claude-Web',
          'anthropic-ai',
          'PerplexityBot',
          'Googlebot',
        ],
        allow: '/',
      },
    ],
    sitemap: 'https://yele.design/sitemap.xml',
  }
}
