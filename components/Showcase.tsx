import { supabase } from '@/lib/supabase'
import ShowcaseClient from './ShowcaseClient'

export const revalidate = 60

export type ShowcaseProject = {
  id: string
  name: string
  main_image: string
  description: string | null
}

const fallbackItems: ShowcaseProject[] = [
  { id: '1', name: 'El Taller · Cerámica, Gràcia',        main_image: 'https://images.pexels.com/photos/32212371/pexels-photo-32212371.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', description: 'Estudio de cerámica artesanal' },
  { id: '2', name: 'Bar Zuriñe · Tapas, Barcelona',       main_image: 'https://images.pexels.com/photos/21327986/pexels-photo-21327986.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', description: 'Bar de tapas tradicional' },
  { id: '3', name: 'Estudio Noa · Yoga, Madrid',          main_image: 'https://images.pexels.com/photos/4327023/pexels-photo-4327023.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',   description: 'Estudio de yoga y meditación' },
  { id: '4', name: 'Despacho Ferrer · Abogados, Valencia', main_image: 'https://images.unsplash.com/photo-1635845080335-dcfe06a0fcf1?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85',  description: 'Despacho de abogados' },
  { id: '5', name: 'Txema · Fontanero, Bilbao',           main_image: 'https://images.unsplash.com/photo-1649769069590-268b0b994462?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85',   description: 'Fontanero autónomo' },
]

export default async function Showcase() {
  let items: ShowcaseProject[] = fallbackItems

  try {
    const { data, error } = await supabase
      .from('showcase_projects')
      .select('id, name, main_image, description')
      .eq('visible', true)
      .order('sort_order', { ascending: true })

    if (!error && data && data.length > 0) {
      items = data
    }
  } catch {
    // Keep fallback on network error
  }

  return <ShowcaseClient items={items} />
}
