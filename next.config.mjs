/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
  },
  async headers() {
    return [
      // Static video/image/font assets served straight from /public (not
      // through the /_next/image optimizer, which already has its own
      // 1-year minimumCacheTTL below) had no explicit cache policy, so
      // browsers were re-validating them on every visit. Not `immutable` —
      // this project's own workflow re-exports some assets in place under
      // the same filename (e.g. hero_poster.jpg), so a byte-for-byte-never-
      // changes policy would risk serving stale content after that; a week
      // fresh + up to 30 days stale-while-revalidate is a real win without
      // that risk.
      {
        source: '/media/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=2592000' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      // Legacy Spanish short-links
      { source: '/trabajos',      destination: '/portfolio',       permanent: true },
      { source: '/como-funciona', destination: '/#como-funciona',  permanent: true },
      { source: '/precios',       destination: '/#precios',         permanent: true },
      { source: '/contacto',      destination: '/#contacto',        permanent: true },
      // Phase 3 — retire Spanish homepage
      { source: '/es',            destination: '/',                permanent: true },
      // Phase 5 — ejemplos → portfolio
      { source: '/ejemplos',      destination: '/portfolio',       permanent: true },
      // Retired trade/vertical landings — consolidated into /letsbuild.
      { source: '/diseno-web-fontaneros',    destination: '/letsbuild', permanent: false },
      { source: '/diseno-web-electricistas', destination: '/letsbuild', permanent: false },
      { source: '/diseno-web-reformas',      destination: '/letsbuild', permanent: false },
      { source: '/diseno-web-mudanzas',      destination: '/letsbuild', permanent: false },
      { source: '/web-design-plumbers',      destination: '/letsbuild', permanent: false },
      { source: '/web-design-electricians',  destination: '/letsbuild', permanent: false },
      { source: '/web-design-contractors',   destination: '/letsbuild', permanent: false },
      { source: '/web-design-movers',        destination: '/letsbuild', permanent: false },
      { source: '/quote',                    destination: '/letsbuild', permanent: false },
      // Phase 7 — legal pages translated to English, Spanish slugs retired
      { source: '/aviso-legal',         destination: '/legal-notice',   permanent: true },
      { source: '/politica-privacidad', destination: '/privacy-policy', permanent: true },
      { source: '/condiciones-uso',     destination: '/terms',          permanent: true },
      // Phase 8 — onboarding split into /start (public discovery) and
      // /signup (private paid flow, was /registro); query params (?plan=,
      // ?lang=) are passed through automatically.
      { source: '/registro',            destination: '/signup',         permanent: true },
      // Consolidated landing pages — everything points to /letsbuild for now.
      // Temporary (307) so it can be reverted without cached permanent redirects.
      { source: '/presupuesto',  destination: '/letsbuild', permanent: false },
      { source: '/agency',       destination: '/letsbuild', permanent: false },
      { source: '/websites',     destination: '/letsbuild', permanent: false },
      { source: '/newwebsite',   destination: '/letsbuild', permanent: false },
    ]
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [390, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 380],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'wdnwacdkoowrrnyaskjl.supabase.co' },
    ],
  },
}

export default nextConfig
