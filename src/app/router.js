import { clearElement } from '../utils/dom.js'

const ROUTER_STATE_KEY = '__rihlatiRouter'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function normalizePathname(pathname) {
  if (!pathname || pathname === '/') {
    return '/'
  }

  return pathname.replace(/\/+$/, '') || '/'
}

function toStateObject(state) {
  return state && typeof state === 'object' && !Array.isArray(state) ? state : {}
}

function createHistoryState(state, url, scrollPosition = { x: 0, y: 0 }) {
  const safeState = toStateObject(state)

  return {
    ...safeState,
    [ROUTER_STATE_KEY]: {
      ...(safeState[ROUTER_STATE_KEY] ?? {}),
      path: `${url.pathname}${url.search}${url.hash}`,
      scrollX: scrollPosition.x,
      scrollY: scrollPosition.y,
    },
  }
}

function getStoredScrollPosition(state) {
  const routerState = toStateObject(state)[ROUTER_STATE_KEY]

  return {
    x: Number.isFinite(routerState?.scrollX) ? routerState.scrollX : 0,
    y: Number.isFinite(routerState?.scrollY) ? routerState.scrollY : 0,
  }
}

function prefersReducedMotion() {
  return window.matchMedia?.(REDUCED_MOTION_QUERY).matches ?? false
}

function waitForTransition(element, duration, signal) {
  if (signal.aborted) {
    return Promise.resolve(false)
  }

  return new Promise((resolve) => {
    let settled = false

    const finish = (completed) => {
      if (settled) {
        return
      }

      settled = true
      window.clearTimeout(fallbackTimer)
      element.removeEventListener('transitionend', onTransitionEnd)
      signal.removeEventListener('abort', onAbort)
      resolve(completed)
    }

    const onTransitionEnd = (event) => {
      if (event.target === element && event.propertyName === 'opacity') {
        finish(true)
      }
    }

    const onAbort = () => finish(false)
    const fallbackTimer = window.setTimeout(() => finish(true), duration + 80)

    element.addEventListener('transitionend', onTransitionEnd)
    signal.addEventListener('abort', onAbort, { once: true })
  })
}

/**
 * Small History API router with an explicit page contract:
 *
 * route.createPage(context) => {
 *   element: Node,
 *   mount(context): void,
 *   destroy(): void
 * }
 */
export class Router {
  #root
  #routes
  #notFoundRoute
  #transitionDuration
  #currentPage = null
  #navigationController = null
  #navigationSequence = 0
  #started = false
  #previousScrollRestoration = 'auto'
  #scrollTimer = null
  #usesScrollEnd = false
  #isNavigating = false

