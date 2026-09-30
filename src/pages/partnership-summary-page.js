import { createSiteHeader, mountSiteHeader } from '../components/site-shell.js'
import { createButtonLink, createCard, createEyebrow } from '../components/ui.js'
import { partnershipSummaryPresentation as summary } from '../data/partnership-summary-presentation-data.js'
import {
  getBusinessFlowContext,
  getBusinessProfile,
  savePendingPartnership,
} from '../services/guest-session-service.js'
import { createElement } from '../utils/dom.js'
import { mountRevealObserver } from '../utils/reveal.js'

const BACK_PATH = '/ei-simulation'
const SUBMIT_PATH = '/ei-submitted'

function savePartnershipSnapshot() {
  const flowContext = getBusinessFlowContext()
  const profile = getBusinessProfile()

  savePendingPartnership({
    schemaVersion: 1,
    businessProfile: profile && typeof profile === 'object' ? profile : {},
    business: flowContext?.business ?? {},
    audienceContext: flowContext?.audienceContext ?? {},
    placement: flowContext?.placement ?? {},
    review: {
      title: summary.title,
      rows: summary.rows.map(({ label, value }) => ({ label, value })),
    },
  })
}

function createSummaryRow({ label, value }) {
  return createElement('div', {
    className: 'partnership-summary__row',
    children: [
      createElement('dt', { className: 'partnership-summary__label', text: label }),
      createElement('dd', { className: 'partnership-summary__value', text: value }),
    ],
  })
}

function createPartnershipSummaryMain() {
  const summaryCard = createCard({
    tagName: 'dl',
    className: 'partnership-summary__card animate-scale-in',
    children: summary.rows.map(createSummaryRow),
  })

  return createElement('main', {
    className: 'partnership-summary-main',
    attributes: { id: 'main-content', tabindex: '-1' },
    children: [
      createElement('section', {
        className: 'partnership-summary',
        attributes: { 'aria-labelledby': 'partnership-summary-title' },
        children: [
          createElement('header', {
            className: 'partnership-summary__heading animate-rise',
            children: [
              createEyebrow(summary.eyebrow),
              createElement('h1', {
                className: 'partnership-summary__title',
                attributes: { id: 'partnership-summary-title' },
                text: summary.title,
              }),
              createElement('p', {
                className: 'partnership-summary__description',
                text: summary.description,
              }),
            ],
          }),
          summaryCard,
          createElement('nav', {
            className: 'partnership-summary__actions',
            attributes: { 'aria-label': 'Partnership summary actions' },
            children: [
              createButtonLink({ href: BACK_PATH, label: 'Back', variant: 'outline' }),
              createButtonLink({
                href: SUBMIT_PATH,
                label: 'Submit partnership request',
                variant: 'gold',
                arrow: true,
              }),
            ],
          }),
        ],
      }),
    ],
  })
}

export function createPartnershipSummaryPage({ path = '/ei-summary' } = {}) {
  let mounted = false
  let destroyed = false
  let headerCleanup = () => {}
  let revealCleanup = () => {}

  const pageController = new AbortController()
  const header = createSiteHeader({ currentPath: path })
  const page = createElement('div', {
    className: 'partnership-summary-page paper',
    children: [header, createPartnershipSummaryMain()],
  })

  return {
    element: page,

    mount() {
      if (mounted || destroyed) {
        return
      }

      mounted = true
      savePartnershipSnapshot()
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
