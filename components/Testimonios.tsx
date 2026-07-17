import { supabase } from '@/lib/supabase'
import TestimoniosClient from './TestimoniosClient'

export const revalidate = 60

const FALLBACK = [
  { author_name: 'Sara M.',    role: 'Yoga instructor, Madrid',                       body: "I'd been putting my website off for two years. With Yele I had it ready in four days. Now my students find me on Google.",        rating: 5 },
  { author_name: 'Carlos R.', role: 'Self-employed plumber, Bilbao',                  body: 'I thought having a website was complicated and expensive. For $99 a month I have something that looks like a big company.',       rating: 5 },
  { author_name: 'Elena T.',  role: 'Ceramics studio owner, Barcelona',               body: 'The process was incredibly fast. They asked the right questions, and three days later I had a site that truly represents me.',     rating: 5 },
  { author_name: 'Miguel A.', role: 'Lawyer, Valencia',                               body: "I needed something serious, not a Wix template. Yele understood that from the very first message.",                              rating: 5 },
  { author_name: 'David B.',  role: 'Yele client',                                    body: 'Yele is fantastic!',                                                                                                              rating: 5 },
]

export default async function Testimonios({ noBg }: { noBg?: boolean } = {}) {
  let testimonials = FALLBACK
  try {
    let query = supabase
      .from('testimonials')
      .select('author_name, role, body, rating')
      .eq('visible', true)
      .order('sort_order', { ascending: true })

    if (process.env.NEXT_PUBLIC_CLIENT_ID) {
      query = query.eq('client_id', process.env.NEXT_PUBLIC_CLIENT_ID)
    }

    const { data } = await query
    if (data && data.length > 0) testimonials = data
  } catch {
    // falls back to FALLBACK
  }

  return <TestimoniosClient testimonials={testimonials} noBg={noBg} />
}
