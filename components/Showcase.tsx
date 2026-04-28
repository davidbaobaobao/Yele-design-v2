import { supabase } from '@/lib/supabase'
import ShowcaseClient from './ShowcaseClient'

export const revalidate = 60

const fallbackItems = [
  {
    id: 'f1',
    image_url: 'https://images.pexels.com/photos/32212371/pexels-photo-32212371.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    caption: 'Cerámica en Gràcia',
    category: 'Comercio',
  },
  {
    id: 'f2',
    image_url: 'https://images.pexels.com/photos/21327986/pexels-photo-21327986.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    caption: 'Bar de tapas Barcelona',
    category: 'Restauración',
  },
  {
    id: 'f3',
    image_url: 'https://images.pexels.com/photos/4327023/pexels-photo-4327023.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    caption: 'Estudio de yoga Madrid',
    category: 'Salud',
  },
  {
    id: 'f4',
    image_url: 'https://images.unsplash.com/photo-1635845080335-dcfe06a0fcf1?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85',
    caption: 'Despacho de abogados Valencia',
    category: 'Servicios',
  },
  {
    id: 'f5',
    image_url: 'https://images.unsplash.com/photo-1649769069590-268b0b994462?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85',
    caption: 'Fontanero Bilbao',
    category: 'Servicios',
  },
]

export type ShowcaseItem = {
  id: string
  image_url: string
  caption: string
  category: string
}

export default async function Showcase() {
  let items: ShowcaseItem[] = fallbackItems

  if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const { data, error } = await supabase
      .from('gallery')
      .select('id, image_url, caption, category')
      .eq('visible', true)
      .order('sort_order', { ascending: true })

    if (!error && data && data.length > 0) {
      items = data
    }
  }

  return <ShowcaseClient items={items} />
}
