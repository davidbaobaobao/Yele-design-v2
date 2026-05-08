'use client'

import { useState, useCallback, useRef } from 'react'
import Image from 'next/image'

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
      className="absolute inset-0 flex flex-col justify-end p-5 pointer-events-none"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.28s ease',
        background:
          'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.22) 45%, transparent 100%)',
      }}
    >
      <h2 className="font-outfit font-semibold text-white text-xl md:text-2xl tracking-tight leading-tight mb-1">
        {name}
      </h2>
      {description && (
        <p className="font-manrope text-white/65 text-sm">{description}</p>
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
      <div className="row-span-2 relative overflow-hidden rounded-2xl">
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
    <div className="flex flex-col gap-1">
      {projects.map((project, i) => (
        <ProjectGroup key={project.id} project={project} priority={i === 0} />
      ))}
    </div>
  )
}
