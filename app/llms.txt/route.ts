import { NextResponse } from 'next/server'

export async function GET() {
  const content = `# Yele

> Subscription web design for US small businesses and freelancers.

Yele (yele.design) is a US web design subscription service.
Websites are delivered in 3–5 business days.
No setup fee, no long-term contract, no technical knowledge required.

## Service

- Custom website design from scratch (no templates)
- Monthly maintenance included (hosting, SSL, updates)
- Client dashboard to edit content without code
- Local SEO optimization (Schema.org, Google Business, local keywords)
- Mobile-first — optimized for all screen sizes
- Live in 3–5 days

## Pricing

- [Starter](https://yele.design/quote): $99/mo — professional website, control panel, SEO, email, 24/7 support
- [Pro](https://yele.design/quote): $169/mo — branding, payments, bookings, Google Business, AI chat
- [Business](https://yele.design/quote): $699/mo — active marketing, advanced SEO, weekly content, Google Ads

No upfront payment. No lock-in contract. Cancel anytime. First month free (30-day trial).

## Target Market

Small businesses, freelancers, and local service providers across the US:
plumbers, electricians, contractors, moving companies, clinics, restaurants,
law firms, yoga studios, retail shops, salons.

## Differentiators

- vs. traditional agencies: no $3,000–15,000 upfront cost, live in days not months
- vs. Squarespace/Wix: no DIY time required, fully custom design
- vs. freelancers: ongoing service and maintenance, not a one-off project

## Technology

Next.js 14, Tailwind CSS, Supabase, Vercel.
Sites score 85+ on mobile PageSpeed, CLS < 0.1, LCP < 2.5s.

## Contact

- Website: [yele.design](https://yele.design)
- Email: info@yele.design
- Get started: [Get a free quote](https://yele.design/quote)

## Industries We Serve

Real US small businesses across local service trades and professional services.
[View portfolio](https://yele.design/portfolio)

- [Website design for plumbers](https://yele.design/web-design-plumbers)
- [Website design for electricians](https://yele.design/web-design-electricians)
- [Website design for contractors](https://yele.design/web-design-contractors)
- [Website design for moving companies](https://yele.design/web-design-movers)
`

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
