'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { type Locale } from '@/lib/i18n/funnel'

type FaqItem = { q: string; a: string; link?: { label: string; href: string } }

const SERVICES_LINK = { en: 'See more in our services', es: 'Ver más en nuestros servicios', zh: '在我们的服务中了解更多' }

const FAQS_BY_LOCALE: Record<Locale, { kicker: string; title: string; items: FaqItem[] }> = {
  en: {
    kicker: 'FAQ',
    title: 'We answer your questions.',
    items: [
      { q: 'How much does a website cost?', a: 'Yele websites start at $699. Most small businesses will choose either our $699 Launch package or our $1,199 Business package. More advanced websites start from $2,799.' },
      { q: 'Is there a monthly fee?', a: 'Yes — Yele Care, our maintenance plan, from $29/month, in three tiers: Yele Care Lite ($29/mo) — hosting, security and backups; Yele Care ($49/mo) — a yearly redesign, we update your content, plus monitoring; and Yele Care+ ($99/mo) — advanced security, backups, monitoring and services.' },
      { q: 'Is Yele Care compulsory?', a: 'No — but we highly recommend it. Yele Care includes a full design refresh every year, so you get a renewed website annually and everything keeps working — hosted, secure, backed up, monitored and up to date. You can host and manage the site yourself, but with Yele Care you never have to worry about the technical side.' },
      { q: 'Can I update my website later with my content?', a: 'Yes — anytime. With Yele Care Lite you can upload and update your content yourself, easily. With Yele Care and Yele Care+, we help you upload it or do it for you.' },
      { q: 'Do I need to pay everything upfront?', a: 'No. You pay 50% when we begin. The remaining 50% is paid when the website is finished and approved for launch.' },
      { q: 'Do I own the design?', a: 'Yes. You own the design files and hold the copyright to all the content we create for you.' },
      { q: 'Is hosting included?', a: 'Yes. Hosting is included with Yele Care.' },
      { q: 'Is my domain included?', a: 'We can provide and manage a standard domain for your website when required, and you can also bring your current domain. Premium or unusually expensive domains may cost extra.' },
      { q: 'Can customers book appointments through my website?', a: 'Yes. With Business, customers can automatically choose and confirm a time in a synchronized calendar. With Launch, your site has direct automatic action buttons to call you or fill in a form. More advanced scheduling, payments, reminders, or multi-staff booking is available with Business or Pro.' },
      { q: 'Is SEO included?', a: 'Every website includes an SEO foundation. This includes technical setup, page titles, descriptions, sitemap, indexing, mobile optimization, and analytics.' },
      { q: 'Can you create images and videos?', a: 'We create the visual assets needed for your website as part of the build. Ongoing image and video content in the future isn’t included and is an added cost.', link: { label: SERVICES_LINK.en, href: 'https://yele.design/services' } },
      { q: 'Can you manage my advertising?', a: 'Yes. Yele can set up and manage Google Ads and Meta advertising campaigns. Advertising management and ad spend are separate from your website package.', link: { label: SERVICES_LINK.en, href: 'https://yele.design/services' } },
      { q: 'Can you add AI to my website?', a: 'Yes. We can add AI chat, AI phone receptionists, lead automation, customer follow-up, and other AI-powered business tools.', link: { label: SERVICES_LINK.en, href: 'https://yele.design/services' } },
    ],
  },
  es: {
    kicker: 'Preguntas frecuentes',
    title: 'Respondemos tus preguntas.',
    items: [
      { q: '¿Cuánto cuesta una web?', a: 'Las webs de Yele empiezan en 699€. La mayoría de pequeños negocios elige el plan Launch (699€) o el plan Business (1.199€). Las webs más avanzadas empiezan en 2.799€.' },
      { q: '¿Hay una cuota mensual?', a: 'Sí — Yele Care, nuestro plan de mantenimiento, desde 29€/mes, en tres niveles: Yele Care Lite (29€/mes) — alojamiento, seguridad y copias; Yele Care (49€/mes) — un rediseño anual, actualizamos tu contenido y monitorización; y Yele Care+ (99€/mes) — seguridad avanzada, copias, monitorización y servicios.' },
      { q: '¿Yele Care es obligatorio?', a: 'No — pero lo recomendamos mucho. Yele Care incluye un rediseño completo cada año, así renuevas tu web anualmente y todo sigue funcionando — alojado, seguro, con copias, monitorizado y actualizado. Puedes alojar y gestionar la web tú mismo, pero con Yele Care nunca tienes que preocuparte por la parte técnica.' },
      { q: '¿Puedo actualizar mi web más adelante con mi contenido?', a: 'Sí — cuando quieras. Con Yele Care Lite puedes subir y actualizar tu contenido tú mismo, fácilmente. Con Yele Care y Yele Care+, te ayudamos a subirlo o lo hacemos por ti.' },
      { q: '¿Tengo que pagar todo por adelantado?', a: 'No. Pagas el 50% al empezar. El 50% restante se paga cuando la web está terminada y aprobada para su lanzamiento.' },
      { q: '¿La propiedad del diseño es mía?', a: 'Sí. Tú eres propietario de los archivos de diseño y tienes los derechos de todo el contenido que creamos para ti.' },
      { q: '¿El alojamiento está incluido?', a: 'Sí. El alojamiento está incluido con Yele Care.' },
      { q: '¿Mi dominio está incluido?', a: 'Podemos proporcionar y gestionar un dominio estándar para tu web cuando sea necesario, y también puedes traer tu dominio actual. Los dominios premium o inusualmente caros pueden tener un coste adicional.' },
      { q: '¿Los clientes pueden reservar cita desde mi web?', a: 'Sí. Con Business, los clientes pueden elegir y confirmar automáticamente una hora en un calendario sincronizado. Con Launch, tu web tiene botones de acción automáticos para llamarte o rellenar un formulario. Reservas más avanzadas, pagos, recordatorios o citas con varios profesionales están disponibles con Business o Pro.' },
      { q: '¿El SEO está incluido?', a: 'Todas las webs incluyen una base de SEO. Incluye configuración técnica, títulos de página, descripciones, sitemap, indexación, optimización móvil y analítica.' },
      { q: '¿Podéis crear imágenes y vídeos?', a: 'Creamos los recursos visuales necesarios para tu web como parte del proyecto. El contenido continuo de imagen y vídeo en el futuro no está incluido y tiene un coste adicional.', link: { label: SERVICES_LINK.es, href: 'https://yele.design/services' } },
      { q: '¿Podéis gestionar mi publicidad?', a: 'Sí. Yele puede configurar y gestionar campañas de Google Ads y Meta. La gestión de publicidad y la inversión en anuncios son independientes de tu plan de web.', link: { label: SERVICES_LINK.es, href: 'https://yele.design/services' } },
      { q: '¿Podéis añadir IA a mi web?', a: 'Sí. Podemos añadir chat con IA, recepcionistas telefónicos con IA, automatización de clientes potenciales, seguimiento de clientes y otras herramientas de negocio con IA.', link: { label: SERVICES_LINK.es, href: 'https://yele.design/services' } },
    ],
  },
  zh: {
    kicker: '常见问题',
    title: '解答你的疑问。',
    items: [
      { q: '一个网站要多少钱？', a: 'Yele 网站 €699 起。大多数小企业会选择 €699 的 Launch 方案或 €1,199 的 Business 方案。更进阶的网站 €2,799 起。' },
      { q: '有月费吗？', a: '有 — Yele Care 是我们的维护方案，€29/月起，分三个等级：Yele Care Lite（€29/月）— 托管、安全和备份；Yele Care（€49/月）— 每年重新设计、更新你的内容并监控；Yele Care+（€99/月）— 进阶安全、备份、监控和服务。' },
      { q: 'Yele Care 是必须的吗？', a: '不是 — 但我们强烈推荐。Yele Care 每年包含一次完整的设计焕新，所以你每年都能获得焕然一新的网站，一切照常运行 — 托管、安全、备份、监控并保持更新。你也可以自己托管和管理网站，但有了 Yele Care，你无需操心技术层面。' },
      { q: '之后我可以用自己的内容更新网站吗？', a: '可以 — 随时都行。使用 Yele Care Lite，你可以自己轻松上传和更新内容。使用 Yele Care 和 Yele Care+，我们帮你上传或替你完成。' },
      { q: '需要一次性付清吗？', a: '不需要。开始时支付 50%，剩余 50% 在网站完成并确认上线时支付。' },
      { q: '设计归我所有吗？', a: '是的。你拥有设计文件，并对我们为你创作的所有内容拥有版权。' },
      { q: '包含托管吗？', a: '包含。托管已包含在 Yele Care 中。' },
      { q: '包含域名吗？', a: '需要时，我们可以为你的网站提供并管理一个标准域名，你也可以使用现有域名。高级或异常昂贵的域名可能需要额外费用。' },
      { q: '客户可以通过我的网站预约吗？', a: '可以。使用 Business，客户可在同步日历中自动选择并确认时间。使用 Launch，你的网站带有直接的自动操作按钮，可致电你或填写表单。更进阶的预约、支付、提醒或多员工预约可通过 Business 或 Pro 实现。' },
      { q: '包含 SEO 吗？', a: '每个网站都包含 SEO 基础，涵盖技术设置、页面标题、描述、站点地图、收录、移动端优化和分析。' },
      { q: '你们能制作图片和视频吗？', a: '作为建站的一部分，我们会制作网站所需的视觉素材。未来持续的图片和视频内容不包含在内，需额外付费。', link: { label: SERVICES_LINK.zh, href: 'https://yele.design/services' } },
      { q: '你们能管理我的广告吗？', a: '可以。Yele 可以设置和管理 Google Ads 与 Meta 广告投放。广告管理和广告支出与你的网站方案是分开的。', link: { label: SERVICES_LINK.zh, href: 'https://yele.design/services' } },
      { q: '你们能给我的网站加入 AI 吗？', a: '可以。我们可以加入 AI 聊天、AI 电话接待、潜在客户自动化、客户跟进以及其他 AI 驱动的业务工具。', link: { label: SERVICES_LINK.zh, href: 'https://yele.design/services' } },
    ],
  },
}

