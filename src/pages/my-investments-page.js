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
import { investorResultMatches } from '../data/investor-result-presentation-data.js'
import { observeAuthState } from '../services/auth-service.js'
import { getCurrentUserInvestments } from '../services/investment-service.js'
import { createElement } from '../utils/dom.js'
import { mountRevealObserver } from '../utils/reveal.js'

const COMPARE_PATH = '/ni-compare'
const QUESTIONNAIRE_PATH = '/ni-questionnaire'
const DISCUSS_PATH = '/ei-summary'
const AUTH_PATH = '/t-save'

function getPresentationMapPosition(opportunityId) {
  const presentationMatch = investorResultMatches.find((match) => match.id === opportunityId)
  return presentationMatch?.prototypeMapPosition ?? null
}

/**
 * Saved-card map artwork only. Positions come from the existing presentation
 * catalog and are not stored Investment data or canonical governorate coordinates.
 */
function createSavedOpportunityMap(opportunity) {
  const position = getPresentationMapPosition(opportunity.id)
  const marker = position
    ? createElement('span', {
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
    : null

  if (marker && position) {
    marker.style.setProperty('--marker-x', `${position.x}%`)
    marker.style.setProperty('--marker-y', `${position.y}%`)
  }

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
          ...(marker ? [marker] : []),
        ],
      }),
    ],
  })
}

function formatSavedDate(value) {
  let date = null

  if (typeof value?.toDate === 'function') {
    date = value.toDate()
  } else if (value instanceof Date) {
    date = value
  } else if (value != null) {
    date = new Date(value)
  }

  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return 'Saved date unavailable'
  }

  return `Saved ${new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)}`
}

function createInvestmentPresentation(investment) {
  const selectedMatch = Array.isArray(investment.matches)
    ? investment.matches.find((match) => match?.id === investment.opportunityKey)
    : null
  const fallbackKey = typeof investment.opportunityKey === 'string'
    ? investment.opportunityKey
    : ''

  return {
    savedId: investment.id,
    id: typeof selectedMatch?.id === 'string' ? selectedMatch.id : fallbackKey,
    region: typeof selectedMatch?.region === 'string' && selectedMatch.region.length > 0
      ? selectedMatch.region
      : 'Saved tourism opportunity',
    type: typeof selectedMatch?.type === 'string' && selectedMatch.type.length > 0
      ? selectedMatch.type
      : 'Opportunity details unavailable',
    fit: Number.isFinite(selectedMatch?.fit) ? selectedMatch.fit : null,
    savedDate: formatSavedDate(investment.createdAt),
  }
}

