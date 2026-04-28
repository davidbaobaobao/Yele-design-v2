# BUILD.md — yele.design
# Marketing site for Yele web design subscription service
# Generated: Abril 2026 · v1.0

---

## Business Identity

```
Nombre:         Yele
Dominio:        yele.design
Email:          info@yele.design
Tipo:           Servicio de diseño y mantenimiento web por suscripción
Mercado:        PYMEs y autónomos españoles
CIF:            [Añadir antes de publicar]
Dirección:      [Añadir antes de publicar]
```

---

## Language

Este sitio es **bilingüe ES/EN**.
- Idioma por defecto: **Español**
- Toggle EN disponible en nav — todas las cadenas de texto tienen versión en inglés
- Implementar con un contexto React (`LanguageContext`) o con un estado global simple
- Las páginas legales (Aviso Legal, Política de Privacidad) son **solo en español** — no tienen versión EN
- Meta tags SEO: en español para la versión ES, en inglés para la versión EN

---

## Design System

Este sitio usa el diseño generado por Emergent AI. Respeta estrictamente:

```
Aesthetic:      Apple.com minimalism + Swiss precision
Theme:          Light (fondo blanco/off-white)
Fonts:          Outfit (headings) + Manrope (body) — cargar vía next/font/google
                NUNCA usar Inter, Space Grotesk, ni fuentes del sistema
Colors:
  --bg:           #FFFFFF
  --bg-secondary: #F5F5F7
  --glass:        rgba(255,255,255,0.72)
  --text-primary: #1D1D1F
  --text-secondary: #86868B
  --accent:       #000000
  --interactive:  #0066CC
  --success:      #34C759
  --border:       rgba(0,0,0,0.08)

Motion:
  - Lenis para smooth scroll (obligatorio)
  - Framer Motion para fade-up y stagger en scroll
  - Cards: hover lift -translate-y-1 + sombra sutil
  - Botones: active:scale-95
  - Header: glassmorphism backdrop-blur-xl bg-white/70

Border radius:  rounded-2xl / rounded-3xl en bento boxes
                rounded (4-8px) en botones y inputs
```

---

## Stack

```
Framework:    Next.js 14 (App Router) — NO crear como React SPA
Styling:      Tailwind CSS
Fonts:        next/font/google — Outfit + Manrope
Images:       next/image — siempre, nunca <img>
Icons:        lucide-react o @phosphor-icons/react
Motion:       framer-motion + @studio-freight/lenis
Database:     Supabase (solo para sección Showcase)
Deploy:       Vercel
Language:     Bilingüe ES/EN (ES por defecto)
```

---

## Pages

```
/                   → Página principal (todas las secciones)
/aviso-legal        → Aviso Legal (solo ES)
/politica-privacidad → Política de Privacidad (solo ES)
```

---

## Sections — Build Order

### 1. Nav / Header

```
Type:     Static
Style:    Glassmorphism sticky — backdrop-blur-xl, bg-white/70, 1px border-white/20
Height:   72px desktop, 60px mobile
Content:
  Izquierda: Wordmark "Yele" en Outfit 600, texto negro
  Centro/Derecha: links + toggle + CTA

Links (ES):   "Cómo funciona"  →  #como-funciona
              "Trabajos"       →  #trabajos
              "Precios"        →  #precios
Links (EN):   "How it works"   →  #como-funciona
              "Work"           →  #trabajos
              "Pricing"        →  #precios

Language toggle: pill pequeño "ES | EN" — al hacer click alterna idioma
CTA button:   "Empieza ahora" / "Get started" → https://yele.design (auth/onboarding)
              Estilo: pill negro, texto blanco, padding 12px 24px

Mobile:       Hamburger → slide-in desde derecha, items con stagger 50ms
```

---

### 2. Hero

