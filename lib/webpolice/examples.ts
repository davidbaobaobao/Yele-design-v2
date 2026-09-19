// Sites the visitor can try without typing anything.
//
// SHOWCASE sits under the search box: recognisable names, so a first-timer
// immediately sees what the tool does.
//
// POOL feeds the "Try random" button. It is deliberately half sites the design
// world holds up as excellent and half sites that are famously dated, cluttered
// or plain — that contrast is the joke, and it keeps the verdict unpredictable.
// `tone` is only used to keep the two halves balanced when picking; the Web
// Police still judges every one of them from scratch.

export type SiteRef = { name: string; url: string; domain: string; tone?: 'good' | 'rough' }

const site = (name: string, domain: string, tone?: 'good' | 'rough', url?: string): SiteRef => ({
  name,
  domain,
  tone,
  url: url ?? `https://${domain}`,
})

/** The six chips under the hero search box. */
export const SHOWCASE: SiteRef[] = [
  site('Apple', 'apple.com', 'good'),
  site('ChatGPT', 'chatgpt.com', 'good', 'https://chatgpt.com/'),
  site('Google', 'google.com', 'good'),
  site('The Boring Company', 'boringcompany.com', 'rough'),
  site('Berkshire Hathaway', 'berkshirehathaway.com', 'rough', 'https://www.berkshirehathaway.com/'),
  site('Carrefour', 'carrefour.es', 'rough', 'https://www.carrefour.es/'),
  site('Craigslist', 'craigslist.org', 'rough', 'https://www.craigslist.org/'),
]

/** 50 sites for the random button — 25 widely admired, 25 famously rough. */
export const POOL: SiteRef[] = [
  // ── Held up as excellent design ───────────────────────────────────────────
  site('Stripe', 'stripe.com', 'good'),
  site('Linear', 'linear.app', 'good'),
  site('Vercel', 'vercel.com', 'good'),
  site('Figma', 'figma.com', 'good'),
  site('Arc', 'arc.net', 'good'),
  site('Framer', 'framer.com', 'good'),
  site('Teenage Engineering', 'teenage.engineering', 'good'),
  site('Aesop', 'aesop.com', 'good'),
  site('Oatly', 'oatly.com', 'good'),
  site('Patagonia', 'patagonia.com', 'good'),
  site('Pentagram', 'pentagram.com', 'good'),
  site('Koto Studio', 'koto.studio', 'good'),
  site('Lusion', 'lusion.co', 'good'),
  site('Bruno Simon', 'bruno-simon.com', 'good'),
  site('Cosmos', 'cosmos.so', 'good'),
  site('Rauno Freiberg', 'rauno.me', 'good'),
  site('WeTransfer', 'wetransfer.com', 'good'),
  site('Mailchimp', 'mailchimp.com', 'good'),
  site('Notion', 'notion.com', 'good'),
  site('Pitch', 'pitch.com', 'good'),
  site('Dropbox Design', 'dropbox.design', 'good'),
  site('Awwwards', 'awwwards.com', 'good'),
  site('Hermès', 'hermes.com', 'good'),
  site('Tesla', 'tesla.com', 'good'),
  site('Monzo', 'monzo.com', 'good'),

  // ── Famously dated, cluttered or gloriously plain ─────────────────────────
  site('Craigslist', 'craigslist.org', 'rough', 'https://www.craigslist.org/'),
  site('Berkshire Hathaway', 'berkshirehathaway.com', 'rough', 'https://www.berkshirehathaway.com/'),
  site("Ling's Cars", 'lingscars.com', 'rough'),
  site('Arngren', 'arngren.net', 'rough'),
  site('Yale School of Art', 'art.yale.edu', 'rough', 'https://art.yale.edu/'),
  site('Suzanne Collins Books', 'suzannecollinsbooks.com', 'rough'),
  site('Space Jam (1996)', 'spacejam.com', 'rough', 'https://www.spacejam.com/1996/'),
  site('Pacific NW X-Ray', 'pacificnorthwestxray.com', 'rough'),
  site('Drudge Report', 'drudgereport.com', 'rough'),
  site('Hacker News', 'news.ycombinator.com', 'rough', 'https://news.ycombinator.com/'),
  site('McMaster-Carr', 'mcmaster.com', 'rough'),
  site('B&H Photo', 'bhphotovideo.com', 'rough'),
  site('Alibaba', 'alibaba.com', 'rough'),
  site('AliExpress', 'aliexpress.com', 'rough'),
  site('Daily Mail', 'dailymail.co.uk', 'rough', 'https://www.dailymail.co.uk/'),
  site('CNN', 'cnn.com', 'rough'),
  site('eBay', 'ebay.com', 'rough'),
  site('Walmart', 'walmart.com', 'rough'),
  site('Temu', 'temu.com', 'rough'),
  site('SHEIN', 'shein.com', 'rough'),
  site('Milanuncios', 'milanuncios.com', 'rough', 'https://www.milanuncios.com/'),
  site('Páginas Amarillas', 'paginasamarillas.es', 'rough', 'https://www.paginasamarillas.es/'),
  site('El Corte Inglés', 'elcorteingles.es', 'rough', 'https://www.elcorteingles.es/'),
  site('IRS', 'irs.gov', 'rough', 'https://www.irs.gov/'),
  site('Ryanair', 'ryanair.com', 'rough'),
]

