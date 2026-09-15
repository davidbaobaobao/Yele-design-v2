// i18n for the /webpolice satire tool — English, Spanish, Chinese. Shared by
// the client UI (WebPoliceClient) and the API route (verdict/effort/aspect
// strings + the language the vision model should reply in).

import type { Locale } from './funnel'
export type { Locale }

export type WPStrings = {
  heroPre: string
  heroCursive: string
  heroPost: string
  questions: string[]
  ctaIdle: string
  ctaLoading: string
  placeholder: string
  loadingLines: string[]
  errWall: string
  reportLabel: string
  caseFile: string
  newSearch: string
  mainCharges: (n: number) => string
  noCharges: string
  noChargesBody: string
  loadMore: (n: number) => string
  looksLikeTook: string
  shareTitle: string
  shareText: (q: number) => string
  plugKicker: string
  plugTitle: string
  plugBody: string
  plugCta: string
  footer: string
  exhibitAlt: string
  readMore: string
  showLess: string
  seoH2: string
  seoP1: string
  seoP2: string
  faq: { q: string; a: string }[]
  // Server-side
  languageName: string
  aspectTitle: Record<'typography' | 'spacing' | 'color' | 'clutter' | 'hierarchy' | 'imagery', string>
  verdict: { gorgeous: string; decent: string; average: string; ugly: string; yele: string }
  effort: { label: string; flavor: string }[] // 7 tiers, low→high quality
  errBadUrl: string
  errUnreachable: string
}

const en: WPStrings = {
  heroPre: 'Is my website ',
  heroCursive: 'objectively',
  heroPost: ' ugly?',
  questions: ['Is my website ugly? generic?', 'Did my developer lie to me?', 'Did he use ChatGPT to generate my website in 10 min?'],
  ctaIdle: 'Call the Web Police',
  ctaLoading: 'Dispatching…',
  placeholder: 'type your website',
  loadingLines: ['Sending in the gorilla unit…', 'Judging your font choices…', 'Checking for stolen stock photos…', 'Measuring the amount of purple…', 'Comparing it to actual good websites…', 'Trying not to laugh…'],
  errWall: 'The investigation hit a wall. Try another URL.',
  reportLabel: 'Web Police report',
  caseFile: 'Case file:',
  newSearch: '↺ New search',
  mainCharges: n => `The ${n} main charges`,
  noCharges: 'No charges filed ✅',
  noChargesBody: 'Clean record. This actually looks like real, considered design. The Web Police tip their hats.',
  loadMore: n => `Load ${n} more crime${n > 1 ? 's' : ''} ↓`,
  looksLikeTook: 'Looks like it took',
  shareTitle: 'Share the verdict',
  shareText: q => `IS MY WEBSITE UGLY? 🚨 I scored ${q}/100 on the Web Police. Judge yours:`,
  plugKicker: 'Shameless plug',
  plugTitle: 'We’ll build you a better website — from $699.',
  plugBody: 'Custom-designed, no template, no AI slop. It passes the Web Police test — we checked.',
  plugCta: 'Get my better website',
  footer: 'A tongue-in-cheek tool by Yele. We look at the page for design clichés — nothing stored, verdicts strictly for laughs.',
  exhibitAlt: 'Exhibit A: a stock photo',
  readMore: 'Read the full rant',
  showLess: 'Show less',
  seoH2: 'The website design checker that roasts your homepage',
  seoP1: 'Web Police is a free website design analyzer and website roast tool. Paste any URL and our AI website design review scores your homepage out of 100 across typography, spacing, colour, clutter, structure and imagery — the fastest way to settle the eternal question: is my website ugly?',
  seoP2: 'Think of it as a website UX checker with a sense of humour. Instead of a dry audit you get a verdict, a design score and a comedy rant — plus the specific design crimes making your site look cheap, generic or AI-generated, so you know exactly what to fix.',
  faq: [
    { q: 'Is this website design checker free?', a: 'Yes. Paste a URL and get an instant design score and roast — no signup, nothing stored.' },
    { q: 'How does the AI website design review work?', a: 'We capture your homepage and a full-page screenshot, then an AI design critic scores it across six design aspects and explains what is letting it down.' },
    { q: 'What does the website roast actually check?', a: 'Typography, spacing, colour, visual clutter, structure and hierarchy, and imagery — the things that make a website feel cheap, generic or AI-generated.' },
    { q: 'Is my website ugly if it scores low?', a: 'A low score means it reads as generic or template-like. It is meant to be funny, but the design crimes it lists are real and fixable.' },
  ],
  languageName: 'English',
  aspectTitle: { typography: 'Typography', spacing: 'Spacing', color: 'Colour', clutter: 'Clarity', hierarchy: 'Structure & hierarchy', imagery: 'Imagery' },
  verdict: { gorgeous: 'Certified Gorgeous', decent: 'Actually Decent', average: 'Painfully Average', ugly: 'Objectively Ugly', yele: 'Illegally Good 😏' },
  effort: [
    { label: 'One hour with ChatGPT', flavor: 'A vibe-coder, one prompt, zero taste.' },
    { label: 'An afternoon with ChatGPT', flavor: 'A vibe-coder and a long coffee.' },
    { label: 'A weekend of vibe-coding with ChatGPT', flavor: 'Copy, paste, deploy, repeat.' },
    { label: 'A few days at an average agency', flavor: 'Fast, competent, forgettable.' },
    { label: 'About a week of serious agency work', flavor: 'Actually considered. Quite good.' },
    { label: 'About a month of serious agency work', flavor: 'Real craft and iteration.' },
    { label: 'Months of serious studio work', flavor: 'Hundreds of meetings between the CEO, the CTO and assorted three-letter guys.' },
  ],
  errBadUrl: 'Give us a real, public URL to investigate (like example.com).',
  errUnreachable: "Couldn't reach that site. Is the address right and the site online?",
}

