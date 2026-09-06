import { supabase } from '@/lib/supabase'
import FAQClient from './FAQClient'

export const revalidate = 60

const FALLBACK = [
  { question: 'How much does a website cost?',              answer: 'Websites are a one-time build starting at $699 (Launch). Business is $1,199 and Pro from $2,799. Then Yele Care keeps everything running from $49/month.' },
  { question: 'Do I need any technical knowledge?',          answer: 'No. You tell us what you want and we build it. To update content you have a simple panel — no code required.' },
  { question: 'How long until my website is ready?',         answer: 'Our delivery goal is under 4 weeks from when you complete your onboarding form.' },
  { question: 'Is Yele Care compulsory?',                    answer: 'No, but we recommend it. Yele Care includes a full design refresh every year plus hosting, security, backups, updates and support — from $49/month.' },
  { question: 'Do I pay everything upfront?',                answer: 'No. You pay 50% to start and the remaining 50% when your website is approved for launch.' },
  { question: 'Are the domain and hosting included?',        answer: 'Hosting is included with Yele Care. The domain can be managed with us, or you can bring your own.' },
  { question: 'Can I see examples of websites you\'ve made?', answer: 'Yes — check out the Portfolio section on this page to see real projects.' },
]

export default async function FAQ({ noBg, dark }: { noBg?: boolean; dark?: boolean } = {}) {
  const { data } = await supabase
    .from('faqs')
    .select('question, answer')
    .eq('client_id', process.env.NEXT_PUBLIC_CLIENT_ID)
    .eq('visible', true)
    .order('sort_order', { ascending: true })

  const faqs = (data && data.length > 0) ? data : FALLBACK

  return <FAQClient faqs={faqs} noBg={noBg} dark={dark} />
}
