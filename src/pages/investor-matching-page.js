import { homeAssets } from '../assets/home-assets.js'
import { createElement } from '../utils/dom.js'

const MESSAGE_INTERVAL_MS = 950
const COMPLETION_DELAY_MS = 4200
const RESULT_PATH = '/ni-result'

const MATCHING_MESSAGES = Object.freeze([
  'Reading your criteria',
  'Mapping demand across regions',
  'Highlighting strongest fits',
  'Preparing your matches',
])

// Presentation-only positions copied from the approved transition artwork.
// They are not governorate coordinates or part of the future matching domain model.
const PRESENTATION_MARKERS = Object.freeze([
  { x: 34, y: 77, tone: 'gold', delay: 600 },
  { x: 33, y: 26, tone: 'terracotta', delay: 1000 },
  { x: 30, y: 50, tone: 'terracotta', delay: 1400 },
])

function createMatchingGraphic() {
  return createElement('div', {
    className: 'investor-matching__map-card',
    attributes: { 'aria-hidden': 'true' },
    children: [
      createElement('img', {
        className: 'investor-matching__map',
        attributes: {
          src: homeAssets.jordanMap,
          alt: '',
          draggable: 'false',
          decoding: 'async',
        },
      }),
      ...PRESENTATION_MARKERS.map((marker) =>
        createElement('span', {
          className: `investor-matching__marker investor-matching__marker--${marker.tone} animate-pop`,
          attributes: {
            style: `--matching-x: ${marker.x}%; --matching-y: ${marker.y}%; --matching-delay: ${marker.delay}ms`,
          },
        }),
      ),
    ],
  })
}

export function createInvestorMatchingPage({ router } = {}) {
  if (!router || typeof router.navigate !== 'function') {
    throw new TypeError('Investor Matching requires the application router.')
  }

  let currentMessage = 0
  let mounted = false
  let active = false
  let destroyed = false
  let messageTimer = null
  let completionTimer = null
  let routeSignal = null

  const status = createElement('p', {
    className: 'investor-matching__status',
    text: `${MATCHING_MESSAGES[currentMessage]}…`,
    attributes: {
      role: 'status',
      'aria-live': 'polite',
      'aria-atomic': 'true',
    },
  })

  const progressFill = createElement('span', {
    className: 'investor-matching__progress-fill',
  })

  const progress = createElement('div', {
    className: 'investor-matching__progress',
    attributes: {
      role: 'progressbar',
      'aria-label': 'Finding investment matches',
      'aria-valuemin': '0',
      'aria-valuemax': '100',
      'aria-valuenow': '25',
      'aria-valuetext': `Step 1 of ${MATCHING_MESSAGES.length}: ${MATCHING_MESSAGES[0]}`,
    },
    children: [progressFill],
  })

  const page = createElement('div', {
    className: 'investor-matching-page paper',
    children: [
      createElement('main', {
        className: 'investor-matching',
        attributes: {
          id: 'main-content',
          tabindex: '-1',
          'aria-labelledby': 'investor-matching-title',
        },
        children: [
          createElement('div', {
            className: 'investor-matching__content animate-fade',
            children: [
              createMatchingGraphic(),
              createElement('p', {
                className: 'investor-matching__arabic font-arabic',
                text: 'نبحث عن أقوى الفرص',
                attributes: { lang: 'ar', dir: 'rtl' },
              }),
              createElement('h1', {
                className: 'investor-matching__title',
                text: 'Finding your strongest tourism opportunity matches',
                attributes: { id: 'investor-matching-title' },
              }),
              status,
              progress,
            ],
          }),
        ],
      }),
    ],
  })

  const renderProgress = () => {
    const percentage = ((currentMessage + 1) / MATCHING_MESSAGES.length) * 100
    const message = MATCHING_MESSAGES[currentMessage]

    status.textContent = `${message}…`
    progressFill.style.width = `${percentage}%`
    progress.setAttribute('aria-valuenow', String(percentage))
    progress.setAttribute(
      'aria-valuetext',
      `Step ${currentMessage + 1} of ${MATCHING_MESSAGES.length}: ${message}`,
    )
  }

  const clearTimers = () => {
    active = false

    if (messageTimer !== null) {
      window.clearInterval(messageTimer)
      messageTimer = null
    }

    if (completionTimer !== null) {
      window.clearTimeout(completionTimer)
      completionTimer = null
    }
  }

  const detachRouteSignal = () => {
    routeSignal?.removeEventListener('abort', clearTimers)
    routeSignal = null
  }

  const stop = () => {
    clearTimers()
    detachRouteSignal()
  }

  renderProgress()

  return {
    element: page,

    mount({ signal } = {}) {
      if (mounted || destroyed) {
        return
      }

      mounted = true
      active = true
      routeSignal = signal instanceof AbortSignal ? signal : null

      if (routeSignal?.aborted) {
        clearTimers()
        return
      }

      routeSignal?.addEventListener('abort', clearTimers, { once: true })

      messageTimer = window.setInterval(() => {
        if (!active || destroyed) {
          return
        }

        const nextMessage = Math.min(currentMessage + 1, MATCHING_MESSAGES.length - 1)

        if (nextMessage === currentMessage) {
          return
        }

        currentMessage = nextMessage
        renderProgress()
      }, MESSAGE_INTERVAL_MS)

      completionTimer = window.setTimeout(() => {
        if (!active || destroyed) {
          return
        }

        stop()
        void router.navigate(RESULT_PATH).catch((error) => {
          console.error('[RIHLATI] Investor matching navigation failed.', error)
        })
      }, COMPLETION_DELAY_MS)
    },

    destroy() {
      if (destroyed) {
        return
      }

      destroyed = true
      stop()
    },
  }
}
