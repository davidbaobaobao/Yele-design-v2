# CLAUDE.md — Spanish SME Website Generator
# v5.0 · Abril 2026

## Always Do First
- **Read BUILD.md** before writing a single line of code. Every client brief lives there.
  If BUILD.md does not exist, stop and ask for it.
- **Check BUILD.md for dynamic sections** — any section marked `dynamic: true` must fetch
  from Supabase, not use hardcoded content. See Dynamic Sections below.
- **Check `brand_assets/`** for logos, photos, and any uploaded assets.
  Use them. Do not use placeholders where real assets are available.

---

## Project Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Fonts**: Google Fonts — loaded via next/font. Never system fonts.
- **Images**: next/image with proper alt text in Spanish
- **Database**: Supabase (for dynamic sections only — see Dynamic Sections below)
- **Dev server**: `npm run dev` at `http://localhost:3000`
- **Deploy**: Vercel (`vercel deploy`)
- **Language**: Spanish everywhere. No English in UI, copy, labels, or meta tags.

---

## BUILD.md Contract
BUILD.md is the single source of truth for each client. It contains:
- Business identity and real contact details
- All real content (services, prices, hours, testimonials)
- Anti-patterns specific to this client
- Dynamic section flags (which sections fetch from Supabase)

**If real content exists in BUILD.md, use it.**
**Never use Lorem ipsum, placeholder names, or invented services in production builds.**
**Never use "Your Business Name" or "Add your text here" in any output.**

---

## Dynamic Sections — Supabase Integration

This is critical. Read this section before building any client site.

Some sections in BUILD.md are marked `dynamic: true` with a `table:` field.
These sections must fetch their content from Supabase at runtime.
They must NOT use hardcoded content from BUILD.md.

The client manages this content from their dashboard at app.yele.design.
When they add, edit, or remove items, the live site updates automatically within 60 seconds.

### Environment variables required for every client project

Create `.env.local` in the project root:
```
NEXT_PUBLIC_SUPABASE_URL=https://wdnwacdkoowrrnyaskjl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon key — get from David]
NEXT_PUBLIC_CLIENT_ID=[client UUID from Supabase clients table]
```

### Supabase client — create once per project

Create `lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

Install if needed: `npm install @supabase/supabase-js`

### Dynamic section pattern — use this exactly

Every section marked `dynamic: true` in BUILD.md must be a Next.js
server component using this pattern:

```typescript
import { supabase } from '@/lib/supabase'

// ISR — rebuilds in background every 60 seconds
export const revalidate = 60

export default async function DynamicSection() {
  const { data, error } = await supabase
    .from('TABLE_NAME')           // from BUILD.md table: field
    .select('*')
    .eq('client_id', process.env.NEXT_PUBLIC_CLIENT_ID)
    .eq('visible', true)          // only show visible items
    .order('sort_order', { ascending: true })

  // Always handle empty state — hide section entirely if no data
  if (error || !data || data.length === 0) return null

  return (
    <section>
      {data.map(item => (
        // render each item
      ))}
    </section>
  )
}
```

### Table mapping — which table for each section type

```
MENU / CARTA
  table:  catalog_items
  fields: category, name, description, price, available
  group:  by category (Entrantes / Principales / Postres)
  filter: available = true only
  render: show price_label if exists, else format price as €X.XX

SERVICES / SERVICIOS
  table:  services
  fields: name, description, price, price_label
  filter: visible = true
  render: show price_label if exists, else price — never show null price

TEAM / EQUIPO
  table:  team_members
  fields: name, role, bio, photo_url
  filter: visible = true
  render: photo optional — gracefully handle missing photo_url

TESTIMONIALS / TESTIMONIOS
  table:  testimonials
  fields: author_name, role, body, rating
  filter: visible = true
  render: show stars if rating > 0, role label optional

FAQS
  table:  faqs
  fields: question, answer
  filter: visible = true
  render: accordion pattern, question bold, answer body text

OFFERS / OFERTAS
  table:  offers
  fields: title, description, badge_text, valid_until, active
  filter: active = true
          AND (valid_until IS NULL OR valid_until > NOW())
  render: badge_text as pill, valid_until as "Hasta [date]"

LISTINGS / PROPIEDADES
  table:  listings
  fields: title, type, price, size_m2, rooms, bathrooms,
          location, description, images
  filter: active = true
  render: type as "Venta" / "Alquiler" badge
          price formatted as €XXX.XXX
          images[0] as card thumbnail

GALLERY / GALERÍA
  table:  gallery
  fields: image_url, caption, category
  filter: visible = true
  render: group by category if multiple categories exist
