import { supabase } from '@/lib/supabase'
import ShowcaseClient from './ShowcaseClient'

export const revalidate = 60

export type ShowcaseProject = {
  id: string
  name: string
  main_image: string
  description: string | null
}

const FALLBACK: ShowcaseProject[] = [
  { id: '1', name: 'El Taller · Cerámica, Gràcia',         description: 'Estudio de cerámica artesanal',  main_image: 'https://images.pexels.com/photos/32212371/pexels-photo-32212371.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
  { id: '2', name: 'Bar Zuriñe · Tapas, Barcelona',        description: 'Bar de tapas tradicional',       main_image: 'https://images.pexels.com/photos/21327986/pexels-photo-21327986.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' },
  { id: '3', name: 'Estudio Noa · Yoga, Madrid',           description: 'Estudio de yoga y meditación',  main_image: 'https://images.pexels.com/photos/4327023/pexels-photo-4327023.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'   },
  { id: '4', name: 'Despacho Ferrer · Abogados, Valencia', description: 'Despacho de abogados',          main_image: 'https://images.unsplash.com/photo-1635845080335-dcfe06a0fcf1?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85'  },
  { id: '5', name: 'Txema · Fontanero, Bilbao',            description: 'Fontanero autónomo',            main_image: 'https://images.unsplash.com/photo-1649769069590-268b0b994462?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85'   },
]

export default async function Showcase() {
  const { data } = await supabase
    .from('showcase_projects')
    .select('id, name, main_image, description')
    .eq('visible', true)
    .order('sort_order', { ascending: true })

  const projects = (data && data.length > 0) ? data : FALLBACK

  return <ShowcaseClient projects={projects} />
}
