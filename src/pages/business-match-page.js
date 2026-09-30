import { homeAssets } from '../assets/home-assets.js'
import { createSiteHeader, mountSiteHeader } from '../components/site-shell.js'
import {
  createBadge,
  createButtonLink,
  createCard,
  createEyebrow,
  createIcon,
  createSectionHeading,
} from '../components/ui.js'
import { existingBusinessMatchPresentation as match } from '../data/existing-business-match-presentation-data.js'
import { saveBusinessFlowContext } from '../services/guest-session-service.js'
import { createElement } from '../utils/dom.js'
import { mountRevealObserver } from '../utils/reveal.js'

const PLACEMENT_PATH = '/ei-simulation'

function createMatchFlowContext() {
  return {
    schemaVersion: 1,
    business: { ...match.business },
    audienceContext: {
      travellerProfiles: match.travellerProfiles.map(({ label, share }) => ({ label, share })),
      insights: match.insights.map(({ label, value, description }) => ({
        label,
        value,
        description,
      })),
    },
  }
}

function createTravellerProfile(profile) {
  const fill = createElement('span', { className: 'business-match-profile__fill' })
  fill.style.setProperty('--profile-share', `${profile.share}%`)

  return createElement('li', {
    className: 'business-match-profile',
    children: [
      createElement('div', {
        className: 'business-match-profile__meta',
        children: [
          createElement('span', { className: 'business-match-profile__label', text: profile.label }),
          createElement('span', { className: 'business-match-profile__share', text: `${profile.share}%` }),
        ],
      }),
      createElement('div', {
        className: 'business-match-profile__track',
        attributes: {
          role: 'progressbar',
          'aria-label': `${profile.label} audience share`,
          'aria-valuemin': '0',
          'aria-valuemax': '100',
          'aria-valuenow': String(profile.share),
        },
        children: [fill],
      }),
    ],
  })
}

function createProfilesCard() {
  return createCard({
    tagName: 'section',
    className: 'business-match-profiles reveal',
    attributes: { 'aria-labelledby': 'business-match-profiles-title' },
    children: [
      createElement('h2', {
        className: 'business-match-profiles__title',
        attributes: { id: 'business-match-profiles-title' },
        text: 'Strongest traveller profiles',
      }),
      createElement('ul', {
        className: 'business-match-profiles__list',
        children: match.travellerProfiles.map(createTravellerProfile),
      }),
    ],
  })
}

function createInsightCard(insight) {
  return createCard({
    className: 'business-match-insight reveal',
    children: [
      createElement('span', {
        className: 'business-match-insight__icon',
        attributes: { 'aria-hidden': 'true' },
        children: [createIcon(insight.icon)],
      }),
      createElement('p', { className: 'business-match-insight__label', text: insight.label }),
      createElement('h2', { className: 'business-match-insight__value', text: insight.value }),
      createElement('p', {
        className: 'business-match-insight__description',
        text: insight.description,
      }),
    ],
  })
}

function createDemandMarker(point, index) {
  const marker = createElement('span', {
    className: [
      'business-match-map__marker',
      point.rank === 'Best Match' ? 'is-best' : '',
    ].filter(Boolean).join(' '),
    attributes: { 'aria-hidden': 'true' },
    children: [
      createElement('span', {
        className: 'business-match-map__marker-content',
        children: [
          ...(point.rank === 'Best Match'
            ? [createElement('span', { className: 'business-match-map__pulse' })]
            : []),
          createElement('span', {
            className: 'business-match-map__marker-dot',
            text: point.rank === 'Best Match' ? '★' : String(index + 1),
          }),
          createElement('span', { className: 'business-match-map__marker-label', text: point.label }),
        ],
      }),
    ],
  })

  marker.style.setProperty('--marker-x', `${point.x}%`)
  marker.style.setProperty('--marker-y', `${point.y}%`)
  marker.style.setProperty('--marker-delay', `${400 + index * 250}ms`)
  return marker
}

function createDemandMap() {
  return createElement('div', {
    className: 'business-match-map',
    attributes: {
      role: 'img',
      'aria-label': 'Demand around your location: your business is the best match near Petra and the Dead Sea.',
    },
    children: [
      createElement('div', {
        className: 'business-match-map__canvas',
        children: [
          createElement('img', {
            className: 'business-match-map__image',
            attributes: {
              src: homeAssets.jordanMap,
              alt: '',
              draggable: 'false',
              decoding: 'async',
            },
          }),
          ...match.demandPoints.map(createDemandMarker),
        ],
      }),
    ],
  })
}

function createOpportunityPreview() {
  return createCard({
    tagName: 'section',
    className: 'business-match-map-card reveal',
    attributes: { 'aria-labelledby': 'business-match-demand-title' },
    children: [
      createElement('header', {
        className: 'business-match-map-card__header',
        children: [
          createBadge('Contextual opportunity preview', 'terracotta'),
          createElement('h2', {
            className: 'business-match-map-card__title',
            attributes: { id: 'business-match-demand-title' },
            text: 'Demand around your location',
          }),
        ],
      }),
      createDemandMap(),
    ],
  })
}

function createPlacementCard() {
  return createCard({
    tagName: 'section',
    className: 'business-match-placement reveal',
    attributes: { 'aria-labelledby': 'business-match-placement-title' },
    children: [
      createSectionHeading({
        eyebrow: 'Journey placement',
        title: 'See your business inside a real traveller journey.',
        description: 'One of Rihlati’s most powerful views — a simulation of how you’d appear as a recommended stop.',
        id: 'business-match-placement-title',
      }),
      createButtonLink({
        href: PLACEMENT_PATH,
        label: 'Open placement simulation',
        arrow: true,
        className: 'business-match-placement__action',
      }),
    ],
  })
}

function createBusinessMatchMain() {
  const businessSummary = `${match.business.name} · ${match.business.location} · ${match.business.type}`

  return createElement('main', {
    className: 'business-match-main',
    attributes: { id: 'main-content', tabindex: '-1' },
    children: [
      createElement('section', {
        className: 'business-match',
        attributes: { 'aria-labelledby': 'business-match-title' },
        children: [
          createElement('header', {
            className: 'business-match__heading animate-rise',
            children: [
              createEyebrow('Your fit'),
              createElement('h1', {
                className: 'business-match__title',
                attributes: { id: 'business-match-title' },
                text: 'Which travellers fit your business',
              }),
              createElement('p', { className: 'business-match__summary', text: businessSummary }),
            ],
          }),
          createElement('div', {
            className: 'business-match__overview',
            children: [
              createProfilesCard(),
              createElement('div', {
                className: 'business-match__insights',
                children: match.insights.map(createInsightCard),
              }),
            ],
          }),
          createElement('div', {
            className: 'business-match__opportunity',
            children: [createOpportunityPreview(), createPlacementCard()],
          }),
        ],
      }),
    ],
  })
}

export function createBusinessMatchPage({ path = '/ei-match' } = {}) {
  let mounted = false
  let destroyed = false
  let headerCleanup = () => {}
  let revealCleanup = () => {}

  const pageController = new AbortController()
  const header = createSiteHeader({ currentPath: path })
  const page = createElement('div', {
    className: 'business-match-page paper',
    children: [header, createBusinessMatchMain()],
  })

  return {
    element: page,

    mount() {
      if (mounted || destroyed) {
        return
      }

      mounted = true
      saveBusinessFlowContext(createMatchFlowContext())
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
