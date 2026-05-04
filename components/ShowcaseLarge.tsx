import { supabase } from '@/lib/supabase'
import ShowcaseLargeClient from './ShowcaseLargeClient'
import type { ShowcaseProject } from './Showcase'

export const revalidate = 60

const FALLBACK: ShowcaseProject[] = [
  { id: '1', name: 'El Taller · Cerámica, Gràcia',         description: 'Estudio de cerámica artesanal',  main_image: 'https://images.pexels.com/photos/32212371/pexels-photo-32212371.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', additional_images: [] },
  { id: '2', name: 'Bar Zuriñe · Tapas, Barcelona',        description: 'Bar de tapas tradicional',       main_image: 'https://images.pexels.com/photos/21327986/pexels-photo-21327986.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', additional_images: [] },
  { id: '3', name: 'Estudio Noa · Yoga, Madrid',           description: 'Estudio de yoga y meditación',  main_image: 'https://images.pexels.com/photos/4327023/pexels-photo-4327023.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',   additional_images: [] },
  { id: '4', name: 'Despacho Ferrer · Abogados, Valencia', description: 'Despacho de abogados',          main_image: 'https://images.unsplash.com/photo-1635845080335-dcfe06a0fcf1?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85',  additional_images: [] },
  { id: '5', name: 'Txema · Fontanero, Bilbao',            description: 'Fontanero autónomo',            main_image: 'https://images.unsplash.com/photo-1649769069590-268b0b994462?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85',   additional_images: [] },
  { id: '6', name: 'Bicicletas Mola · Madrid',             description: 'Tienda de bicicletas',          main_image: 'https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',    additional_images: [] },
  { id: '7', name: 'Peluquería Sonia · Sevilla',           description: 'Peluquería y estética',         main_image: 'https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',  additional_images: [] },
  { id: '8', name: 'Fisio Olga · Zaragoza',                description: 'Fisioterapia y rehabilitación', main_image: 'https://images.pexels.com/photos/5473182/pexels-photo-5473182.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',  additional_images: [] },
]

export default async function ShowcaseLarge() {
  const { data } = await supabase
    .from('showcase_projects')
    .select('id, name, main_image, description, additional_images')
    .eq('visible', true)
    .order('sort_order', { ascending: true })

  const projects = (data && data.length > 0) ? data : FALLBACK

  return <ShowcaseLargeClient projects={projects} />
}