export default function LetsBuildFAQ({ locale = 'en' }: { locale?: Locale }) {
  const [open, setOpen] = useState<number | null>(0)
  const { kicker, title, items: FAQS } = FAQS_BY_LOCALE[locale] ?? FAQS_BY_LOCALE.en

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-6">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted mb-3">{kicker}</p>
        <h2 className="font-display font-bold text-3xl md:text-4xl text-ink tracking-tight mb-8">
          {title}
        </h2>

        <div className="divide-y divide-hairline border-t border-b border-hairline">
          {FAQS.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-body font-medium text-base md:text-lg text-ink">{item.q}</span>
                  {isOpen ? (
                    <Minus size={20} className="text-[#D46FC8] flex-shrink-0" aria-hidden="true" />
                  ) : (
                    <Plus size={20} className="text-[#D46FC8] flex-shrink-0" aria-hidden="true" />
                  )}
                </button>
                {isOpen && (
                  <div className="pb-5 -mt-1 max-w-2xl">
                    <p className="font-body text-base text-muted leading-relaxed">{item.a}</p>
                    {item.link && (
                      <a
                        href={item.link.href}
                        className="inline-flex items-center gap-1 mt-2 font-body text-sm font-medium text-[#D46FC8] underline underline-offset-4 hover:text-[#DE85D2] transition-colors"
                      >
                        {item.link.label} →
                      </a>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