```
Type:     Static
BG:       #FFFFFF o textura abstracta muy sutil (imagen de hero_texture del repo)
Layout:   100vh, contenido centrado verticalmente, flush-left en desktop

Headline ES:
  Línea 1: "Tu web lista"
  Línea 2: "en 3 días."
  Tipografía: Outfit 600, clamp(56px, 8vw, 104px), tracking-tighter, color #1D1D1F

Headline EN:
  Línea 1: "Your website ready"
  Línea 2: "in 3 days."

Subtítulo ES:
  "Diseño profesional, mantenimiento incluido y precios claros.
   Sin agencias, sin complicaciones, sin permanencia."
  Tipografía: Manrope 400, 20px, color #86868B, max-width 520px

Subtítulo EN:
  "Professional design, maintenance included and transparent pricing.
   No agencies, no hassle, no lock-in."

CTA primario:
  ES: "Empieza hoy" / EN: "Start today"
  → https://yele.design (onboarding)
  Estilo: botón negro, texto blanco, rounded-xl, 16px 32px padding

Badges flotantes (glass cards, framer-motion parallax leve):
  Badge 1: "⚡ Entrega en 3–5 días" / "⚡ Delivered in 3–5 days"
  Badge 2: "✓ Sin permanencia" / "✓ No lock-in"
  Badge 3: "€29 / mes" — fijo, sin traducción
  Estilo: glass card rounded-2xl, text-sm, sombra sutil, posición absoluta decorativa
```

---

### 3. Cómo funciona

```
Type:     Static
id:       como-funciona
Layout:   Sticky scroll — izquierda sticky (título + descripción intro),
          derecha: pasos que van apareciendo con scroll

Título ES: "Tan sencillo como debería ser."
Título EN: "As simple as it should be."

Intro ES:  "Tres pasos para tener tu web en marcha. Sin reuniones interminables, sin presupuestos sorpresa."
Intro EN:  "Three steps to get your website live. No endless meetings, no surprise costs."

Paso 1:
  Número:   01
  ES título: "Cuéntanos tu negocio"
  ES desc:   "Rellenas un formulario breve. Nos dices qué haces, a quién, y cómo quieres que te vean."
  EN título: "Tell us about your business"
  EN desc:   "Fill out a short form. Tell us what you do, who you serve, and how you want to be seen."

Paso 2:
  Número:   02
  ES título: "Nosotros construimos"
  ES desc:   "En 3–5 días tienes un sitio profesional, adaptado a tu sector, con tu contenido real."
  EN título: "We build it"
  EN desc:   "In 3–5 days you have a professional site, tailored to your industry, with your real content."

Paso 3:
  Número:   03
  ES título: "Tú te centras en tu trabajo"
  ES desc:   "Actualizamos, mantenemos y mejoramos tu web. Tú no tocas código. Nunca."
  EN título: "You focus on your work"
  EN desc:   "We update, maintain and improve your website. You never touch the code."

Estilo pasos: cards #F5F5F7, rounded-2xl, Outfit para número grande en --text-secondary,
              Manrope para título y descripción. Framer Motion fade-up en scroll.
```

---

### 4. Showcase / Trabajos

```
Type:     Dynamic → table: gallery
id:       trabajos
dynamic:  true

Layout:   Bento grid "Tetris" — mezcla de cards cuadradas y rectangulares
          Grid de 12 columnas, cards de tamaño variable (2col, 3col, 4col, etc.)
          Parallax sutil en imágenes dentro de overflow-hidden containers

Supabase fields usados:
  image_url   → imagen del sitio construido (screenshot o foto del negocio)
  caption     → nombre del negocio (ej. "El Taller · Cerámica, Gràcia")
  category    → tipo de negocio (ej. "Restauración", "Salud", "Comercio")

Fallback hardcoded (usar si Supabase devuelve 0 filas):
  Usar las imágenes del design_guidelines.json:
  - Cerámica en Gràcia (showcase_ceramics_gracia)
  - Bar de tapas Barcelona (showcase_tapas_barcelona)
  - Estudio de yoga (showcase_yoga_studio)
  - Despacho de abogados (showcase_law_firm)
  - Fontanero Bilbao (showcase_plumber_bilbao)

  IMPORTANTE: En este caso específico, si no hay datos en Supabase,
  mostrar el fallback hardcoded — NO devolver null.
  El showcase siempre debe tener contenido.

Título ES: "Webs que hemos construido."
Título EN: "Websites we've built."
Subtítulo ES: "Para negocios reales, en toda España."
Subtítulo EN: "For real businesses, all across Spain."

Image URLs fallback:
  https://images.pexels.com/photos/32212371/pexels-photo-32212371.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940
  https://images.pexels.com/photos/21327986/pexels-photo-21327986.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940
  https://images.pexels.com/photos/4327023/pexels-photo-4327023.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940
  https://images.unsplash.com/photo-1635845080335-dcfe06a0fcf1?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85
  https://images.unsplash.com/photo-1649769069590-268b0b994462?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85
```

