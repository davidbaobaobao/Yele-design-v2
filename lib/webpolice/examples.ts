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

/** A random site, never the same one twice in a row. */
export function randomSite(exclude?: string): SiteRef {
  const pool = POOL.filter(s => s.url !== exclude)
  return pool[Math.floor(Math.random() * pool.length)]
}

/** Favicon for a chip. Falls back to the first letter if it fails to load. */
export function faviconUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`
}