```

### Empty state rule — mandatory

Every dynamic section must handle empty data gracefully:
- If Supabase returns 0 rows → return null (section disappears entirely)
- Never show an empty grid, blank cards, or placeholder text
- Never show "No hay elementos" to the visitor — just hide the section
- The section reappears automatically when the client adds content

### ISR revalidation — mandatory on all dynamic sections

```typescript
export const revalidate = 60
```

This tells Next.js to rebuild the page cache in the background every 60 seconds.
Visitors always get a fast cached page. Client edits appear within 60 seconds.
Never use `revalidate = 0` (disables caching) — this would make every request
hit Supabase directly and slow down the site for visitors.

### Static vs dynamic — decision rule

```
dynamic: true  in BUILD.md → fetch from Supabase, use table: field
dynamic: false in BUILD.md → use hardcoded content from BUILD.md
not specified              → use hardcoded content from BUILD.md

ALWAYS dynamic (client edits these regularly):
  ✓ Food menu / carta
  ✓ Property listings
  ✓ Offers and promotions
  ✓ Gallery photos

USUALLY dynamic (set in workflow):
  ✓ Services list
  ✓ Team members
  ✓ Testimonials
  ✓ FAQs

ALWAYS static (never changes without a rebuild):
  ✗ Hero section (headline, CTA, background)
  ✗ About / story section
  ✗ Contact information (phone, email, address)
  ✗ Navigation and footer
  ✗ Legal pages (aviso legal, privacidad, cookies)
```

### Build order for projects with dynamic sections

1. Set up `.env.local` with Supabase credentials first
2. Create `lib/supabase.ts`
3. Build all static sections as normal (from BUILD.md)
4. Build dynamic sections last, using the fetch pattern above
5. Test each dynamic section with real data from Supabase
6. Confirm empty state works (temporarily empty the table, check section hides)
7. Run `npm run build` — fix any errors
8. Deploy to Vercel — confirm dynamic data loads on production URL

---

## Build Process — Always Follow This Order

```
1.  Read BUILD.md completely — client brief, requirements, dynamic section flags
2.  Check brand_assets/ for logos, photos, assets
3.  Check .env.local exists with Supabase credentials (required for dynamic sections)
4.  List all dynamic sections from BUILD.md with their Supabase table names
5.  Build ONE section at a time
6.  Review against checklist
7.  Fix all issues found
8.  Only then move to next section
```

**Section build order (standard):**
```
1. Tailwind config + CSS variables + font setup
2. lib/supabase.ts (if project has dynamic sections)
3. Navigation / Header
4. Hero section (always static)
5. Services / Features section (static or dynamic per BUILD.md)
6. Dynamic sections (menu, listings, team, etc.) — fetch pattern
7. About / Story section (always static)
8. Testimonials (static or dynamic per BUILD.md)
9. Gallery (static or dynamic per BUILD.md)
10. Contact section (phone, WhatsApp, map if required — always static)
11. Footer (with legal links — always static)
12. SEO meta tags on all pages
13. Mobile review pass — full site at 390px
14. Performance check (npm run build — fix any errors)
15. Verify dynamic sections load data in production (check Vercel deployment)
```

---

## Performance & Legal Requirements

**Performance:**
- `next/image` handles WebP/AVIF — never use raw `<img>`
- Declare width and height on every image — CLS < 0.1
- Fonts loaded via `next/font` — never `@import` in CSS
- Lazy load all images below the fold
- Preload only the hero/critical image
- No render-blocking scripts — load third-party scripts `async` or `defer`
- Target: Google PageSpeed 85+ on mobile, CLS < 0.1, LCP < 2.5s
- Dynamic sections use `revalidate = 60` — never 0

**Legal (Spanish law — mandatory on every site):**
```
✓ Aviso Legal page (empresa, CIF, dirección registrada, contacto)
✓ Política de Privacidad page (RGPD compliant)
✓ Cookie banner if using analytics or tracking
✓ Footer links to both legal pages
✓ Contact form with RGPD consent checkbox
```

---

## Contact & CTA Patterns — Spanish SME Specific

Spanish SME clients receive most enquiries via phone and WhatsApp. Prioritise these.

```jsx
// Phone CTA — always clickable
<a href="tel:+34612345678">📞 612 345 678</a>

// WhatsApp CTA — highly effective in Spain
<a href="https://wa.me/34612345678?text=Hola%2C%20me%20gustaría%20más%20información"
   target="_blank" rel="noopener noreferrer">
  Escríbenos por WhatsApp
</a>