---

### 5. Precios

```
Type:     Static
id:       precios
BG:       #F5F5F7 o blanco — sección que contrasta visualmente con anterior

Título ES: "Sin letra pequeña."
Título EN: "No fine print."
Subtítulo ES: "Elige tu plan. Cambia cuando quieras."
Subtítulo EN: "Choose your plan. Change whenever you want."

Plan 1 — Básica:
  Precio:   €29/mes
  ES nombre: "Básica"
  EN nombre: "Basic"
  ES desc:   "Para autónomos y negocios que necesitan presencia online clara y profesional."
  EN desc:   "For freelancers and businesses that need a clear, professional online presence."
  Incluye ES:
    - Web de hasta 5 secciones
    - Diseño personalizado
    - Adaptado a móvil
    - Mantenimiento incluido
    - Cambios de contenido en 48h
  Incluye EN:
    - Website up to 5 sections
    - Custom design
    - Mobile-ready
    - Maintenance included
    - Content updates in 48h
  Estilo: card #F5F5F7 o blanco, sin elevación especial

Plan 2 — Profesional: ← DESTACADO
  Precio:   €49/mes
  ES nombre: "Profesional"
  EN nombre: "Professional"
  ES desc:   "Para negocios que quieren destacar y convertir más visitas en clientes."
  EN desc:   "For businesses that want to stand out and convert more visitors into clients."
  Incluye ES:
    - Todo lo de Básica
    - Web de hasta 10 secciones
    - Blog o sección de noticias
    - Formulario de contacto avanzado
    - SEO básico incluido
    - Cambios prioritarios en 24h
  Incluye EN:
    - Everything in Basic
    - Website up to 10 sections
    - Blog or news section
    - Advanced contact form
    - Basic SEO included
    - Priority updates in 24h
  Badge ES: "Más elegido" / EN: "Most popular"
  Estilo: card negro (bg #1D1D1F), texto blanco, elevada, ring o sombra destacada

Plan 3 — Avanzada:
  Precio:   €89/mes
  ES nombre: "Avanzada"
  EN nombre: "Advanced"
  ES desc:   "Para negocios con necesidades específicas: tienda, reservas, multiidioma."
  EN desc:   "For businesses with specific needs: shop, bookings, multilanguage."
  Incluye ES:
    - Todo lo de Profesional
    - Funcionalidades a medida
    - Integración con reservas o tienda
    - Soporte prioritario
    - Cambios en 12h
  Incluye EN:
    - Everything in Professional
    - Custom functionality
    - Bookings or shop integration
    - Priority support
    - Updates in 12h
  Estilo: card #F5F5F7 o blanco, sin elevación especial

CTA en cada card:
  ES: "Empezar" / EN: "Get started"
  → https://yele.design (onboarding)

Nota bajo precios:
  ES: "Sin permanencia. Cancela cuando quieras."
  EN: "No lock-in. Cancel anytime."
```

---

### 6. Tabla Comparativa

```
Type:     Static

Título ES: "¿Por qué no una agencia o hacerlo tú mismo?"
Título EN: "Why not an agency or DIY?"

Columnas: Yele · Agencia · Tú mismo (DIY)

Filas ES / EN:
  Tiempo hasta tener la web:     3–5 días / 6–12 semanas / Semanas o meses
  Precio mensual:                Desde €29 / €500–€3.000 (proyecto) / Tiempo tuyo
  Mantenimiento incluido:        ✓ / ✗ extra / ✓ si sabes cómo
  Diseño profesional:            ✓ / ✓ / Depende
  Sin conocimientos técnicos:    ✓ / ✓ / ✗
  Cambios de contenido:          En 24–48h / Presupuesto aparte / Tú mismo
  Sin permanencia:               ✓ / ✗ contratos / ✓

Estilo: tabla limpia, filas alternas #F5F5F7/blanco, columna Yele destacada
        con fondo muy sutil o header en negro, checks en #34C759, cruces en #86868B
```

