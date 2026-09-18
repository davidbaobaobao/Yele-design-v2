// Funnel i18n — English (default, US), Spanish and Chinese for the /letsbuild
// + /received conversion path. English strings here MUST match the original
// hardcoded copy verbatim so the English pages render unchanged.
//
// Currency: the price NUMBERS are identical across locales (699 / 1199 / 2799,
// and 29 / 49 / 99); only the symbol changes — '$' for English, '€' for
// Spanish and Chinese — so nothing about Stripe/checkout changes. Brand and
// product names (Yele, Yele Care, Launch/Business/Pro) stay in Latin script
// in every locale.

export const LOCALES = ['en', 'es', 'zh'] as const
export type Locale = (typeof LOCALES)[number]

export function isLocale(v: string | undefined | null): v is Locale {
  return v === 'en' || v === 'es' || v === 'zh'
}

// '$' before the amount for USD, '€' before the amount for EUR. Kept as a
// prefix everywhere so it drops straight into the existing card layouts.
export function currencySymbol(locale: Locale): string {
  return locale === 'en' ? '$' : '€'
}

// e.g. price('es', '1,199') -> '€1,199'
export function price(locale: Locale, amount: string): string {
  return `${currencySymbol(locale)}${amount}`
}

type Feature = { label: string; info?: string }
type Tier = {
  name: string
  amount: string
  from?: boolean
  planValue: string
  blurb: string
  headline: string | null
  features: Feature[]
  care: string
  cta: string
  popular: boolean
}

export type FunnelDict = {
  heroTitle: string
  featuredTitle: string
  hero: {
    points: string[]
    startNow: string
    pricing: string
    scrollDown: string
    reviews: string
  }
  rating: string
  form: {
    heading: string
    coreValues: string
    values: { title: string; body: string }[]
    bookCall: string
    // When set, the "book a call" link becomes a WhatsApp link instead (used
    // for the Spanish version, where the Spanish number is a WhatsApp line).
    whatsapp?: string
    // LeadForm field labels + controls
    name: string
    email: string
    phone: string
    company: string
    companyPlaceholder: string
    namePlaceholder: string
    emailPlaceholder: string
    phonePlaceholder: string
    timelineQ: string
    timeline: string[]
    timelineError: string
    planQ: string
    cta: string
    sending: string
    consentPre: string
    privacy: string
    errName: string
    errEmail: string
    errEmailInvalid: string
    errPhone: string
    errCompany: string
    submitError: string
  }
  logos: { heading?: string }
  pricing: {
    title: string
    payNote: string
    tiers: Tier[]
    perMonthCare: string
  }
  care: {
    title1: string
    title2: string
    subtitle: string
    contentTitle: string
    contentBody: string
    redesignTitle: string
    redesignBodyPre: string
    redesignNever: string
    redesignBodyPost: string
    maintTitle: string
    maintBody: string
    includes: string[]
  }
  how: {
    kicker: string
    title: string
    steps: { title: string; body: string }[]
  }
  why: {
    title: string
    subtitle: string
    items: { title: string; body: string }[]
    neverTitlePre: string
    neverWord: string
    neverTitlePost: string
    neverBody: string
  }
  buildForm: {
    title: string
    subtitle: string
  }
  finalCta: {
    title: string
    line1: string
    line2: string
    startNow: string
  }
  received: {
    welcome: string
    welcomeName: (n: string) => string
    callLead: string
    dontWait: string
    dontWaitBody: string
    pay50: string
    nextSteps: string
    steps: { title: string; body: string }[]
    backHome: string
  }
  footer: {
    rights: string
    terms: string
    privacy: string
    legal: string
  }
  switcher: { label: string }
}

