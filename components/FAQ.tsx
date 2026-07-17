import { supabase } from '@/lib/supabase'
import FAQClient from './FAQClient'

export const revalidate = 60

const FALLBACK = [
  { question: 'Do I need any technical knowledge?',          answer: "No. You tell us what you want and we build it. To update content you have a simple panel — no code required." },
  { question: 'How long until my website is ready?',         answer: 'Under 1 week from when you complete your onboarding form. No waiting around.' },
  { question: 'Can I cancel at any time?',                   answer: 'Yes. No contract, no penalties. If you ever don\'t need it anymore, just cancel — that\'s it.' },
  { question: 'What if I want to change something on my site?', answer: 'Message us and we\'ll change it. Depending on your plan, within 12, 24 or 48 hours. No extra charges.' },
  { question: 'Are the domain and hosting included?',        answer: 'Hosting is included. The domain can be managed with us, or you can bring your own.' },
  { question: 'Can I see examples of websites you\'ve made?', answer: 'Yes — check out the Portfolio section on this page to see real projects.' },
]

export default async function FAQ({ noBg }: { noBg?: boolean } = {}) {
  const { data } = await supabase
    .from('faqs')
    .select('question, answer')
    .eq('client_id', process.env.NEXT_PUBLIC_CLIENT_ID)
    .eq('visible', true)
    .order('sort_order', { ascending: true })

  const faqs = (data && data.length > 0) ? data : FALLBACK

  return <FAQClient faqs={faqs} noBg={noBg} />
}
