// i18n for the /webpolice satire tool — English, Spanish, Chinese. Shared by
// the client UI (WebPoliceClient) and the API route (verdict/effort/aspect
// strings + the language and comedic register the vision model should use).

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
  loadingNote: string
  errWall: string
  reportLabel: string
  caseFile: string
  newSearch: string
  mainCharges: (n: number) => string
  noCharges: string
  noChargesBody: string
  loadMore: (n: number) => string
  looksLikeTook: string
  tryLabel: string
  randomCta: string
  dragHint: string
  shareTitle: string
  shareText: (q: number) => string
  plugKicker: string
  plugTitleGood: string
  plugTitleBad: string
  plugBody: string
  plugCta: string
  footer: string
  exhibitAlt: string
  readMore: string
  showLess: string
  aiFailed: string
  signatureIntro: string
  saysLabel: string
  hearsLabel: string
  personalityLabel: string
  designYearLabel: string
  seriouslyLead: string
  seriouslyBody: string
  seriouslyCta: string
  seoH2: string
  seoP1: string
  seoP2: string
  faq: { q: string; a: string }[]
  // Server-side
  languageName: string
  // Extra voice instructions for the vision model, so the roast lands in the
  // local register instead of reading like a translation of the English one.
  roastStyle: string
  aspectTitle: Record<'typography' | 'spacing' | 'color' | 'clutter' | 'hierarchy' | 'imagery', string>
  verdict: { gorgeous: string; decent: string; average: string; ugly: string; yele: string }
  effort: { label: string; flavor: string }[] // 7 tiers, low→high quality
  errBadUrl: string
  errUnreachable: string
  errProtected: string
  errAiFailed: string
}

const en: WPStrings = {
  heroPre: 'Is my website ',
  heroCursive: 'objectively',
  heroPost: ' ugly?',
  questions: ['Is my website ugly? generic? 🍌', 'Did my developer lie to me? 👨‍💻', 'Did he use ChatGPT to generate my website in 10 min? 🤖'],
  ctaIdle: 'Call the Web Police',
  ctaLoading: 'Dispatching…',
  placeholder: 'type your website',
  loadingLines: ['Sending in the gorilla unit…', 'Judging your font choices…', 'Checking for stolen stock photos…', 'Measuring the amount of purple…', 'Comparing it to actual good websites…', 'Trying not to laugh…'],
  loadingNote: 'This takes around 30 seconds — there’s some serious stuff happening on this site.',
  errWall: 'The investigation hit a wall. Try another URL.',
  reportLabel: 'Web Police report',
  caseFile: 'Case file:',
  newSearch: '↺ New search',
  mainCharges: n => `The ${n} main charges`,
  noCharges: 'No charges filed ✅',
  noChargesBody: 'Clean record. This actually looks like real, considered design. The Web Police tip their hats.',
  loadMore: n => `Load ${n} more crime${n > 1 ? 's' : ''} ↓`,
  looksLikeTook: 'Time to make this website',
  tryLabel: 'Or try one of these',
  randomCta: 'Try random',
  dragHint: 'Drag to see the whole page',
  shareTitle: 'Share the verdict',
  shareText: q => `IS MY WEBSITE UGLY? 🚨 I scored ${q}/100 on the Web Police. Judge yours:`,
  plugKicker: 'Shameless plug',
  plugTitleGood: 'We’ll build you a great website — just like this one, from $699.',
  plugTitleBad: 'We’ll build you a much better website — from $699.',
  plugBody: 'Custom-designed, no template, no AI slop. It passes the Web Police test — we checked.',
  plugCta: 'Get my better website',
  footer: 'A tongue-in-cheek tool by Yele. An AI design critic roasts your homepage for the usual clichés — we don’t store anything, and every verdict is strictly for laughs.',
  exhibitAlt: 'Exhibit A: a stock photo',
  readMore: 'Read the full rant',
  showLess: 'Show less',
  aiFailed: '🚧 My AI analyzer failed on this one — running a quick automatic review instead.',
  signatureIntro: 'And here’s the bit that could become your signature — what your site thinks it says vs. what visitors actually hear:',
  saysLabel: 'Your website says',
  hearsLabel: 'Visitors hear',
  personalityLabel: 'Website personality diagnosis',
  designYearLabel: 'Estimated design year',
  seriouslyLead: 'But seriously…',
  seriouslyBody: 'We try our best so your website looks good.',
  seriouslyCta: 'Check out our site →',
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
  roastStyle: 'Write like a very funny, slightly mean designer on Twitter. Short punchy sentences, concrete specifics about what you can SEE, no corporate hedging.',
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
  errProtected: "🕵️ This site is locked down tighter than a witness protection program — we couldn't get a photo of it. Smells fishy. Try another one.",
  errAiFailed: '🚔 Our forensic expert just fainted looking at this one. We couldn’t file a report — try another site while we get the smelling salts.',
}

