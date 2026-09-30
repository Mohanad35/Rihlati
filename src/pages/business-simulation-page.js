import { createJourneyMapPresentation } from '../components/journey-map-presentation.js'
import { createSiteHeader, mountSiteHeader } from '../components/site-shell.js'
import {
  createButtonLink,
  createCard,
  createEyebrow,
  createIcon,
} from '../components/ui.js'
import { existingBusinessSimulationPresentation as simulation } from '../data/existing-business-simulation-presentation-data.js'
import {
  getBusinessFlowContext,
  saveBusinessFlowContext,
} from '../services/guest-session-service.js'
import { createElement } from '../utils/dom.js'
import { mountRevealObserver } from '../utils/reveal.js'

const BACK_PATH = '/ei-match'
const PARTNERSHIP_PATH = '/ei-summary'

function savePlacementContext() {
  const currentContext = getBusinessFlowContext()
  const businessStop = simulation.journeyStops.find((stop) => stop.type === 'Your business')

  saveBusinessFlowContext({
    ...(currentContext && typeof currentContext === 'object' ? currentContext : {}),
    schemaVersion: 1,
    placement: {
      recommendation: { ...simulation.recommendation },
      businessStop: businessStop
        ? {
            day: businessStop.day,
            name: businessStop.name,
            type: businessStop.type,
            why: businessStop.why,
          }
        : null,
      journeyStops: simulation.journeyStops.map(({ day, name, type, why }) => ({
        day,
        name,
        type,
        why,
      })),
    },
  })
}

function createRecommendationBadge() {
  return createElement('span', {
    className: 'badge badge--gold business-simulation-recommendation__badge',
    children: [
      createIcon('star', { className: 'business-simulation-recommendation__badge-icon' }),
      createElement('span', { text: simulation.recommendation.badge }),
    ],
  })
}

function createRecommendationCard() {
  return createCard({
    tagName: 'section',
    className: 'business-simulation-recommendation reveal',
    attributes: { 'aria-labelledby': 'business-simulation-recommendation-title' },
    children: [
      createRecommendationBadge(),
      createElement('h2', {
        className: 'business-simulation-recommendation__title',
        attributes: { id: 'business-simulation-recommendation-title' },
        text: simulation.recommendation.title,
      }),
      createElement('p', {
        className: 'business-simulation-recommendation__description',
        text: simulation.recommendation.description,
      }),
    ],
  })
}

function createJourneyStopCard(stop) {
  const isBusiness = stop.type === 'Your business'

  return createCard({
    className: [
      'business-simulation-stop',
      'reveal',
      isBusiness ? 'is-business' : '',
    ].filter(Boolean).join(' '),
    attributes: { 'aria-label': isBusiness ? `${stop.name}, your recommended business placement` : undefined },
    children: [
      createElement('img', {
        className: 'business-simulation-stop__image',
        attributes: {
          src: stop.image,
          alt: stop.imageAlt,
          loading: 'lazy',
          decoding: 'async',
        },
      }),
      createElement('div', {
        className: 'business-simulation-stop__body',
        children: [
          createElement('p', {
            className: 'business-simulation-stop__day',
            text: isBusiness ? 'You' : `Day ${stop.day}`,
          }),
          createElement('h2', { className: 'business-simulation-stop__title', text: stop.name }),
          createElement('p', { className: 'business-simulation-stop__reason', text: stop.why }),
        ],
      }),
    ],
  })
}

function createBusinessSimulationMain() {
  const journeyMap = createJourneyMapPresentation({
    stops: simulation.mapStops,
    activeIndex: 3,
    interactive: false,
  })
  journeyMap.element.classList.add('business-simulation__map', 'reveal')

  return createElement('main', {
    className: 'business-simulation-main',
    attributes: { id: 'main-content', tabindex: '-1' },
    children: [
      createElement('section', {
        className: 'business-simulation',
        attributes: { 'aria-labelledby': 'business-simulation-title' },
        children: [
          createElement('header', {
            className: 'business-simulation__heading animate-rise',
            children: [
              createElement('div', {
                children: [
                  createEyebrow('Journey placement simulation'),
                  createElement('h1', {
                    className: 'business-simulation__title',
                    attributes: { id: 'business-simulation-title' },
                    text: 'Here’s how travellers would meet you',
                  }),
                ],
              }),
              createButtonLink({
                href: BACK_PATH,
                label: 'Back',
                variant: 'outline',
                className: 'business-simulation__back',
              }),
            ],
          }),
          createElement('div', {
            className: 'business-simulation__layout',
            children: [
              journeyMap.element,
              createElement('div', {
                className: 'business-simulation__details',
                children: [
                  createRecommendationCard(),
                  ...simulation.journeyStops.map(createJourneyStopCard),
                  createButtonLink({
                    href: PARTNERSHIP_PATH,
                    label: 'Continue to partnership',
                    full: true,
                    arrow: true,
                    className: 'business-simulation__continue',
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

export function createBusinessSimulationPage({ path = '/ei-simulation' } = {}) {
  let mounted = false
  let destroyed = false
  let headerCleanup = () => {}
  let revealCleanup = () => {}

  const pageController = new AbortController()
  const header = createSiteHeader({ currentPath: path })
  const page = createElement('div', {
    className: 'business-simulation-page paper',
    children: [header, createBusinessSimulationMain()],
  })

  return {
    element: page,

    mount() {
      if (mounted || destroyed) {
        return
      }

      mounted = true
      savePlacementContext()
      headerCleanup = mountSiteHeader(header, { signal: pageController.signal })
      revealCleanup = mountRevealObserver(page)
    },

    destroy() {
      if (destroyed) {
        return
      }

      destroyed = true
      pageController.abort()
      headerCleanup()
      revealCleanup()
    },
  }
}
