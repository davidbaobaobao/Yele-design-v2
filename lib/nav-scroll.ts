// Shared by Nav/Footer anchor links and any section with its own
// scroll-snap IntersectionObserver (currently PreciosIndexSection). A nav
// click can animate through a snap section on its way to a further target
// (e.g. FAQ, Contact — both below Pricing); without this flag the snap
// section's own observer fires mid-animation and hijacks the scroll toward
// itself instead of the clicked link's actual target.
let navJumping = false
let clearTimer: ReturnType<typeof setTimeout> | undefined

export function isNavJumping() {
  return navJumping
}

export function scrollToSection(href: string) {
  const el = document.querySelector(href)
  if (!el) return

  navJumping = true
  clearTimeout(clearTimer)
  const clear = () => {
    navJumping = false
    window.removeEventListener('scrollend', clear)
  }
  window.addEventListener('scrollend', clear, { once: true })
  clearTimer = setTimeout(clear, 1600)

  el.scrollIntoView({ behavior: 'smooth' })
}
