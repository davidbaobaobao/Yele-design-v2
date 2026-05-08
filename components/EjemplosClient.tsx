'use client'

import { useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { ArrowUp } from 'lucide-react'

type Project = {
  id: string
  name: string
  description: string | null
  main_image: string
  additional_images: string[]
}

function CardInner({
  src,
  alt,
  sizes,
  priority = false,
  onEnter,
  onLeave,
  children,
}: {
  src: string
  alt: string
  sizes: string
  priority?: boolean
  onEnter?: () => void
  onLeave?: () => void
  children?: React.ReactNode
}) {
  const [hovered, setHovered] = useState(false)
  const [rot, setRot] = useState({ x: 0, y: 0 })
  const [hl, setHl] = useState({ x: 50, y: 50 })

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const nx = (e.clientX - r.left) / r.width - 0.5
    const ny = (e.clientY - r.top) / r.height - 0.5
    setRot({ x: -ny * 9, y: nx * 9 })
    setHl({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    })
  }, [])

  const handleEnter = useCallback(() => {
    setHovered(true)
    onEnter?.()
  }, [onEnter])

  const handleLeave = useCallback(() => {
    setHovered(false)
    setRot({ x: 0, y: 0 })
    onLeave?.()
  }, [onLeave])

  return (
    <div
      className="absolute inset-0 cursor-pointer"
      style={{
        transform: hovered
          ? `perspective(900px) rotateX(${rot.x}deg) rotateY(${rot.y}deg) scale(1.04)`
          : 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)',
        transition: hovered ? 'transform 0.1s ease-out' : 'transform 0.55s ease-out',
        willChange: 'transform',
      }}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
      {/* Mouse-follow highlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.2s ease',
          background: `radial-gradient(circle at ${hl.x}% ${hl.y}%, rgba(255,255,255,0.22) 0%, transparent 62%)`,
        }}
      />
      {children}
    </div>
  )
}

function TitleOverlay({
  name,
  description,
  visible,
}: {
  name: string
  description: string | null
  visible: boolean
}) {
  return (
    <div
      className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 pointer-events-none"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.28s ease',
        background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 55%, transparent 80%)',
      }}
    >
      <h2
        className="font-outfit font-semibold text-white text-xl md:text-2xl tracking-tight leading-tight mb-1"
        style={{ textShadow: '0 1px 16px rgba(0,0,0,0.7), 0 0 40px rgba(0,0,0,0.4)' }}
      >
        {name}
      </h2>
      {description && (
        <p
          className="font-manrope text-white text-sm"
          style={{ textShadow: '0 1px 10px rgba(0,0,0,0.8)' }}
        >
          {description}
        </p>
      )}
    </div>
  )
}

function ProjectGroup({ project, priority }: { project: Project; priority: boolean }) {
  const [groupHovered, setGroupHovered] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const enter = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
    setGroupHovered(true)
  }, [])

  const leave = useCallback(() => {
    timer.current = setTimeout(() => setGroupHovered(false), 60)
  }, [])

  const imgs = [project.main_image, ...project.additional_images]
  const img1 = imgs[0]
  const img2 = imgs[1] ?? imgs[0]
  const img3 = imgs[2] ?? imgs[1] ?? imgs[0]

  return (
    <div
      id={project.id}
      className="grid gap-1 scroll-mt-4"
      style={{ gridTemplateColumns: '2fr 1fr' }}
    >
      {/* Left: large 16:9 card, spans 2 rows */}
      <div
        className="row-span-2 relative overflow-hidden rounded-2xl"
        style={{
          boxShadow: groupHovered
            ? '0 0 0 2px rgba(255,255,255,0.7), 0 8px 40px rgba(0,0,0,0.12)'
            : '0 0 0 0px transparent',
          transition: 'box-shadow 0.28s ease',
        }}
      >
        <CardInner
          src={img1}
          alt={`Web de ${project.name} — Yele`}
          sizes="67vw"
          priority={priority}
          onEnter={enter}
          onLeave={leave}
        >
          <TitleOverlay name={project.name} description={project.description} visible={groupHovered} />
        </CardInner>
      </div>

      {/* Right top */}
      <div className="aspect-video relative overflow-hidden rounded-2xl">
        <CardInner
          src={img2}
          alt={`${project.name} — imagen 2`}
          sizes="33vw"
          onEnter={enter}
          onLeave={leave}
        />
      </div>

      {/* Right bottom */}
      <div className="aspect-video relative overflow-hidden rounded-2xl">
        <CardInner
          src={img3}
          alt={`${project.name} — imagen 3`}
          sizes="33vw"
          onEnter={enter}
          onLeave={leave}
        />
      </div>
    </div>
  )
}

export default function EjemplosClient({ projects }: { projects: Project[] }) {
  return (
    <div className="flex flex-col gap-3">
      {projects.map((project, i) => (
        <ProjectGroup key={project.id} project={project} priority={i === 0} />
      ))}
      <div className="flex justify-center py-6">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Volver al inicio"
          className="w-11 h-11 rounded-full bg-[#1D1D1F] text-white flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:bg-black active:scale-95 transition-all duration-200"
        >
          <ArrowUp size={16} />
        </button>
      </div>
    </div>
  )
}
