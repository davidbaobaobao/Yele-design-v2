'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const SECTORES = [
  'Fontanero / Instalaciones', 'Electricista', 'Carpintero / Reformas', 'Pintor',
  'Peluquería / Barbería', 'Estética / Spa / Belleza',
  'Fisioterapeuta / Clínica', 'Dentista', 'Veterinario',
  'Médico / Especialista', 'Psicólogo',
  'Yoga / Pilates / Bienestar', 'Entrenador personal / Gym', 'Instructor de deporte',
  'Restaurante / Bar / Cafetería', 'Panadería / Pastelería',
  'Academia / Clases particulares', 'Guardería / Educación infantil',
  'Tienda local / Comercio', 'Inmobiliaria',
  'Asesoría / Gestoría', 'Abogado', 'Fotógrafo',
  'Diseñador / Creativo', 'Taller / Estudio creativo', 'Otro',
]

const PAGINAS_OPCIONES = [
  'Inicio', 'Servicios', 'Sobre nosotros', 'Galería', 'Blog',
  'Contacto', 'Reservas / Booking', 'Tienda online',
  'Precios', 'Portfolio', 'Otro',
]

const PLANES = [
  { id: 'Básica', precio: '€19/mes', detalle: 'hasta 4 páginas' },
  { id: 'Profesional', precio: '€29/mes', detalle: 'hasta 6 páginas' },
  { id: 'Avanzada', precio: '€59/mes', detalle: 'sin límites' },
]

const inputClass = 'w-full bg-white border border-black/[0.12] rounded-xl px-4 py-3 font-manrope text-sm text-[#1D1D1F] placeholder-[#86868B] focus:outline-none focus:border-[#1D1D1F] transition-colors'
const labelClass = 'font-manrope text-xs text-[#86868B] mb-1.5 block'
const errorClass = 'font-manrope text-xs text-red-500 mt-1'

type FormData = {
  nombre_negocio: string
  sector: string
  ciudad: string
  direccion: string
  cif: string
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
  anos_negocio: string
  plan: string
  paginas: string[]
  tiene_logo: string
  tiene_fotos: string
  referencias: string
  estilo_visual: string
  como_nos_conocio: string
  notas: string
  rgpd: boolean
}

