/**
 * Enhance the native skip link so dynamically mounted route content receives
 * keyboard focus consistently across browsers. The real href target remains
 * in the document for no-JavaScript and assistive-technology fallback.
 */
export function mountSkipLink(selector = '.skip-link') {
  const link = document.querySelector(selector)

  if (!(link instanceof HTMLAnchorElement)) {
    return () => {}
  }

  const controller = new AbortController()

  link.addEventListener(
    'click',
    (event) => {
      const targetId = decodeURIComponent(link.hash.slice(1))
      const target = targetId ? document.getElementById(targetId) : null

      if (!(target instanceof HTMLElement)) {
        return
      }

      event.preventDefault()
      history.replaceState(history.state, '', link.hash)
      target.focus({ preventScroll: true })
      target.scrollIntoView({ block: 'start', behavior: 'auto' })
    },
    { signal: controller.signal },
  )

  return () => controller.abort()
}
