export interface Article {
  slug: string
  lang: 'en' | 'es'
  titleEs: string
  titleEn: string
  excerptEs: string
  excerptEn: string
  date: string
  readTime: number
  category: string
  image: string
  contentEs: string
  contentEn: string
}

export const articles: Article[] = []

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find(a => a.slug === slug)
}

export function getRecentArticles(count = 3): Article[] {
  return [...articles]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count)
}
