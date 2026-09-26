const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const REVEAL_SELECTOR = '.reveal, [data-reveal]'

function reveal(element) {
  element.classList.add('is-revealed')
}

/**
 * Observe reveal elements inside a mounted page and return explicit cleanup.
 * Content remains visible when JavaScript, IntersectionObserver, or motion is
 * unavailable/disabled.
 */
export function mountRevealObserver(scope) {
  const elements = Array.from(scope.querySelectorAll(REVEAL_SELECTOR))

  if (elements.length === 0) {
    return () => {}
  }

  const motionPreference = window.matchMedia?.(REDUCED_MOTION_QUERY)
  let observer = null
  let destroyed = false

  const revealAll = () => {
    elements.forEach(reveal)
    observer?.disconnect()
    observer = null
  }

  const onMotionPreferenceChange = (event) => {
    if (event.matches) {
      revealAll()
    }
  }

  if (motionPreference?.matches || !('IntersectionObserver' in window)) {
    revealAll()
  } else {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal(entry.target)
            observer?.unobserve(entry.target)
          }
        }
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -8% 0px',
      },
    )

    elements.forEach((element) => observer.observe(element))
  }

  motionPreference?.addEventListener?.('change', onMotionPreferenceChange)

  return () => {
    if (destroyed) {
      return
    }

    destroyed = true
    observer?.disconnect()
    observer = null
    motionPreference?.removeEventListener?.('change', onMotionPreferenceChange)
  }
}
