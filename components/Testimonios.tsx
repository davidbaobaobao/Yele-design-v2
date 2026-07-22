import { supabase } from '@/lib/supabase'
import TestimoniosClient from './TestimoniosClient'

export const revalidate = 60

const FALLBACK = [
  { author_name: 'Sara M.',       role: 'Yoga instructor, Madrid',          body: "I'd been putting my website off for two years. With Yele I had it ready in four days. Now my students find me on Google and bookings have doubled.",                                                           rating: 5 },
  { author_name: 'Carlos R.',     role: 'Plumber, Bilbao',                  body: 'I thought having a website was complicated and expensive. For $99 a month I have something that looks like a big company. Clients call me instead of the competition.',                                         rating: 5 },
  { author_name: 'Miguel A.',     role: 'Lawyer, Valencia',                 body: "I needed something serious, not a Wix template. Yele understood that from the very first message. The design is clean, professional, and exactly what a law firm should look like online.",                   rating: 5 },
  { author_name: 'David B.',      role: 'Contractor, Madrid',               body: 'Yele delivered faster than any agency I have ever worked with. The site was live in five days, and it looks incredible on mobile. My clients are genuinely impressed.',                                        rating: 5 },
  { author_name: 'Ruben P.',      role: 'Restaurant owner, Seville',        body: 'We launched our new menu online in less than a week. Reservations went up immediately. The subscription model means I never have to worry about updates — they handle everything.',                           rating: 5 },
  { author_name: 'Elaine S.',     role: 'Ceramics studio, Barcelona',       body: 'The process was incredibly smooth. They asked the right questions and three days later I had a site that truly represents my brand. The photography integration is beautiful.',                               rating: 5 },
  { author_name: 'Eustaquio L.', role: 'Electrician, Málaga',               body: 'Before Yele I had zero online presence. Now I rank on Google for local searches and get two or three new enquiries every week. Best investment I have made for my business.',                                 rating: 5 },
  { author_name: 'Jorge M.',      role: 'Architect, Zaragoza',              body: 'As an architect I have high standards for design. Yele exceeded them. The portfolio section showcases my projects beautifully, and the site loads fast on every device.',                                      rating: 5 },
  { author_name: 'Sara L.',       role: 'Florist, Bilbao',                  body: 'I was sceptical about the subscription model but it makes total sense. I get ongoing support, content updates, and SEO improvements every month. It feels like having my own marketing team.',               rating: 5 },
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