export default function EmpezarPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  const [formData, setFormData] = useState<FormData>({
    nombre_negocio: '',
    sector: '',
    ciudad: '',
    direccion: '',
    cif: '',
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
    anos_negocio: '',
    plan: 'Profesional',
    paginas: ['Inicio'],
    tiene_logo: '',
    tiene_fotos: '',
    referencias: '',
    estilo_visual: '',
    como_nos_conocio: '',
    notas: '',
    rgpd: false,
  })

  function set(key: keyof FormData, value: string | boolean | string[]) {
    setFormData(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }))
  }

  function validateStep(s: number): boolean {
    const newErrors: Partial<Record<keyof FormData, string>> = {}
    if (s === 1) {
      if (!formData.nombre_negocio.trim()) newErrors.nombre_negocio = 'Campo obligatorio'
      if (!formData.sector) newErrors.sector = 'Selecciona un sector'
      if (!formData.ciudad.trim()) newErrors.ciudad = 'Campo obligatorio'
    }
    if (s === 2) {
      if (!formData.nombre_contacto.trim()) newErrors.nombre_contacto = 'Campo obligatorio'
      if (!formData.telefono.trim()) newErrors.telefono = 'Campo obligatorio'
      if (!formData.email.trim()) newErrors.email = 'Campo obligatorio'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email inválido'
      if (!formData.canal_contacto) newErrors.canal_contacto = 'Selecciona una opción'
    }
    if (s === 3) {
      if (!formData.descripcion.trim()) newErrors.descripcion = 'Campo obligatorio'
      if (!formData.servicios.trim()) newErrors.servicios = 'Campo obligatorio'
    }
    if (s === 5) {
      if (!formData.rgpd) newErrors.rgpd = 'Debes aceptar la política de privacidad'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function nextStep() {
    if (validateStep(step)) setStep(s => s + 1)
  }

  function prevStep() {
    setStep(s => s - 1)
    setErrors({})
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
        ...(session?.access_token && {
          Authorization: `Bearer ${session.access_token}`,
        }),
      },
      body: JSON.stringify(formData),
    })

    if (response.ok) {
      router.push('/gracias')
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

        {/* Step indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="font-manrope text-xs text-[#86868B]">Paso {step} de 5</span>
            <span className="font-manrope text-xs text-[#86868B]">{Math.round(progress)}%</span>
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

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="font-manrope text-sm text-[#86868B] hover:text-[#1D1D1F] transition-colors cursor-pointer"
            >
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
              {loading ? 'Enviando tu solicitud…' : 'Enviar solicitud →'}
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

/* ───── Step components ───── */

type StepProps = {
  formData: FormData
  set: (key: keyof FormData, value: string | boolean | string[]) => void
  errors: Partial<Record<keyof FormData, string>>
}

function Field({ label, required, error, children }: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
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

function Step1({ formData, set, errors }: StepProps) {
  return (
    <div className="space-y-5">
      <div className="mb-6">
        <h1 className="font-outfit font-semibold text-2xl text-[#1D1D1F] tracking-tight mb-1">
          Información básica
        </h1>
        <p className="font-manrope text-sm text-[#86868B]">Cuéntanos sobre tu negocio.</p>
      </div>

      <Field label="Nombre del negocio" required error={errors.nombre_negocio}>
        <input
          type="text"
          className={inputClass}
          placeholder="ej. Peluquería Montserrat"
          value={formData.nombre_negocio}
          onChange={e => set('nombre_negocio', e.target.value)}
        />
      </Field>

      <Field label="Sector" required error={errors.sector}>
        <select
          className={inputClass}
          value={formData.sector}
          onChange={e => set('sector', e.target.value)}
        >
          <option value="">Selecciona tu sector</option>
          {SECTORES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </Field>

      <Field label="Ciudad y provincia" required error={errors.ciudad}>
        <input
          type="text"
          className={inputClass}
          placeholder="ej. Barcelona, Cataluña"
          value={formData.ciudad}
          onChange={e => set('ciudad', e.target.value)}
        />
      </Field>

      <Field label="Dirección" error={errors.direccion}>
        <input
          type="text"
          className={inputClass}
          placeholder="Calle, número, piso..."
          value={formData.direccion}
          onChange={e => set('direccion', e.target.value)}
        />
      </Field>

      <Field label="CIF / NIF" error={errors.cif}>
        <input
          type="text"
          className={inputClass}
          placeholder="ej. B12345678"
          value={formData.cif}
          onChange={e => set('cif', e.target.value)}
        />
      </Field>
    </div>
  )
}

function Step2({ formData, set, errors }: StepProps) {
  return (
    <div className="space-y-5">
      <div className="mb-6">
        <h1 className="font-outfit font-semibold text-2xl text-[#1D1D1F] tracking-tight mb-1">
          Contacto
        </h1>
        <p className="font-manrope text-sm text-[#86868B]">¿Cómo podemos hablar contigo?</p>
      </div>

      <Field label="Nombre de contacto" required error={errors.nombre_contacto}>
        <input
          type="text"
          className={inputClass}
          placeholder="Tu nombre completo"
          value={formData.nombre_contacto}
          onChange={e => set('nombre_contacto', e.target.value)}
        />
      </Field>

      <Field label="Teléfono" required error={errors.telefono}>
        <input
          type="tel"
          className={inputClass}
          placeholder="+34 600 000 000"
          value={formData.telefono}
          onChange={e => set('telefono', e.target.value)}
        />
      </Field>

      <Field label="Email" required error={errors.email}>
        <input
          type="email"
          className={inputClass}
          placeholder="tu@email.com"
          value={formData.email}
          onChange={e => set('email', e.target.value)}
        />
      </Field>

      <Field label="Web actual" error={errors.web_actual}>
        <input
          type="text"
          className={inputClass}
          placeholder="https://..."
          value={formData.web_actual}
          onChange={e => set('web_actual', e.target.value)}
        />
      </Field>

      <Field label="Canal de contacto preferido" required error={errors.canal_contacto}>
        <select
          className={inputClass}
          value={formData.canal_contacto}
          onChange={e => set('canal_contacto', e.target.value)}
        >
          <option value="">Selecciona canal</option>
          <option value="WhatsApp">WhatsApp</option>
          <option value="Email">Email</option>
          <option value="Teléfono">Teléfono</option>
        </select>
      </Field>

      {formData.canal_contacto === 'WhatsApp' && (
        <Field label="Número de WhatsApp" error={errors.whatsapp}>
          <input
            type="text"
            className={inputClass}
            placeholder="+34 600 000 000"
            value={formData.whatsapp}
            onChange={e => set('whatsapp', e.target.value)}
          />
        </Field>
      )}
    </div>
  )
}

function Step3({ formData, set, errors }: StepProps) {
  return (
    <div className="space-y-5">
      <div className="mb-6">
        <h1 className="font-outfit font-semibold text-2xl text-[#1D1D1F] tracking-tight mb-1">
          El negocio
        </h1>
        <p className="font-manrope text-sm text-[#86868B]">Cuéntanos qué haces y cómo lo haces.</p>
      </div>

      <Field label="Describe tu negocio en pocas palabras" required error={errors.descripcion}>
        <textarea
          className={`${inputClass} resize-none`}
          rows={3}
          placeholder="ej. Somos una peluquería familiar en el centro de Barcelona con 10 años de experiencia..."
          value={formData.descripcion}
          onChange={e => set('descripcion', e.target.value)}
        />
      </Field>

      <Field label="Servicios principales" required error={errors.servicios}>
        <textarea
          className={`${inputClass} resize-none`}
          rows={3}
          placeholder="ej. Corte de pelo, tinte, peinados..."
          value={formData.servicios}
          onChange={e => set('servicios', e.target.value)}
        />
      </Field>

      <Field label="Precio medio o desde" error={errors.precio_medio}>
        <input
          type="text"
          className={inputClass}
          placeholder="ej. Desde €15"
          value={formData.precio_medio}
          onChange={e => set('precio_medio', e.target.value)}
        />
      </Field>

      <Field label="Horario de apertura" error={errors.horario}>
        <input
          type="text"
          className={inputClass}
          placeholder="ej. Lunes a viernes 9:00–20:00"
          value={formData.horario}
          onChange={e => set('horario', e.target.value)}
        />
      </Field>

      <Field label="Años en el negocio" error={errors.anos_negocio}>
        <input
          type="text"
          className={inputClass}
          placeholder="ej. 5"
          value={formData.anos_negocio}
          onChange={e => set('anos_negocio', e.target.value)}
        />
      </Field>
    </div>
  )
}

function Step4({ formData, set, errors }: StepProps) {
  function togglePagina(pagina: string) {
    if (pagina === 'Inicio') return
    const current = formData.paginas
    if (current.includes(pagina)) {
      set('paginas', current.filter(p => p !== pagina))
    } else {
      set('paginas', [...current, pagina])
    }
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="font-outfit font-semibold text-2xl text-[#1D1D1F] tracking-tight mb-1">
          La web
        </h1>
        <p className="font-manrope text-sm text-[#86868B]">Configuremos tu proyecto.</p>
      </div>

      {/* Plan cards */}
      <div>
        <label className={labelClass}>
          Plan contratado<span className="text-red-500 ml-0.5">*</span>
        </label>
        <div className="grid grid-cols-1 gap-3">
          {PLANES.map(plan => {
            const selected = formData.plan === plan.id
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => set('plan', plan.id)}
                className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all cursor-pointer ${
                  selected
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-black/[0.12] bg-white hover:border-black/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-manrope font-semibold text-sm ${selected ? 'text-amber-700' : 'text-[#1D1D1F]'}`}>
                    {plan.id}
                  </span>
                  <span className={`font-manrope font-semibold text-sm ${selected ? 'text-amber-600' : 'text-[#1D1D1F]'}`}>
                    {plan.precio}
                  </span>
                </div>
                <p className={`font-manrope text-xs mt-0.5 ${selected ? 'text-amber-600' : 'text-[#86868B]'}`}>
                  {plan.detalle}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Páginas */}
      <div>
        <label className={labelClass}>Páginas que necesita</label>
        <div className="grid grid-cols-2 gap-2">
          {PAGINAS_OPCIONES.map(pagina => {
            const checked = formData.paginas.includes(pagina)
            const disabled = pagina === 'Inicio'
            return (
              <label
                key={pagina}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border cursor-pointer transition-all ${
                  checked
                    ? 'border-[#1D1D1F] bg-[#1D1D1F]/[0.04]'
                    : 'border-black/[0.08] hover:border-black/20'
                } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={() => togglePagina(pagina)}
                  className="w-3.5 h-3.5 accent-[#1D1D1F]"
                />
                <span className="font-manrope text-xs text-[#1D1D1F]">{pagina}</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Radio groups */}
      <RadioGroup
        label="¿Tiene logo?"
        options={['Sí', 'No', 'En proceso']}
        value={formData.tiene_logo}
        onChange={v => set('tiene_logo', v)}
      />

      <RadioGroup
        label="¿Tiene fotos profesionales?"
        options={['Sí', 'No', 'Las haré pronto']}
        value={formData.tiene_fotos}
        onChange={v => set('tiene_fotos', v)}
      />

      <Field label="Referencias visuales" error={errors.referencias}>
        <input
          type="text"
          className={inputClass}
          placeholder="URLs de webs que le gusten..."
          value={formData.referencias}
          onChange={e => set('referencias', e.target.value)}
        />
      </Field>

      <Field label="Estilo visual preferido" error={errors.estilo_visual}>
        <select
          className={inputClass}
          value={formData.estilo_visual}
          onChange={e => set('estilo_visual', e.target.value)}
        >
          <option value="">Selecciona un estilo</option>
          <option value="Elegante y minimalista">Elegante y minimalista</option>
          <option value="Cálido y cercano">Cálido y cercano</option>
          <option value="Moderno y tecnológico">Moderno y tecnológico</option>
          <option value="Clásico y tradicional">Clásico y tradicional</option>
          <option value="Atrevido y llamativo">Atrevido y llamativo</option>
          <option value="Sin preferencia — decide tú">Sin preferencia — decide tú</option>
        </select>
      </Field>
    </div>
  )
}

function Step5({ formData, set, errors }: StepProps) {
  return (
    <div className="space-y-5">
      <div className="mb-6">
        <h1 className="font-outfit font-semibold text-2xl text-[#1D1D1F] tracking-tight mb-1">
          Últimos detalles
        </h1>
        <p className="font-manrope text-sm text-[#86868B]">Ya casi hemos terminado.</p>
      </div>

      <Field label="¿Cómo nos has conocido?" error={errors.como_nos_conocio}>
        <select
          className={inputClass}
          value={formData.como_nos_conocio}
          onChange={e => set('como_nos_conocio', e.target.value)}
        >
          <option value="">Selecciona una opción</option>
          <option value="Búsqueda en Google">Búsqueda en Google</option>
          <option value="Recomendación de un amigo">Recomendación de un amigo</option>
          <option value="Redes sociales">Redes sociales</option>
          <option value="WhatsApp">WhatsApp</option>
          <option value="Otro">Otro</option>
        </select>
      </Field>

      <Field label="¿Algo más que debamos saber?" error={errors.notas}>
        <textarea
          className={`${inputClass} resize-none`}
          rows={4}
          placeholder="Cualquier detalle relevante sobre tu negocio o tu web..."
          value={formData.notas}
          onChange={e => set('notas', e.target.value)}
        />
      </Field>

      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.rgpd}
            onChange={e => set('rgpd', e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[#1D1D1F] flex-shrink-0"
          />
          <span className="font-manrope text-sm text-[#1D1D1F]">
            He leído y acepto la{' '}
            <Link
              href="/politica-privacidad"
              target="_blank"
              className="underline hover:text-[#86868B] transition-colors"
            >
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

function RadioGroup({ label, options, value, onChange }: {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`font-manrope text-sm px-4 py-2 rounded-xl border transition-all cursor-pointer ${
              value === opt
                ? 'border-[#1D1D1F] bg-[#1D1D1F] text-white'
                : 'border-black/[0.12] text-[#1D1D1F] hover:border-black/30'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
