import { createSiteFooter, createSiteHeader, mountSiteHeader } from '../components/site-shell.js'
import { createButtonLink, createEyebrow, createIcon } from '../components/ui.js'
import { routePaths } from '../data/home-presentation-data.js'
import { observeAuthState } from '../services/auth-service.js'
import { getCurrentUserJourneys } from '../services/journey-service.js'
import { createElement } from '../utils/dom.js'
import { mountRevealObserver } from '../utils/reveal.js'

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'
const JOURNEY_PATH = '/t-journey'
const QUESTIONNAIRE_PATH = '/t-questionnaire'
const SAVE_PATH = '/t-save'
const PASSPORT_TONES = ['teal', 'forest', 'terracotta']
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function createSvgElement(tagName, attributes = {}) {
  const element = document.createElementNS(SVG_NAMESPACE, tagName)

  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, String(value))
  }

  return element
}

function createSevenRayRosette(className = '') {
  const svg = createSvgElement('svg', {
    class: ['journey-rosette', className].filter(Boolean).join(' '),
    viewBox: '0 0 100 100',
    'aria-hidden': 'true',
    focusable: 'false',
  })
  const rays = createSvgElement('g', { fill: 'none', stroke: 'currentColor' })

  for (let index = 0; index < 7; index += 1) {
    const ray = createSvgElement('path', {
      d: 'M50 12 C45 24 45 34 50 43 C55 34 55 24 50 12Z',
      transform: `rotate(${index * (360 / 7)} 50 50)`,
      'stroke-width': '1.4',
    })
    rays.append(ray)
  }

  rays.append(
    createSvgElement('circle', {
      cx: '50',
      cy: '50',
      r: '6',
      'stroke-width': '1.4',
    }),
  )
  svg.append(rays)
  return svg
}

/** Decorative cover artwork only; never use this polygon as geographic data. */
function createDecorativeJordanOutline(className = '') {
  const svg = createSvgElement('svg', {
    class: ['journey-jordan-outline', className].filter(Boolean).join(' '),
    viewBox: '0 0 84 108',
    'aria-hidden': 'true',
    focusable: 'false',
  })
  const outline = createSvgElement('path', {
    d: 'M40 8 55 25 49 41 69 45 63 66 51 92 29 98 12 73 20 51 26 35 31 20Z',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '1.5',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  })
  const route = createSvgElement('path', {
    d: 'M39 22 C50 38 30 49 47 61 S54 78 39 88',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '1.4',
    'stroke-linecap': 'round',
    'stroke-dasharray': '2 5',
  })
  svg.append(outline, route)
  return svg
}

function createAbstractRouteTrace(stopCount, className = '') {
  const svg = createSvgElement('svg', {
    class: ['journey-route-trace', className].filter(Boolean).join(' '),
    viewBox: '0 0 280 72',
    preserveAspectRatio: 'none',
    'aria-hidden': 'true',
    focusable: 'false',
  })
  const verticalPositions = [47, 23, 40, 17, 45]
  const distance = stopCount > 1 ? 244 / (stopCount - 1) : 0
  const points = Array.from({ length: stopCount }, (_, index) => ({
    x: 18 + (distance * index),
    y: verticalPositions[index % verticalPositions.length],
  }))
  const line = createSvgElement('polyline', {
    class: 'journey-route-trace__line',
    points: points.map(({ x, y }) => `${x},${y}`).join(' '),
    fill: 'none',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  })
  svg.append(line)

  points.forEach(({ x, y }) => {
    svg.append(
      createSvgElement('circle', {
        class: 'journey-route-trace__stop',
        cx: x,
        cy: y,
        r: '4.5',
      }),
    )
  })

  return svg
}