// ---- English (verbatim from the original components) ----
const en: FunnelDict = {
  heroTitle: "Let's build your website",
  featuredTitle: 'Latest featured work',
  hero: {
    points: ['From $699', 'No tasteless templates', 'No DIY — we build everything for you', 'Delivery under 4 weeks'],
    startNow: 'Start now',
    pricing: 'Pricing',
    scrollDown: 'Scroll down',
    reviews: '4.9',
  },
  rating: 'Delivered over 1000+ projects',
  form: {
    heading: "Let's start",
    coreValues: 'Our core values',
    values: [
      { title: 'Design', body: 'No generic look, no cheap AI, no dull templates.' },
      { title: 'Structure', body: "One clear message: what you do, why you're trustworthy, what it costs, and how to become your customer." },
      { title: 'Performance', body: 'Optimized to get you more customers, more leads and more sales.' },
    ],
    bookCall: 'Prefer to talk? Book a free 10-min intro call',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    company: 'Describe your company',
    companyPlaceholder: 'What do you do, and who do you do it for?',
    namePlaceholder: 'Your full name',
    emailPlaceholder: 'you@email.com',
    phonePlaceholder: '+1 (213) 555-0123',
    timelineQ: 'When do you need your website?',
    timeline: ['ASAP', '1–3 months', 'Not sure, just exploring'],
    timelineError: 'Please pick a timeline',
    planQ: 'Which plan are you interested in? (optional)',
    cta: "Let's start",
    sending: 'Sending…',
    consentPre: 'By clicking, you agree that Yele may contact you at the phone number you provide — including by automated technology. See our ',
    privacy: 'Privacy Policy',
    errName: 'Your name is required',
    errEmail: 'Email is required',
    errEmailInvalid: 'Invalid email',
    errPhone: 'Phone is required',
    errCompany: 'Please tell us a bit about your company',
    submitError: 'Something went wrong. Please try again or email us at info@yele.design',
  },
  logos: {},
  pricing: {
    title: 'Pricing',
    payNote: 'Pay 50% at the beginning and the remaining 50% at launch.',
    perMonthCare: '',
    tiers: [
      {
        name: 'Launch',
        amount: '699',
        planValue: 'Launch — $699',
        blurb: 'Everything most small businesses need to get online professionally.',
        headline: null,
        features: [
          { label: 'No page limit — functional website' },
          { label: 'Custom website design', info: 'No AI or cheap templates — a bespoke design tailored to your business.' },
          { label: 'Mobile optimization', info: 'Fast and responsive on phones, where almost half of your customers are.' },
          { label: 'Calendar booking', info: 'Customers book their own appointments online, with automatic confirmations.' },
          { label: 'Custom domain and email', info: 'A professional address like yourbusiness.com and an email such as info@yourbusiness.com.' },
          { label: 'SEO and Google indexing', info: 'Helps customers find your business on Google and Google Maps.' },
          { label: 'Professional image and video content', info: 'Our studio creates and edits professional, high-budget media content for your website.' },
        ],
        care: '$49',
        cta: 'Choose Launch',
        popular: false,
      },
      {
        name: 'Business',
        amount: '1,199',
        planValue: 'Business — $1,199',
        blurb: 'For businesses that want more functionality on their website.',
        headline: 'Everything in Launch, plus:',
        features: [
          { label: 'Smart AI chatbot', info: 'A 24/7 assistant that answers visitor questions, captures leads and books calls right on your site.' },
          { label: 'Payment acceptance', info: 'Accept secure credit-card payments directly on your website.' },
          { label: 'Small e-commerce', info: 'Ideal for smaller catalogs — up to around 30 products.' },
          { label: 'Conversion optimization', info: 'Improved layout and clear calls-to-action to turn more visitors into customers.' },
          { label: 'Advanced SEO', info: 'Deeper, more advanced SEO implementation for stronger rankings.' },
          { label: 'Detailed analytics' },
        ],
        care: '$49',
        cta: 'Choose Business',
        popular: true,
      },
      {
        name: 'Pro',
        amount: '2,799',
        from: true,
        planValue: 'Pro — $2,799',
        blurb: 'For businesses that need advanced functionality.',
        headline: 'Everything in Business, plus:',
        features: [
          { label: 'High-performance e-commerce', info: 'A fast, high-volume online store built around layout and conversion optimization.' },
          { label: 'Custom functionality and dashboard', info: 'A custom SaaS-style dashboard to track the specific parameters that matter to your business.' },
          { label: 'Advanced integrations', info: 'Connect third-party tools and services to your website.' },
          { label: 'Multiple locations' },
          { label: 'Custom workflows', info: 'Automated, business-specific processes built around how you actually operate.' },
          { label: 'Complex payment flows', info: 'Subscriptions, deposits, and multi-step or conditional checkout.' },
        ],
        care: '$99',
        cta: 'Talk to Us',
        popular: false,
      },
    ],
  },
  care: {
    title1: 'Looked after with ',
    title2: 'Yele Care',
    subtitle: 'Permanent attention that keeps everything working — from $29/month.',
    contentTitle: 'Content updates',
    contentBody: 'We help you add new content — new projects, new photos, new menu items, whatever your business needs.',
    redesignTitle: 'Yearly website redesign',
    redesignBodyPre: 'A full design refresh every year, so your website is ',
    redesignNever: 'never',
    redesignBodyPost: ' outdated.',
    maintTitle: 'Maintenance & management',
    maintBody: 'All the technical work handled so your site stays online, secure and running correctly.',
    includes: ['Hosting', 'SSL & security', 'Backups', 'Uptime monitoring'],
  },
  how: {
    kicker: 'How it works',
    title: 'From idea to live website in four simple steps.',
    steps: [
      { title: 'Start now', body: 'Secure your spot by paying 50% — this locks in your project and reserves your place in our schedule.' },
      { title: 'Tell us about your business', body: 'A quick call or email so we understand your exact needs for the website before we design anything.' },
      { title: 'Review', body: 'We show you the finished website and make the agreed revisions before launch.' },
      { title: 'Go live', body: 'Approve, pay the remaining 50%, and we launch your website — Yele Care keeps everything running afterwards.' },
    ],
  },
  why: {
    title: 'Why businesses choose Yele',
    subtitle: 'Professional without the traditional agency price.',
    items: [
      { title: 'Design refresh', body: 'A full redesign every year, so your website never looks dated.' },
      { title: 'Affordable & transparent', body: 'Professional websites from $699, with clear pricing and no confusing agency quotes.' },
      { title: 'Custom', body: 'Designed around your business, not a generic template with your logo dropped on.' },
      { title: 'Fast delivery', body: 'Delivery goal set for under 4 weeks.' },
      { title: 'Support 24/7', body: 'We stay with you after launch — support whenever you need it.' },
      { title: 'Built for growth', body: 'Add SEO, advertising, content, AI, and automation as your business grows.' },
    ],
    neverTitlePre: 'Your website will ',
    neverWord: 'never',
    neverTitlePost: ' be outdated.',
    neverBody: "Every year, Yele Care includes a full redesign — we refresh the look, update the content, and keep your website modern as design trends move on. No rebuilds, no extra quotes. Your site stays current for as long as you're with us.",
  },
  buildForm: {
    title: 'Ready for a better website?',
    subtitle: "Tell us a little about your business and we'll recommend the right website package.",
  },
  finalCta: {
    title: 'Your business deserves a website that looks professional.',
    line1: 'Get a custom website without paying traditional agency prices.',
    line2: "Websites from $699. Yele Care from $49/month. 50% to start. 50% when you're ready to launch.",
    startNow: 'Start now',
  },
  received: {
    welcome: 'Welcome!',
    welcomeName: n => `Welcome ${n}!`,
    callLead: "Let's book a 10-min call to get started with your website.",
    dontWait: "Don't want to wait?",
    dontWaitBody: "Start right now. Make the first 50% payment and secure your spot. This locks in your project and reserves your place in our schedule — we'll start working on it right away.",
    pay50: 'Pay 50% today',
    nextSteps: 'Next steps',
    steps: [
      { title: 'Tell us about your business', body: 'A short survey so we understand your exact needs for the website before we design anything.' },
      { title: 'First proposal under 72h', body: "We'll build a functional demo of your website as a starting point, then review all the changes needed together." },
      { title: 'Go live', body: 'Approve, pay the remaining 50%, and we launch your website — Yele Care keeps everything running smoothly afterwards.' },
    ],
    backHome: '← Back to home',
  },
  footer: {
    rights: 'All rights reserved.',
    terms: 'Terms',
    privacy: 'Privacy Policy',
    legal: 'Legal Notice',
  },
  switcher: { label: 'Language' },
}

