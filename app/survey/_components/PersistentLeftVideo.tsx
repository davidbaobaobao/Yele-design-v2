'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { useHydratedReducedMotion } from '@/hooks/useHydratedReducedMotion'

const VIDEO_DIR = '/media/boldstats'

interface PersistentLeftVideoProps {
  visible: boolean
}

// Mounted exactly ONCE for the whole survey — rendered in page.tsx as a
// fixed sibling OUTSIDE the per-step conditional tree, not nested inside a
// step's own JSX. Each `{step === N && <SplitLayout>...}` block is a
// distinct element at its own fixed array position in <main>'s children;
// switching steps unmounts the outgoing block and mounts the incoming one
// (not a re-render of a shared node), so a <video> living inside SplitLayout
// would restart from frame 0 on every step change. Living here instead,
// only opacity/pointer-events toggle — the element itself never
// un/remounts, so playback continues seamlessly across steps 1 <-> 2.
// Paused (not unmounted) while off-screen on other steps so it resumes
// from the same position rather than decoding invisibly forever.
export default function PersistentLeftVideo({ visible }: PersistentLeftVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const reduceMotion = useHydratedReducedMotion()

  useEffect(() => {
    const v = videoRef.current
    if (!v || reduceMotion) return
    if (visible) {
      v.play().catch(() => {})
    } else {
      v.pause()
    }
  }, [visible, reduceMotion])

  return (
    <div
      className={`fixed left-0 top-0 z-[1] hidden h-full w-1/2 overflow-hidden transition-opacity duration-500 motion-reduce:transition-none md:block ${
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      aria-hidden="true"
    >
      {reduceMotion ? (
        <Image src={`${VIDEO_DIR}/boldstats_poster.jpg`} alt="" fill sizes="50vw" className="object-cover" />
      ) : (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={`${VIDEO_DIR}/boldstats_poster.jpg`}
          className="h-full w-full object-cover"
        >
          <source src={`${VIDEO_DIR}/boldstats_hq.webm`} type="video/webm" />
          <source src={`${VIDEO_DIR}/boldstats_hq.mp4`} type="video/mp4" />
        </video>
      )}
    </div>
  )
}
