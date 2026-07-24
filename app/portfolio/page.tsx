import { supabase } from '@/lib/supabase'
import EjemplosClient from '@/components/EjemplosClient'
import Navigation from '@/components/Navigation'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import Footer from '@/components/Footer'

import type { Metadata } from 'next'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Portfolio — Websites we\'ve built',
  description:
    'Portfolio of professional websites built by Yele for real businesses. Ceramics studios, restaurants, yoga, law firms, plumbers, and more.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Portfolio — Websites we\'ve built | Yele',
    description:
      'Professional websites built by Yele for real small businesses.',
    url: 'https://yele.design/portfolio',
  },
  alternates: {
    canonical: 'https://yele.design/portfolio',
  },
}

type ShowcaseProject = {
  id: string
  name: string
  description: string | null
  main_image: string
  additional_images: unknown
}

const FALLBACK: ShowcaseProject[] = [
  { id: '1', name: 'The Clay Studio · Ceramics, Austin',    description: 'Artisan ceramics studio',      main_image: 'https://images.pexels.com/photos/32212371/pexels-photo-32212371.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', additional_images: [] },
  { id: '2', name: 'Casa Verde · Mexican, Miami',           description: 'Neighborhood Mexican restaurant', main_image: 'https://images.pexels.com/photos/21327986/pexels-photo-21327986.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', additional_images: [] },
  { id: '3', name: 'Studio Noa · Yoga, Portland',          description: 'Yoga and meditation studio',     main_image: 'https://images.pexels.com/photos/4327023/pexels-photo-4327023.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',   additional_images: [] },
  { id: '4', name: 'Ferrer Law · Attorneys, Chicago',      description: 'Boutique law firm',              main_image: 'https://images.unsplash.com/photo-1635845080335-dcfe06a0fcf1?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85',  additional_images: [] },
  { id: '5', name: 'Mike\'s Plumbing · Denver',            description: 'Independent plumber',           main_image: 'https://images.unsplash.com/photo-1649769069590-268b0b994462?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85',   additional_images: [] },
]

function parseImages(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((v): v is string => typeof v === 'string')
  if (typeof raw === 'string') {
    try { return (JSON.parse(raw) as string[]).filter(Boolean) } catch { return [] }
  }
  return []
}

export default async function PortfolioPage() {
  const { data } = await supabase
    .from('showcase_projects')
    .select('id, name, description, main_image, additional_images')
    .eq('visible', true)
    .order('sort_order', { ascending: true })

  const raw = (data && data.length > 0) ? data : FALLBACK
  const projects = raw.map(p => ({
    ...p,
    additional_images: parseImages(p.additional_images),
  }))

  return (
    <main className="min-h-screen bg-base">
      <Navigation />

      <div className="px-3 pt-28 pb-4">
        <h1 className="font-display font-bold text-4xl md:text-5xl text-ink tracking-tight">
          Portfolio
        </h1>
      </div>

      <div className="px-3 pb-10">
        <EjemplosClient projects={projects} />
      </div>

      <ScrollToTopButton />
      <Footer />
    </main>
  )
}
