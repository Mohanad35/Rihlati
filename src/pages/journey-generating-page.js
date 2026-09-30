import { homeAssets } from '../assets/home-assets.js'
import { touristAssets } from '../assets/tourist-assets.js'
import { createElement } from '../utils/dom.js'
import {
  getTouristAnswers,
  savePendingJourney,
} from '../services/guest-session-service.js'

import {
  buildTouristJourney,
} from '../services/tourist-journey-builder-service.js'

const MESSAGE_INTERVAL_MS = 950
const COMPLETION_DELAY_MS = 4200
const JOURNEY_PATH = '/t-journey'

const GENERATION_MESSAGES = Object.freeze([
  'Reading your preferences',
  'Matching regions & experiences',
  'Drawing your route across Jordan',
  'Adding tips & timing',
])

function createLoadingGraphic() {
  return createElement('div', {
    className: 'journey-generating__graphic',
    attributes: { 'aria-hidden': 'true' },
    children: [
      createElement('span', { className: 'journey-generating__ring' }),
      createElement('span', {
        className: 'journey-generating__ring journey-generating__ring--spinner animate-spin-ring',
      }),
      createElement('span', {
        className: 'journey-generating__map-frame',
        children: [
          createElement('img', {
            className: 'journey-generating__map',
            attributes: {
              src: homeAssets.jordanMap,
              alt: '',
              draggable: 'false',
              decoding: 'async',
            },
          }),
        ],
      }),
      createElement('img', {
        className: 'journey-generating__markers animate-float',
        attributes: {
          src: touristAssets.routeMarkers,
          alt: '',
          draggable: 'false',
          decoding: 'async',
        },
      }),
    ],
  })
}

export function createJourneyGeneratingPage({ router } = {}) {
  if (!router || typeof router.navigate !== 'function') {
    throw new TypeError('Journey Generating requires the application router.')
  }

  let currentMessage = 0
  let mounted = false
  let active = false
  let destroyed = false
  let messageTimer = null
  let completionTimer = null
  let routeSignal = null

  const status = createElement('p', {
    className: 'journey-generating__status',
    text: `${GENERATION_MESSAGES[currentMessage]}…`,
    attributes: {
      role: 'status',
      'aria-live': 'polite',
      'aria-atomic': 'true',
    },
  })

  const progressFill = createElement('span', {
    className: 'journey-generating__progress-fill',
  })

  const progress = createElement('div', {
    className: 'journey-generating__progress',
    attributes: {
      role: 'progressbar',
      'aria-label': 'Building your journey',
      'aria-valuemin': '0',
      'aria-valuemax': '100',
      'aria-valuenow': '25',
      'aria-valuetext': `Step 1 of ${GENERATION_MESSAGES.length}: ${GENERATION_MESSAGES[0]}`,
    },
    children: [progressFill],
  })

  const page = createElement('div', {
    className: 'journey-generating-page paper',
    children: [
      createElement('main', {
        className: 'journey-generating',
        attributes: {
          id: 'main-content',
          tabindex: '-1',
          'aria-labelledby': 'journey-generating-title',
        },
        children: [
          createElement('div', {
            className: 'journey-generating__content animate-fade',
            children: [
              createLoadingGraphic(),
              createElement('p', {
                className: 'journey-generating__arabic font-arabic',
                text: 'نبني رحلتك عبر الأردن',
                attributes: { lang: 'ar', dir: 'rtl' },
              }),
              createElement('h1', {
                className: 'journey-generating__title',
                text: 'Building your journey through Jordan',
                attributes: { id: 'journey-generating-title' },
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
    const percentage = ((currentMessage + 1) / GENERATION_MESSAGES.length) * 100
    const message = GENERATION_MESSAGES[currentMessage]

    status.textContent = `${message}…`
    progressFill.style.width = `${percentage}%`
    progress.setAttribute('aria-valuenow', String(percentage))
    progress.setAttribute(
      'aria-valuetext',
      `Step ${currentMessage + 1} of ${GENERATION_MESSAGES.length}: ${message}`,
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

      const answers = getTouristAnswers()

if (
  !answers
  || typeof answers !== 'object'
  || Array.isArray(answers)
) {
  stop()

  void router.navigate('/t-questionnaire').catch((error) => {
    console.error(
      '[RIHLATI] Missing tourist answers; questionnaire navigation failed.',
      error,
    )
  })

  return
}

try {
  const generatedJourney =
    buildTouristJourney(answers)

  const saved =
    savePendingJourney(
      generatedJourney,
    )

  if (!saved) {
    throw new Error(
      'Unable to store the generated journey.',
    )
  }
} catch (error) {
  console.error(
    '[RIHLATI] Journey matching failed.',
    error,
  )

  stop()

  void router.navigate('/t-questionnaire').catch(
    (navigationError) => {
      console.error(
        '[RIHLATI] Questionnaire fallback navigation failed.',
        navigationError,
      )
    },
  )

  return
}

      if (routeSignal?.aborted) {
        clearTimers()
        return
      }

      routeSignal?.addEventListener('abort', clearTimers, { once: true })

      messageTimer = window.setInterval(() => {
        if (!active || destroyed) {
          return
        }

        const nextMessage = Math.min(currentMessage + 1, GENERATION_MESSAGES.length - 1)

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
        void router.navigate(JOURNEY_PATH).catch((error) => {
          console.error('[RIHLATI] Journey generation navigation failed.', error)
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
