import { supabase } from '@/lib/supabase'
import TestimoniosClient from './TestimoniosClient'

export const revalidate = 60

const FALLBACK = [
  { author_name: 'Sara M.',    role: 'Instructora de yoga, Madrid',                  body: 'Tenía la web pendiente desde hacía dos años. Con Yele la tuve lista en cuatro días. Ahora mis alumnas me encuentran en Google.',   rating: 5 },
  { author_name: 'Carlos R.', role: 'Fontanero autónomo, Bilbao',                   body: 'Pensé que tener web era complicado y caro. Por €29 al mes tengo algo que parece de empresa grande.',                              rating: 5 },
  { author_name: 'Elena T.',  role: 'Propietaria de estudio de cerámica, Gràcia',   body: 'El proceso fue rapidísimo. Me hicieron preguntas concretas, y tres días después tenía una web que realmente me representa.',      rating: 5 },
  { author_name: 'Miguel A.', role: 'Abogado, Valencia',                             body: 'Necesitaba algo serio, no un template de Wix. Yele entendió eso desde el primer mensaje.',                                       rating: 5 },
  { author_name: 'David B.',  role: 'Cliente Yele',                                  body: 'Yele es fantástica!',                                                                                                               rating: 5 },
]

export default async function Testimonios() {
  const { data } = await supabase
    .from('testimonials')
    .select('author_name, role, body, rating')
    .eq('client_id', process.env.NEXT_PUBLIC_CLIENT_ID)
    .eq('visible', true)
    .order('sort_order', { ascending: true })

  const testimonials = (data && data.length > 0) ? data : FALLBACK

  return <TestimoniosClient testimonials={testimonials} />
}
