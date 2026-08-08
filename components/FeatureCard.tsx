'use client'

import { motion } from 'framer-motion'

export type FeatureCardMedia = {
  title: string
  description: string
  poster: string
  webmSrc: string
  mp4Src: string
  mobileSrc: string
}

// Shared by BeyondWebsite and WhyYele — same panel aspect ratio, rounded
// corners, video treatment, text-below layout and entrance stagger for
// both. panelBg/titleColor are the only two things that differ between the
// two sections (light/dark theme), and videoRef/reduceMotion/index are
// wired in by the caller's own IntersectionObserver + reduced-motion logic.
export default function FeatureCard({
  card,
  index,
  videoRef,
  reduceMotion,
  panelBg,
  titleColor,
}: {
  card: FeatureCardMedia
  index: number
  videoRef: React.Ref<HTMLVideoElement>
  reduceMotion: boolean
  panelBg: string
  titleColor: string
}) {
  const inner = (
    <div>
      <div className={`relative aspect-square rounded-2xl overflow-hidden ${panelBg}`}>
        {reduceMotion ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={card.poster} alt={card.title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            poster={card.poster}
            className="absolute inset-0 w-full h-full object-cover"
            aria-hidden="true"
          >
            {/* media-query <source>: mobile (iOS included — no webm
                support there) never considers the webm/desktop-mp4 pair
                below; desktop is untouched since the query never matches
                there. */}
            <source media="(max-width: 767px)" src={card.mobileSrc} type="video/mp4" />
            <source src={card.webmSrc} type="video/webm" />
            <source src={card.mp4Src} type="video/mp4" />
          </video>
        )}
      </div>
      <div className="mt-5">
        <h3 className={`font-display text-[18px] ${titleColor}`}>{card.title}</h3>
        <p className="font-body text-[14px] text-muted max-w-xs mt-1.5">{card.description}</p>
      </div>
    </div>
  )

  if (reduceMotion) return inner

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: 'easeOut' }}
    >
      {inner}
    </motion.div>
  )
}