function createCollectionFolio() {
  return createElement('div', {
    className: 'my-journeys-hero__folio animate-scale-in',
    attributes: { 'aria-hidden': 'true' },
    children: [
      createElement('span', { className: 'my-journeys-hero__folio-book my-journeys-hero__folio-book--back' }),
      createElement('span', { className: 'my-journeys-hero__folio-book my-journeys-hero__folio-book--middle' }),
      createElement('span', {
        className: 'my-journeys-hero__folio-book my-journeys-hero__folio-book--front',
        children: [createSevenRayRosette('my-journeys-hero__folio-rosette')],
      }),
    ],
  })
}

function createHero() {
  return createElement('section', {
    className: 'my-journeys-hero',
    attributes: { 'aria-labelledby': 'my-journeys-title' },
    children: [
      createElement('div', {
        className: 'container my-journeys-hero__inner',
        children: [
          createElement('div', {
            className: 'my-journeys-hero__copy animate-rise',
            children: [
              createEyebrow('My journeys'),
              createElement('h1', {
                className: 'my-journeys-hero__title',
                attributes: { id: 'my-journeys-title' },
                text: 'Your journeys through Jordan, collected like chapters in a travel passport.',
              }),
              createElement('p', {
                className: 'my-journeys-hero__lead',
                text: 'Reopen a saved route, revisit the story behind each stop, or refine the pace when the next chapter calls.',
              }),
              createElement('div', {
                className: 'my-journeys-hero__actions',
                children: [
                  createButtonLink({
                    href: routePaths.touristEntry,
                    label: 'Plan another journey',
                    arrow: true,
                  }),
                  createElement('span', {
                    className: 'my-journeys-hero__count',
                    text: 'Loading journey passports…',
                    attributes: {
                      'data-my-journeys-count': true,
                      'aria-live': 'polite',
                    },
                  }),
                ],
              }),
            ],
          }),
          createCollectionFolio(),
        ],
      }),
    ],
  })
}

function createPassportCover(journey) {
  const titleId = `journey-passport-title-${journey.id}`

  return createElement('div', {
    className: 'journey-passport__stage',
    children: [
      createElement('span', {
        className: 'journey-passport__leaf',
        attributes: { 'aria-hidden': 'true' },
      }),
      createElement('button', {
        className: `journey-passport__book journey-passport__book--${journey.tone}`,
        attributes: {
          type: 'button',
          'data-my-journeys-action': 'quick-peek',
          'data-journey-id': journey.id,
          'aria-label': `Quick Peek: ${journey.title}`,
          'aria-describedby': titleId,
        },
        children: [
          createElement('span', {
            className: 'journey-passport__spine',
            attributes: { 'aria-hidden': 'true' },
          }),
          createElement('span', {
            className: 'journey-passport__foil-catch',
            attributes: { 'aria-hidden': 'true' },
          }),
          createElement('span', {
            className: 'journey-passport__cover-top',
            children: [
              createElement('span', {
                className: 'journey-passport__brand',
                children: [
                  createElement('strong', { text: 'RIHLATI' }),
                  createElement('span', {
                    className: 'font-arabic',
                    text: 'رحلتي',
                    attributes: { lang: 'ar', dir: 'rtl' },
                  }),
                ],
              }),
              createElement('span', {
                className: 'journey-passport__type',
                text: 'Journey Passport',
              }),
            ],
          }),
          createElement('span', {
            className: 'journey-passport__motif',
            attributes: { 'aria-hidden': 'true' },
            children: [
              createDecorativeJordanOutline(),
              createSevenRayRosette(),
            ],
          }),
          createElement('span', {
            className: 'journey-passport__cover-title',
            text: journey.title,
          }),
          createElement('span', {
            className: 'journey-passport__cover-stats',
            text: `${journey.duration} · ${journey.stops} stops`,
          }),
          createAbstractRouteTrace(journey.stops, 'journey-passport__route'),
          createElement('span', {
            className: 'journey-passport__cover-foot',
            children: [
              createElement('span', {
                className: 'journey-passport__reference',
                text: `Journey ref · ${journey.reference}`,
              }),
              createElement('span', {
                className: 'journey-passport__status',
                text: journey.status,
              }),
            ],
          }),
          createElement('span', {
            className: 'journey-passport__peek',
            children: [
              createIcon('eye', { className: 'journey-passport__peek-icon' }),
              document.createTextNode('Quick Peek'),
            ],
          }),
        ],
      }),
    ],
  })
}