// ---- Spanish ----
const es: FunnelDict = {
  heroTitle: 'Empecemos\ncon tu web',
  featuredTitle: 'Últimos proyectos',
  hero: {
    points: ['Desde 699€', 'Sin plantillas genéricas feas', 'Lo construimos todo por ti', 'Entrega en menos de 4 semanas'],
    startNow: 'Empezar ahora',
    pricing: 'Precios',
    scrollDown: 'Desplázate',
    reviews: '4.9',
  },
  rating: 'Más de 1000+ proyectos entregados',
  form: {
    heading: 'Empezar ahora',
    coreValues: 'Nuestros valores',
    values: [
      { title: 'Diseño', body: 'Nada genérico, sin IA barata, sin plantillas aburridas.' },
      { title: 'Estructura', body: 'Un mensaje claro: qué haces, por qué eres de fiar, cuánto cuesta y cómo convertirse en tu cliente.' },
      { title: 'Rendimiento', body: 'Optimizada para conseguirte más clientes, más contactos y más ventas.' },
    ],
    bookCall: '¿Prefieres hablar? Reserva una llamada gratis de 10 min',
    whatsapp: 'O danos un toque por WhatsApp',
    name: 'Nombre',
    email: 'Correo electrónico',
    phone: 'Teléfono',
    company: 'Describe tu empresa',
    companyPlaceholder: '¿Qué haces y para quién lo haces?',
    namePlaceholder: 'Tu nombre completo',
    emailPlaceholder: 'tu@correo.com',
    phonePlaceholder: '+34 600 000 000',
    timelineQ: '¿Cuándo necesitas tu web?',
    timeline: ['Lo antes posible', '1–3 meses', 'No estoy seguro, solo mirando'],
    timelineError: 'Elige un plazo, por favor',
    planQ: '¿Qué plan te interesa? (opcional)',
    cta: 'Empezar',
    sending: 'Enviando…',
    consentPre: 'Al hacer clic, aceptas que Yele pueda contactarte en el número que facilitas — incluso mediante tecnología automatizada. Consulta nuestra ',
    privacy: 'Política de Privacidad',
    errName: 'Tu nombre es obligatorio',
    errEmail: 'El correo es obligatorio',
    errEmailInvalid: 'Correo no válido',
    errPhone: 'El teléfono es obligatorio',
    errCompany: 'Cuéntanos un poco sobre tu empresa',
    submitError: 'Algo salió mal. Inténtalo de nuevo o escríbenos a info@yele.design',
  },
  logos: {},
  pricing: {
    title: 'Precios',
    payNote: 'Paga el 50% al principio y el 50% restante en el lanzamiento.',
    perMonthCare: '',
    tiers: [
      {
        name: 'Launch',
        amount: '699',
        planValue: 'Launch — 699€',
        blurb: 'Todo lo que la mayoría de pequeños negocios necesita para estar online de forma profesional.',
        headline: null,
        features: [
          { label: 'Sin límite de páginas — web funcional' },
          { label: 'Diseño web a medida', info: 'Sin IA ni plantillas baratas — un diseño hecho a medida para tu negocio.' },
          { label: 'Optimización móvil', info: 'Rápida y adaptable en el móvil, donde está casi la mitad de tus clientes.' },
          { label: 'Reserva por calendario', info: 'Tus clientes reservan cita online, con confirmaciones automáticas.' },
          { label: 'Dominio y correo propios', info: 'Una dirección profesional como tunegocio.com y un correo como info@tunegocio.com.' },
          { label: 'SEO e indexación en Google', info: 'Ayuda a que tus clientes encuentren tu negocio en Google y Google Maps.' },
          { label: 'Contenido de imagen y vídeo profesional', info: 'Nuestro estudio crea y edita contenido audiovisual profesional para tu web.' },
        ],
        care: '49€',
        cta: 'Elegir Launch',
        popular: false,
      },
      {
        name: 'Business',
        amount: '1.199',
        planValue: 'Business — 1.199€',
        blurb: 'Para negocios que quieren más funcionalidad en su web.',
        headline: 'Todo lo de Launch, y además:',
        features: [
          { label: 'Chatbot con IA', info: 'Un asistente 24/7 que responde preguntas, capta clientes y agenda llamadas en tu web.' },
          { label: 'Aceptación de pagos', info: 'Acepta pagos seguros con tarjeta directamente en tu web.' },
          { label: 'E-commerce pequeño', info: 'Ideal para catálogos pequeños — hasta unos 30 productos.' },
          { label: 'Optimización de conversión', info: 'Mejor estructura y llamadas a la acción claras para convertir más visitas en clientes.' },
          { label: 'SEO avanzado', info: 'Una implementación de SEO más profunda para mejor posicionamiento.' },
          { label: 'Analítica detallada' },
        ],
        care: '49€',
        cta: 'Elegir Business',
        popular: true,
      },
      {
        name: 'Pro',
        amount: '2.799',
        from: true,
        planValue: 'Pro — 2.799€',
        blurb: 'Para negocios que necesitan funcionalidad avanzada.',
        headline: 'Todo lo de Business, y además:',
        features: [
          { label: 'E-commerce de alto rendimiento', info: 'Una tienda online rápida y de gran volumen, optimizada para conversión.' },
          { label: 'Funcionalidad y panel a medida', info: 'Un panel tipo SaaS a medida para controlar los parámetros que importan a tu negocio.' },
          { label: 'Integraciones avanzadas', info: 'Conecta herramientas y servicios de terceros con tu web.' },
          { label: 'Múltiples ubicaciones' },
          { label: 'Flujos de trabajo a medida', info: 'Procesos automatizados y específicos según cómo trabajas realmente.' },
          { label: 'Flujos de pago complejos', info: 'Suscripciones, depósitos y pagos en varios pasos o condicionales.' },
        ],
        care: '99€',
        cta: 'Habla con nosotros',
        popular: false,
      },
    ],
  },
  care: {
    title1: 'Mantenimiento con ',
    title2: 'Yele Care',
    subtitle: 'Atención permanente que mantiene todo funcionando — desde 29€/mes.',
    contentTitle: 'Actualización de contenido',
    contentBody: 'Te ayudamos a añadir contenido nuevo — proyectos, fotos, platos de menú, lo que tu negocio necesite.',
    redesignTitle: 'Rediseño anual de la web',
    redesignBodyPre: 'Un rediseño completo cada año, para que tu web ',
    redesignNever: 'nunca',
    redesignBodyPost: ' quede desactualizada.',
    maintTitle: 'Mantenimiento y gestión',
    maintBody: 'Todo el trabajo técnico gestionado para que tu web siga online, segura y funcionando bien.',
    includes: ['Alojamiento', 'SSL y seguridad', 'Copias de seguridad', 'Monitorización'],
  },
  how: {
    kicker: 'Cómo funciona',
    title: 'De la idea a la web publicada en cuatro pasos.',
    steps: [
      { title: 'Empieza ahora', body: 'Asegura tu plaza pagando el 50% — así aseguras tu proyecto y reservas tu lugar en nuestra agenda.' },
      { title: 'Cuéntanos sobre tu negocio', body: 'Una llamada o correo rápido para entender exactamente qué necesitas antes de diseñar nada.' },
      { title: 'Revisión', body: 'Te enseñamos la web terminada y hacemos las revisiones acordadas antes del lanzamiento.' },
      { title: 'Publicación', body: 'Apruebas, pagas el 50% restante y lanzamos tu web — Yele Care mantiene todo funcionando después.' },
    ],
  },
  why: {
    title: 'Por qué los negocios eligen Yele',
    subtitle: 'Profesional sin el precio de las agencias tradicionales.',
    items: [
      { title: 'Rediseño anual', body: 'Un rediseño completo cada año, para que tu web nunca parezca anticuada.' },
      { title: 'Asequible y transparente', body: 'Webs profesionales desde 699€, con precios claros y sin presupuestos de agencia confusos.' },
      { title: 'A medida', body: 'Diseñada en torno a tu negocio, no una plantilla genérica con tu logo encima.' },
      { title: 'Entrega rápida', body: 'Objetivo de entrega en menos de 4 semanas.' },
      { title: 'Soporte 24/7', body: 'Seguimos contigo tras el lanzamiento — soporte cuando lo necesites.' },
      { title: 'Pensada para crecer', body: 'Añade SEO, publicidad, contenido, IA y automatización a medida que creces.' },
    ],
    neverTitlePre: 'Tu web ',
    neverWord: 'nunca',
    neverTitlePost: ' quedará desactualizada.',
    neverBody: 'Cada año, Yele Care incluye un rediseño completo — renovamos el aspecto, actualizamos el contenido y mantenemos tu web moderna según evolucionan las tendencias. Sin reconstrucciones ni presupuestos extra. Tu web se mantiene actual mientras estés con nosotros.',
  },
  buildForm: {
    title: '¿Listo para una web mejor?',
    subtitle: 'Cuéntanos un poco sobre tu negocio y te recomendaremos el plan adecuado.',
  },
  finalCta: {
    title: 'Tu negocio merece una web con aspecto profesional.',
    line1: 'Consigue una web a medida sin pagar precios de agencia tradicional.',
    line2: 'Webs desde 699€. Yele Care desde 49€/mes. 50% para empezar. 50% cuando estés listo para lanzar.',
    startNow: 'Empezar ahora',
  },
  received: {
    welcome: '¡Bienvenido!',
    welcomeName: n => `¡Bienvenido ${n}!`,
    callLead: 'Reservemos una llamada de 10 min para empezar con tu web.',
    dontWait: '¿No quieres esperar?',
    dontWaitBody: 'Empieza ahora mismo. Haz el primer pago del 50% y asegura tu plaza. Así bloqueas tu proyecto y reservas tu lugar en nuestra agenda — empezamos a trabajar de inmediato.',
    pay50: 'Paga el 50% hoy',
    nextSteps: 'Siguientes pasos',
    steps: [
      { title: 'Cuéntanos sobre tu negocio', body: 'Una breve encuesta para entender exactamente qué necesitas antes de diseñar nada.' },
      { title: 'Primera propuesta en menos de 72h', body: 'Construiremos una demo funcional de tu web como punto de partida y luego revisamos juntos todos los cambios.' },
      { title: 'Publicación', body: 'Apruebas, pagas el 50% restante y lanzamos tu web — Yele Care mantiene todo funcionando después.' },
    ],
    backHome: '← Volver al inicio',
  },
  footer: {
    rights: 'Todos los derechos reservados.',
    terms: 'Términos',
    privacy: 'Política de Privacidad',
    legal: 'Aviso Legal',
  },
  switcher: { label: 'Idioma' },
}