const es: WPStrings = {
  heroPre: '¿Mi web es ',
  heroCursive: 'objetivamente',
  heroPost: ' fea?',
  questions: ['¿Mi web es fea? ¿genérica? 🍌', '¿Me mintió mi desarrollador? 👨‍💻', '¿Usó ChatGPT para generar mi web en 10 min? 🤖'],
  ctaIdle: 'Web poli',
  ctaLoading: 'Enviando patrulla…',
  placeholder: 'escribe tu web',
  loadingLines: ['Enviando a la unidad gorila…', 'Juzgando tus tipografías…', 'Buscando fotos de stock robadas…', 'Midiendo la cantidad de morado…', 'Comparándola con webs de verdad buenas…', 'Intentando no reírnos…'],
  loadingNote: 'Esto tarda unos 30 segundos — aquí está pasando algo serio.',
  errWall: 'La investigación chocó con un muro. Prueba otra URL.',
  reportLabel: 'Informe de la Policía Web',
  caseFile: 'Expediente:',
  newSearch: '↺ Nueva búsqueda',
  mainCharges: n => `Los ${n} cargos principales`,
  noCharges: 'Sin cargos ✅',
  noChargesBody: 'Sin antecedentes. Esto parece diseño de verdad, pensado. La Policía Web se quita el sombrero.',
  loadMore: n => `Cargar ${n} cargo${n > 1 ? 's' : ''} más ↓`,
  looksLikeTook: 'Tiempo para hacer esta web',
  tryLabel: 'O prueba con una de estas',
  randomCta: 'Una al azar',
  dragHint: 'Arrastra para ver la página entera',
  shareTitle: 'Comparte el veredicto',
  shareText: q => `¿MI WEB ES FEA? 🚨 Saqué ${q}/100 en la Policía Web. Juzga la tuya:`,
  plugKicker: 'Publicidad descarada',
  plugTitleGood: 'Te hacemos una web genial — igual que esta, desde 699€.',
  plugTitleBad: 'Te hacemos una web mucho mejor — desde 699€.',
  plugBody: 'Diseño a medida, sin plantillas, sin IA cutre. Pasa el test de la Policía Web — lo comprobamos.',
  plugCta: 'Quiero mi mejor web',
  footer: 'Una herramienta con humor de Yele. Un crítico de diseño con IA se ríe de tu página buscando los clichés de siempre — no guardamos nada y todos los veredictos son solo para reír.',
  exhibitAlt: 'Prueba A: una foto de stock',
  readMore: 'Leer el veredicto completo',
  showLess: 'Mostrar menos',
  aiFailed: '🚧 Mi analizador con IA falló con esta web — te dejo una revisión automática rápida.',
  signatureIntro: 'Y aquí va lo que podría ser tu sello — lo que tu web cree que dice vs. lo que la gente entiende de verdad:',
  saysLabel: 'Tu web dice',
  hearsLabel: 'La gente entiende',
  personalityLabel: 'Diagnóstico de personalidad de la web',
  designYearLabel: 'Año de diseño estimado',
  seriouslyLead: 'Pero en serio…',
  seriouslyBody: 'Hacemos todo lo posible para que tu web se vea bien.',
  seriouslyCta: 'Visita nuestra web →',
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
  roastStyle: 'Escribe en español de España, de tú, con mala leche y gracia — como un diseñador cabrón en Twitter. Frases cortas, nada de tono neutro latinoamericano, nada de lenguaje corporativo.',
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
  errProtected: '🕵️ Esta web está más blindada que un testigo protegido — no pudimos hacerle ni una foto. Huele raro. Prueba con otra.',
  errAiFailed: '🚔 A nuestro forense le ha dado un mareo al verla. No pudimos redactar el informe — prueba otra web mientras lo reanimamos.',
}

