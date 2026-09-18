import { supabase } from '@/lib/supabase'
import TestimoniosClient from './TestimoniosClient'

export const revalidate = 60

const FALLBACK = [
  { author_name: 'Sara M.',       role: 'Yoga instructor, Madrid',          body: "I'd been putting my website off for two years. With Yele I had it ready in four days. Now my students find me on Google and bookings have doubled.",                                                           rating: 5 },
  { author_name: 'Carlos R.',     role: 'Plumber, Bilbao',                  body: 'I thought having a website was complicated and expensive. For one fair price I got something that looks like a big company. Clients call me instead of the competition.',                                         rating: 5 },
  { author_name: 'Miguel A.',     role: 'Lawyer, Valencia',                 body: "I needed something serious, not a Wix template. Yele understood that from the very first message. The design is clean, professional, and exactly what a law firm should look like online.",                   rating: 5 },
  { author_name: 'David B.',      role: 'Contractor, Madrid',               body: 'Yele delivered faster than any agency I have ever worked with. The site was live in five days, and it looks incredible on mobile. My clients are genuinely impressed.',                                        rating: 5 },
  { author_name: 'Ruben P.',      role: 'Restaurant owner, Seville',        body: 'We launched our new menu online in less than a week. Reservations went up immediately. The subscription model means I never have to worry about updates — they handle everything.',                           rating: 5 },
  { author_name: 'Elaine S.',     role: 'Ceramics studio, Barcelona',       body: 'The process was incredibly smooth. They asked the right questions and three days later I had a site that truly represents my brand. The photography integration is beautiful.',                               rating: 5 },
  { author_name: 'Eustaquio L.', role: 'Electrician, Málaga',               body: 'Before Yele I had zero online presence. Now I rank on Google for local searches and get two or three new enquiries every week. Best investment I have made for my business.',                                 rating: 5 },
  { author_name: 'Jorge M.',      role: 'Architect, Zaragoza',              body: 'As an architect I have high standards for design. Yele exceeded them. The portfolio section showcases my projects beautifully, and the site loads fast on every device.',                                      rating: 5 },
  { author_name: 'Sara L.',       role: 'Florist, Bilbao',                  body: 'I was sceptical about the subscription model but it makes total sense. I get ongoing support, content updates, and SEO improvements every month. It feels like having my own marketing team.',               rating: 5 },
]

// Spanish version of the same testimonials (the names/cities are already
// Spanish — this just translates the roles and quotes for /es).
const FALLBACK_ES = [
  { author_name: 'Sara M.',      role: 'Instructora de yoga, Madrid',   body: 'Llevaba dos años posponiendo mi web. Con Yele la tuve lista en cuatro días. Ahora mis alumnos me encuentran en Google y las reservas se han duplicado.',                                             rating: 5 },
  { author_name: 'Carlos R.',    role: 'Fontanero, Bilbao',             body: 'Pensaba que tener una web era complicado y caro. Por un precio justo conseguí algo que parece de una gran empresa. Ahora me llaman a mí en vez de a la competencia.',                             rating: 5 },
  { author_name: 'Miguel A.',    role: 'Abogado, Valencia',             body: 'Necesitaba algo serio, no una plantilla de Wix. Yele lo entendió desde el primer mensaje. El diseño es limpio, profesional y justo como debe verse un despacho de abogados online.',              rating: 5 },
  { author_name: 'David B.',     role: 'Contratista, Madrid',           body: 'Yele entregó más rápido que cualquier agencia con la que he trabajado. La web estuvo lista en cinco días y se ve increíble en el móvil. Mis clientes están impresionados de verdad.',              rating: 5 },
  { author_name: 'Ruben P.',     role: 'Dueño de restaurante, Sevilla', body: 'Lanzamos nuestra nueva carta online en menos de una semana. Las reservas subieron enseguida. Con la suscripción no tengo que preocuparme por las actualizaciones: se encargan de todo.',           rating: 5 },
  { author_name: 'Elaine S.',    role: 'Estudio de cerámica, Barcelona',body: 'El proceso fue muy fácil. Hicieron las preguntas correctas y tres días después tenía una web que representa de verdad mi marca. La integración de las fotos quedó preciosa.',                        rating: 5 },
  { author_name: 'Eustaquio L.', role: 'Electricista, Málaga',          body: 'Antes de Yele no tenía ninguna presencia online. Ahora aparezco en Google en las búsquedas locales y recibo dos o tres consultas nuevas cada semana. La mejor inversión para mi negocio.',          rating: 5 },
  { author_name: 'Jorge M.',     role: 'Arquitecto, Zaragoza',          body: 'Como arquitecto soy muy exigente con el diseño. Yele superó mis expectativas. La sección de portfolio muestra mis proyectos de maravilla y la web carga rápido en cualquier dispositivo.',        rating: 5 },
  { author_name: 'Sara L.',      role: 'Florista, Bilbao',              body: 'Era escéptica con el modelo de suscripción, pero tiene todo el sentido. Tengo soporte continuo, actualizaciones de contenido y mejoras de SEO cada mes. Es como tener mi propio equipo de marketing.', rating: 5 },
]

export default async function Testimonios({ noBg, locale = 'en' }: { noBg?: boolean; locale?: 'en' | 'es' | 'zh' } = {}) {
  // Spanish page → use the Spanish testimonials directly (the DB copy is English).
  if (locale === 'es') {
    return <TestimoniosClient testimonials={FALLBACK_ES} noBg={noBg} />
  }

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
