import type { Locale } from '@/lib/i18n/funnel'

// Content dictionary for the /tutienda ecommerce Meta-ads landing (ES/EN/ZH).
// Prices/figures are kept identical across locales (euro-denominated, since the
// Shopify comparison is EU-based); only the surrounding copy is translated.

export type CompareRow = { volume: string; yele: string; shopify: string; saving: string }
export type FeatureRow = { feature: string; yele: string; shopify: string; shopifyNone?: boolean }
export type BuildTier = {
  name: string
  amount: string
  planValue: string
  headline: string | null
  cta: string
  popular: boolean
  features: string[]
}
export type CareTier = { name: string; price: string; popular: boolean; headline: string | null; features: string[] }
export type FaqItem = { q: string; a: string; link?: { label: string; href: string } }

export type TuTiendaDict = {
  meta: { title: string; description: string }
  leadSource: string
  hero: { titleLine1: string; titleLine2: string; highlight: string; points: string[]; ctaPrecios: string; ctaDemo: string; scrollLabel: string }
  compare: { title: string; rows: CompareRow[] }
  feature: { vsRest: string; subtitle: string; colFeature: string; rows: FeatureRow[] }
  pricing: {
    title: string
    group1: string
    pagoUnico: string
    group2: string
    cuotaMensual: string
    careSubtitle: string
    iva: string
    masPopular: string
    perMonth: string
    tiers: BuildTier[]
    careTiers: CareTier[]
  }
  values: { titleLine1: string; titleLine2: string; kicker: string; items: { title: string; body: string }[] }
  how: { kicker: string; title: string; steps: { title: string; body: string }[] }
  faq: FaqItem[]
  finalCta: { title: string; line1: string; line2: string }
  whatsappPrefill: string
  // Overrides the "affordable & transparent" why-card body (index 1).
  whyAffordableBody: string
  // Second (detailed) form package options — no 699 Launch tier.
  buildPackages: string[]
}

const SERVICES = { es: 'Ver más en nuestros servicios', en: 'See more in our services', zh: '在我们的服务中了解更多' }
const SERVICES_HREF = 'https://yele.design/services'