  constructor({ root, routes, notFoundRoute, transitionDuration = 240 }) {
    if (!(root instanceof HTMLElement)) {
      throw new TypeError('Router requires a valid HTMLElement root.')
    }

    this.#root = root
    this.#routes = new Map(
      routes.map((route) => [normalizePathname(route.path), route]),
    )
    this.#notFoundRoute = notFoundRoute
    this.#transitionDuration = transitionDuration
  }

  async start() {
    if (this.#started) {
      return
    }

    this.#started = true
    this.#previousScrollRestoration = history.scrollRestoration
    history.scrollRestoration = 'manual'

    document.addEventListener('click', this.#handleDocumentClick)
    window.addEventListener('popstate', this.#handlePopState)
    this.#usesScrollEnd = 'onscrollend' in window
    window.addEventListener(
      this.#usesScrollEnd ? 'scrollend' : 'scroll',
      this.#handleScroll,
      { passive: true },
    )

    const url = new URL(window.location.href)
    const initialScroll = getStoredScrollPosition(history.state)
    history.replaceState(createHistoryState(history.state, url, initialScroll), '', url)

    try {
      await this.#render(url, {
        initial: true,
        restoreScroll: initialScroll,
      })
    } catch (error) {
      this.destroy()
      throw error
    }
  }

  navigate(destination, { replace = false, state = {} } = {}) {
    const url = new URL(destination, window.location.href)

    if (url.origin !== window.location.origin) {
      window.location.assign(url.href)
      return Promise.resolve(false)
    }

    if (url.href === window.location.href) {
      if (replace) {
        history.replaceState(createHistoryState(state, url, getStoredScrollPosition(history.state)), '', url)
      }

      return Promise.resolve(false)
    }

    this.#cancelScheduledScrollCapture()
    this.#captureCurrentScroll()

    const nextState = createHistoryState(state, url)
    history[replace ? 'replaceState' : 'pushState'](nextState, '', url)

    return this.#render(url, {
      initial: false,
      restoreScroll: { x: 0, y: 0 },
    })
  }

  destroy() {
    if (!this.#started) {
      return
    }

    this.#started = false
    document.removeEventListener('click', this.#handleDocumentClick)
    window.removeEventListener('popstate', this.#handlePopState)
    window.removeEventListener(this.#usesScrollEnd ? 'scrollend' : 'scroll', this.#handleScroll)
    history.scrollRestoration = this.#previousScrollRestoration

    this.#cancelScheduledScrollCapture()

    this.#navigationController?.abort()
    this.#navigationController = null
    this.#isNavigating = false
    this.#destroyCurrentPage()
    this.#resetStage()
    clearElement(this.#root)
  }

  #resolveRoute(url) {
    return this.#routes.get(normalizePathname(url.pathname)) ?? this.#notFoundRoute
  }

  #captureCurrentScroll() {
    const url = new URL(window.location.href)
    const nextState = createHistoryState(history.state, url, {
      x: window.scrollX,
      y: window.scrollY,
    })

    history.replaceState(nextState, '', url)
  }

  #cancelScheduledScrollCapture() {
    if (this.#scrollTimer !== null) {
      window.clearTimeout(this.#scrollTimer)
      this.#scrollTimer = null
    }
  }

  #ownsNavigation(sequence, controller) {
    return (
      this.#navigationController === controller &&
      !controller.signal.aborted &&
      sequence === this.#navigationSequence
    )
  }

  async #render(url, { initial, restoreScroll }) {
    const sequence = ++this.#navigationSequence
    let renderCompleted = false

    this.#navigationController?.abort()
    const controller = new AbortController()
    this.#navigationController = controller

    this.#resetStage()
    this.#isNavigating = true
    this.#root.setAttribute('aria-busy', 'true')
    this.#root.inert = true

    try {
      const shouldAnimate = !initial && !prefersReducedMotion()

      if (shouldAnimate) {
        // Ensure the stable state is committed before the exit class is added.
        this.#root.getBoundingClientRect()
        this.#root.classList.add('is-route-leaving')

        const transitionCompleted = await waitForTransition(
          this.#root,
          this.#transitionDuration,
          controller.signal,
        )

        if (!transitionCompleted || !this.#ownsNavigation(sequence, controller)) {
          return false
        }
      }

      if (!this.#ownsNavigation(sequence, controller)) {
        return false
      }

      this.#destroyCurrentPage()

      // Page cleanup is application code and may synchronously redirect.
      if (!this.#ownsNavigation(sequence, controller)) {
        return false
      }

      const route = this.#resolveRoute(url)
      const pageContext = {
        path: normalizePathname(url.pathname),
        url,
        route,
        router: this,
        signal: controller.signal,
      }
      const page = route.createPage(pageContext)

      // Route factories are kept deliberately simple, but ownership is still
      // checked so a synchronous redirect cannot let stale work commit.
      if (!this.#ownsNavigation(sequence, controller)) {
        return false
      }

      if (!page || !(page.element instanceof Node)) {
        throw new TypeError(`Route "${pageContext.path}" did not return a valid page element.`)
      }

      clearElement(this.#root)

      if (!this.#ownsNavigation(sequence, controller)) {
        return false
      }

      // Register ownership before insertion because custom-element callbacks
      // can run synchronously while a node is connected to the document.
      this.#currentPage = page
      this.#root.append(page.element)

      if (!this.#ownsNavigation(sequence, controller)) {
        return false
      }

      try {
        page.mount?.(pageContext)
      } catch (error) {
        const stillOwnsNavigation = this.#ownsNavigation(sequence, controller)

        if (this.#currentPage === page) {
          this.#destroyCurrentPage()
        }

        if (!stillOwnsNavigation) {
          console.error('[RIHLATI] A superseded page failed while mounting.', error)
          return false
        }

        throw error
      }

      // A mount hook can perform an immediate guard/redirect. In that case the
      // newer navigation owns the stage, title, focus, and scroll position.
      if (!this.#ownsNavigation(sequence, controller)) {
        return false
      }

      document.title = route.title

      if (shouldAnimate) {
        this.#root.classList.remove('is-route-leaving')
        this.#root.classList.add('is-route-entering')
        this.#root.getBoundingClientRect()
        this.#root.classList.remove('is-route-entering')
      }

      this.#root.inert = false
      this.#root.removeAttribute('aria-busy')

      if (!initial) {
        const main = this.#root.querySelector('main#main-content')
        main?.focus({ preventScroll: true })

        if (!this.#ownsNavigation(sequence, controller)) {
          return false
        }
      }

      window.scrollTo({
        left: restoreScroll.x,
        top: restoreScroll.y,
        behavior: 'instant',
      })

      this.#isNavigating = false
      delete document.body.dataset.appError
      renderCompleted = true
      return true
    } finally {
      if (this.#navigationController === controller && !renderCompleted) {
        this.#isNavigating = false
        this.#resetStage()
      }
    }
  }

  #destroyCurrentPage() {
    if (!this.#currentPage) {
      return
    }

    const page = this.#currentPage
    this.#currentPage = null

    try {
      page.destroy?.()
    } catch (error) {
      console.error('[RIHLATI] Page cleanup failed.', error)
    }
  }

  #resetStage() {
    this.#root.classList.remove('is-route-leaving', 'is-route-entering')
    this.#root.removeAttribute('aria-busy')
    this.#root.inert = false
  }

  #handleDocumentClick = (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }

    const target = event.target
    const anchor = target instanceof Element ? target.closest('a[data-router-link]') : null

    if (
      !(anchor instanceof HTMLAnchorElement) ||
      anchor.hasAttribute('download') ||
      (anchor.target && anchor.target !== '_self')
    ) {
      return
    }

    const url = new URL(anchor.href, window.location.href)

    if (url.origin !== window.location.origin) {
      return
    }

    if (
      url.pathname === window.location.pathname &&
      url.search === window.location.search &&
      url.hash
    ) {
      return
    }

    event.preventDefault()
    void this.navigate(url).catch(this.#handleNavigationError)
  }

  #handlePopState = (event) => {
    this.#cancelScheduledScrollCapture()
    const url = new URL(window.location.href)

    void this.#render(url, {
      initial: false,
      restoreScroll: getStoredScrollPosition(event.state),
    }).catch(this.#handleNavigationError)
  }

  #handleScroll = () => {
    if (!this.#started || this.#isNavigating) {
      return
    }

    this.#cancelScheduledScrollCapture()

    const delay = this.#usesScrollEnd ? 0 : 200
    this.#scrollTimer = window.setTimeout(() => {
      this.#scrollTimer = null

      if (this.#started && !this.#isNavigating) {
        this.#captureCurrentScroll()
      }
    }, delay)
  }

  #handleNavigationError = (error) => {
    document.body.dataset.appError = 'true'
    console.error('[RIHLATI] Route navigation failed.', error)
  }
}
