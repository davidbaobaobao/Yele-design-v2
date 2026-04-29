'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

/* ─────────────────────────────────────────────
   Icon paths  (Heroicons v2 outline, 24×24)
───────────────────────────────────────────── */
const P = {
  wrench: 'M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z',
  bolt: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
  pencil: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10',
  brush: 'M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42',
  scissors: 'M7.848 8.25l1.536.887M7.848 8.25a3 3 0 11-5.196-3 3 3 0 015.196 3zm1.536.887a2.165 2.165 0 011.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 11-5.196 3 3 3 0 015.196-3zm1.536-.887a2.165 2.165 0 001.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863l2.077-1.199m0-3.328a4.323 4.323 0 012.068-1.379l5.325-1.628a4.5 4.5 0 012.48-.044l.803.215-7.794 4.5m-2.882-1.664A4.331 4.331 0 0010.607 12m3.736 0l7.794 4.5-.802.215a4.5 4.5 0 01-2.48-.043l-5.326-1.629a4.324 4.324 0 01-2.068-1.379M14.343 12l-2.882 1.664',
  sparkles: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z',
  heart: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z',
  shield: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
  chat: 'M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z',
  sun: 'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z',
  fire: 'M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z',
  trophy: 'M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0',
  book: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25',
  star: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z',
  bag: 'M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z',
  building: 'M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z',
  briefcase: 'M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z',
  scale: 'M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97zm-16.5 0c1.01.143 2.01.317 3 .52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.97z',
  camera: 'M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z',
  swatch: 'M4.098 19.902a3.75 3.75 0 005.304 0l6.401-7.16a4.5 4.5 0 00-6.364-6.364L4.553 11.46c-.261.27-.49.566-.677.88M4.098 19.902a3.75 3.75 0 01-5.304 0 3.75 3.75 0 010-5.304l5.304-5.304m7.072 7.072l1.06 1.06a3.75 3.75 0 005.304-5.304l-1.06-1.06m-5.304 5.304a3.75 3.75 0 01-5.304 0',
  plus: 'M12 4.5v15m7.5-7.5h-15',
}

function Icon({ d, size = 20 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {d.split(' M').map((seg, i) => (
        <path key={i} d={i === 0 ? seg : 'M' + seg} />
      ))}
    </svg>
  )
}

/* ─────────────────────────────────────────────
   Sector data
───────────────────────────────────────────── */
const SECTORES = [
  { id: 'Fontanero / Instalaciones',    label: 'Fontanero',       icon: P.wrench    },
  { id: 'Electricista',                 label: 'Electricista',    icon: P.bolt      },
  { id: 'Carpintero / Reformas',        label: 'Carpintero',      icon: P.pencil    },
  { id: 'Pintor',                       label: 'Pintor',          icon: P.brush     },
  { id: 'Peluquería / Barbería',        label: 'Peluquería',      icon: P.scissors  },
  { id: 'Estética / Spa / Belleza',     label: 'Estética / Spa',  icon: P.sparkles  },
  { id: 'Fisioterapeuta / Clínica',     label: 'Fisioterapeuta',  icon: P.heart     },
  { id: 'Dentista',                     label: 'Dentista',        icon: P.shield    },
  { id: 'Veterinario',                  label: 'Veterinario',     icon: P.heart     },
  { id: 'Médico / Especialista',        label: 'Médico',          icon: P.shield    },
  { id: 'Psicólogo',                    label: 'Psicólogo',       icon: P.chat      },
  { id: 'Yoga / Pilates / Bienestar',   label: 'Yoga / Pilates',  icon: P.sun       },
  { id: 'Entrenador personal / Gym',    label: 'Entrenador',      icon: P.fire      },
  { id: 'Instructor de deporte',        label: 'Deporte',         icon: P.trophy    },
  { id: 'Restaurante / Bar / Cafetería',label: 'Restaurante',     icon: P.fire      },
  { id: 'Panadería / Pastelería',       label: 'Panadería',       icon: P.sparkles  },
  { id: 'Academia / Clases particulares',label:'Academia',        icon: P.book      },
  { id: 'Guardería / Educación infantil',label:'Guardería',       icon: P.star      },
  { id: 'Tienda local / Comercio',      label: 'Tienda',          icon: P.bag       },
  { id: 'Inmobiliaria',                 label: 'Inmobiliaria',    icon: P.building  },
  { id: 'Asesoría / Gestoría',          label: 'Asesoría',        icon: P.briefcase },
  { id: 'Abogado',                      label: 'Abogado',         icon: P.scale     },
  { id: 'Fotógrafo',                    label: 'Fotógrafo',       icon: P.camera    },
  { id: 'Diseñador / Creativo',         label: 'Diseñador',       icon: P.swatch    },
  { id: 'Taller / Estudio creativo',    label: 'Taller Creativo', icon: P.brush     },
  { id: 'Otro',                         label: 'Otro',            icon: P.plus      },
]