const es: TuTiendaDict = {
  meta: {
    title: 'Crea tu tienda online a medida desde 1.199€ | Yele',
    description:
      'Una tienda online diseñada a medida, optimizada para vender y con comisiones mucho más bajas que Shopify. Fotos y vídeos de tus productos incluidos. Desde 1.199€ + Yele Care desde 29€/mes.',
  },
  leadSource: 'Tu Tienda (ES)',
  hero: {
    titleLine1: 'Una tienda de la que presumir.',
    titleLine2: 'A un precio que no asusta.',
    highlight: 'presumir',
    points: [
      'Sin plantillas genéricas feas',
      '40% menos en comisiones',
      'Mejoramos tus fotos y vídeos de los productos',
      'Entrega en menos de 4 semanas',
      'Desde 1.199€',
    ],
    ctaPrecios: 'Precios',
    ctaDemo: 'Pide demo gratis',
    scrollLabel: 'Desplázate',
  },
  compare: {
    title: 'Comparativa de costes',
    rows: [
      { volume: '5.000 € EN VENTAS/MES', yele: '99 €', shopify: '167 €', saving: '40,7 % menos' },
      { volume: '20.000 € EN VENTAS/MES', yele: '309 €', shopify: '572 €', saving: '46,0 % menos' },
      { volume: '50.000 € EN VENTAS/MES', yele: '347 €', shopify: '1.292 €', saving: '73,1 % menos' },
    ],
  },
  feature: {
    vsRest: ' vs Shopify',
    subtitle: 'Una tienda hecha a medida, con comisiones mucho más bajas.',
    colFeature: 'Característica',
    rows: [
      { feature: 'Cuota mensual', yele: 'Basic: 29 € · Plus: 49 € · Pro: 99 €', shopify: 'Basic: 32 € · Grow: 92 € · Advanced: 384 €' },
      { feature: 'Comisión base', yele: '1 % + 0,20 €', shopify: '2,1 % + 0,30 €' },
      { feature: 'Comisión para mayor volumen', yele: '0,5 % + 0,02 €', shopify: 'Grow: 1,8 % + 0,30 € · Advanced: 1,6 % + 0,30 €' },
      { feature: 'Creación de contenido (imágenes y vídeos)', yele: '0 / 5 / 20 productos al mes', shopify: 'No ofrecido', shopifyNone: true },
      { feature: 'Cuentas de empleados', yele: 'Ilimitadas', shopify: 'Según el plan' },
      { feature: 'Personalización', yele: 'UI/UX completa', shopify: 'Según el plan y las extensiones' },
    ],
  },
  pricing: {
    title: 'Precios',
    group1: 'Puesta en marcha',
    pagoUnico: 'Pago único',
    group2: 'Yele Care',
    cuotaMensual: 'Cuota mensual',
    careSubtitle: 'Mantenimiento, contenido, soporte y rediseños.',
    iva: '+ IVA',
    masPopular: 'Más popular',
    perMonth: '/mes',
    tiers: [
      {
        name: 'Business',
        amount: '1.199',
        planValue: 'Business — 1.199€',
        headline: null,
        cta: 'Elegir Business',
        popular: true,
        features: ['Diseño personalizado, no plantilla', 'Optimizado para vender', 'Fotos y vídeos customizados para 20 productos', 'Chat IA inteligente', 'Pago seguro'],
      },
      {
        name: 'Pro',
        amount: '2.799',
        planValue: 'Pro — 2.799€',
        headline: 'Todo lo de Business, y además:',
        cta: 'Elegir Pro',
        popular: false,
        features: ['Fotos y vídeos customizados para 50 productos', 'Catálogo de 100+ productos', 'Base de datos de alto rendimiento', 'Integraciones avanzadas', 'Extensiones'],
      },
    ],
    careTiers: [
      { name: 'Basic', price: '29€', popular: false, headline: null, features: ['Alojamiento', 'SSL y seguridad', 'Copias de seguridad'] },
      { name: 'Plus', price: '49€', popular: true, headline: 'Todo lo de Basic, y además:', features: ['Creación de fotos y vídeos customizados de 5 productos nuevos al mes', 'Soporte para modificar/añadir productos', 'Rediseño anual'] },
      { name: 'Pro', price: '99€', popular: false, headline: 'Todo lo de Plus, y además:', features: ['Creación de fotos y vídeos customizados de 20 productos nuevos al mes', 'Rediseño por temporada', 'Soporte prioritario'] },
    ],
  },
  values: {
    titleLine1: 'Demo sin compromiso:',
    titleLine2: 'Descubre cómo podemos mejorar tu tienda',
    kicker: 'Nuestros valores',
    items: [
      { title: 'Diseño', body: 'Nada genérico, sin IA barata, sin plantillas aburridas.' },
      { title: 'Estructura', body: 'Optimizado con un solo propósito: VENDER.' },
      { title: 'Rendimiento', body: 'Optimizada para conseguirte más clientes y más ventas.' },
    ],
  },
  how: {
    kicker: 'Cómo funciona',
    title: 'De la idea a tu tienda online en tres pasos.',
    steps: [
      { title: 'Cuéntanos sobre tu negocio', body: 'Montamos una demo de cómo podemos mejorar tu tienda. Si te encaja, seguimos con el proyecto con el primer pago del 50%.' },
      { title: 'Revisión', body: 'Escuchamos vuestro feedback y aplicamos las mejoras necesarias.' },
      { title: 'Publicación', body: 'Apruebas, pagas el 50% restante y tu tienda está online. Nuestro Yele Care mantiene todo funcionando después, mes tras mes.' },
    ],
  },
  faq: [
    { q: '¿Cuánto cuesta una tienda online?', a: 'Las tiendas de Yele empiezan en 1.199€. La mayoría elige el plan Business (1.199€); las tiendas más avanzadas, el plan Pro (2.799€). Es un pago único por el desarrollo — sin mensualidades de licencia.' },
    { q: '¿Hay una cuota mensual?', a: 'Sí — Yele Care para tu tienda, desde 29€/mes, en tres niveles: Basic (29€/mes) — alojamiento, seguridad y copias; Plus (49€/mes) — fotos y vídeos de 5 productos nuevos al mes, soporte para modificar/añadir productos y un rediseño anual; y Pro (99€/mes) — fotos y vídeos de 20 productos nuevos al mes, rediseño por temporada y soporte prioritario.' },
    { q: '¿Yele Care es obligatorio?', a: 'No — pero lo recomendamos mucho para una tienda. Mantiene todo funcionando (alojamiento, seguridad, copias y monitorización), renueva el contenido de tus productos cada mes e incluye rediseños para que tu tienda nunca quede anticuada. Puedes gestionarla tú mismo, pero con Yele Care no te preocupas por la parte técnica.' },
    { q: '¿Puedo añadir productos y actualizar mi tienda más adelante?', a: 'Sí — cuando quieras. Puedes gestionar tu catálogo tú mismo de forma sencilla, y con Plus o Pro añadimos y optimizamos productos por ti cada mes.' },
    { q: '¿Tengo que pagar todo por adelantado?', a: 'No. Pagas el 50% al empezar. El 50% restante se paga cuando la tienda está terminada y aprobada para su lanzamiento.' },
    { q: '¿La propiedad del diseño y el contenido es mía?', a: 'Sí. Eres propietario del diseño y de todo el contenido — fotos, vídeos y textos — que creamos para tu tienda.' },
    { q: '¿Puedo recuperar o exportar mis datos cuando quiera?', a: 'Sí — cuando quieras. Puedes recuperar y exportar tus productos, pedidos y datos de clientes en cualquier momento. Tus datos son tuyos.' },
    { q: '¿El alojamiento está incluido?', a: 'Sí. El alojamiento está incluido con Yele Care.' },
    { q: '¿Mi dominio está incluido?', a: 'Podemos proporcionar y gestionar un dominio estándar para tu tienda cuando sea necesario, y también puedes traer tu dominio actual. Los dominios premium o inusualmente caros pueden tener un coste adicional.' },
    { q: '¿El SEO está incluido?', a: 'Todas las tiendas incluyen una base de SEO: configuración técnica, títulos de página, descripciones, sitemap, indexación, optimización móvil y analítica.' },
    { q: '¿Podéis crear las fotos y vídeos de mis productos?', a: 'Sí. Creamos y mejoramos las fotos y vídeos de tus productos como parte del proyecto, y cada mes con Yele Care — 5 o 20 productos nuevos al mes según tu plan.', link: { label: SERVICES.es, href: SERVICES_HREF } },
    { q: '¿Podéis gestionar mi publicidad?', a: 'Sí. Yele puede configurar y gestionar campañas de Google Ads y Meta. La gestión de publicidad y la inversión en anuncios son independientes de tu plan de tienda.', link: { label: SERVICES.es, href: SERVICES_HREF } },
    { q: '¿Podéis añadir IA a mi tienda?', a: 'Sí. Podemos añadir chat con IA, recomendador de productos, automatización de clientes y seguimiento posventa, entre otras herramientas.', link: { label: SERVICES.es, href: SERVICES_HREF } },
  ],
  finalCta: {
    title: 'Tu tienda merece un escaparate a su altura.',
    line1: 'Una tienda online a medida, optimizada para vender — con comisiones mucho más bajas que Shopify.',
    line2: 'Tiendas desde 1.199€. Yele Care desde 29€/mes. 50% para empezar, 50% al lanzar.',
  },
  whatsappPrefill: '¡Hola! Me interesa una tienda online con Yele.',
  whyAffordableBody: 'Ecommerce profesionales desde 1199€, con precios claros y sin presupuestos de agencia confusos.',
  buildPackages: ['Business — 1.199€', 'Pro — 2.799€', 'No estoy seguro — recomendádmelo'],
}