const es: WPStrings = {
  heroPre: '¿Mi web es ',
  heroCursive: 'objetivamente',
  heroPost: ' fea?',
  questions: ['¿Mi web es fea? ¿genérica?', '¿Me mintió mi desarrollador?', '¿Usó ChatGPT para generar mi web en 10 min?'],
  ctaIdle: 'Llama a la Policía Web',
  ctaLoading: 'Enviando patrulla…',
  placeholder: 'escribe tu web',
  loadingLines: ['Enviando a la unidad gorila…', 'Juzgando tus tipografías…', 'Buscando fotos de stock robadas…', 'Midiendo la cantidad de morado…', 'Comparándola con webs de verdad buenas…', 'Intentando no reírnos…'],
  errWall: 'La investigación chocó con un muro. Prueba otra URL.',
  reportLabel: 'Informe de la Policía Web',
  caseFile: 'Expediente:',
  newSearch: '↺ Nueva búsqueda',
  mainCharges: n => `Los ${n} cargos principales`,
  noCharges: 'Sin cargos ✅',
  noChargesBody: 'Sin antecedentes. Esto parece diseño de verdad, pensado. La Policía Web se quita el sombrero.',
  loadMore: n => `Cargar ${n} cargo${n > 1 ? 's' : ''} más ↓`,
  looksLikeTook: 'Parece que llevó',
  shareTitle: 'Comparte el veredicto',
  shareText: q => `¿MI WEB ES FEA? 🚨 Saqué ${q}/100 en la Policía Web. Juzga la tuya:`,
  plugKicker: 'Publicidad descarada',
  plugTitle: 'Te hacemos una web mejor — desde 699€.',
  plugBody: 'Diseño a medida, sin plantillas, sin IA cutre. Pasa el test de la Policía Web — lo comprobamos.',
  plugCta: 'Quiero mi mejor web',
  footer: 'Una herramienta con humor de Yele. Analizamos la página en busca de clichés de diseño — no guardamos nada, los veredictos son solo para reír.',
  exhibitAlt: 'Prueba A: una foto de stock',
  readMore: 'Leer el veredicto completo',
  showLess: 'Mostrar menos',
  seoH2: 'El analizador de diseño web que critica tu página',
  seoP1: 'Web Police es un analizador de diseño web y herramienta de «roast» gratis. Pega cualquier URL y nuestra revisión de diseño web con IA puntúa tu página sobre 100 en tipografía, espaciado, color, saturación visual, estructura e imágenes — la forma más rápida de responder la eterna duda: ¿mi web es fea?',
  seoP2: 'Piénsalo como un chequeo de UX web con sentido del humor. En vez de una auditoría aburrida recibes un veredicto, una puntuación de diseño y un monólogo cómico — además de los «delitos de diseño» concretos que hacen que tu web parezca barata, genérica o generada por IA, para que sepas exactamente qué arreglar.',
  faq: [
    { q: '¿Este analizador de diseño web es gratis?', a: 'Sí. Pega una URL y obtén al instante una puntuación de diseño y un roast — sin registro y sin guardar nada.' },
    { q: '¿Cómo funciona la revisión de diseño web con IA?', a: 'Capturamos tu página y una captura de la web completa, y un crítico de diseño con IA la puntúa en seis aspectos y explica qué falla.' },
    { q: '¿Qué comprueba exactamente el roast de la web?', a: 'Tipografía, espaciado, color, saturación visual, estructura y jerarquía, e imágenes — lo que hace que una web parezca barata, genérica o hecha con IA.' },
    { q: '¿Mi web es fea si saca poca nota?', a: 'Una nota baja significa que se percibe como genérica o de plantilla. Es para reír, pero los delitos de diseño que señala son reales y se pueden arreglar.' },
  ],
  languageName: 'Spanish',
  aspectTitle: { typography: 'Tipografía', spacing: 'Espaciado', color: 'Color', clutter: 'Claridad', hierarchy: 'Estructura y jerarquía', imagery: 'Imágenes' },
  verdict: { gorgeous: 'Espectacular', decent: 'Bastante Decente', average: 'Dolorosamente del Montón', ugly: 'Objetivamente Fea', yele: 'Ilegalmente Buena 😏' },
  effort: [
    { label: 'Una hora con ChatGPT', flavor: 'Un vibe-coder, un prompt, cero gusto.' },
    { label: 'Una tarde con ChatGPT', flavor: 'Un vibe-coder y un café largo.' },
    { label: 'Un finde programando con ChatGPT', flavor: 'Copiar, pegar, publicar, repetir.' },
    { label: 'Unos días en una agencia del montón', flavor: 'Rápido, competente, olvidable.' },
    { label: 'Una semana de trabajo serio de agencia', flavor: 'Bien pensado. Bastante bueno.' },
    { label: 'Un mes de trabajo serio de agencia', flavor: 'Oficio de verdad e iteración.' },
    { label: 'Meses en un estudio serio', flavor: 'Cientos de reuniones entre el CEO, el CTO y varios señores de tres letras.' },
  ],
  errBadUrl: 'Danos una URL pública real (como ejemplo.com).',
  errUnreachable: 'No pudimos acceder a esa web. ¿Es correcta la dirección y está online?',
}

