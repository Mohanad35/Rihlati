import { createSiteHeader, mountSiteHeader } from '../components/site-shell.js'
import { createButtonLink, createCard, createIcon } from '../components/ui.js'
import { partnershipTrackingPresentation as tracking } from '../data/partnership-tracking-presentation-data.js'
import { getCurrentUser } from '../services/auth-service.js'
import { getCurrentUserPartnershipRequests } from '../services/partnership-request-service.js'
import { createElement } from '../utils/dom.js'
import { mountRevealObserver } from '../utils/reveal.js'
import { routePaths } from '../data/home-presentation-data.js'

const HOME_PATH = '/'
const INVEST_PATH = routePaths.investorEntry

function createStatusMarker(stage, index) {
  return createElement('span', {
    className: [
      'partnership-tracking-stage__marker',
      stage.current ? 'is-current' : '',
    ].filter(Boolean).join(' '),
    attributes: { 'aria-hidden': 'true' },
    children: stage.current
      ? [
          createIcon('check', {
            className: 'partnership-tracking-stage__check',
          }),
        ]
      : [
          createElement('span', {
            text: index + 1,
          }),
        ],
  })
}

function createTrackingStage(stage, index) {
  return createCard({
    tagName: 'li',
    className: [
      'partnership-tracking-stage',
      'reveal',
      stage.current ? 'is-current' : '',
    ].filter(Boolean).join(' '),

    attributes: stage.current
      ? { 'aria-current': 'step' }
      : {},

    children: [
      createStatusMarker(stage, index),

      createElement('div', {
        className: 'partnership-tracking-stage__content',

        children: [
          createElement('div', {
            className: 'partnership-tracking-stage__heading',

            children: [
              createElement('h2', {
                className: 'partnership-tracking-stage__title',
                text: stage.label,
              }),

              ...(stage.current
                ? [
                    createElement('span', {
                      className:
                        'partnership-tracking-stage__current-label',
                      text: 'Current',
                    }),
                  ]
                : []),
            ],
          }),

          createElement('p', {
            className: 'partnership-tracking-stage__description',
            text: stage.description,
          }),
        ],
      }),
    ],
  })
}

function createStagesForStatus(currentStatus) {
  return tracking.stages.map((stage) => ({
    ...stage,
    current: stage.label === currentStatus,
  }))
}

function createPartnershipSubmittedMain() {
  const statusNotice = createElement('p', {
    className: 'partnership-submitted__notice',
    attributes: {
      role: 'status',
      'aria-live': 'polite',
      'aria-atomic': 'true',
    },
    text: 'Loading your partnership request...',
  })

  const trackingList = createElement('ol', {
    className: 'partnership-tracking',
    attributes: {
      'aria-label': 'Partnership request status',
    },
  })

  const main = createElement('main', {
    className: 'partnership-submitted-main',
    attributes: {
      id: 'main-content',
      tabindex: '-1',
    },

    children: [
      createElement('section', {
        className: 'partnership-submitted',
        attributes: {
          'aria-labelledby': 'partnership-submitted-title',
        },

        children: [
          createElement('span', {
            className:
              'partnership-submitted__success animate-pop',
            attributes: {
              'aria-hidden': 'true',
            },
            children: [
              createIcon('check', {
                className:
                  'partnership-submitted__success-icon',
              }),
            ],
          }),

          createElement('h1', {
            className:
              'partnership-submitted__title animate-rise',
            attributes: {
              id: 'partnership-submitted-title',
            },
            text: tracking.title,
          }),

          createElement('p', {
            className:
              'partnership-submitted__description animate-rise',
            text: tracking.description,
          }),

          statusNotice,

          trackingList,

          createElement('nav', {
            className: 'partnership-submitted__actions',
            attributes: {
              'aria-label': 'Partnership tracking actions',
            },

            children: [
              createButtonLink({
                href: HOME_PATH,
                label: 'Back to home',
                arrow: true,
              }),

              createButtonLink({
              href: INVEST_PATH,
              label: 'Back to Invest',
              variant: 'outline',
            }),
            ],
          }),
        ],
      }),
    ],
  })

  function renderStatus(status) {
    const stages = createStagesForStatus(status)

    trackingList.replaceChildren(
      ...stages.map(createTrackingStage)
    )

    statusNotice.textContent =
      `Current partnership status: ${status}.`
  }

  function renderEmpty() {
    trackingList.replaceChildren()

    statusNotice.textContent =
      'No saved partnership request was found for this account.'
  }

  function renderError() {
    trackingList.replaceChildren()

    statusNotice.textContent =
      'We could not load your partnership request status. Please try again.'
  }

  return {
    element: main,
    renderStatus,
    renderEmpty,
    renderError,
    statusNotice,
  }
}

export function createPartnershipSubmittedPage({
  path = '/ei-submitted',
} = {}) {
  let mounted = false
  let destroyed = false
  let headerCleanup = () => {}
  let revealCleanup = () => {}

  const pageController = new AbortController()

  const header = createSiteHeader({
    currentPath: path,
  })

  const submittedView =
    createPartnershipSubmittedMain()

  const page = createElement('div', {
    className: 'partnership-submitted-page paper',
    children: [
      header,
      submittedView.element,
    ],
  })

  return {
    element: page,

    mount() {
      if (mounted || destroyed) {
        return
      }

      mounted = true

      headerCleanup = mountSiteHeader(
        header,
        {
          signal: pageController.signal,
        }
      )

      revealCleanup = mountRevealObserver(page)

      const user = getCurrentUser()

      if (!user) {
        submittedView.renderError()
        submittedView.statusNotice.textContent =
          'Sign in to view your partnership request status.'

        return
      }

      void getCurrentUserPartnershipRequests(user)
        .then((requests) => {
          if (destroyed) {
            return
          }

          const latestRequest = requests[0]

          if (!latestRequest) {
            submittedView.renderEmpty()
            return
          }

          submittedView.renderStatus(
            latestRequest.status
          )
        })
        .catch((error) => {
          if (destroyed) {
            return
          }

          console.error(
            'Failed to load partnership request status:',
            error
          )

          submittedView.renderError()
        })
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