function createPassportCard(journey) {
  const titleId = `journey-passport-title-${journey.id}`

  return createElement('li', {
    className: 'journey-passport-grid__item reveal',
    children: [
      createElement('article', {
        className: 'journey-passport',
        attributes: { 'aria-labelledby': titleId },
        children: [
          createPassportCover(journey),
          createElement('div', {
            className: 'journey-passport__details',
            children: [
              createElement('div', {
                className: 'journey-passport__meta-row',
                children: [
                  createElement('span', {
                    className: `journey-passport__state journey-passport__state--${journey.status === 'Draft Journey' ? 'draft' : 'saved'}`,
                    text: journey.status,
                  }),
                  createElement('span', {
                    className: 'journey-passport__updated',
                    text: journey.updated,
                  }),
                ],
              }),
              createElement('h2', {
                className: 'journey-passport__title',
                attributes: { id: titleId },
                text: journey.title,
              }),
              createElement('p', {
                className: 'journey-passport__mood',
                text: `${journey.duration} · ${journey.stops} stops · ${journey.mood}`,
              }),
              createElement('div', {
                className: 'journey-passport__actions',
                children: [
                  createButtonLink({
                    href: JOURNEY_PATH,
                    label: 'Open Journey',
                    size: 'small',
                    arrow: true,
                    className: 'journey-passport__open',
                  }),
                  createButtonLink({
                    href: QUESTIONNAIRE_PATH,
                    label: 'Refine Preferences',
                    variant: 'outline',
                    size: 'small',
                    className: 'journey-passport__refine',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  })
}

function createCollectionShell() {
  const content = createElement('div', {
    className: 'journey-passport-collection__content',
    attributes: {
      'data-my-journeys-content': true,
      'aria-live': 'polite',
    },
  })
  const element = createElement('section', {
    className: 'container journey-passport-collection',
    attributes: { 'aria-labelledby': 'journey-passport-collection-title' },
    children: [
      createElement('div', {
        className: 'journey-passport-collection__heading',
        children: [
          createElement('div', {
            children: [
              createElement('h2', {
                attributes: { id: 'journey-passport-collection-title' },
                text: 'Your journey passports',
              }),
              createElement('p', {
                text: 'Open a cover for a closer look, or continue from any saved route.',
              }),
            ],
          }),
          createElement('p', {
            className: 'journey-passport-collection__note',
            text: 'Original Rihlati travel keepsakes · not identity documents',
          }),
        ],
      }),
      content,
    ],
  })

  return { element, content }
}

function createPassportGrid(journeys) {
  return createElement('ol', {
    className: 'journey-passport-grid',
    children: journeys.map(createPassportCard),
  })
}

function createCollectionState({ title, copy, type = 'status', action = null }) {
  return createElement('div', {
    className: `journey-passport-collection__state journey-passport-collection__state--${type}`,
    attributes: {
      role: type === 'error' ? 'alert' : 'status',
    },
    children: [
      createElement('h3', { text: title }),
      createElement('p', { text: copy }),
      ...(action ? [action] : []),
    ],
  })
}

function formatSavedDate(timestamp) {
  const date = typeof timestamp?.toDate === 'function'
    ? timestamp.toDate()
    : new Date(timestamp ?? Number.NaN)

  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return 'Saved Journey'
  }

  return `Saved ${new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)}`
}

function mapJourneyToPassport(journey, index) {
  const summary = journey.summary && typeof journey.summary === 'object'
    ? journey.summary
    : {}
  const destinations = Array.isArray(journey.stops)
    ? journey.stops.map((stop) => ({
        day: stop.day,
        name: stop.name,
        nameAr: stop.nameAr,
      }))
    : []
  const durationDays = Number.isInteger(summary.durationDays) ? summary.durationDays : 0
  const stopCount = Number.isInteger(summary.stopCount) ? summary.stopCount : destinations.length
  const duration = `${durationDays} ${durationDays === 1 ? 'day' : 'days'}`
  const mood = [summary.pace, summary.focus].filter(Boolean).join(' · ')
  const referenceSuffix = String(journey.id ?? journey.journeyKey ?? index + 1)
    .replace(/[^a-z0-9]/gi, '')
    .slice(0, 8)
    .toUpperCase()

  return {
    id: journey.id,
    reference: `RJ-${referenceSuffix || String(index + 1).padStart(3, '0')}`,
    title: journey.title,
    duration,
    stops: stopCount,
    mood,
    updated: formatSavedDate(journey.createdAt),
    status: 'Saved Journey',
    tone: PASSPORT_TONES[index % PASSPORT_TONES.length],
    summary: [duration, `${stopCount} ${stopCount === 1 ? 'stop' : 'stops'}`, mood]
      .filter(Boolean)
      .join(' · '),
    destinations,
  }
}

function createDialogDestinationList(journey) {
  if (journey.destinations.length === 0) {
    return createElement('div', {
      className: 'journey-passport-dialog__route-note',
      children: [
        createAbstractRouteTrace(journey.stops, 'journey-passport-dialog__route'),
        createElement('p', {
          text: `${journey.stops} stops are preserved in this presentation route. Open the journey to continue exploring it.`,
        }),
      ],
    })
  }

  return createElement('div', {
    className: 'journey-passport-dialog__chapters',
    children: [
      createElement('h3', { text: 'Route chapters' }),
      createElement('ol', {
        children: journey.destinations.map((destination) =>
          createElement('li', {
            children: [
              createElement('span', {
                className: 'journey-passport-dialog__day',
                text: String(destination.day).padStart(2, '0'),
              }),
              createElement('span', {
                className: 'journey-passport-dialog__destination',
                children: [
                  createElement('strong', { text: destination.name }),
                  createElement('span', {
                    className: 'font-arabic',
                    text: destination.nameAr,
                    attributes: { lang: 'ar', dir: 'rtl' },
                  }),
                ],
              }),
            ],
          }),
        ),
      }),
    ],
  })
}

function createQuickPeekDialog(journey) {
  const titleId = `saved-journey-dialog-title-${journey.id}`
  const descriptionId = `saved-journey-dialog-description-${journey.id}`
  const closeButton = createElement('button', {
    className: 'journey-passport-dialog__close',
    attributes: {
      type: 'button',
      'data-my-journeys-action': 'close-quick-peek',
      'aria-label': `Close Quick Peek for ${journey.title}`,
    },
    children: [createElement('span', { text: '✕', attributes: { 'aria-hidden': 'true' } })],
  })

  const visual = createElement('div', {
    className: `journey-passport-dialog__visual journey-passport-dialog__visual--${journey.tone}`,
    attributes: { 'aria-hidden': 'true' },
    children: [
      createElement('span', { className: 'journey-passport-dialog__visual-brand', text: 'RIHLATI' }),
      createElement('span', {
        className: 'journey-passport-dialog__visual-arabic font-arabic',
        text: 'رحلتي',
        attributes: { lang: 'ar', dir: 'rtl' },
      }),
      createSevenRayRosette('journey-passport-dialog__visual-rosette'),
      createDecorativeJordanOutline('journey-passport-dialog__visual-jordan'),
      createElement('span', {
        className: 'journey-passport-dialog__visual-type',
        text: 'Journey Passport',
      }),
      createElement('span', {
        className: 'journey-passport-dialog__visual-reference',
        text: journey.reference,
      }),
    ],
  })

  const dialog = createElement('dialog', {
    className: 'journey-passport-dialog animate-scale-in',
    attributes: {
      'aria-modal': 'true',
      'aria-labelledby': titleId,
      'aria-describedby': descriptionId,
    },
    children: [
      createElement('div', {
        className: 'journey-passport-dialog__surface',
        children: [
          closeButton,
          visual,
          createElement('div', {
            className: 'journey-passport-dialog__content',
            children: [
              createElement('p', {
                className: 'journey-passport-dialog__eyebrow',
                text: `${journey.status} · ${journey.reference}`,
              }),
              createElement('h2', {
                attributes: { id: titleId },
                text: journey.title,
              }),
              createElement('p', {
                className: 'journey-passport-dialog__summary',
                attributes: { id: descriptionId },
                text: journey.summary,
              }),
              createElement('dl', {
                className: 'journey-passport-dialog__facts',
                children: [
                  ['Duration', journey.duration],
                  ['Stops', String(journey.stops)],
                  ['Travel style', journey.mood],
                ].map(([term, detail]) =>
                  createElement('div', {
                    children: [
                      createElement('dt', { text: term }),
                      createElement('dd', { text: detail }),
                    ],
                  }),
                ),
              }),
              createDialogDestinationList(journey),
              createElement('div', {
                className: 'journey-passport-dialog__actions',
                children: [
                  createButtonLink({
                    href: JOURNEY_PATH,
                    label: 'Open Journey',
                    arrow: true,
                  }),
                  createButtonLink({
                    href: QUESTIONNAIRE_PATH,
                    label: 'Refine Preferences',
                    variant: 'outline',
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

export function createMyJourneysPage({ path = routePaths.myJourneys } = {}) {
  let mounted = false
  let destroyed = false
  let routeSignal = null
  let currentUser = null
  let currentJourneys = []
  let loadRequest = 0
  let activeDialog = null
  let activeDialogController = null
  let activeDialogOpener = null
  let previousBodyOverflow = ''

  const header = createSiteHeader({ currentPath: path })
  const collection = createCollectionShell()
  const main = createElement('main', {
    className: 'my-journeys-main',
    attributes: { id: 'main-content', tabindex: '-1' },
    children: [createHero(), collection.element],
  })
  const page = createElement('div', {
    className: 'my-journeys-page paper',
    children: [header, main, createSiteFooter({ currentPath: path })],
  })
  const pageController = new AbortController()
  const countIndicator = page.querySelector('[data-my-journeys-count]')
  let headerCleanup = () => {}
  let revealCleanup = () => {}
  let authCleanup = () => {}

  const setJourneyCount = (copy) => {
    if (countIndicator) {
      countIndicator.textContent = copy
    }
  }

  const refreshRevealObserver = () => {
    revealCleanup()
    revealCleanup = mountRevealObserver(page)
  }

  const renderLoading = () => {
    currentJourneys = []
    setJourneyCount('Loading journey passports…')
    collection.content.replaceChildren(createCollectionState({
      title: 'Opening your journey collection…',
      copy: 'Rihlati is retrieving the journeys saved to your account.',
      type: 'loading',
    }))
  }

  const renderUnauthenticated = () => {
    currentJourneys = []
    setJourneyCount('Sign in to view journeys')
    collection.content.replaceChildren(createCollectionState({
      title: 'Your journey passports are private',
      copy: 'Sign in through the journey save gate to view routes saved to your RIHLATI account.',
      type: 'empty',
      action: createButtonLink({
        href: SAVE_PATH,
        label: 'Sign in to RIHLATI',
        arrow: true,
      }),
    }))
  }

  const renderEmpty = () => {
    currentJourneys = []
    setJourneyCount('0 journey passports')
    collection.content.replaceChildren(createCollectionState({
      title: 'Your first journey passport is waiting',
      copy: 'Plan a personalized route through Jordan, then save it to begin your collection.',
      type: 'empty',
      action: createButtonLink({
        href: routePaths.touristEntry,
        label: 'Plan a journey',
        arrow: true,
      }),
    }))
  }

  const renderError = () => {
    currentJourneys = []
    setJourneyCount('Journeys unavailable')
    collection.content.replaceChildren(createCollectionState({
      title: 'We couldn’t open your journeys',
      copy: 'Check your connection and try loading your saved journey passports again.',
      type: 'error',
      action: createElement('button', {
        className: 'button button--primary',
        text: 'Try again',
        attributes: {
          type: 'button',
          'data-my-journeys-action': 'retry-load',
        },
      }),
    }))
  }

  const renderJourneys = (journeys) => {
    currentJourneys = journeys.map(mapJourneyToPassport)
    const count = currentJourneys.length
    setJourneyCount(`${count} journey ${count === 1 ? 'passport' : 'passports'}`)
    collection.content.replaceChildren(createPassportGrid(currentJourneys))
    refreshRevealObserver()
  }

  const loadJourneys = async (user) => {
    const requestId = ++loadRequest
    renderLoading()

    try {
      const journeys = await getCurrentUserJourneys(user)

      if (destroyed || requestId !== loadRequest) {
        return
      }

      if (journeys.length === 0) {
        renderEmpty()
      } else {
        renderJourneys(journeys)
      }
    } catch {
      if (!destroyed && requestId === loadRequest) {
        renderError()
      }
    }
  }

  const closeQuickPeek = ({ restoreFocus = true } = {}) => {
    if (!activeDialog) {
      return
    }

    const dialog = activeDialog
    const opener = activeDialogOpener
    activeDialog = null
    activeDialogOpener = null
    activeDialogController?.abort()
    activeDialogController = null

    if (dialog.open) {
      dialog.close()
    }

    dialog.remove()
    document.body.style.overflow = previousBodyOverflow

    if (restoreFocus && opener?.isConnected) {
      opener.focus({ preventScroll: true })
    }
  }

  const openQuickPeek = (journey, opener) => {
    closeQuickPeek({ restoreFocus: false })

    const { dialog, closeButton } = createQuickPeekDialog(journey)
    const controller = new AbortController()
    activeDialog = dialog
    activeDialogController = controller
    activeDialogOpener = opener instanceof HTMLElement ? opener : null
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

        const controls = [...dialog.querySelectorAll(FOCUSABLE_SELECTOR)].filter(
          (control) =>
            control instanceof HTMLElement &&
            control.getClientRects().length > 0 &&
            !control.closest('[hidden], [inert]'),
        )
        const firstControl = controls[0]
        const lastControl = controls.at(-1)

        if (!firstControl || !lastControl) {
          event.preventDefault()
          dialog.focus()
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

  const handleClick = (event) => {
    const actionControl = event.target instanceof Element
      ? event.target.closest('[data-my-journeys-action]')
      : null

    if (!(actionControl instanceof HTMLElement)) {
      return
    }

    const action = actionControl.dataset.myJourneysAction

    if (action === 'close-quick-peek') {
      closeQuickPeek()
      return
    }

    if (action === 'quick-peek') {
      const journey = currentJourneys.find(
        (item) => item.id === actionControl.dataset.journeyId,
      )

      if (journey) {
        openQuickPeek(journey, actionControl)
      }
      return
    }

    if (action === 'retry-load' && currentUser) {
      void loadJourneys(currentUser)
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
      headerCleanup = mountSiteHeader(header, { signal: pageController.signal })
      revealCleanup = mountRevealObserver(page)
      page.addEventListener('click', handleClick, { signal: pageController.signal })
      authCleanup = observeAuthState((user) => {
        currentUser = user
        loadRequest += 1

        if (!user) {
          renderUnauthenticated()
          return
        }

        void loadJourneys(user)
      })
      routeSignal = signal instanceof AbortSignal ? signal : null
      routeSignal?.addEventListener('abort', handleRouteAbort, { once: true })
    },

    destroy() {
      if (destroyed) {
        return
      }

      destroyed = true
      loadRequest += 1
      routeSignal?.removeEventListener('abort', handleRouteAbort)
      routeSignal = null
      closeQuickPeek({ restoreFocus: false })
      pageController.abort()
      authCleanup()
      headerCleanup()
      revealCleanup()
    },
  }
}