function createStatusBadge(opportunity) {
  const bestMatch = opportunity.fit != null && opportunity.fit >= 90

  return createBadge(
    'Saved opportunity',
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

function createSavedInvestmentCard(investment) {
  const opportunity = createInvestmentPresentation(investment)
  const safeId = String(opportunity.savedId).replace(/[^a-zA-Z0-9_-]/g, '-')
  const titleId = `saved-investment-title-${safeId}`

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
                      ...(opportunity.fit == null
                        ? []
                        : [createElement('span', {
                            className: 'my-investment-card__fit',
                            attributes: {
                              'aria-label': `${opportunity.fit}% match score`,
                            },
                            text: `${opportunity.fit}%`,
                          })]),
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
                  createElement('p', {
                    className: 'my-investment-card__date',
                    text: opportunity.savedDate,
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

function createStateCard({ title, message, action }) {
  return createCard({
    className: 'my-investments-state',
    attributes: { role: title === 'Unable to load investments' ? 'alert' : 'status' },
    children: [
      createElement('h2', { className: 'my-investments-state__title', text: title }),
      createElement('p', { className: 'my-investments-state__message', text: message }),
      action,
    ],
  })
}

function createInvestmentsMain() {
  const lead = createElement('p', {
    className: 'my-investments__lead',
    text: 'Loading your saved opportunities…',
  })
  const content = createElement('div', {
    className: 'my-investments__content',
    attributes: { 'aria-live': 'polite' },
  })
  const element = createElement('main', {
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
                  lead,
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
          content,
        ],
      }),
    ],
  })

  return { element, content, lead }
}

export function createMyInvestmentsPage({ path = '/ni-my-investments' } = {}) {
  let mounted = false
  let destroyed = false
  let currentUser = null
  let loadSequence = 0
  let headerCleanup = () => {}
  let revealCleanup = () => {}
  let unsubscribeAuth = () => {}

  const header = createSiteHeader({ currentPath: path })
  const pageController = new AbortController()
  const investmentsMain = createInvestmentsMain()
  const page = createElement('div', {
    className: 'my-investments-page paper',
    children: [
      header,
      investmentsMain.element,
      createSiteFooter({ currentPath: path }),
    ],
  })

  const mountReveal = () => {
    revealCleanup()
    revealCleanup = mountRevealObserver(investmentsMain.content)
  }

  const renderLoading = () => {
    investmentsMain.lead.textContent = 'Loading your saved opportunities…'
    investmentsMain.content.replaceChildren(createStateCard({
      title: 'Loading investments',
      message: 'Retrieving your saved tourism opportunities.',
      action: createElement('span', { className: 'my-investments-state__loader' }),
    }))
    mountReveal()
  }

  const renderUnauthenticated = () => {
    investmentsMain.lead.textContent = 'Sign in to view opportunities saved to your account.'
    investmentsMain.content.replaceChildren(createStateCard({
      title: 'Account access required',
      message: 'Use the existing account access, then return to My Investments.',
      action: createButtonLink({
        href: AUTH_PATH,
        label: 'Sign in or create an account',
        className: 'my-investments-state__action',
      }),
    }))
    mountReveal()
  }

  const renderEmpty = () => {
    investmentsMain.lead.textContent = 'No saved opportunities yet.'
    investmentsMain.content.replaceChildren(createStateCard({
      title: 'Your opportunity collection is ready to begin',
      message: 'Explore tourism investment matches and save the opportunities you want to revisit.',
      action: createButtonLink({
        href: routePaths.investorEntry,
        label: 'Find opportunities',
        arrow: true,
        className: 'my-investments-state__action',
      }),
    }))
    mountReveal()
  }

  const renderError = () => {
    investmentsMain.lead.textContent = 'Your saved opportunities are temporarily unavailable.'
    investmentsMain.content.replaceChildren(createStateCard({
      title: 'Unable to load investments',
      message: 'Your saved data has not been changed. Please try again.',
      action: createElement('button', {
        className: 'button button--primary button--medium my-investments-state__action',
        attributes: {
          type: 'button',
          'data-investments-action': 'retry',
        },
        text: 'Try again',
      }),
    }))
    mountReveal()
  }

  const renderInvestments = (investments) => {
    const countLabel = `${investments.length} saved ${investments.length === 1 ? 'opportunity' : 'opportunities'}`
    investmentsMain.lead.textContent = `${countLabel}, newest first.`
    investmentsMain.content.replaceChildren(createElement('ul', {
      className: 'my-investments-grid',
      attributes: { 'aria-label': 'Saved investment opportunities' },
      children: investments.map(createSavedInvestmentCard),
    }))
    mountReveal()
  }

  const loadInvestments = async (user) => {
    const sequence = ++loadSequence
    renderLoading()

    try {
      const investments = await getCurrentUserInvestments(user)

      if (destroyed || sequence !== loadSequence) {
        return
      }

      if (investments.length === 0) {
        renderEmpty()
        return
      }

      renderInvestments(investments)
    } catch {
      if (!destroyed && sequence === loadSequence) {
        renderError()
      }
    }
  }

  const handleClick = (event) => {
    const retryButton = event.target instanceof Element
      ? event.target.closest('[data-investments-action="retry"]')
      : null

    if (retryButton instanceof HTMLButtonElement && currentUser) {
      void loadInvestments(currentUser)
    }
  }

  return {
    element: page,

    mount() {
      if (mounted || destroyed) {
        return
      }

      mounted = true
      headerCleanup = mountSiteHeader(header, { signal: pageController.signal })
      page.addEventListener('click', handleClick, { signal: pageController.signal })
      renderLoading()
      unsubscribeAuth = observeAuthState((user) => {
        currentUser = user

        if (!user) {
          ++loadSequence
          renderUnauthenticated()
          return
        }

        void loadInvestments(user)
      })
    },

    destroy() {
      if (destroyed) {
        return
      }

      destroyed = true
      ++loadSequence
      pageController.abort()
      unsubscribeAuth()
      headerCleanup()
      revealCleanup()
    },
  }
}