const en: TuTiendaDict = {
  meta: {
    title: 'Get a custom online store from €1,199 | Yele',
    description:
      'A custom-built online store, optimized to sell, with fees much lower than Shopify. Product photos and videos included. From €1,199 + Yele Care from €29/month.',
  },
  leadSource: 'Tu Tienda (EN)',
  hero: {
    titleLine1: 'A store worth showing off.',
    titleLine2: "At a price that won't scare you.",
    highlight: 'showing off',
    points: [
      'No ugly generic templates',
      '40% lower fees',
      'We improve your product photos and videos',
      'Delivery in under 4 weeks',
      'From €1,199',
    ],
    ctaPrecios: 'Pricing',
    ctaDemo: 'Get a free demo',
    scrollLabel: 'Scroll down',
  },
  compare: {
    title: 'Cost comparison',
    rows: [
      { volume: '€5,000 IN SALES/MONTH', yele: '99 €', shopify: '167 €', saving: '40.7% less' },
      { volume: '€20,000 IN SALES/MONTH', yele: '309 €', shopify: '572 €', saving: '46.0% less' },
      { volume: '€50,000 IN SALES/MONTH', yele: '347 €', shopify: '1,292 €', saving: '73.1% less' },
    ],
  },
  feature: {
    vsRest: ' vs Shopify',
    subtitle: 'A fully custom store, with much lower fees.',
    colFeature: 'Feature',
    rows: [
      { feature: 'Monthly fee', yele: 'Basic: 29 € · Plus: 49 € · Pro: 99 €', shopify: 'Basic: 32 € · Grow: 92 € · Advanced: 384 €' },
      { feature: 'Base transaction fee', yele: '1% + 0.20 €', shopify: '2.1% + 0.30 €' },
      { feature: 'Higher-volume fee', yele: '0.5% + 0.02 €', shopify: 'Grow: 1.8% + 0.30 € · Advanced: 1.6% + 0.30 €' },
      { feature: 'Content creation (photos & videos)', yele: '0 / 5 / 20 products per month', shopify: 'Not offered', shopifyNone: true },
      { feature: 'Staff accounts', yele: 'Unlimited', shopify: 'Depends on plan' },
      { feature: 'Customization', yele: 'Full UI/UX', shopify: 'Depends on plan and apps' },
    ],
  },
  pricing: {
    title: 'Pricing',
    group1: 'Setup',
    pagoUnico: 'One-time',
    group2: 'Yele Care',
    cuotaMensual: 'Monthly',
    careSubtitle: 'Maintenance, content, support and redesigns.',
    iva: '+ VAT',
    masPopular: 'Most popular',
    perMonth: '/mo',
    tiers: [
      {
        name: 'Business',
        amount: '1.199',
        planValue: 'Business — €1,199',
        headline: null,
        cta: 'Choose Business',
        popular: true,
        features: ['Custom design, no template', 'Built to sell', 'Custom photos & videos for 20 products', 'Smart AI chat', 'Secure payments'],
      },
      {
        name: 'Pro',
        amount: '2.799',
        planValue: 'Pro — €2,799',
        headline: 'Everything in Business, plus:',
        cta: 'Choose Pro',
        popular: false,
        features: ['Custom photos & videos for 50 products', 'Catalog of 100+ products', 'High-performance database', 'Advanced integrations', 'Extensions'],
      },
    ],
    careTiers: [
      { name: 'Basic', price: '29€', popular: false, headline: null, features: ['Hosting', 'SSL & security', 'Backups'] },
      { name: 'Plus', price: '49€', popular: true, headline: 'Everything in Basic, plus:', features: ['Creation of custom photos & videos for 5 new products per month', 'Support to edit/add products', 'Yearly redesign'] },
      { name: 'Pro', price: '99€', popular: false, headline: 'Everything in Plus, plus:', features: ['Creation of custom photos & videos for 20 new products per month', 'Seasonal redesign', 'Priority support'] },
    ],
  },
  values: {
    titleLine1: 'Free, no-commitment demo:',
    titleLine2: 'See how we can improve your store',
    kicker: 'Our values',
    items: [
      { title: 'Design', body: 'Nothing generic — no cheap AI, no boring templates.' },
      { title: 'Structure', body: 'Optimized with one single goal: to SELL.' },
      { title: 'Performance', body: 'Built to win you more customers and more sales.' },
    ],
  },
  how: {
    kicker: 'How it works',
    title: 'From idea to live store in three steps.',
    steps: [
      { title: 'Tell us about your business', body: 'We build a demo of how we can improve your store. If it fits, we continue the project with the first 50% payment.' },
      { title: 'Review', body: 'We listen to your feedback and apply the improvements needed.' },
      { title: 'Launch', body: 'You approve, pay the remaining 50%, and your store goes live. Yele Care keeps everything running afterwards, month after month.' },
    ],
  },
  faq: [
    { q: 'How much does an online store cost?', a: 'Yele stores start at €1,199. Most businesses choose the Business plan (€1,199); more advanced stores go with Pro (€2,799). It’s a one-time payment for the build — no licensing subscriptions.' },
    { q: 'Is there a monthly fee?', a: 'Yes — Yele Care for your store, from €29/month, in three tiers: Basic (€29/mo) — hosting, security and backups; Plus (€49/mo) — photos and videos for 5 new products a month, support to edit/add products and a yearly redesign; and Pro (€99/mo) — photos and videos for 20 new products a month, seasonal redesigns and priority support.' },
    { q: 'Is Yele Care compulsory?', a: 'No — but we highly recommend it for a store. It keeps everything running (hosting, security, backups and monitoring), refreshes your product content every month and includes redesigns so your store never looks dated. You can manage it yourself, but with Yele Care you never have to worry about the technical side.' },
    { q: 'Can I add products and update my store later?', a: 'Yes — anytime. You can manage your catalog yourself easily, and with Plus or Pro we add and optimize products for you every month.' },
    { q: 'Do I need to pay everything upfront?', a: 'No. You pay 50% to start. The remaining 50% is paid when the store is finished and approved for launch.' },
    { q: 'Do I own the design and content?', a: 'Yes. You own the design and all the content — photos, videos and copy — we create for your store.' },
    { q: 'Can I retrieve or export my data anytime?', a: 'Yes — anytime. You can retrieve and export your products, orders and customer data whenever you want. Your data is yours.' },
    { q: 'Is hosting included?', a: 'Yes. Hosting is included with Yele Care.' },
    { q: 'Is my domain included?', a: 'We can provide and manage a standard domain for your store when needed, and you can also bring your current domain. Premium or unusually expensive domains may cost extra.' },
    { q: 'Is SEO included?', a: 'Every store includes an SEO foundation: technical setup, page titles, descriptions, sitemap, indexing, mobile optimization and analytics.' },
    { q: 'Can you create my product photos and videos?', a: 'Yes. We create and improve your product photos and videos as part of the build, and every month with Yele Care — 5 or 20 new products a month depending on your plan.', link: { label: SERVICES.en, href: SERVICES_HREF } },
    { q: 'Can you manage my advertising?', a: 'Yes. Yele can set up and manage Google Ads and Meta campaigns. Advertising management and ad spend are separate from your store package.', link: { label: SERVICES.en, href: SERVICES_HREF } },
    { q: 'Can you add AI to my store?', a: 'Yes. We can add AI chat, a product recommender, customer automation and post-sale follow-up, among other tools.', link: { label: SERVICES.en, href: SERVICES_HREF } },
  ],
  finalCta: {
    title: 'Your store deserves a storefront to match.',
    line1: 'A fully custom online store, built to sell — with far lower fees than Shopify.',
    line2: 'Stores from €1,199. Yele Care from €29/mo. 50% to start, 50% at launch.',
  },
  whatsappPrefill: "Hi! I'm interested in an online store with Yele.",
  whyAffordableBody: 'Professional ecommerce from €1,199 — clear pricing and no confusing agency quotes.',
  buildPackages: ['Business — €1,199', 'Pro — €2,799', 'Not sure — recommend one'],
}

