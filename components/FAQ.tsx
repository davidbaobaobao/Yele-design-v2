import { supabase } from '@/lib/supabase'
import FAQClient from './FAQClient'

export const revalidate = 60

const FALLBACK = [
  { question: '¿Necesito saber de tecnología?',             answer: 'No. Tú nos dices qué quieres y nosotros lo construimos. Para actualizar contenido tienes un panel sencillo, sin código.' },
  { question: '¿Cuánto tarda en estar lista mi web?',       answer: 'Entre 3 y 5 días desde que recibes tu formulario completado. Sin esperas de semanas.' },
  { question: '¿Puedo cancelar cuando quiera?',             answer: 'Sí. Sin permanencia, sin penalizaciones. Si en algún momento no lo necesitas, cancelas y listo.' },
  { question: '¿Qué pasa si quiero cambiar algo de mi web?', answer: 'Nos escribes y lo cambiamos. Según tu plan, en 12, 24 o 48 horas. Sin presupuestos extra.' },
  { question: '¿El dominio y el hosting están incluidos?',  answer: 'El hosting sí. El dominio se puede gestionar con nosotros o tú puedes traer el tuyo propio.' },
  { question: '¿Puedo ver ejemplos de webs que hayáis hecho?', answer: 'Sí, en la sección Trabajos de esta misma página puedes ver proyectos reales.' },
]

export default async function FAQ() {
  const { data } = await supabase
    .from('faqs')
    .select('question, answer')
    .eq('client_id', process.env.NEXT_PUBLIC_CLIENT_ID)
    .eq('visible', true)
    .order('sort_order', { ascending: true })

  const faqs = (data && data.length > 0) ? data : FALLBACK

  return <FAQClient faqs={faqs} />
}
