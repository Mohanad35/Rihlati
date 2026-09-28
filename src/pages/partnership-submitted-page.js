import { createSiteHeader, mountSiteHeader } from '../components/site-shell.js'
import { createButtonLink, createCard, createIcon } from '../components/ui.js'
import { partnershipTrackingPresentation as tracking } from '../data/partnership-tracking-presentation-data.js'
import { createElement } from '../utils/dom.js'
import { mountRevealObserver } from '../utils/reveal.js'

const HOME_PATH = '/'
const DASHBOARD_PATH = '/ni-my-investments'

function createStatusMarker(stage, index) {
  return createElement('span', {
    className: [
      'partnership-tracking-stage__marker',
      stage.current ? 'is-current' : '',
    ].filter(Boolean).join(' '),
    attributes: { 'aria-hidden': 'true' },
    children: stage.current
      ? [createIcon('check', { className: 'partnership-tracking-stage__check' })]
      : [createElement('span', { text: index + 1 })],
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
    attributes: stage.current ? { 'aria-current': 'step' } : {},
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
                ? [createElement('span', {
                    className: 'partnership-tracking-stage__current-label',
                    text: 'Current',
                  })]
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

function createPartnershipSubmittedMain() {
  return createElement('main', {
    className: 'partnership-submitted-main',
    attributes: { id: 'main-content', tabindex: '-1' },
    children: [
      createElement('section', {
        className: 'partnership-submitted',
        attributes: { 'aria-labelledby': 'partnership-submitted-title' },
        children: [
          createElement('span', {
            className: 'partnership-submitted__success animate-pop',
            attributes: { 'aria-hidden': 'true' },
            children: [createIcon('check', { className: 'partnership-submitted__success-icon' })],
          }),
          createElement('h1', {
            className: 'partnership-submitted__title animate-rise',
            attributes: { id: 'partnership-submitted-title' },
            text: tracking.title,
          }),
          createElement('p', {
            className: 'partnership-submitted__description animate-rise',
            text: tracking.description,
          }),
          createElement('p', {
            className: 'partnership-submitted__notice',
            text: tracking.notice,
          }),
          createElement('ol', {
            className: 'partnership-tracking',
            attributes: { 'aria-label': 'Partnership request status' },
            children: tracking.stages.map(createTrackingStage),
          }),
          createElement('nav', {
            className: 'partnership-submitted__actions',
            attributes: { 'aria-label': 'Partnership tracking actions' },
            children: [
              createButtonLink({
                href: HOME_PATH,
                label: 'Back to home',
                arrow: true,
              }),
              createButtonLink({
                href: DASHBOARD_PATH,
                label: 'My dashboard',
                variant: 'outline',
              }),
            ],
          }),
        ],
      }),
    ],
  })
}

export function createPartnershipSubmittedPage({ path = '/ei-submitted' } = {}) {
  let mounted = false
  let destroyed = false
  let headerCleanup = () => {}
  let revealCleanup = () => {}

  const pageController = new AbortController()
  const header = createSiteHeader({ currentPath: path })
  const page = createElement('div', {
    className: 'partnership-submitted-page paper',
    children: [header, createPartnershipSubmittedMain()],
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