const zh: TuTiendaDict = {
  meta: {
    title: '€1,199 起打造定制网店 | Yele',
    description: '完全定制的在线商店，为成交而优化，佣金远低于 Shopify。含产品图片和视频。€1,199 起 + Yele Care €29/月起。',
  },
  leadSource: 'Tu Tienda (ZH)',
  hero: {
    titleLine1: '一家值得炫耀的网店。',
    titleLine2: '价格却不吓人。',
    highlight: '炫耀',
    points: ['没有丑陋的通用模板', '佣金降低 40%', '我们优化你的产品照片和视频', '4 周内交付', '€1,199 起'],
    ctaPrecios: '价格',
    ctaDemo: '预约免费演示',
    scrollLabel: '向下滚动',
  },
  compare: {
    title: '成本对比',
    rows: [
      { volume: '月销售额 €5,000', yele: '99 €', shopify: '167 €', saving: '少 40.7%' },
      { volume: '月销售额 €20,000', yele: '309 €', shopify: '572 €', saving: '少 46.0%' },
      { volume: '月销售额 €50,000', yele: '347 €', shopify: '1,292 €', saving: '少 73.1%' },
    ],
  },
  feature: {
    vsRest: ' vs Shopify',
    subtitle: '完全定制的网店，佣金低得多。',
    colFeature: '功能',
    rows: [
      { feature: '月费', yele: 'Basic: 29 € · Plus: 49 € · Pro: 99 €', shopify: 'Basic: 32 € · Grow: 92 € · Advanced: 384 €' },
      { feature: '基础交易佣金', yele: '1% + 0.20 €', shopify: '2.1% + 0.30 €' },
      { feature: '大额交易佣金', yele: '0.5% + 0.02 €', shopify: 'Grow: 1.8% + 0.30 € · Advanced: 1.6% + 0.30 €' },
      { feature: '内容创作（图片和视频）', yele: '每月 0 / 5 / 20 个产品', shopify: '不提供', shopifyNone: true },
      { feature: '员工账户', yele: '无限', shopify: '视套餐而定' },
      { feature: '定制化', yele: '完整 UI/UX', shopify: '视套餐和插件而定' },
    ],
  },
  pricing: {
    title: '价格',
    group1: '搭建',
    pagoUnico: '一次性付款',
    group2: 'Yele Care',
    cuotaMensual: '月费',
    careSubtitle: '维护、内容、支持与改版。',
    iva: '+ IVA',
    masPopular: '最受欢迎',
    perMonth: '/月',
    tiers: [
      {
        name: 'Business',
        amount: '1.199',
        planValue: 'Business — €1,199',
        headline: null,
        cta: '选择 Business',
        popular: true,
        features: ['定制设计，非模板', '为转化而优化', '20 个产品的定制图片和视频', '智能 AI 聊天', '安全支付'],
      },
      {
        name: 'Pro',
        amount: '2.799',
        planValue: 'Pro — €2,799',
        headline: '包含 Business 的全部，另加：',
        cta: '选择 Pro',
        popular: false,
        features: ['50 个产品的定制图片和视频', '100+ 产品目录', '高性能数据库', '高级集成', '扩展功能'],
      },
    ],
    careTiers: [
      { name: 'Basic', price: '29€', popular: false, headline: null, features: ['托管', 'SSL 与安全', '备份'] },
      { name: 'Plus', price: '49€', popular: true, headline: '包含 Basic 的全部，另加：', features: ['每月为 5 个新产品创作定制图片和视频', '修改/新增产品的支持', '每年改版'] },
      { name: 'Pro', price: '99€', popular: false, headline: '包含 Plus 的全部，另加：', features: ['每月为 20 个新产品创作定制图片和视频', '按季度改版', '优先支持'] },
    ],
  },
  values: {
    titleLine1: '免费无压力演示：',
    titleLine2: '看看我们如何改进你的网店',
    kicker: '我们的价值观',
    items: [
      { title: '设计', body: '拒绝千篇一律 — 没有廉价 AI，没有无聊模板。' },
      { title: '结构', body: '只为一个目标而优化：成交。' },
      { title: '性能', body: '为你带来更多客户和更多销售而打造。' },
    ],
  },
  how: {
    kicker: '运作方式',
    title: '从想法到上线，只需三步。',
    steps: [
      { title: '告诉我们你的业务', body: '我们先做一个演示，展示如何改进你的网店。如果合适，支付首期 50% 继续推进项目。' },
      { title: '审阅', body: '我们听取你的反馈，并做出必要的改进。' },
      { title: '上线', body: '你确认后支付剩余 50%，网店即可上线。之后 Yele Care 持续运营维护，月月如此。' },
    ],
  },
  faq: [
    { q: '做一家网店要多少钱？', a: 'Yele 网店 €1,199 起。大多数企业选择 Business 方案（€1,199）；更进阶的网店选择 Pro（€2,799）。开发是一次性付款 — 没有授权月费。' },
    { q: '有月费吗？', a: '有 — 面向网店的 Yele Care，€29/月起，分三个等级：Basic（€29/月）— 托管、安全和备份；Plus（€49/月）— 每月 5 个新产品的图片和视频、修改/新增产品的支持以及每年一次改版；Pro（€99/月）— 每月 20 个新产品的图片和视频、按季度改版和优先支持。' },
    { q: 'Yele Care 是必须的吗？', a: '不是 — 但我们强烈推荐网店使用。它让一切照常运行（托管、安全、备份和监控），每月更新你的产品内容，并包含改版，让你的网店永不过时。你也可以自己管理，但有了 Yele Care，你无需操心技术层面。' },
    { q: '之后我可以新增产品、更新网店吗？', a: '可以 — 随时都行。你可以自己轻松管理商品目录，使用 Plus 或 Pro 时，我们每月为你新增并优化产品。' },
    { q: '需要一次性付清吗？', a: '不需要。开始时支付 50%，剩余 50% 在网店完成并确认上线时支付。' },
    { q: '设计和内容归我所有吗？', a: '是的。你拥有我们为你的网店创作的设计以及全部内容 — 图片、视频和文案。' },
    { q: '我可以随时取回或导出我的数据吗？', a: '可以 — 随时都行。你可以随时取回并导出你的产品、订单和客户数据。你的数据属于你。' },
    { q: '包含托管吗？', a: '包含。托管已包含在 Yele Care 中。' },
    { q: '包含域名吗？', a: '需要时，我们可以为你的网店提供并管理一个标准域名，你也可以使用现有域名。高级或异常昂贵的域名可能需要额外费用。' },
    { q: '包含 SEO 吗？', a: '每个网店都包含 SEO 基础：技术设置、页面标题、描述、站点地图、收录、移动端优化和分析。' },
    { q: '你们能制作我的产品图片和视频吗？', a: '可以。作为建站的一部分，我们会制作并优化你的产品图片和视频，并通过 Yele Care 每月更新 — 根据套餐每月 5 或 20 个新产品。', link: { label: SERVICES.zh, href: SERVICES_HREF } },
    { q: '你们能管理我的广告吗？', a: '可以。Yele 可以设置和管理 Google Ads 与 Meta 广告。广告管理和广告支出与你的网店方案是分开的。', link: { label: SERVICES.zh, href: SERVICES_HREF } },
    { q: '你们能给我的网店加入 AI 吗？', a: '可以。我们可以加入 AI 聊天、产品推荐、客户自动化和售后跟进等工具。', link: { label: SERVICES.zh, href: SERVICES_HREF } },
  ],
  finalCta: {
    title: '你的网店值得一个与之匹配的门面。',
    line1: '完全定制的在线商店，为成交而生 — 佣金远低于 Shopify。',
    line2: '网店 €1,199 起。Yele Care €29/月起。50% 启动，50% 上线时支付。',
  },
  whatsappPrefill: '你好！我想用 Yele 做一家网店。',
  whyAffordableBody: '专业电商 €1,199 起 — 价格清晰，没有令人困惑的代理报价。',
  buildPackages: ['Business — €1,199', 'Pro — €2,799', '不确定 — 帮我推荐'],
}

const DICTS: Record<Locale, TuTiendaDict> = { es, en, zh }

export function getTuTienda(locale: Locale): TuTiendaDict {
  return DICTS[locale] ?? es
}