// ---- Chinese (Simplified). Brand/plan names kept in Latin script. ----
const zh: FunnelDict = {
  heroTitle: '一起打造你的网站',
  featuredTitle: '精选案例',
  hero: {
    points: ['€699 起', '拒绝没有品味的模板', '无需自己动手 — 一切由我们打造', '4 周内交付'],
    startNow: '立即开始',
    pricing: '价格',
    scrollDown: '向下滚动',
    reviews: '4.9',
  },
  rating: '已交付 1000+ 个项目',
  form: {
    heading: '现在开始',
    coreValues: '我们的核心价值',
    values: [
      { title: '设计', body: '不套用通用模板，不用廉价 AI，不做乏味设计。' },
      { title: '结构', body: '清晰传达一个信息：你做什么、为何值得信赖、价格是多少、以及如何成为你的客户。' },
      { title: '性能', body: '经过优化，为你带来更多客户、更多潜在客户和更多销售。' },
    ],
    bookCall: '更想聊聊？预约一个免费的 10 分钟通话',
    name: '姓名',
    email: '电子邮箱',
    phone: '电话',
    company: '介绍你的公司',
    companyPlaceholder: '你做什么，为谁服务？',
    namePlaceholder: '你的全名',
    emailPlaceholder: 'you@email.com',
    phonePlaceholder: '+1 (213) 555-0123',
    timelineQ: '你希望什么时候上线网站？',
    timeline: ['尽快', '1–3 个月', '还不确定，只是了解一下'],
    timelineError: '请选择一个时间',
    planQ: '你对哪个方案感兴趣？（可选）',
    cta: '开始',
    sending: '发送中…',
    consentPre: '点击即表示你同意 Yele 通过你提供的电话号码与你联系 — 包括通过自动化技术。详见我们的',
    privacy: '隐私政策',
    errName: '请填写姓名',
    errEmail: '请填写电子邮箱',
    errEmailInvalid: '邮箱格式无效',
    errPhone: '请填写电话',
    errCompany: '请简单介绍一下你的公司',
    submitError: '出错了。请重试，或发邮件至 info@yele.design',
  },
  logos: {},
  pricing: {
    title: '价格',
    payNote: '开始时支付 50%，上线时支付剩余 50%。',
    perMonthCare: '',
    tiers: [
      {
        name: 'Launch',
        amount: '699',
        planValue: 'Launch — €699',
        blurb: '大多数小企业专业上线所需的一切。',
        headline: null,
        features: [
          { label: '不限页数 — 功能完善的网站' },
          { label: '定制网站设计', info: '不用 AI 或廉价模板 — 为你的业务量身打造的设计。' },
          { label: '移动端优化', info: '在手机上快速且自适应，近一半的客户都在手机端。' },
          { label: '日历预约', info: '客户可在线自助预约，并自动确认。' },
          { label: '专属域名和邮箱', info: '像 yourbusiness.com 这样的专业网址，以及 info@yourbusiness.com 这样的邮箱。' },
          { label: 'SEO 与 Google 收录', info: '帮助客户在 Google 和 Google 地图上找到你的业务。' },
          { label: '专业图片与视频内容', info: '我们的工作室为你的网站制作和剪辑专业的高水准媒体内容。' },
        ],
        care: '€49',
        cta: '选择 Launch',
        popular: false,
      },
      {
        name: 'Business',
        amount: '1,199',
        planValue: 'Business — €1,199',
        blurb: '适合希望网站拥有更多功能的企业。',
        headline: '包含 Launch 的全部，另加：',
        features: [
          { label: '智能 AI 聊天机器人', info: '全天候助手，直接在你的网站上回答访客问题、获取潜在客户并预约通话。' },
          { label: '支持在线支付', info: '直接在你的网站上安全地接受信用卡付款。' },
          { label: '小型电商', info: '适合较小的目录 — 约 30 个产品以内。' },
          { label: '转化优化', info: '更优的布局和清晰的行动号召，把更多访客变成客户。' },
          { label: '进阶 SEO', info: '更深入、更进阶的 SEO 实施，获得更好的排名。' },
          { label: '详细分析' },
        ],
        care: '€49',
        cta: '选择 Business',
        popular: true,
      },
      {
        name: 'Pro',
        amount: '2,799',
        from: true,
        planValue: 'Pro — €2,799',
        blurb: '适合需要进阶功能的企业。',
        headline: '包含 Business 的全部，另加：',
        features: [
          { label: '高性能电商', info: '围绕布局和转化优化打造的快速、大流量在线商店。' },
          { label: '定制功能与仪表盘', info: '定制的 SaaS 式仪表盘，追踪对你业务重要的关键指标。' },
          { label: '进阶集成', info: '将第三方工具和服务连接到你的网站。' },
          { label: '多地点' },
          { label: '定制工作流', info: '根据你的实际运营方式打造的自动化专属流程。' },
          { label: '复杂支付流程', info: '订阅、定金，以及多步骤或条件式结账。' },
        ],
        care: '€99',
        cta: '联系我们',
        popular: false,
      },
    ],
  },
  care: {
    title1: '由 ',
    title2: 'Yele Care',
    subtitle: '持续维护，让一切正常运行 — €29/月起。',
    contentTitle: '内容更新',
    contentBody: '我们帮你添加新内容 — 新项目、新照片、新菜单项，任何业务所需。',
    redesignTitle: '每年网站重新设计',
    redesignBodyPre: '每年一次完整的设计焕新，让你的网站',
    redesignNever: '永不',
    redesignBodyPost: '过时。',
    maintTitle: '维护与管理',
    maintBody: '所有技术工作都由我们处理，让你的网站保持在线、安全、正常运行。',
    includes: ['托管', 'SSL 与安全', '备份', '运行监控'],
  },
  how: {
    kicker: '流程',
    title: '四个简单步骤，从想法到网站上线。',
    steps: [
      { title: '立即开始', body: '支付 50% 锁定名额 — 这将确定你的项目并在我们的排期中为你保留位置。' },
      { title: '介绍你的业务', body: '一通简短的电话或邮件，让我们在设计之前准确理解你对网站的需求。' },
      { title: '审阅', body: '我们向你展示完成的网站，并在上线前完成约定的修改。' },
      { title: '上线', body: '确认、支付剩余 50%，我们即为你上线网站 — 之后由 Yele Care 保持一切运行。' },
    ],
  },
  why: {
    title: '为什么企业选择 Yele',
    subtitle: '专业水准，却没有传统代理机构的价格。',
    items: [
      { title: '设计焕新', body: '每年一次完整重设计，让你的网站永不显得过时。' },
      { title: '实惠且透明', body: '专业网站 €699 起，价格清晰，没有令人困惑的代理报价。' },
      { title: '量身定制', body: '围绕你的业务设计，而不是套个 Logo 的通用模板。' },
      { title: '快速交付', body: '交付目标设定为 4 周以内。' },
      { title: '全天候支持', body: '上线后我们仍与你同行 — 随时提供支持。' },
      { title: '为增长而建', body: '随着业务成长，随时添加 SEO、广告、内容、AI 和自动化。' },
    ],
    neverTitlePre: '你的网站将',
    neverWord: '永不',
    neverTitlePost: '过时。',
    neverBody: '每一年，Yele Care 都包含一次完整重设计 — 我们焕新外观、更新内容，并随着设计趋势的演变保持网站现代。无需重建，也没有额外报价。只要你与我们同行，网站始终保持最新。',
  },
  buildForm: {
    title: '准备好拥有更好的网站了吗？',
    subtitle: '简单介绍一下你的业务，我们会为你推荐合适的方案。',
  },
  finalCta: {
    title: '你的业务值得一个看起来专业的网站。',
    line1: '拥有定制网站，无需支付传统代理机构的价格。',
    line2: '网站 €699 起。Yele Care €49/月起。50% 起步，准备上线时再付 50%。',
    startNow: '立即开始',
  },
  received: {
    welcome: '欢迎！',
    welcomeName: n => `欢迎 ${n}！`,
    callLead: '预约一个 10 分钟通话，开始打造你的网站。',
    dontWait: '不想等待？',
    dontWaitBody: '立即开始。支付第一笔 50% 并锁定名额。这将确定你的项目并在排期中为你保留位置 — 我们会立刻着手。',
    pay50: '今天支付 50%',
    nextSteps: '接下来的步骤',
    steps: [
      { title: '介绍你的业务', body: '一份简短的问卷，让我们在设计之前准确理解你对网站的需求。' },
      { title: '72 小时内首个方案', body: '我们会先做出一个可用的网站演示作为起点，然后与你一起审阅所有需要的修改。' },
      { title: '上线', body: '确认、支付剩余 50%，我们即为你上线网站 — 之后由 Yele Care 保持一切顺畅运行。' },
    ],
    backHome: '← 返回首页',
  },
  footer: {
    rights: '版权所有。',
    terms: '条款',
    privacy: '隐私政策',
    legal: '法律声明',
  },
  switcher: { label: '语言' },
}

const DICTS: Record<Locale, FunnelDict> = { en, es, zh }

export function getFunnelDict(locale: Locale): FunnelDict {
  return DICTS[locale] ?? en
}
