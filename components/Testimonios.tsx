import { supabase } from '@/lib/supabase'
import TestimoniosClient, { type Testimonial } from './TestimoniosClient'

export const revalidate = 60

const fallbackItems: Testimonial[] = [
  { id: '1', author: 'Sara M.',    role: 'Instructora de yoga, Madrid',                  text: 'Tenía la web pendiente desde hacía dos años. Con Yele la tuve lista en cuatro días. Ahora mis alumnas me encuentran en Google.' },
  { id: '2', author: 'Carlos R.', role: 'Fontanero autónomo, Bilbao',                   text: 'Pensé que tener web era complicado y caro. Por €20 al mes tengo algo que parece de empresa grande.' },
  { id: '3', author: 'Elena T.',  role: 'Propietaria de estudio de cerámica, Gràcia',   text: 'El proceso fue rapidísimo. Me hicieron preguntas concretas, y tres días después tenía una web que realmente me representa.' },
  { id: '4', author: 'Miguel A.', role: 'Abogado, Valencia',                             text: 'Necesitaba algo serio, no un template de Wix. Yele entendió eso desde el primer mensaje.' },
]

export default async function Testimonios() {
  let items: Testimonial[] = fallbackItems

  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('id, author, role, text')
      .eq('visible', true)
      .order('sort_order', { ascending: true })

    if (!error && data && data.length > 0) {
      items = data
    }
  } catch {
    // Keep fallback on network error
  }

  return <TestimoniosClient items={items} />
}