const zh: WPStrings = {
  heroPre: '我的网站是不是 ',
  heroCursive: '客观上',
  heroPost: ' 就很丑？',
  questions: ['我的网站是不是又土又丑？🍌', '给我做网站的是不是在忽悠我？👨‍💻', '他是不是拿 ChatGPT 十分钟糊弄了一个？🤖'],
  ctaIdle: '一键报警',
  ctaLoading: '出警中…',
  placeholder: '输入你的网址',
  loadingLines: ['大猩猩小队已出警，正在赶来…', '正在数你首页到底叠了几层渐变…', '正在检测「微软雅黑」含量是否超标…', '正在核对这张图是不是全网都在用…', '正在闻一闻这股班味从哪来…', '正在拉几个真好看的网站来做对比…', '正在努力憋笑，请稍候…'],
  loadingNote: '大概需要 30 秒 —— 这个网站背后有不少「大动作」要处理。',
  errWall: '调查卡住了，换个网址再试试。',
  reportLabel: '网页警察出警报告',
  caseFile: '案卷：',
  newSearch: '↺ 再查一个',
  mainCharges: n => `主要罪名 ${n} 项`,
  noCharges: '无罪释放 ✅',
  noChargesBody: '查无此罪。这是真的有人认真设计过的网站。网页警察敬个礼，收队。',
  loadMore: n => `还有 ${n} 项，继续看 ↓`,
  looksLikeTook: '做这个网站花的时间',
  tryLabel: '或者试试这几个',
  randomCta: '随机抽一个',
  dragHint: '拖动查看整页',
  shareTitle: '把判决书发出去',
  shareText: q => `我的网站丑吗？🚨 我在「网页警察」只拿了 ${q}/100。来看看你的：`,
  plugKicker: '恰饭时间',
  plugTitleGood: '我们也能给你做个这么好看的 —— €699 起。',
  plugTitleBad: '这个我们能给你做得好看得多 —— €699 起。',
  plugBody: '纯定制设计，不套模板，不用 AI 糊弄。我们自己的网站也送去测过了 —— 警察没敢开罚单。',
  plugCta: '我也要一个',
  footer: 'Yele 出品的玩笑工具。一个 AI 设计评审专挑你首页的老套路吐槽 —— 不保存任何数据，判决纯属娱乐，图一乐。',
  exhibitAlt: '证物 A：一张全网通用的图库照片',
  readMore: '看完整吐槽',
  showLess: '收起',
  aiFailed: '🚧 AI 检察官在这个网站上翻车了 —— 先给你一份快速的自动检查。',
  signatureIntro: '还有一个点，说不定能成为你的招牌 —— 你的网站以为自己在说什么 vs. 访客其实听到了什么：',
  saysLabel: '你的网站说',
  hearsLabel: '访客听到的是',
  personalityLabel: '网站人格诊断',
  designYearLabel: '预估设计年份',
  seriouslyLead: '不过说正经的……',
  seriouslyBody: '我们是真的用心，想让你的网站好看。',
  seriouslyCta: '来看看我们的网站 →',
  seoH2: '会吐槽你首页的网站设计检查器',
  seoP1: '「网页警察」是一个免费的网站设计检查器，也是一个网站吐槽工具。贴上任意网址，AI 设计评审会从字体、间距、配色、杂乱度、结构和图片六个方面给你的首页打一个百分制的分数 —— 用最快的方式回答那个永恒的问题：我的网站到底丑不丑？',
  seoP2: '你可以把它当成一个有幽默感的网站体验检查工具。你拿到的不是一份枯燥的审计报告，而是一份判决、一个设计评分，外加一段吐槽 —— 以及那些让你的网站显得廉价、像模板、像 AI 生成的具体「罪名」，让你清楚知道该改哪里。',
  faq: [
    { q: '这个网站设计检查器收费吗？', a: '不收费。贴上网址就能立刻拿到设计评分和吐槽，不用注册，也不保存你的数据。' },
    { q: 'AI 设计评审是怎么打分的？', a: '我们先给你的首页拍一张整页截图，再由 AI 设计评审从六个方面打分，并说明问题出在哪。' },
    { q: '它到底会检查什么？', a: '字体、间距、配色、页面是否杂乱、结构与层级，以及图片 —— 也就是让一个网站显得廉价、像模板、像 AI 随手生成的那些地方。' },
    { q: '分数低是不是就代表我的网站很丑？', a: '分数低说明它看起来很像模板、没有记忆点。结果是拿来一乐的，但它列出来的问题都是真的，也都能改。' },
  ],
  languageName: 'Simplified Chinese',
  roastStyle: [
    '你是一个毒舌但好笑的中文设计博主，在小红书 / 知乎 / 微博上吐槽网站。全程用地道的中文互联网口语，句子要短要脆。绝对不要翻译腔，不要英式幽默直译，不要书面报告腔，也不要「总体而言」「该网站」「令人」「值得一提的是」这种词。',
    '核心是「吐槽」：面无表情地说狠话，靠夸张的比喻和精准的细节把人逗笑，而不是靠脏字或单纯骂。多用反差和自嘲——理想 vs 现实、「它以为自己是 X，其实是 Y」这种句式最好用。',
    '可以用这些设计吐槽黑话，但必须贴切、别硬凑：阴间配色、辣眼睛、五彩斑斓的黑、土到掉渣、城乡结合部（杀马特）风、一眼模板、一眼假、复制粘贴、祖传代码、建站三件套（微软雅黑＋居中＋大红大绿）、大字报开会、群魔乱舞、车祸现场、PPT 成精、像 Word 文档流落到网上、一股班味、2008 年既视感、用爱发电、甲方审美。真好看的网站就大方夸：有松弛感、克制、留白舒服、每个像素都像有人认真决定过。',
    '偶尔来一个谐音梗提提神就够了，别每句都玩——谐音梗玩多了是要挨打的。',
    '只吐槽你真正看到的东西（具体的颜色、字体、间距、那张图），不要泛泛而谈。尺度是朋友之间开玩笑，损但不做人身攻击。',
    '语感示范——好的：「这配色克制得像个成年人，难得」；差的：「这绿配这紫，阴间调色盘看了都想连夜加班」「整个首页像一张大字报在开会，谁都想当标题」「一眼建站三件套，微软雅黑居中大法好，土到亲切」。',
  ].join(' '),
  aspectTitle: { typography: '字体排版', spacing: '间距', color: '配色', clutter: '清爽度', hierarchy: '结构与层级', imagery: '图片' },
  verdict: { gorgeous: '好看得不像话', decent: '还真挺能打', average: '平平无奇', ugly: '客观上就是丑', yele: '好看到犯规 😏' },
  effort: [
    { label: 'ChatGPT 一小时速成', flavor: '一条提示词，零审美，直接上线。' },
    { label: '老板的侄子做了一下午', flavor: '家里那个「会电脑」的亲戚，友情价。' },
    { label: '一个周末的 AI 折腾', flavor: '复制、粘贴、部署，再复制一遍。' },
    { label: '普通建站公司做了几天', flavor: '快，便宜，转头就忘。' },
    { label: '正经设计师做了一周', flavor: '看得出来是想过的，挺好。' },
    { label: '正经设计师做了一个月', flavor: '真下了功夫，反复打磨过。' },
    { label: '正经工作室做了几个月', flavor: 'CEO、CTO 和一堆挂着总监头衔的人开了几百场会。' },
  ],
  errBadUrl: '给我们一个真实的、能公开打开的网址（比如 example.com）。',
  errUnreachable: '打不开这个网站。地址写对了吗？站点还活着吗？',
  errProtected: '🕵️ 这网站防得比证人保护计划还严 —— 我们连张照片都拍不到。有点可疑，换一个试试吧。',
  errAiFailed: '🚔 我们的法医看了一眼就晕过去了，报告没写成 —— 先换个网站，等我们把他掐醒。',
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
