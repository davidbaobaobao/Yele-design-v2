import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export const revalidate = 60

export const metadata = {
  title: 'Ejemplos — Yele',
  description: 'Webs que hemos construido para negocios reales en toda España.',
}

type ShowcaseProject = {
  id: string
  name: string
  description: string | null
  main_image: string
  additional_images: unknown
}

const FALLBACK: ShowcaseProject[] = [
  { id: '1', name: 'El Taller · Cerámica, Gràcia',         description: 'Estudio de cerámica artesanal',  main_image: 'https://images.pexels.com/photos/32212371/pexels-photo-32212371.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', additional_images: [] },
  { id: '2', name: 'Bar Zuriñe · Tapas, Barcelona',        description: 'Bar de tapas tradicional',       main_image: 'https://images.pexels.com/photos/21327986/pexels-photo-21327986.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940', additional_images: [] },
  { id: '3', name: 'Estudio Noa · Yoga, Madrid',           description: 'Estudio de yoga y meditación',  main_image: 'https://images.pexels.com/photos/4327023/pexels-photo-4327023.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',   additional_images: [] },
  { id: '4', name: 'Despacho Ferrer · Abogados, Valencia', description: 'Despacho de abogados',          main_image: 'https://images.unsplash.com/photo-1635845080335-dcfe06a0fcf1?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85',  additional_images: [] },
  { id: '5', name: 'Txema · Fontanero, Bilbao',            description: 'Fontanero autónomo',            main_image: 'https://images.unsplash.com/photo-1649769069590-268b0b994462?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85',   additional_images: [] },
]

function parseImages(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter((v): v is string => typeof v === 'string')
  if (typeof raw === 'string') {
    try { return (JSON.parse(raw) as string[]).filter(Boolean) } catch { return [] }
  }
  return []
}

export default async function EjemplosPage() {
  const { data } = await supabase
    .from('showcase_projects')
    .select('id, name, description, main_image, additional_images')
    .eq('visible', true)
    .order('sort_order', { ascending: true })

  const projects = (data && data.length > 0) ? data : FALLBACK

  return (
    <main className="min-h-screen bg-white">
      {/* Page header */}
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-16">
        <Link
          href="/#trabajos"
          className="inline-flex items-center gap-1.5 font-manrope text-sm text-[#86868B] hover:text-[#1D1D1F] transition-colors mb-10"
        >
          ← Volver
        </Link>
        <span className="font-manrope text-xs tracking-[0.15em] uppercase text-[#86868B] mb-4 block">
          Portafolio
        </span>
        <h1 className="font-outfit font-semibold text-4xl md:text-5xl text-[#1D1D1F] tracking-tight mb-4">
          Webs que hemos construido.
        </h1>
        <p className="font-manrope text-[#86868B] text-lg">
          Para negocios reales, en toda España.
        </p>
      </div>

      {/* Project list */}
      <div className="max-w-5xl mx-auto px-6 pb-32">
        {projects.map((project, i) => {
          const extra = parseImages(project.additional_images)
          return (
            <div key={project.id}>
              {i > 0 && <hr className="border-t border-black/[0.06] my-24" />}

              <article id={project.id} className="scroll-mt-20">
                <h2 className="font-outfit font-semibold text-2xl md:text-3xl text-[#1D1D1F] tracking-tight mb-2">
                  {project.name}
                </h2>
                {project.description && (
                  <p className="font-manrope text-[#86868B] text-base mb-6">{project.description}</p>
                )}

                {/* Main image — 16:9 */}
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#F5F5F7] mb-4">
                  <Image
                    src={project.main_image}
                    alt={`Web de ${project.name} — diseñada por Yele`}
                    fill
                    sizes="(max-width: 768px) 100vw, 960px"
                    className="object-cover"
                    priority={i === 0}
                  />
                </div>

                {/* Additional images */}
                {extra.length === 1 && (
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#F5F5F7]">
                    <Image
                      src={extra[0]}
                      alt={`${project.name} — imagen adicional`}
                      fill
                      sizes="960px"
                      className="object-cover"
                    />
                  </div>
                )}
                {extra.length === 2 && (
                  <div className="grid grid-cols-2 gap-3">
                    {extra.map((img, j) => (
                      <div key={j} className="relative aspect-video rounded-xl overflow-hidden bg-[#F5F5F7]">
                        <Image
                          src={img}
                          alt={`${project.name} — imagen ${j + 2}`}
                          fill
                          sizes="480px"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
                {extra.length >= 3 && (
                  <div className="grid grid-cols-3 gap-3">
                    {extra.map((img, j) => (
                      <div key={j} className="relative aspect-video rounded-xl overflow-hidden bg-[#F5F5F7]">
                        <Image
                          src={img}
                          alt={`${project.name} — imagen ${j + 2}`}
                          fill
                          sizes="(max-width: 768px) 50vw, 320px"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </article>
            </div>
          )
        })}
      </div>
    </main>
  )
}
