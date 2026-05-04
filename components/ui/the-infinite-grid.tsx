"use client"

import { useId, useRef } from "react"
import { motion, useMotionValue, useMotionTemplate, useAnimationFrame, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"

interface InfiniteGridProps {
  className?: string
  baseOpacity?: number
  revealOpacity?: number
  revealRadius?: number
}

export function InfiniteGrid({
  className,
  baseOpacity = 0.08,
  revealOpacity = 0.45,
  revealRadius = 280,
}: InfiniteGridProps) {
  const uid = useId().replace(/:/g, "_")
  const containerRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(-9999)
  const mouseY = useMotionValue(-9999)
  // Spring the mask position so the reveal circle follows the cursor smoothly
  const springX = useSpring(mouseX, { stiffness: 100, damping: 20, mass: 0.3 })
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20, mass: 0.3 })

  const gridOffsetX = useMotionValue(0)
  const gridOffsetY = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - left)
    mouseY.set(e.clientY - top)
  }

  const handleMouseLeave = () => {
    mouseX.set(-9999)
    mouseY.set(-9999)
  }

  useAnimationFrame(() => {
    gridOffsetX.set((gridOffsetX.get() + 0.4) % 40)
    gridOffsetY.set((gridOffsetY.get() + 0.4) % 40)
  })

  const maskImage = useMotionTemplate`radial-gradient(${revealRadius}px circle at ${springX}px ${springY}px, black, transparent)`

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("absolute inset-0 overflow-hidden", className)}
    >
      {/* Base layer: always-visible blurred grid */}
      <div
        className="absolute inset-0"
        style={{ opacity: baseOpacity, filter: "blur(3px)" }}
      >
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} patternId={`${uid}_base`} />
      </div>

      {/* Cursor layer: sharp grid revealed inside a radial mask.
          Outside the mask the blurred layer shows through, creating
          a smooth blur→clear gradient transition at the mask edge. */}
      <motion.div
        className="absolute inset-0"
        style={{ maskImage, WebkitMaskImage: maskImage, opacity: revealOpacity, filter: "blur(1px)" }}
      >
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} patternId={`${uid}_reveal`} />
      </motion.div>
    </div>
  )
}

function GridPattern({
  offsetX,
  offsetY,
  patternId,
}: {
  offsetX: ReturnType<typeof useMotionValue<number>>
  offsetY: ReturnType<typeof useMotionValue<number>>
  patternId: string
}) {
  return (
    <svg className="w-full h-full">
      <defs>
        <motion.pattern
          id={patternId}
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-white"
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  )
}
