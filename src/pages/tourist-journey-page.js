import { createJourneyMapPresentation } from '../components/journey-map-presentation.js'
import { createSiteHeader, mountSiteHeader } from '../components/site-shell.js'
import { createCard, createEyebrow, createIcon } from '../components/ui.js'
import { touristJourneyStops } from '../data/tourist-journey-presentation-data.js'
import {
  getTouristAnswers,
  savePendingJourney,
} from '../services/guest-session-service.js'
import { createElement } from '../utils/dom.js'

const QUESTIONNAIRE_PATH = '/t-questionnaire'
const SAVE_PATH = '/t-save'

function createPendingJourneySnapshot() {
  return {
    schemaVersion: 1,
    journeyKey: 'heritage-desert-escape',
    title: 'Heritage & Desert Escape',
    summary: {
      durationDays: 4,
      stopCount: touristJourneyStops.length,
      pace: 'Balanced pace',
      focus: 'Culture-led',
    },
    preferences: getTouristAnswers() ?? {},
    stops: touristJourneyStops.map((stop) => ({
      day: stop.day,
      name: stop.name,
      nameAr: stop.nameAr,
      region: stop.region,
      type: stop.type,
      time: stop.time,
      why: stop.why,
      tip: stop.tip,
      image: stop.image,
      imageAlt: stop.imageAlt,
    })),
  }
}

function createSummaryBadge({ label, tone, icon }) {
  return createElement('span', {
    className: `badge badge--${tone} tourist-journey-summary__badge`,
    children: [
      ...(icon ? [createIcon(icon, { className: 'tourist-journey-summary__badge-icon' })] : []),
      document.createTextNode(label),
    ],
  })
}

function createActionLink({ href, label, variant, icon }) {
  return createElement('a', {
    className: `button button--${variant} tourist-journey__action`,
    attributes: {
      href,
      'data-router-link': true,
    },
    children: [
      createElement('span', { text: label }),
      ...(icon
        ? [
            createElement('span', {
              className: 'tourist-journey__action-icon',
              attributes: { 'aria-hidden': 'true' },
              children: [createIcon(icon)],
            }),
          ]
        : []),
    ],
  })
}

