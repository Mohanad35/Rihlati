import { createElement } from '../utils/dom.js'
import { mountRevealObserver } from '../utils/reveal.js'

const lifecycleStats = {
  active: 0,
  mounts: 0,
  destroys: 0,
}

const smokeRoutes = [
  { path: '/', label: 'Foundation' },
  { path: '/foundation/lifecycle', label: 'Lifecycle check' },
]

function createRouterLink({ path, label, currentPath, className = '' }) {
  return createElement('a', {
    className,
    text: label,
    attributes: {
      href: path,
      'data-router-link': true,
      ...(path === currentPath ? { 'aria-current': 'page' } : {}),
    },
  })
}

function createHeader(currentPath) {
  const brand = createRouterLink({
    path: '/',
    currentPath,
    className: 'foundation-brand',
    label: 'RIHLATI · VANILLA FOUNDATION',
  })

  const navigation = createElement('nav', {
    className: 'foundation-nav',
    attributes: { 'aria-label': 'Foundation smoke routes' },
    children: smokeRoutes.map((route) =>
      createRouterLink({ ...route, currentPath, className: 'foundation-nav__link' }),
    ),
  })

  return createElement('header', {
    className: 'foundation-header glass',
    children: [
      createElement('div', {
        className: 'container foundation-header__inner',
        children: [brand, navigation],
      }),
    ],
  })
}

function createStatusCard({ title, description, badge }) {
  return createElement('article', {
    className: 'foundation-card reveal',
    attributes: { 'data-reveal': true },
    children: [
      createElement('span', { className: 'foundation-card__badge', text: badge }),
      createElement('h2', { text: title }),
      createElement('p', { text: description }),
    ],
  })
}

function createTokenStrip() {
  const tokens = [
    ['Deep Jordan Teal', 'token-swatch--brand'],
    ['Petra Terracotta', 'token-swatch--terracotta'],
    ['Desert Sand', 'token-swatch--sand'],
    ['Opportunity Gold', 'token-swatch--gold'],
    ['Primary Dark', 'token-swatch--dark'],
  ]

  return createElement('div', {
    className: 'token-strip',
    attributes: { 'aria-label': 'Verified Rihlati color tokens' },
    children: tokens.map(([label, modifier]) =>
      createElement('span', {
        className: `token-swatch ${modifier}`,
        attributes: { title: label, 'aria-label': label },
      }),
    ),
  })
}

