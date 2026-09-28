import { homeAssets } from '../assets/home-assets.js'
import {
  createSiteFooter,
  createSiteHeader,
  mountSiteHeader,
} from '../components/site-shell.js'
import {
  createBadge,
  createButtonLink,
  createCard,
  createEyebrow,
} from '../components/ui.js'
import { routePaths } from '../data/home-presentation-data.js'
import { savedInvestmentPresentations } from '../data/my-investments-presentation-data.js'
import { createElement } from '../utils/dom.js'
import { mountRevealObserver } from '../utils/reveal.js'

const COMPARE_PATH = '/ni-compare'
const QUESTIONNAIRE_PATH = '/ni-questionnaire'
const DISCUSS_PATH = '/ei-summary'

/**
 * Saved-card map artwork only. prototypeMapPosition reproduces temporary
 * prototype placement and is not a canonical governorate coordinate model.
 */
function createSavedOpportunityMap(opportunity) {
  const marker = createElement('span', {
    className: 'my-investment-map__marker',
    attributes: { 'aria-hidden': 'true' },
    children: [
      createElement('span', {
        className: 'my-investment-map__marker-content',
        children: [
          createElement('span', { className: 'my-investment-map__pulse' }),
          createElement('span', {
            className: 'my-investment-map__marker-dot',
            text: '★',
          }),
        ],
      }),
    ],
  })

  marker.style.setProperty('--marker-x', `${opportunity.prototypeMapPosition.x}%`)
  marker.style.setProperty('--marker-y', `${opportunity.prototypeMapPosition.y}%`)

  return createElement('div', {
    className: 'my-investment-map',
    attributes: { 'aria-hidden': 'true' },
    children: [
      createElement('div', {
        className: 'my-investment-map__canvas',
        children: [
          createElement('img', {
            className: 'my-investment-map__image',
            attributes: {
              src: homeAssets.jordanMap,
              alt: '',
              draggable: 'false',
              decoding: 'async',
            },
          }),
          marker,
        ],
      }),
    ],
  })
}

function createStatusBadge(opportunity) {
  const bestMatch = opportunity.fit >= 90

  return createBadge(
    opportunity.status,
    bestMatch ? 'gold' : 'brand',
    [
      'my-investment-card__status',
      bestMatch
        ? 'my-investment-card__status--best'
        : 'my-investment-card__status--outline',
    ].join(' '),
  )
}

function createCardAction({ href, label, opportunity, variant = 'primary' }) {
  return createButtonLink({
    href,
    label,
    variant,
    size: 'small',
    className: 'my-investment-card__action',
    attributes: {
      'aria-label': `${label}: ${opportunity.region}`,
    },
  })
}

function createSavedInvestmentCard(opportunity) {
  const titleId = `saved-investment-title-${opportunity.savedId}`

  return createElement('li', {
    className: 'my-investments-grid__item',
    children: [
      createCard({
        className: 'my-investment-card reveal',
        hover: true,
        attributes: { 'aria-labelledby': titleId },
        children: [
          createElement('div', {
            className: 'my-investment-card__layout',
            children: [
              createSavedOpportunityMap(opportunity),
              createElement('div', {
                className: 'my-investment-card__content',
                children: [
                  createElement('div', {
                    className: 'my-investment-card__meta',
                    children: [
                      createStatusBadge(opportunity),
                      createElement('span', {
                        className: 'my-investment-card__fit',
                        attributes: {
                          'aria-label': `${opportunity.fit}% match score`,
                        },
                        text: `${opportunity.fit}%`,
                      }),
                    ],
                  }),
                  createElement('h2', {
                    className: 'my-investment-card__title',
                    attributes: { id: titleId },
                    text: opportunity.region,
                  }),
                  createElement('p', {
                    className: 'my-investment-card__type',
                    text: opportunity.type,
                  }),
                  createElement('div', {
                    className: 'my-investment-card__actions',
                    children: [
                      createCardAction({
                        href: COMPARE_PATH,
                        label: 'Compare',
                        opportunity,
                      }),
                      createCardAction({
                        href: QUESTIONNAIRE_PATH,
                        label: 'Update criteria',
                        opportunity,
                        variant: 'outline',
                      }),
                      createCardAction({
                        href: DISCUSS_PATH,
                        label: 'Discuss',
                        opportunity,
                        variant: 'ghost',
                      }),
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
}

function createInvestmentsMain() {
  return createElement('main', {
    className: 'my-investments-main',
    attributes: { id: 'main-content', tabindex: '-1' },
    children: [
      createElement('section', {
        className: 'my-investments',
        attributes: { 'aria-labelledby': 'my-investments-title' },
        children: [
          createElement('header', {
            className: 'my-investments__overview animate-rise',
            children: [
              createElement('div', {
                children: [
                  createEyebrow('Saved'),
                  createElement('h1', {
                    className: 'my-investments__title',
                    attributes: { id: 'my-investments-title' },
                    text: 'My Investments',
                  }),
                  createElement('p', {
                    className: 'my-investments__lead',
                    text: 'Opportunities you’re tracking.',
                  }),
                ],
              }),
              createButtonLink({
                href: routePaths.investorEntry,
                label: 'New search',
                arrow: true,
                className: 'my-investments__new-search',
              }),
            ],
          }),
          createElement('ul', {
            className: 'my-investments-grid',
            attributes: { 'aria-label': 'Saved investment opportunities' },
            children: savedInvestmentPresentations.map(createSavedInvestmentCard),
          }),
        ],
      }),
    ],
  })
}

export function createMyInvestmentsPage({ path = '/ni-my-investments' } = {}) {
  let mounted = false
  let destroyed = false
  let headerCleanup = () => {}
  let revealCleanup = () => {}

  const header = createSiteHeader({ currentPath: path })
  const pageController = new AbortController()
  const page = createElement('div', {
    className: 'my-investments-page paper',
    children: [
      header,
      createInvestmentsMain(),
      createSiteFooter({ currentPath: path }),
    ],
  })

  return {
    element: page,

    mount() {
      if (mounted || destroyed) {
        return
      }

      mounted = true
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