// Opening hours — always visible in footer and contact
"Lunes a Viernes: 9:00 – 14:00 y 16:00 – 20:00"
"Sábados: 10:00 – 14:00"
"Domingos: Cerrado"
```

---

## Language Rules — Spanish Everywhere

All user-facing text must be in Spanish. No exceptions.

**UI elements:**
- Buttons: "Llámanos", "Contáctanos", "Ver más", "Reservar", "Enviar mensaje", "Solicitar presupuesto"
- Navigation: "Inicio", "Servicios", "Sobre nosotros", "Contacto", "Galería"
- Forms: "Nombre", "Teléfono", "Mensaje", "Enviar"
- Footer: "Todos los derechos reservados", "Política de privacidad", "Aviso legal"
- Error messages: "Campo obligatorio", "Email no válido"

**SEO meta tags — always in Spanish:**
```html
<title>[Nombre negocio] | [Servicio principal] en [Ciudad]</title>
<meta name="description" content="[2 sentences in Spanish about the business]" />
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
```

**Alt text on all images — in Spanish:**
```html
<Image alt="Interior del restaurante Casa Pepe en Valencia" ... />
<Image alt="Sara García, instructora de snowboard certificada en Sierra Nevada" ... />
```

**Legal requirements (Spanish law):**
Every site must include in the footer:
- Link to "Política de privacidad" (RGPD compliance)
- Link to "Aviso legal" (business identity: name, CIF, registered address)
- Cookie consent if analytics are used

---

## Accessibility — Priority 1 (CRITICAL)
```
Contrast:       4.5:1 minimum for normal text, 3:1 for large text
Alt text:       Every image — descriptive, in Spanish, never "image of..."
Focus rings:    Visible on every interactive element
                NEVER remove focus rings — keyboard users depend on them
Keyboard nav:   Tab order matches visual order
Aria labels:    Every icon-only button needs aria-label in Spanish
Skip links:     Add "Saltar al contenido principal" as first focusable element
Heading order:  h1 → h2 → h3 — never skip levels
Color not only: Never convey information by color alone — add icon or text
Form labels:    Every input has a visible <label> — never placeholder-only
```

**Form UX Rules:**
```
Validation:      Validate on blur — not on every keystroke
Error messages:  Place error directly below the field
                 Must state cause + recovery: "Email inválido — comprueba que incluye @"
Input types:     type="email" / type="tel" / type="number" / type="date"
Required fields: Mark with * and explain: "* Campos obligatorios"
Password:        Always include show/hide toggle
Multi-step:      Show step indicator (Paso 1 de 3) and allow going back
Primary CTA:     One primary CTA per section
                 Exception: homepage hero may have phone + WhatsApp as dual CTAs
```

---

## Hard Rules — Never Break These

```
DO NOT leave Lorem ipsum in any production file
DO NOT write English in any user-facing text
DO NOT build the entire site in one pass — build section by section, review each one
DO NOT use raw <img> tags — always next/image
DO NOT add sections or features not specified in BUILD.md
DO NOT use <form> HTML tags in React — use event handlers (onClick, onChange)
DO NOT generate only the success state — implement loading, empty, and error states
DO NOT remove focus rings — keyboard accessibility is mandatory
DO NOT convey information by color alone — always add icon or text
DO NOT validate forms on keystroke — validate on blur
DO NOT hardcode content in dynamic sections — always fetch from Supabase
DO NOT use revalidate = 0 on dynamic sections — always use revalidate = 60
DO NOT show empty grids or blank sections — return null if no Supabase data
```

**Anti-AI Copywriting — Banned Words:**
```
Banned words:    Elevate, Seamless, Unleash, Next-Gen, Game-changer,
                 Delve, Tapestry, "In the world of...", Revolutionary,
                 Cutting-edge, Leverage, Holistic, Synergy, Empower

Banned patterns: Round numbers (use 47.2% not 50%, use €189 not €200)
                 Generic names (use María García, not Jane Smith / John Doe)
                 Exclamation marks in premium brand copy (!!! = unprofessional)

Write:           Plain, specific, honest language
                 "Aprende a leer la montaña" — not "Eleva tu experiencia"
                 "Respondo en 24 horas" — not "Atención al cliente seamless"
```

---

## File Structure
```
/
├── CLAUDE.md                    ← this file
├── BUILD.md                     ← client brief (one per project)
├── brand_assets/
│   ├── logo.svg (or .png)       ← client logo
│   └── photos/                  ← client photography assets
├── reference-components/
│   └── [frontend reference files]
├── lib/
│   └── supabase.ts              ← Supabase client (only if dynamic sections exist)
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── contacto/page.tsx
│   └── servicios/page.tsx
├── components/
│   ├── Navigation.tsx
│   ├── Hero.tsx
│   ├── Services.tsx             ← static or dynamic per BUILD.md
│   ├── Menu.tsx                 ← dynamic (catalog_items) if restaurant
│   ├── Listings.tsx             ← dynamic (listings) if inmobiliaria
│   ├── Team.tsx                 ← dynamic (team_members) if applicable
│   ├── Testimonials.tsx         ← dynamic (testimonials) if applicable
│   ├── Gallery.tsx              ← dynamic (gallery) if applicable
│   ├── FAQs.tsx                 ← dynamic (faqs) if applicable
│   ├── Offers.tsx               ← dynamic (offers) if applicable
│   ├── About.tsx
│   ├── Contact.tsx
│   └── Footer.tsx
├── public/images/
├── tailwind.config.js
├── next.config.js
└── .env.local                   ← NEVER commit this — contains Supabase keys
```