function createFoundationMain({ path, variant, requestedPath }) {
  const isLifecycleRoute = variant === 'lifecycle'
  const isNotFound = variant === 'not-found'

  const title = isNotFound
    ? 'Neutral route fallback verified'
    : isLifecycleRoute
      ? 'Explicit mount and cleanup are active'
      : 'Vanilla foundation ready'

  const description = isNotFound
    ? `No smoke route matches “${requestedPath}”. This development-only fallback confirms unknown paths are handled without mounting a product screen.`
    : isLifecycleRoute
      ? 'This second neutral route exists only to exercise History API navigation, page destruction, observer cleanup, timer cleanup, and re-mounting.'
      : 'A development-only smoke screen proving the standalone HTML, authored CSS, ES modules, route lifecycle, accessibility baseline, and Rihlati visual tokens.'

  const lifecycleOutput = createElement('output', {
    className: 'foundation-diagnostic',
    attributes: { 'data-lifecycle-output': true },
  })
  const heartbeatOutput = createElement('output', {
    className: 'foundation-diagnostic',
    text: 'Mounted for 0 seconds',
    attributes: { 'data-heartbeat-output': true },
  })
  const interactionOutput = createElement('output', {
    className: 'foundation-diagnostic',
    text: 'Local interactions: 0',
    attributes: { 'data-interaction-output': true, 'aria-live': 'polite' },
  })
  const interactionButton = createElement('button', {
    className: 'foundation-button',
    text: 'Test page-local listener',
    attributes: { type: 'button', 'data-interaction-button': true },
  })

  const main = createElement('main', {
    className: 'container foundation-main',
    attributes: { id: 'main-content', tabindex: '-1' },
    children: [
      createElement('section', {
        className: 'foundation-intro animate-rise',
        attributes: { 'aria-labelledby': 'foundation-title' },
        children: [
          createElement('p', {
            className: 'foundation-eyebrow',
            text: 'Development-only smoke screen',
          }),
          createElement('h1', { text: title, attributes: { id: 'foundation-title' } }),
          createElement('p', { className: 'foundation-lead', text: description }),
          createElement('p', {
            className: 'foundation-arabic-sample',
            text: 'رحلتي — أساس فانيلا مستقل',
            attributes: { lang: 'ar', dir: 'rtl' },
          }),
          createTokenStrip(),
        ],
      }),
      createElement('section', {
        className: 'foundation-grid',
        attributes: { 'aria-label': 'Foundation capabilities' },
        children: [
          createStatusCard({
            badge: 'HTML + ESM',
            title: 'Standalone application',
            description: 'No frontend framework, build tool, package manager, or dependency on the reference prototype.',
          }),
          createStatusCard({
            badge: 'History API',
            title: 'Real navigation lifecycle',
            description: 'Push, replace, popstate, Back, Forward, refresh architecture, route transitions, mount, and destroy are explicit.',
          }),
          createStatusCard({
            badge: 'ACCESSIBILITY',
            title: 'Keyboard-first foundation',
            description: 'The document has a working skip link, semantic main target, focus-visible treatment, and motion preference support.',
          }),
          createStatusCard({
            badge: 'AUTHORED CSS',
            title: 'Rihlati visual identity',
            description: 'Verified colors, typography, radii, shadows, layout conventions, paper texture, glass, and global motion are expressed as CSS.',
          }),
        ],
      }),
      createElement('section', {
        className: 'foundation-lifecycle reveal',
        attributes: {
          'data-reveal': true,
          'aria-labelledby': 'lifecycle-title',
        },
        children: [
          createElement('div', {
            children: [
              createElement('p', { className: 'foundation-eyebrow', text: 'Lifecycle diagnostics' }),
              createElement('h2', { text: 'One mounted page. Cleanup before replacement.', attributes: { id: 'lifecycle-title' } }),
              createElement('p', {
                text: 'The timer, listener, and reveal observer below belong to this page instance and are released by destroy().',
              }),
            ],
          }),
          createElement('div', {
            className: 'foundation-diagnostics',
            children: [lifecycleOutput, heartbeatOutput, interactionOutput, interactionButton],
          }),
        ],
      }),
      createElement('section', {
        className: 'foundation-actions reveal',
        attributes: { 'data-reveal': true, 'aria-label': 'Router smoke navigation' },
        children: [
          createElement('p', {
            text: isLifecycleRoute
              ? 'Return through the router, then use browser Forward to verify popstate.'
              : 'Move to the second neutral route, then use browser Back and Forward.',
          }),
          createRouterLink({
            path: isLifecycleRoute ? '/' : '/foundation/lifecycle',
            currentPath: path,
            className: 'foundation-button foundation-button--link',
            label: isLifecycleRoute ? 'Return to foundation' : 'Open lifecycle check',
          }),
        ],
      }),
    ],
  })

  return {
    main,
    lifecycleOutput,
    heartbeatOutput,
    interactionOutput,
    interactionButton,
  }
}

function createFooter() {
  return createElement('footer', {
    className: 'foundation-footer',
    children: [
      createElement('div', {
        className: 'container',
        children: [
          createElement('p', {
            text: 'Pure static foundation only — no RIHLATI product screen is implemented here.',
          }),
        ],
      }),
    ],
  })
}

export function createFoundationPage({ path, variant = 'foundation', requestedPath = '' }) {
  const page = createElement('div', {
    className: 'foundation-page',
  })
  const mainParts = createFoundationMain({ path, variant, requestedPath })

  page.append(createHeader(path), mainParts.main, createFooter())

  const pageController = new AbortController()
  let revealCleanup = () => {}
  let heartbeatTimer = null
  let mounted = false
  let destroyed = false
  let interactionCount = 0
  let secondsMounted = 0

  const updateLifecycleOutput = () => {
    mainParts.lifecycleOutput.textContent = `Active page instances: ${lifecycleStats.active} · mounts: ${lifecycleStats.mounts} · destroys: ${lifecycleStats.destroys}`
  }

  return {
    element: page,

    mount() {
      if (mounted || destroyed) {
        return
      }

      mounted = true
      lifecycleStats.active += 1
      lifecycleStats.mounts += 1
      updateLifecycleOutput()

      revealCleanup = mountRevealObserver(page)

      mainParts.interactionButton.addEventListener(
        'click',
        () => {
          interactionCount += 1
          mainParts.interactionOutput.textContent = `Local interactions: ${interactionCount}`
        },
        { signal: pageController.signal },
      )

      heartbeatTimer = window.setInterval(() => {
        secondsMounted += 1
        mainParts.heartbeatOutput.textContent = `Mounted for ${secondsMounted} second${secondsMounted === 1 ? '' : 's'}`
      }, 1000)
    },

    destroy() {
      if (!mounted || destroyed) {
        return
      }

      destroyed = true
      pageController.abort()
      revealCleanup()

      if (heartbeatTimer !== null) {
        window.clearInterval(heartbeatTimer)
        heartbeatTimer = null
      }

      lifecycleStats.active = Math.max(0, lifecycleStats.active - 1)
      lifecycleStats.destroys += 1
    },
  }
}
