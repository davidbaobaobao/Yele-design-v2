import FAQClient from './FAQClient'

// Fixed FAQ — the same set shown on /letsbuild, so the homepage, the schema.org
// FAQPage (app/layout.tsx) and the landing page all tell one consistent story.
// No longer Supabase-driven, so it can never drift back to the old model.
const FAQS = [
  {
    question: 'How much does a website cost?',
    answer:
      'Yele websites start at $699. Most small businesses choose either our $699 Launch package or our $1,199 Business package. More advanced websites start from $2,799.',
  },
  {
    question: 'Is there a monthly fee?',
    answer:
      'Yes — Yele Care, our maintenance plan, from $29/month, in three tiers: Yele Care Lite ($29/mo) — hosting, security and backups; Yele Care ($49/mo) — a yearly redesign, we update your content, plus monitoring; and Yele Care+ ($99/mo) — advanced security, backups, monitoring and services.',
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

const FAQS_ES = [
  {
    question: '¿Cuánto cuesta una web?',
    answer:
      'Las webs de Yele empiezan en 699€. La mayoría de pequeños negocios eligen el plan Launch (699€) o el plan Business (1.199€). Las webs más avanzadas parten de 2.799€.',
  },
  {
    question: '¿Hay una cuota mensual?',
    answer:
      'Sí — Yele Care, nuestro plan de mantenimiento, desde 29€/mes, en tres niveles: Yele Care Lite (29€/mes) — hosting, seguridad y copias de seguridad; Yele Care (49€/mes) — un rediseño anual, actualizamos tu contenido y monitorización; y Yele Care+ (99€/mes) — seguridad avanzada, copias, monitorización y servicios.',
  },
  {
    question: '¿Es obligatorio Yele Care?',
    answer:
      'No — pero lo recomendamos encarecidamente. Yele Care incluye un rediseño completo cada año, así que tienes una web renovada cada año y todo sigue funcionando — alojada, segura, con copias, monitorizada y actualizada. Puedes alojar y gestionar la web tú mismo, pero con Yele Care nunca tienes que preocuparte de la parte técnica.',
  },
  {
    question: '¿Tengo que pagarlo todo por adelantado?',
    answer:
      'No. Pagas el 50% cuando empezamos. El 50% restante se paga cuando la web está terminada y aprobada para su lanzamiento.',
  },
  {
    question: '¿Soy dueño del diseño?',
    answer: 'Sí. Eres dueño de los archivos de diseño y tienes los derechos de autor de todo el contenido que creamos para ti.',
  },
  {
    question: '¿Cuánto tarda mi web en estar lista?',
    answer: 'Nuestro objetivo de entrega es en menos de 4 semanas desde que completas tu formulario de alta.',
  },
  {
    question: '¿El dominio y el hosting están incluidos?',
    answer:
      'El hosting está incluido con Yele Care. Podemos proporcionar y gestionar un dominio estándar, o puedes traer el tuyo. Los dominios premium pueden tener un coste adicional.',
  },
  {
    question: '¿El SEO está incluido?',
    answer:
      'Cada web incluye una base de SEO — configuración técnica, títulos de página, descripciones, sitemap, indexación, optimización móvil y analítica.',
  },
]

export default function FAQ({ noBg, dark }: { noBg?: boolean; dark?: boolean } = {}) {
  return <FAQClient faqs={FAQS} faqsEs={FAQS_ES} noBg={noBg} dark={dark} />
}
