'use client'

import { useEffect, useState } from 'react'

// WebKit (desktop Safari + every browser on iOS, which are all WebKit
// under Apple's App Store policy — CriOS/FxiOS included) has a real
// concurrent-video-decode ceiling that Chrome/Firefox-on-desktop don't
// share. This detects that engine, not literally "the Safari app", since
// the decoder limit is the actual thing callers need to know about. The
// regex excludes "chrome"/"android" so desktop Chrome (which also
// includes "Safari" in its UA string) and Android Chrome aren't
// misclassified — iOS Chrome's UA says "CriOS", not "Chrome", so it's
// correctly still caught here.
export function isSafariEngine(): boolean {
  if (typeof navigator === 'undefined') return false
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
}

// Hydration-safe reactive version for components — starts false, resolves
// after mount, matching every other environment-detection hook in this
// codebase. Imperative code inside an effect (e.g. useCappedVideoPlayback)
// should call isSafariEngine() directly instead, to avoid an extra render.
export function useIsSafari() {
  const [isSafari, setIsSafari] = useState(false)

  useEffect(() => {
    setIsSafari(isSafariEngine())
  }, [])

  return isSafari
}
