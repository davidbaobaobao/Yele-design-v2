import { supabase } from '@/lib/supabase'
import FAQClient, { type FAQItem } from './FAQClient'

export const revalidate = 60

const fallbackItems: FAQItem[] = [
  { id: '1', question: '¿Cuánto tarda en estar lista mi web?',          answer: 'Entre 3 y 5 días laborables desde que recibimos tu formulario completo. Es el tiempo real, no marketing.' },
  { id: '2', question: '¿Puedo pedir cambios una vez esté publicada?',   answer: 'Sí. Los cambios de contenido (textos, fotos, precios, horarios...) los hacemos en 24–48h en todos los planes.' },
  { id: '3', question: '¿Qué pasa si quiero cancelar?',                  answer: 'Sin permanencia. Avisas con 30 días de antelación y listo. No hay penalizaciones ni letras pequeñas.' },
  { id: '4', question: '¿Están incluidos el hosting y el dominio?',       answer: 'Sí. Hosting gestionado, dominio (.com o .es), certificado SSL y copias de seguridad diarias están incluidos en todos los planes.' },
  { id: '5', question: '¿Necesito saber de tecnología para gestionar mi web?', answer: 'No. Te damos acceso a un panel sencillo donde puedes cambiar textos e imágenes tú mismo, sin tocar ninguna línea de código.' },
  { id: '6', question: '¿Y si necesito algo muy específico?',             answer: 'Consúltanos. Si está fuera de los planes estándar, te preparamos un presupuesto a medida sin compromiso.' },
]

export default async function FAQ() {
  let items: FAQItem[] = fallbackItems

  try {
    const { data, error } = await supabase
      .from('faqs')
      .select('id, question, answer')
      .eq('visible', true)
      .order('sort_order', { ascending: true })

    if (!error && data && data.length > 0) {
      items = data
    }
  } catch {
    // Keep fallback on network error
  }

  return <FAQClient items={items} />
}