---

### 7. Testimonios

```
Type:     Static (hardcoded — 4 testimonios reales o representativos)

Título ES: "Lo que dicen nuestros clientes."
Título EN: "What our clients say."

Layout: Marquee de cards — animación horizontal continua, pausar en hover
        O bento 2x2 en desktop, scroll en mobile

Testimonio 1:
  Autor ES: "Sara M."
  Rol ES:   "Instructora de yoga, Madrid"
  Rol EN:   "Yoga instructor, Madrid"
  Texto ES: "Tenía la web pendiente desde hacía dos años. Con Yele la tuve lista en cuatro días. Ahora mis alumnas me encuentran en Google."
  Texto EN: "I'd been putting off my website for two years. Yele had it ready in four days. Now my students find me on Google."

Testimonio 2:
  Autor ES: "Carlos R."
  Rol ES:   "Fontanero autónomo, Bilbao"
  Rol EN:   "Self-employed plumber, Bilbao"
  Texto ES: "Pensé que tener web era complicado y caro. Por €29 al mes tengo algo que parece de empresa grande."
  Texto EN: "I thought having a website was complicated and expensive. For €29 a month I have something that looks like a big company."

Testimonio 3:
  Autor ES: "Elena T."
  Rol ES:   "Propietaria de estudio de cerámica, Gràcia"
  Rol EN:   "Ceramics studio owner, Gràcia"
  Texto ES: "El proceso fue rapidísimo. Me hicieron preguntas concretas, y tres días después tenía una web que realmente me representa."
  Texto EN: "The process was incredibly fast. They asked me specific questions, and three days later I had a website that truly represents me."

Testimonio 4:
  Autor ES: "Miguel A."
  Rol ES:   "Abogado, Valencia"
  Rol EN:   "Lawyer, Valencia"
  Texto ES: "Necesitaba algo serio, no un template de Wix. Yele entendió eso desde el primer mensaje."
  Texto EN: "I needed something serious, not a Wix template. Yele understood that from the first message."

Estilo: cards blancas, rounded-2xl, sombra sutil 0 4px 24px rgba(0,0,0,0.08),
        autor en Outfit 500, rol en Manrope text-secondary, texto en Manrope 400
```

---

### 8. Footer

```
Type:     Static
BG:       #F5F5F7 o #1D1D1F (versión oscura — elegir una que contraste con la sección anterior)

Contenido izquierda:
  Wordmark "Yele" en Outfit 600
  ES: "Diseño web para negocios españoles."
  EN: "Web design for Spanish businesses."
  Email: info@yele.design (enlace mailto)

Contenido derecha / links:
  ES: "Aviso Legal" → /aviso-legal
  ES: "Política de Privacidad" → /politica-privacidad
  EN: "Legal Notice" → /aviso-legal
  EN: "Privacy Policy" → /politica-privacidad

Copyright:
  ES: "© 2026 Yele. Todos los derechos reservados."
  EN: "© 2026 Yele. All rights reserved."

Nota importante: Las páginas legales son solo en español
```

---

### Página: Aviso Legal (`/aviso-legal`)

```
Type:   Static · Solo español · NO tiene versión EN

Contenido mínimo legal requerido:
  Titular: [Nombre completo o razón social]
  CIF/NIF: [Añadir]
  Domicilio: [Añadir]
  Email: info@yele.design
  Web: yele.design

  "En cumplimiento de la Ley 34/2002, de 11 de julio,
  de Servicios de la Sociedad de la Información y del Comercio Electrónico..."

  Secciones: Datos del titular · Objeto · Propiedad intelectual ·
             Limitación de responsabilidad · Ley aplicable

Layout: página simple, max-width 720px, Manrope 400, headings en Outfit,
        nav y footer iguales al resto del sitio
```

