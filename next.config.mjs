/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/trabajos',      destination: '/ejemplos',        permanent: true },
      { source: '/como-funciona', destination: '/#como-funciona',  permanent: true },
      { source: '/precios',       destination: '/#precios',         permanent: true },
      { source: '/contacto',      destination: '/#contacto',        permanent: true },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'wdnwacdkoowrrnyaskjl.supabase.co',
      },
    ],
  },
}

export default nextConfig