function createStopCard(stop, index, activeIndex) {
  const active = index === activeIndex

  return createElement('li', {
    className: ['journey-stop-card', 'card', active ? 'is-active' : ''].filter(Boolean).join(' '),
    attributes: { 'data-journey-stop-card': index },
    children: [
      createElement('button', {
        className: 'journey-stop-card__select',
        attributes: {
          type: 'button',
          'data-journey-action': 'select-stop',
          'data-stop-index': index,
          'aria-label': `Select Day ${stop.day}: ${stop.name}`,
          'aria-pressed': active ? 'true' : 'false',
        },
      }),
      createElement('div', {
        className: 'journey-stop-card__content',
        children: [
          createElement('div', {
            className: 'journey-stop-card__image-wrap',
            children: [
              createElement('img', {
                className: 'journey-stop-card__image',
                attributes: {
                  src: stop.image,
                  alt: stop.imageAlt,
                  loading: index === 0 ? 'eager' : 'lazy',
                  decoding: 'async',
                },
              }),
              createElement('span', {
                className: 'journey-stop-card__number',
                text: String(index + 1),
                attributes: { 'aria-hidden': 'true' },
              }),
            ],
          }),
          createElement('div', {
            className: 'journey-stop-card__details',
            children: [
              createElement('div', {
                className: 'journey-stop-card__meta',
                children: [
                  createElement('p', { text: `Day ${stop.day}` }),
                  createElement('span', { text: stop.time }),
                ],
              }),
              createElement('h3', {
                className: 'journey-stop-card__name',
                text: stop.name,
              }),
              createElement('p', {
                className: 'journey-stop-card__type',
                text: `${stop.type} · ${stop.region}`,
              }),
              createElement('button', {
                className: 'journey-stop-card__peek',
                attributes: {
                  type: 'button',
                  'data-journey-action': 'quick-peek',
                  'data-stop-index': index,
                  'aria-label': `Quick peek: ${stop.name}`,
                },
                children: [
                  createIcon('eye', { className: 'journey-stop-card__peek-icon' }),
                  document.createTextNode('Quick peek'),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  })
}

function createTripGuidance() {
  return createCard({
    tagName: 'aside',
    className: 'journey-guidance',
    attributes: { 'aria-labelledby': 'journey-guidance-title' },
    children: [
      createElement('span', {
        className: 'journey-guidance__icon',
        attributes: { 'aria-hidden': 'true' },
        children: [createIcon('bulb')],
      }),
      createElement('div', {
        children: [
          createElement('h3', {
            attributes: { id: 'journey-guidance-title' },
            text: 'Trip guidance',
          }),
          createElement('p', {
            text: 'Your route keeps daily travel comfortable. Consider a Bedouin camp for your Wadi Rum night, and keep Petra unhurried.',
          }),
        ],
      }),
    ],
  })
}

function createDestinationContext(stop) {
  const arabicName = createElement('span', {
    className: 'font-arabic',
    text: stop.nameAr,
    attributes: { lang: 'ar', dir: 'rtl' },
  })

  return createCard({
    className: 'journey-context-card animate-scale-in',
    attributes: { 'aria-labelledby': 'journey-context-name' },
    children: [
      createElement('div', {
        className: 'journey-context-card__body',
        children: [
          createElement('img', {
            className: 'journey-context-card__image',
            attributes: {
              src: stop.image,
              alt: stop.imageAlt,
              decoding: 'async',
            },
          }),
          createElement('div', {
            className: 'journey-context-card__copy',
            children: [
              createElement('span', {
                className: 'badge badge--terracotta',
                text: 'Why this place?',
              }),
              createElement('h2', {
                className: 'journey-context-card__name',
                attributes: { id: 'journey-context-name' },
                children: [
                  document.createTextNode(`${stop.name} `),
                  createElement('span', {
                    className: 'journey-context-card__arabic font-arabic',
                    children: [document.createTextNode('· '), arabicName],
                  }),
                ],
              }),
              createElement('p', {
                className: 'journey-context-card__why',
                text: stop.why,
              }),
            ],
          }),
        ],
      }),
      createElement('div', {
        className: 'journey-context-card__tip',
        children: [
          createIcon('bulb', { className: 'journey-context-card__tip-icon' }),
          createElement('p', {
            children: [
              createElement('strong', { text: 'Tip:' }),
              document.createTextNode(` ${stop.tip}`),
            ],
          }),
        ],
      }),
    ],
  })
}

function createInfoPanel({ icon, title, text, tone = 'brand' }) {
  return createElement('div', {
    className: `journey-quick-peek__info journey-quick-peek__info--${tone}`,
    children: [
      createElement('p', {
        className: 'journey-quick-peek__info-title',
        children: [createIcon(icon), document.createTextNode(title)],
      }),
      createElement('p', {
        className: 'journey-quick-peek__info-copy',
        text,
      }),
    ],
  })
}

function createQuickPeekDialog(stop, index) {
  const titleId = `journey-quick-peek-title-${index}`
  const closeButton = createElement('button', {
    className: 'journey-quick-peek__close',
    attributes: {
      type: 'button',
      'data-journey-action': 'close-quick-peek',
      'aria-label': 'Close Quick Peek',
    },
    children: [createElement('span', { text: '✕', attributes: { 'aria-hidden': 'true' } })],
  })

  const dialog = createElement('dialog', {
    className: 'journey-quick-peek animate-scale-in',
    attributes: {
      'aria-modal': 'true',
      'aria-labelledby': titleId,
    },
    children: [
      createCard({
        tagName: 'div',
        className: 'journey-quick-peek__card',
        children: [
          createElement('div', {
            className: 'journey-quick-peek__hero',
            children: [
              createElement('img', {
                attributes: {
                  src: stop.image,
                  alt: stop.imageAlt,
                  decoding: 'async',
                },
              }),
              closeButton,
              createElement('span', {
                className: 'badge badge--gold journey-quick-peek__day',
                text: `Day ${stop.day} · ${stop.time}`,
              }),
            ],
          }),
          createElement('div', {
            className: 'journey-quick-peek__body',
            children: [
              createElement('div', {
                children: [
                  createElement('h2', {
                    attributes: { id: titleId },
                    text: stop.name,
                  }),
                  createElement('p', {
                    className: 'journey-quick-peek__location font-arabic',
                    children: [
                      createElement('span', {
                        className: 'font-arabic',
                        text: stop.nameAr,
                        attributes: { lang: 'ar', dir: 'rtl' },
                      }),
                      document.createTextNode(` · ${stop.region}`),
                    ],
                  }),
                  createElement('span', {
                    className: 'badge badge--brand journey-quick-peek__type',
                    text: stop.type,
                  }),
                  createElement('p', {
                    className: 'journey-quick-peek__why',
                    children: [
                      createElement('strong', { text: 'Why it fits: ' }),
                      document.createTextNode(stop.why),
                    ],
                  }),
                ],
              }),
              createElement('div', {
                className: 'journey-quick-peek__details',
                children: [
                  createInfoPanel({
                    icon: 'clock',
                    title: 'Recommended time',
                    text: stop.time,
                  }),
                  createInfoPanel({
                    icon: 'bulb',
                    title: 'Insider tip',
                    text: stop.tip,
                    tone: 'gold',
                  }),
                  createElement('button', {
                    className: 'button button--primary button--full journey-quick-peek__save',
                    attributes: {
                      type: 'button',
                      'data-journey-action': 'save-from-quick-peek',
                    },
                    children: [
                      createElement('span', { text: 'Save this journey' }),
                      createIcon('heart', { className: 'journey-quick-peek__save-icon' }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  })

  return { dialog, closeButton }
}

export function createTouristJourneyPage({ path = '/t-journey', router } = {}) {
  if (!router || typeof router.navigate !== 'function') {
    throw new TypeError('Tourist Journey requires the application router.')
  }

  let activeStopIndex = 0
  let quickPeekDialog = null
  let quickPeekController = null
  let quickPeekOpener = null
  let previousBodyOverflow = ''
  let routeSignal = null
  let mounted = false
  let destroyed = false

  const header = createSiteHeader({ currentPath: path })
  const stopCards = touristJourneyStops.map((stop, index) =>
    createStopCard(stop, index, activeStopIndex),
  )
  const journeyMap = createJourneyMapPresentation({
    stops: touristJourneyStops,
    activeIndex: activeStopIndex,
  })
  const contextHost = createElement('div', {
    className: 'tourist-journey__context',
    children: [createDestinationContext(touristJourneyStops[activeStopIndex])],
  })
  const selectionStatus = createElement('p', {
    className: 'visually-hidden',
    attributes: {
      role: 'status',
      'aria-live': 'polite',
      'aria-atomic': 'true',
    },
  })

  const main = createElement('main', {
    className: 'tourist-journey-main',
    attributes: { id: 'main-content', tabindex: '-1' },
    children: [
      createElement('section', {
        className: 'tourist-journey',
        attributes: { 'aria-labelledby': 'tourist-journey-title' },
        children: [
          createElement('div', {
            className: 'tourist-journey__overview animate-rise',
            children: [
              createElement('div', {
                children: [
                  createEyebrow('Your personalized journey'),
                  createElement('h1', {
                    className: 'tourist-journey__title',
                    attributes: { id: 'tourist-journey-title' },
                    text: 'Heritage & Desert Escape',
                  }),
                  createElement('div', {
                    className: 'tourist-journey-summary',
                    attributes: { 'aria-label': 'Journey summary' },
                    children: [
                      createSummaryBadge({ label: '4 days', tone: 'brand', icon: 'clock' }),
                      createSummaryBadge({
                        label: `${touristJourneyStops.length} stops`,
                        tone: 'terracotta',
                        icon: 'pin',
                      }),
                      createSummaryBadge({ label: 'Balanced pace', tone: 'sand' }),
                      createSummaryBadge({ label: 'Culture-led', tone: 'gold' }),
                    ],
                  }),
                ],
              }),
              createElement('div', {
                className: 'tourist-journey__actions',
                children: [
                  createActionLink({
                    href: QUESTIONNAIRE_PATH,
                    label: 'Adjust preferences',
                    variant: 'outline',
                  }),
                  createActionLink({
                    href: SAVE_PATH,
                    label: 'Save journey',
                    variant: 'gold',
                    icon: 'heart',
                  }),
                ],
              }),
            ],
          }),
          createElement('div', {
            className: 'tourist-journey__grid',
            children: [
              createElement('section', {
                attributes: { 'aria-labelledby': 'journey-itinerary-title' },
                children: [
                  createElement('h2', {
                    className: 'visually-hidden',
                    attributes: { id: 'journey-itinerary-title' },
                    text: 'Day-by-day itinerary',
                  }),
                  createElement('ol', {
                    className: 'tourist-journey__itinerary',
                    children: stopCards,
                  }),
                  createTripGuidance(),
                  selectionStatus,
                ],
              }),
              createElement('div', {
                className: 'tourist-journey__map-column',
                children: [journeyMap.element, contextHost],
              }),
            ],
          }),
        ],
      }),
    ],
  })

  const page = createElement('div', {
    className: 'tourist-journey-page paper',
    children: [header, main],
  })

  const pageController = new AbortController()
  let headerCleanup = () => {}

  const getStopIndex = (control) => {
    const index = Number(control.dataset.stopIndex)
    return Number.isInteger(index) && index >= 0 && index < touristJourneyStops.length
      ? index
      : null
  }

  const updateActiveStop = (nextIndex) => {
    if (nextIndex === activeStopIndex) {
      return
    }

    activeStopIndex = nextIndex
    stopCards.forEach((card, index) => {
      const active = index === activeStopIndex
      card.classList.toggle('is-active', active)
      card.querySelector('.journey-stop-card__select').setAttribute(
        'aria-pressed',
        active ? 'true' : 'false',
      )
    })
    journeyMap.setActive(activeStopIndex)
    contextHost.replaceChildren(createDestinationContext(touristJourneyStops[activeStopIndex]))
    selectionStatus.textContent = `Selected stop ${activeStopIndex + 1}: ${touristJourneyStops[activeStopIndex].name}.`
  }

  const closeQuickPeek = ({ restoreFocus = true } = {}) => {
    if (!quickPeekDialog) {
      return
    }

    const dialog = quickPeekDialog
    const opener = quickPeekOpener
    quickPeekDialog = null
    quickPeekOpener = null
    quickPeekController?.abort()
    quickPeekController = null

    if (dialog.open) {
      dialog.close()
    }

    dialog.remove()
    document.body.style.overflow = previousBodyOverflow

    if (restoreFocus && opener?.isConnected) {
      opener.focus({ preventScroll: true })
    } else if (!restoreFocus && main.isConnected) {
      main.focus({ preventScroll: true })
    }
  }

  const openQuickPeek = (index, opener) => {
    closeQuickPeek({ restoreFocus: false })

    const stop = touristJourneyStops[index]
    const { dialog, closeButton } = createQuickPeekDialog(stop, index)
    const controller = new AbortController()
    quickPeekDialog = dialog
    quickPeekController = controller
    quickPeekOpener = opener instanceof HTMLElement ? opener : null
    previousBodyOverflow = document.body.style.overflow

    dialog.addEventListener(
      'cancel',
      (event) => {
        event.preventDefault()
        closeQuickPeek()
      },
      { signal: controller.signal },
    )

    dialog.addEventListener(
      'click',
      (event) => {
        if (event.target !== dialog) {
          return
        }

        const bounds = dialog.getBoundingClientRect()
        const outside =
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom

        if (outside) {
          closeQuickPeek()
        }
      },
      { signal: controller.signal },
    )

    dialog.addEventListener(
      'keydown',
      (event) => {
        if (event.key !== 'Tab') {
          return
        }

        const focusableControls = [...dialog.querySelectorAll('button:not([disabled])')]
        const firstControl = focusableControls[0]
        const lastControl = focusableControls.at(-1)

        if (!firstControl || !lastControl) {
          event.preventDefault()
          return
        }

        if (event.shiftKey && document.activeElement === firstControl) {
          event.preventDefault()
          lastControl.focus()
        } else if (!event.shiftKey && document.activeElement === lastControl) {
          event.preventDefault()
          firstControl.focus()
        }
      },
      { signal: controller.signal },
    )

    page.append(dialog)
    document.body.style.overflow = 'hidden'
    dialog.showModal()
    closeButton.focus({ preventScroll: true })
  }

  const navigate = (destination) => {
    void router.navigate(destination).catch((error) => {
      console.error('[RIHLATI] Tourist Journey navigation failed.', error)
    })
  }

  const handleClick = (event) => {
    const actionControl = event.target instanceof Element
      ? event.target.closest('[data-journey-action]')
      : null

    if (!(actionControl instanceof HTMLElement)) {
      return
    }

    const action = actionControl.dataset.journeyAction

    if (action === 'select-stop') {
      const index = getStopIndex(actionControl)
      if (index !== null) {
        updateActiveStop(index)
      }
      return
    }

    if (action === 'quick-peek') {
      const index = getStopIndex(actionControl)
      if (index !== null) {
        openQuickPeek(index, actionControl)
      }
      return
    }

    if (action === 'close-quick-peek') {
      closeQuickPeek()
      return
    }

    if (action === 'save-from-quick-peek') {
      closeQuickPeek({ restoreFocus: false })
      navigate(SAVE_PATH)
    }
  }

  const handleRouteAbort = () => closeQuickPeek({ restoreFocus: false })

  return {
    element: page,

    mount({ signal } = {}) {
      if (mounted || destroyed) {
        return
      }

      mounted = true
      savePendingJourney(createPendingJourneySnapshot())
      headerCleanup = mountSiteHeader(header, { signal: pageController.signal })
      page.addEventListener('click', handleClick, { signal: pageController.signal })
      routeSignal = signal instanceof AbortSignal ? signal : null
      routeSignal?.addEventListener('abort', handleRouteAbort, { once: true })
    },

    destroy() {
      if (destroyed) {
        return
      }

      destroyed = true
      routeSignal?.removeEventListener('abort', handleRouteAbort)
      routeSignal = null
      closeQuickPeek({ restoreFocus: false })
      pageController.abort()
      headerCleanup()
    },
  }
}