const zh: WPStrings = {
  heroPre: '我的网站',
  heroCursive: '客观上',
  heroPost: '丑吗？',
  questions: ['我的网站丑吗？普通吗？', '我的开发者骗了我吗？', '他是不是用 ChatGPT 十分钟做出了我的网站？'],
  ctaIdle: '呼叫网页警察',
  ctaLoading: '出警中…',
  placeholder: '输入你的网站',
  loadingLines: ['派出大猩猩小队…', '审判你的字体选择…', '排查被盗的图库照片…', '测量紫色的用量…', '和真正好的网站作对比…', '努力憋住不笑…'],
  errWall: '调查遇到了瓶颈。换个网址试试。',
  reportLabel: '网页警察报告',
  caseFile: '案卷：',
  newSearch: '↺ 重新搜索',
  mainCharges: n => `${n} 项主要罪名`,
  noCharges: '无罪指控 ✅',
  noChargesBody: '记录清白。这看起来是真正用心的设计。网页警察向你致敬。',
  loadMore: n => `再看 ${n} 项罪名 ↓`,
  looksLikeTook: '看起来花了',
  shareTitle: '分享判决',
  shareText: q => `我的网站丑吗？🚨 我在网页警察拿了 ${q}/100。来评评你的：`,
  plugKicker: '厚脸皮广告',
  plugTitle: '我们帮你做个更好的网站 — €699 起。',
  plugBody: '定制设计，无模板，无 AI 垃圾。通过网页警察测试 — 我们查过了。',
  plugCta: '获取我的更好网站',
  footer: 'Yele 出品的玩笑工具。我们查看页面的设计俗套 — 不保存任何数据，判决纯属娱乐。',
  exhibitAlt: '证物 A：一张图库照片',
  readMore: '阅读完整吐槽',
  showLess: '收起',
  seoH2: '会吐槽你首页的网站设计检查器',
  seoP1: 'Web Police 是一款免费的网站设计分析器和「吐槽」工具。粘贴任意网址，我们的 AI 网站设计评审会从字体、间距、色彩、杂乱度、结构和图像六个方面为你的首页打出百分制评分 —— 最快回答那个永恒的问题：我的网站丑吗？',
  seoP2: '把它当作一个有幽默感的网站 UX 检查器。你得到的不是枯燥的审计，而是一个判决、一个设计评分和一段吐槽 —— 以及让你的网站显得廉价、普通或像 AI 生成的具体「设计罪名」，让你清楚知道该改什么。',
  faq: [
    { q: '这个网站设计检查器免费吗？', a: '免费。粘贴网址即可立即获得设计评分和吐槽 —— 无需注册，不保存任何数据。' },
    { q: 'AI 网站设计评审是怎么工作的？', a: '我们截取你的首页和整页截图，然后由 AI 设计评审从六个方面打分，并解释问题所在。' },
    { q: '网站吐槽具体检查什么？', a: '字体、间距、色彩、视觉杂乱、结构与层级，以及图像 —— 让网站显得廉价、普通或像 AI 生成的那些方面。' },
    { q: '评分低就代表我的网站丑吗？', a: '低分意味着它看起来普通或像模板。它是为了搞笑，但列出的设计罪名是真实且可以修复的。' },
  ],
  languageName: 'Simplified Chinese',
  aspectTitle: { typography: '字体排版', spacing: '间距', color: '色彩', clutter: '清晰度', hierarchy: '结构与层级', imagery: '图像' },
  verdict: { gorgeous: '惊艳认证', decent: '其实还不错', average: '平庸得让人心痛', ugly: '客观上很丑', yele: '好得犯规 😏' },
  effort: [
    { label: '用 ChatGPT 花了一小时', flavor: '一个 vibe-coder，一句提示词，毫无品味。' },
    { label: '用 ChatGPT 花了一下午', flavor: '一个 vibe-coder 加一杯长咖啡。' },
    { label: '用 ChatGPT 折腾了一个周末', flavor: '复制、粘贴、部署、重复。' },
    { label: '在普通代理公司做了几天', flavor: '快速、还行，但很快就被忘掉。' },
    { label: '认真的代理公司做了大约一周', flavor: '有认真考虑，相当不错。' },
    { label: '认真的代理公司做了大约一个月', flavor: '真正的用心与打磨。' },
    { label: '认真的工作室做了几个月', flavor: 'CEO、CTO 和一堆三字母大佬开了几百场会。' },
  ],
  errBadUrl: '请给我们一个真实的公开网址（例如 example.com）。',
  errUnreachable: '无法访问该网站。网址正确吗？网站在线吗？',
}

const WP: Record<Locale, WPStrings> = { en, es, zh }

export function getWP(locale: Locale): WPStrings {
  return WP[locale] ?? en
}

// schema.org JSON-LD for a /webpolice page: WebApplication + FAQPage.
export function webPoliceJsonLd(locale: Locale, url: string, name: string) {
  const wp = getWP(locale)
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name,
        url,
        applicationCategory: 'DesignApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        description: wp.seoP1,
      },
      {
        '@type': 'FAQPage',
        mainEntity: wp.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ],
  }
}