---

### Página: Política de Privacidad (`/politica-privacidad`)

```
Type:   Static · Solo español · NO tiene versión EN

Contenido mínimo RGPD requerido:
  Responsable del tratamiento: [Nombre/razón social + CIF]
  Finalidad: gestión de solicitudes y prestación del servicio
  Legitimación: consentimiento del interesado (Art. 6.1.a RGPD)
  Destinatarios: no se ceden datos a terceros salvo obligación legal
  Derechos: acceso, rectificación, supresión, oposición, portabilidad
  Contacto para ejercer derechos: info@yele.design
  Plazo de conservación: mientras dure la relación contractual

  Cookies: el sitio puede usar cookies de análisis (si se añade analytics).
           Si no hay analytics, indicar que solo se usan cookies técnicas.

Layout: igual que Aviso Legal — max-width 720px, tipografía limpia
```

---

## Anti-Patterns — Never Do This

```
✗ No usar gradientes morado→azul ni ningún gradiente genérico SaaS
✗ No usar ilustraciones isométricas con personajes y portátiles
✗ No usar avatares de stock en testimonios (solo iniciales o nombre)
✗ No mostrar precios tachados con "oferta" ficticia
✗ No usar copy con: "potencia", "transforma", "solución integral", "eleva"
✗ No usar Poppins, Nunito, ni ninguna fuente redondeada
✗ No usar <img> — siempre next/image
✗ No dejar Lorem ipsum en ningún archivo de producción
✗ No hardcodear el showcase si hay datos en Supabase
✗ No mostrar el showcase vacío — siempre usar fallback hardcoded si Supabase devuelve 0 filas
✗ No añadir secciones no especificadas en este BUILD.md
✗ No usar revalidate = 0 en secciones dinámicas
✗ No usar <form> HTML — siempre event handlers React (onClick, onChange)
```

---

## SEO Meta Tags

```
ES:
  title:       "Yele — Tu web lista en 3 días | Diseño web por suscripción"
  description: "Diseño web profesional para PYMEs y autónomos españoles.
                Entrega en 3–5 días, mantenimiento incluido, desde €29/mes. Sin permanencia."
  og:title:    "Yele — Tu web lista en 3 días"
  og:description: "Diseño web por suscripción para negocios españoles. Desde €29/mes."

EN:
  title:       "Yele — Your website ready in 3 days | Web design subscription"
  description: "Professional web design for Spanish SMEs and freelancers.
                Delivered in 3–5 days, maintenance included, from €29/month. No lock-in."
```

---

## Environment Variables (solo para sección Showcase)

```
NEXT_PUBLIC_SUPABASE_URL=https://wdnwacdkoowrrnyaskjl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon key]
NEXT_PUBLIC_CLIENT_ID=[UUID de Yele en tabla clients — o usar query sin client_id filter]
```

Nota: El showcase de Yele puede no tener `client_id` específico si las entradas de galería
son globales. En ese caso, omitir el filtro `.eq('client_id', ...)` y traer todos los
registros de `gallery` con `visible = true`.

---

## Reference Assets (from design_guidelines.json)

```
Hero texture:
  https://images.pexels.com/photos/7640903/pexels-photo-7640903.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940

Showcase fallback images (usar en orden si Supabase vacío):
  1. https://images.pexels.com/photos/32212371/pexels-photo-32212371.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940
  2. https://images.pexels.com/photos/21327986/pexels-photo-21327986.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940
  3. https://images.pexels.com/photos/4327023/pexels-photo-4327023.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940
  4. https://images.unsplash.com/photo-1635845080335-dcfe06a0fcf1?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85
  5. https://images.unsplash.com/photo-1649769069590-268b0b994462?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85
```

---

## Dependencies to Install

```bash
npm install @supabase/supabase-js
npm install framer-motion
npm install @studio-freight/lenis
npm install lucide-react
# or: npm install @phosphor-icons/react
```

---

*BUILD.md · yele.design · Abril 2026*