// ── Spanish version — the sites a Spanish visitor actually recognises. ───────
// Same good/rough contrast; seeding discards any that block screenshots, so
// only the working ones end up in the live pool.

/** The chips shown under the search box on /es/webpolice. Recognisable AND
 *  actually capturable (many big Spanish sites are Cloudflare/DataDome-walled). */
export const SHOWCASE_ES: SiteRef[] = [
  site('ChatGPT', 'chatgpt.com', 'good', 'https://chatgpt.com/'),
  site('SpanishDict', 'spanishdict.com', 'good', 'https://www.spanishdict.com/'),
  site('Mercadona', 'mercadona.es', 'rough', 'https://www.mercadona.es/'),
  site('Zara', 'zara.com', 'good', 'https://www.zara.com/es/'),
  site('Marca', 'marca.com', 'rough', 'https://www.marca.com/'),
  site('Carrefour', 'carrefour.es', 'rough', 'https://www.carrefour.es/'),
  site('Glovo', 'glovoapp.com', 'good', 'https://glovoapp.com/es/es/'),
  site('20minutos', '20minutos.es', 'rough', 'https://www.20minutos.es/'),
]

/** The "Try random" pool for the Spanish version — common Spanish sites. */
export const POOL_ES: SiteRef[] = [
  // Modern / well-made
  site('Zara', 'zara.com', 'good', 'https://www.zara.com/es/'),
  site('Mango', 'mango.com', 'good', 'https://shop.mango.com/es'),
  site('PcComponentes', 'pccomponentes.com', 'good', 'https://www.pccomponentes.com/'),
  site('Glovo', 'glovoapp.com', 'good', 'https://glovoapp.com/es/es/'),
  site('Cabify', 'cabify.com', 'good', 'https://cabify.com/es'),
  site('Fever', 'feverup.com', 'good', 'https://feverup.com/es'),
  site('Hawkers', 'hawkersco.com', 'good', 'https://www.hawkersco.com/'),
  site('Idealista', 'idealista.com', 'good', 'https://www.idealista.com/'),
  site('Wallapop', 'wallapop.com', 'good', 'https://es.wallapop.com/'),
  // Famously busy / dated / plain
  site('Forocoches', 'forocoches.com', 'rough', 'https://www.forocoches.com/'),
  site('Milanuncios', 'milanuncios.com', 'rough', 'https://www.milanuncios.com/'),
  site('Páginas Amarillas', 'paginasamarillas.es', 'rough', 'https://www.paginasamarillas.es/'),
  site('El Corte Inglés', 'elcorteingles.es', 'rough', 'https://www.elcorteingles.es/'),
  site('Mercadona', 'mercadona.es', 'rough', 'https://www.mercadona.es/'),
  site('Carrefour', 'carrefour.es', 'rough', 'https://www.carrefour.es/'),
  site('MediaMarkt', 'mediamarkt.es', 'rough', 'https://www.mediamarkt.es/'),
  site('Marca', 'marca.com', 'rough', 'https://www.marca.com/'),
  site('As', 'as.com', 'rough', 'https://as.com/'),
  site('20minutos', '20minutos.es', 'rough', 'https://www.20minutos.es/'),
  site('El País', 'elpais.com', 'rough', 'https://elpais.com/'),
  site('El Mundo', 'elmundo.es', 'rough', 'https://www.elmundo.es/'),
  site('La Vanguardia', 'lavanguardia.com', 'rough', 'https://www.lavanguardia.com/'),
  site('ABC', 'abc.es', 'rough', 'https://www.abc.es/'),
  site('RTVE', 'rtve.es', 'rough', 'https://www.rtve.es/'),
  site('Telecinco', 'telecinco.es', 'rough', 'https://www.telecinco.es/'),
  site('Antena 3', 'antena3.com', 'rough', 'https://www.antena3.com/'),
  site('AEMET', 'aemet.es', 'rough', 'https://www.aemet.es/'),
  site('Correos', 'correos.es', 'rough', 'https://www.correos.es/'),
  site('Renfe', 'renfe.com', 'rough', 'https://www.renfe.com/'),
  site('DGT', 'dgt.es', 'rough', 'https://www.dgt.es/'),
  site('Fotocasa', 'fotocasa.es', 'rough', 'https://www.fotocasa.es/'),
  site('InfoJobs', 'infojobs.net', 'rough', 'https://www.infojobs.net/'),
]

/** Chips for a locale (Spanish has its own; everything else uses the default). */
export function showcaseFor(locale: string): SiteRef[] {
  return locale === 'es' ? SHOWCASE_ES : SHOWCASE
}

/** Random-button pool for a locale. */
export function poolFor(locale: string): SiteRef[] {
  return locale === 'es' ? POOL_ES : POOL
}

/** Full unique site list (chips + pool) to precompute for a locale. */
export function siteListFor(locale: string): SiteRef[] {
  const all = [...showcaseFor(locale), ...poolFor(locale)]
  return Array.from(new Map(all.map(s => [s.url, s])).values())
}

/** A random site, never the same one twice in a row. */
export function randomSite(exclude?: string): SiteRef {
  const pool = POOL.filter(s => s.url !== exclude)
  return pool[Math.floor(Math.random() * pool.length)]
}

/** Favicon for a chip. Falls back to the first letter if it fails to load. */
export function faviconUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`
}
