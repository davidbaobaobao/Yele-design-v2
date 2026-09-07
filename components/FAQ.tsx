import FAQClient from './FAQClient'

// Fixed FAQ — the same set shown on /letsbuild, so the homepage, the schema.org
// FAQPage (app/layout.tsx) and the landing page all tell one consistent story.
// No longer Supabase-driven, so it can never drift back to the old model.
const FAQS = [
  {
    question: 'How much does a website cost?',
    answer:
      'Yele websites start at $699. Most small businesses choose either our $699 Launch package or our $1,199 Business package. More advanced websites start from $2,799 — a one-time build.',
  },
  {
    question: 'Is there a monthly fee?',
    answer:
      'Yes. Yele Care is $49/month and covers hosting, domain support, security, backups, maintenance, support, and small website updates.',
  },
  {
    question: 'Is Yele Care compulsory?',
    answer:
      'No — but we highly recommend it. Yele Care includes a full design refresh every year, so you get a renewed website annually and everything keeps working — hosted, secure, backed up, monitored and up to date. You can host and manage the site yourself, but with Yele Care you never have to worry about the technical side.',
  },
  {
    question: 'Do I need to pay everything upfront?',
    answer:
      'No. You pay 50% when we begin. The remaining 50% is paid when the website is finished and approved for launch.',
  },
  {
    question: 'Do I own the design?',
    answer: 'Yes. You own the design files and hold the copyright to all the content we create for you.',
  },
  {
    question: 'How long until my website is ready?',
    answer: 'Our delivery goal is under 4 weeks from when you complete your onboarding form.',
  },
  {
    question: 'Are the domain and hosting included?',
    answer:
      'Hosting is included with Yele Care. We can provide and manage a standard domain, or you can bring your current one. Premium domains may cost extra.',
  },
  {
    question: 'Is SEO included?',
    answer:
      'Every website includes an SEO foundation — technical setup, page titles, descriptions, sitemap, indexing, mobile optimization, and analytics.',
  },
]

export default function FAQ({ noBg, dark }: { noBg?: boolean; dark?: boolean } = {}) {
  return <FAQClient faqs={FAQS} noBg={noBg} dark={dark} />
}