/* ─────────────────────────────────────────────
   Estilo visual data
───────────────────────────────────────────── */
const ESTILOS = [
  { id: 'Elegante y minimalista',       label: 'Elegante',        desc: 'Minimalista y limpio',      icon: P.sparkles  },
  { id: 'Cálido y cercano',             label: 'Cálido',          desc: 'Próximo y familiar',        icon: P.sun       },
  { id: 'Moderno y tecnológico',        label: 'Moderno',         desc: 'Tech y contemporáneo',      icon: P.bolt      },
  { id: 'Clásico y tradicional',        label: 'Clásico',         desc: 'Atemporal y serio',         icon: P.shield    },
  { id: 'Atrevido y llamativo',         label: 'Atrevido',        desc: 'Impactante y memorable',   icon: P.star      },
  { id: 'Sin preferencia — decide tú',  label: 'Sorpréndeme',     desc: 'Tú decides el estilo',      icon: P.swatch    },
]

/* ─────────────────────────────────────────────
   Shared styles
───────────────────────────────────────────── */
const inputClass = 'w-full bg-white border border-black/[0.12] rounded-xl px-4 py-3 font-manrope text-sm text-[#1D1D1F] placeholder-[#86868B] focus:outline-none focus:border-[#1D1D1F] transition-colors'
const labelClass = 'font-manrope text-xs text-[#86868B] mb-1.5 block'
const errorClass = 'font-manrope text-xs text-red-500 mt-1'

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
type FormData = {
  nombre_negocio: string
  sector: string
  ciudad: string
  direccion: string
  nombre_contacto: string
  telefono: string
  email: string
  web_actual: string
  canal_contacto: string
  whatsapp: string
  descripcion: string
  servicios: string
  precio_medio: string
  horario: string
  tiene_logo: string
  tiene_fotos: string
  referencias: string
  estilo_visual: string
  como_nos_conocio: string
  notas: string
  rgpd: boolean
}

