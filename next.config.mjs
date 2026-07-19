/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
  },
  async redirects() {
    return [
      { source: '/trabajos',      destination: '/ejemplos',        permanent: true },
      { source: '/como-funciona', destination: '/#como-funciona',  permanent: true },
      { source: '/precios',       destination: '/#precios',         permanent: true },
      { source: '/contacto',      destination: '/#contacto',        permanent: true },
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
