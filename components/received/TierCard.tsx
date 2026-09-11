'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion'
import PayButton from '@/components/received/PayButton'

export type Tier = {
  plan: 'launch' | 'business' | 'pro'
  name: string
  price: string
  from?: boolean
  care: string
  pay: string
  desc: string
  dark: boolean
}

// Cursor-driven 3D tilt + spotlight, same feel as the pricing cards.
export default function TierCard({
  tier,
  name,
  email,
  company,
}: {
  tier: Tier
  name: string
  email: string
  company: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 150, damping: 20 })
  const sy = useSpring(my, { stiffness: 150, damping: 20 })
  const rotateX = useTransform(sy, [-0.5, 0.5], [5, -5])
  const rotateY = useTransform(sx, [-0.5, 0.5], [-5, 5])
  const spotX = useTransform(sx, [-0.5, 0.5], [0, 100])
  const spotY = useTransform(sy, [-0.5, 0.5], [0, 100])
  const spot = useMotionTemplate`radial-gradient(340px circle at ${spotX}% ${spotY}%, ${
    tier.dark ? 'rgba(255,255,255,0.10)' : 'rgba(212,111,200,0.10)'
  }, transparent 60%)`

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  function onLeave() {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`relative flex flex-col rounded-2xl p-6 shadow-lg will-change-transform ${
        tier.dark
          ? 'bg-[#0D0E12] text-white shadow-black/30'
          : 'bg-white text-ink border border-ink/15 shadow-black/[0.08]'
      }`}
    >
      <motion.div className="pointer-events-none absolute inset-0 rounded-2xl" style={{ background: spot }} aria-hidden="true" />

      <h4 className={`relative font-display text-xl font-bold ${tier.dark ? 'text-white' : 'text-ink'}`}>{tier.name}</h4>
      <div className="relative mt-1 flex items-end gap-1 whitespace-nowrap">
        {tier.from && (
          <span className={`mb-1.5 font-body text-xs ${tier.dark ? 'text-white/50' : 'text-muted'}`}>From</span>
        )}
        <span className={`font-display text-3xl font-bold ${tier.dark ? 'text-white' : 'text-ink'}`}>{tier.price}</span>
        <span className={`mb-1 font-body text-sm ${tier.dark ? 'text-white/55' : 'text-muted'}`}>one-time</span>
      </div>
      <p className={`relative mt-4 mb-6 flex-1 font-body text-sm leading-relaxed ${tier.dark ? 'text-white/75' : 'text-ink/75'}`}>
        {tier.desc}
      </p>
      <div className="relative">
        <PayButton plan={tier.plan} name={name} email={email} company={company} label={`Pay ${tier.pay}`} popular={tier.dark} />
      </div>
    </motion.div>
  )
}