/* ═════════════════════════════════════════════
   Page component
═════════════════════════════════════════════ */
export default function EmpezarPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  const stepRef = useRef(step)
  useEffect(() => { stepRef.current = step }, [step])

  // Intercept browser back button
  useEffect(() => {
    window.history.pushState(null, '', window.location.pathname)

    const handlePop = () => {
      // Always re-push so the next back press can be caught too
      window.history.pushState(null, '', window.location.pathname)
      if (stepRef.current > 1) {
        setStep(s => s - 1)
        setErrors({})
      } else {
        if (window.confirm('¿Seguro que quieres salir? Perderás los datos del formulario.')) {
          window.removeEventListener('popstate', handlePop)
          router.push('/')
        }
      }
    }

    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [router])

  const [formData, setFormData] = useState<FormData>({
    nombre_negocio: '',
    sector: '',
    ciudad: '',
    direccion: '',
    nombre_contacto: '',
    telefono: '',
    email: '',
    web_actual: '',
    canal_contacto: '',
    whatsapp: '',
    descripcion: '',
    servicios: '',
    precio_medio: '',
    horario: '',
    tiene_logo: '',
    tiene_fotos: '',
    referencias: '',
    estilo_visual: '',
    como_nos_conocio: '',
    notas: '',
    rgpd: false,
  })

  function set(key: keyof FormData, value: string | boolean) {
    setFormData(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }))
  }

  function validateStep(s: number): boolean {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (s === 1) {
      if (!formData.nombre_negocio.trim()) e.nombre_negocio = 'Campo obligatorio'
      if (!formData.sector) e.sector = 'Selecciona tu sector'
      if (!formData.ciudad.trim()) e.ciudad = 'Campo obligatorio'
    }
    if (s === 2) {
      if (!formData.nombre_contacto.trim()) e.nombre_contacto = 'Campo obligatorio'
      if (!formData.telefono.trim()) e.telefono = 'Campo obligatorio'
      if (!formData.email.trim()) e.email = 'Campo obligatorio'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Email inválido'
      if (!formData.canal_contacto) e.canal_contacto = 'Selecciona una opción'
    }
    if (s === 3) {
      if (!formData.descripcion.trim()) e.descripcion = 'Campo obligatorio'
      if (!formData.servicios.trim()) e.servicios = 'Campo obligatorio'
    }
    if (s === 5) {
      if (!formData.rgpd) e.rgpd = 'Debes aceptar la política de privacidad'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function nextStep() {
    if (validateStep(step)) { setStep(s => s + 1); window.scrollTo(0, 0) }
  }
  function prevStep() {
    setStep(s => s - 1)
    setErrors({})
    window.scrollTo(0, 0)
  }

  async function handleSubmit() {
    if (!validateStep(5)) return
    setLoading(true)
    setSubmitError('')
    const { data: { session } } = await supabase.auth.getSession()
    const response = await fetch('/api/intake', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(session?.access_token && { Authorization: `Bearer ${session.access_token}` }),
      },
      body: JSON.stringify(formData),
    })
    if (response.ok) {
      const result = await response.json()
      router.push(`/elegir-plan?client_id=${result.clientId ?? ''}`)
    } else {
      setSubmitError('Error al enviar. Por favor inténtalo de nuevo o escríbenos a info@yele.design')
      setLoading(false)
    }
  }

  const progress = (step / 5) * 100

  return (
    <div className="min-h-screen bg-white px-6 py-12">
      <div className="max-w-xl mx-auto">

        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-1.5 mb-10 focus-visible:outline-none">
          <span className="w-2 h-2 rounded-full bg-[#34C759]" aria-hidden="true" />
          <span className="font-outfit font-semibold text-sm text-[#1D1D1F]">
            yele<span className="text-[#86868B] font-normal">.design</span>
          </span>
        </Link>

        {/* Step indicator with top arrows */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 1}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/[0.05] transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Paso anterior"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <span className="font-manrope text-xs text-[#86868B]">Paso {step} de 5</span>

            <button
              type="button"
              onClick={nextStep}
              disabled={step === 5}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/[0.05] transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Siguiente paso"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          <div className="w-full h-1 bg-black/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1D1D1F] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        {step === 1 && <Step1 formData={formData} set={set} errors={errors} />}
        {step === 2 && <Step2 formData={formData} set={set} errors={errors} />}
        {step === 3 && <Step3 formData={formData} set={set} errors={errors} />}
        {step === 4 && <Step4 formData={formData} set={set} errors={errors} />}
        {step === 5 && <Step5 formData={formData} set={set} errors={errors} />}

        {/* Bottom navigation */}
        <div className="flex items-center justify-between mt-8">
          {step > 1 ? (
            <button type="button" onClick={prevStep} className="font-manrope text-sm text-[#86868B] hover:text-[#1D1D1F] transition-colors cursor-pointer">
              ← Atrás
            </button>
          ) : (
            <Link href="/" className="font-manrope text-sm text-[#86868B] hover:text-[#1D1D1F] transition-colors">
              ← Volver
            </Link>
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={nextStep}
              className="inline-flex items-center gap-2 font-manrope font-medium text-sm bg-[#1D1D1F] text-white px-6 py-3 rounded-xl hover:bg-black transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066CC]"
            >
              Continuar →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center gap-2 font-manrope font-medium text-sm bg-[#1D1D1F] text-white px-6 py-3 rounded-xl hover:bg-black transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0066CC]"
            >
              {loading ? 'Enviando…' : 'Enviar solicitud →'}
            </button>
          )}
        </div>

        {submitError && (
          <p className="font-manrope text-xs text-red-500 text-center mt-4">{submitError}</p>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Shared sub-components
───────────────────────────────────────────── */
type StepProps = {
  formData: FormData
  set: (key: keyof FormData, value: string | boolean) => void
  errors: Partial<Record<keyof FormData, string>>
}

function Field({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode
}) {
  return (
    <div>
      <label className={labelClass}>
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className={errorClass}>{error}</p>}
    </div>
  )
}

function RadioGroup({ label, options, value, onChange }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button key={opt} type="button" onClick={() => onChange(opt)}
            className={`font-manrope text-sm px-4 py-2 rounded-xl border transition-all cursor-pointer ${
              value === opt
                ? 'border-[#1D1D1F] bg-[#1D1D1F] text-white'
                : 'border-black/[0.12] text-[#1D1D1F] hover:border-black/30'
            }`}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Step 1 — Información básica
───────────────────────────────────────────── */
function Step1({ formData, set, errors }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-outfit font-semibold text-2xl text-[#1D1D1F] tracking-tight mb-1">Información básica</h1>
        <p className="font-manrope text-sm text-[#86868B]">Cuéntanos sobre tu negocio.</p>
      </div>

      <Field label="Nombre del negocio" required error={errors.nombre_negocio}>
        <input type="text" className={inputClass} placeholder="ej. Peluquería Montserrat"
          value={formData.nombre_negocio} onChange={e => set('nombre_negocio', e.target.value)} />
      </Field>

      {/* Sector card grid */}
      <div>
        <label className={labelClass}>
          Sector<span className="text-red-500 ml-0.5">*</span>
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {SECTORES.map(s => {
            const selected = formData.sector === s.id
            return (
              <button key={s.id} type="button" onClick={() => set('sector', s.id)}
                className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border text-center transition-all cursor-pointer ${
                  selected
                    ? 'border-[#1D1D1F] bg-[#1D1D1F] text-white'
                    : 'border-black/[0.10] hover:border-black/25 text-[#1D1D1F]'
                }`}>
                <Icon d={s.icon} size={18} />
                <span className="font-manrope text-[10px] leading-tight">{s.label}</span>
              </button>
            )
          })}
        </div>
        {errors.sector && <p className={errorClass}>{errors.sector}</p>}
      </div>

      <Field label="Ciudad y provincia" required error={errors.ciudad}>
        <input type="text" className={inputClass} placeholder="ej. Barcelona, Cataluña"
          value={formData.ciudad} onChange={e => set('ciudad', e.target.value)} />
      </Field>

      <Field label="Dirección" error={errors.direccion}>
        <input type="text" className={inputClass} placeholder="Calle, número, piso..."
          value={formData.direccion} onChange={e => set('direccion', e.target.value)} />
      </Field>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Step 2 — Contacto
───────────────────────────────────────────── */
function Step2({ formData, set, errors }: StepProps) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-outfit font-semibold text-2xl text-[#1D1D1F] tracking-tight mb-1">Contacto</h1>
        <p className="font-manrope text-sm text-[#86868B]">¿Cómo podemos hablar contigo?</p>
      </div>

      <Field label="Nombre de contacto" required error={errors.nombre_contacto}>
        <input type="text" className={inputClass} placeholder="Tu nombre completo"
          value={formData.nombre_contacto} onChange={e => set('nombre_contacto', e.target.value)} />
      </Field>

      <Field label="Teléfono" required error={errors.telefono}>
        <input type="tel" className={inputClass} placeholder="+34 600 000 000"
          value={formData.telefono} onChange={e => set('telefono', e.target.value)} />
      </Field>

      <Field label="Email" required error={errors.email}>
        <input type="email" className={inputClass} placeholder="tu@email.com"
          value={formData.email} onChange={e => set('email', e.target.value)} />
      </Field>

      <Field label="Web actual" error={errors.web_actual}>
        <input type="text" className={inputClass} placeholder="https://..."
          value={formData.web_actual} onChange={e => set('web_actual', e.target.value)} />
      </Field>

      <Field label="Canal de contacto preferido" required error={errors.canal_contacto}>
        <select className={inputClass} value={formData.canal_contacto}
          onChange={e => set('canal_contacto', e.target.value)}>
          <option value="">Selecciona canal</option>
          <option value="WhatsApp">WhatsApp</option>
          <option value="Email">Email</option>
          <option value="Teléfono">Teléfono</option>
        </select>
      </Field>

      {formData.canal_contacto === 'WhatsApp' && (
        <Field label="Número de WhatsApp" error={errors.whatsapp}>
          <input type="text" className={inputClass} placeholder="+34 600 000 000"
            value={formData.whatsapp} onChange={e => set('whatsapp', e.target.value)} />
        </Field>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────
   Step 3 — El negocio
───────────────────────────────────────────── */
function Step3({ formData, set, errors }: StepProps) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-outfit font-semibold text-2xl text-[#1D1D1F] tracking-tight mb-1">El negocio</h1>
        <p className="font-manrope text-sm text-[#86868B]">Cuéntanos qué haces y cómo lo haces.</p>
      </div>

      <Field label="Describe tu negocio en pocas palabras" required error={errors.descripcion}>
        <textarea className={`${inputClass} resize-none`} rows={3}
          placeholder="ej. Somos una peluquería familiar en el centro de Barcelona con 10 años de experiencia..."
          value={formData.descripcion} onChange={e => set('descripcion', e.target.value)} />
      </Field>

      <Field label="Servicios principales" required error={errors.servicios}>
        <textarea className={`${inputClass} resize-none`} rows={3}
          placeholder="ej. Corte de pelo, tinte, peinados..."
          value={formData.servicios} onChange={e => set('servicios', e.target.value)} />
      </Field>

      <Field label="Precio medio o desde" error={errors.precio_medio}>
        <input type="text" className={inputClass} placeholder="ej. Desde €15"
          value={formData.precio_medio} onChange={e => set('precio_medio', e.target.value)} />
      </Field>

      <Field label="Horario de apertura" error={errors.horario}>
        <input type="text" className={inputClass} placeholder="ej. Lunes a viernes 9:00–20:00"
          value={formData.horario} onChange={e => set('horario', e.target.value)} />
      </Field>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Step 4 — La web
───────────────────────────────────────────── */
function Step4({ formData, set, errors }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-outfit font-semibold text-2xl text-[#1D1D1F] tracking-tight mb-1">La web</h1>
        <p className="font-manrope text-sm text-[#86868B]">Configuremos tu proyecto.</p>
      </div>

      <RadioGroup label="¿Tiene logo?" options={['Sí', 'No', 'En proceso']}
        value={formData.tiene_logo} onChange={v => set('tiene_logo', v)} />

      <RadioGroup label="¿Tiene fotos profesionales?" options={['Sí', 'No', 'Las haré pronto']}
        value={formData.tiene_fotos} onChange={v => set('tiene_fotos', v)} />

      <Field label="Referencias visuales" error={errors.referencias}>
        <input type="text" className={inputClass}
          placeholder="URLs de webs que le gusten..."
          value={formData.referencias} onChange={e => set('referencias', e.target.value)} />
      </Field>

      {/* Estilo visual card grid */}
      <div>
        <label className={labelClass}>Estilo visual preferido</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {ESTILOS.map(e => {
            const selected = formData.estilo_visual === e.id
            return (
              <button key={e.id} type="button" onClick={() => set('estilo_visual', e.id)}
                className={`flex flex-col items-start gap-2 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selected
                    ? 'border-[#1D1D1F] bg-[#1D1D1F] text-white'
                    : 'border-black/[0.10] hover:border-black/25 text-[#1D1D1F]'
                }`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  selected ? 'bg-white/10' : 'bg-black/[0.05]'
                }`}>
                  <Icon d={e.icon} size={16} />
                </div>
                <div>
                  <p className="font-manrope font-semibold text-xs">{e.label}</p>
                  <p className={`font-manrope text-[10px] leading-tight mt-0.5 ${selected ? 'text-white/60' : 'text-[#86868B]'}`}>
                    {e.desc}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Step 5 — Últimos detalles
───────────────────────────────────────────── */
function Step5({ formData, set, errors }: StepProps) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-outfit font-semibold text-2xl text-[#1D1D1F] tracking-tight mb-1">Últimos detalles</h1>
        <p className="font-manrope text-sm text-[#86868B]">Ya casi hemos terminado.</p>
      </div>

      <Field label="¿Cómo nos has conocido?" error={errors.como_nos_conocio}>
        <select className={inputClass} value={formData.como_nos_conocio}
          onChange={e => set('como_nos_conocio', e.target.value)}>
          <option value="">Selecciona una opción</option>
          <option value="Búsqueda en Google">Búsqueda en Google</option>
          <option value="Recomendación de un amigo">Recomendación de un amigo</option>
          <option value="Redes sociales">Redes sociales</option>
          <option value="WhatsApp">WhatsApp</option>
          <option value="Otro">Otro</option>
        </select>
      </Field>

      <Field label="¿Algo más que debamos saber?" error={errors.notas}>
        <textarea className={`${inputClass} resize-none`} rows={4}
          placeholder="Cualquier detalle relevante sobre tu negocio o tu web..."
          value={formData.notas} onChange={e => set('notas', e.target.value)} />
      </Field>

      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={formData.rgpd}
            onChange={e => set('rgpd', e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[#1D1D1F] flex-shrink-0" />
          <span className="font-manrope text-sm text-[#1D1D1F]">
            He leído y acepto la{' '}
            <Link href="/politica-privacidad" target="_blank"
              className="underline hover:text-[#86868B] transition-colors">
              política de privacidad
            </Link>
            <span className="text-red-500 ml-0.5">*</span>
          </span>
        </label>
        {errors.rgpd && <p className={`${errorClass} ml-7`}>{errors.rgpd}</p>}
      </div>
    </div>
  )
}
