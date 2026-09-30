import { createSiteHeader, mountSiteHeader } from '../components/site-shell.js'
import {
  createBadge,
  createButtonLink,
  createCard,
  createEyebrow,
} from '../components/ui.js'
import { investorResultMatches } from '../data/investor-result-presentation-data.js'
import {
  getInvestorCompareSelection,
  getPendingInvestment,
  saveInvestorCompareSelection,
} from '../services/guest-session-service.js'
import { getCurrentUser } from '../services/auth-service.js'
import { savePendingInvestorOpportunity } from '../services/investment-service.js'
import { createElement } from '../utils/dom.js'

const RESULTS_PATH = '/ni-result'
const QUESTIONNAIRE_PATH = '/ni-questionnaire'
const SAVE_PATH = '/ni-my-investments'
const AUTH_PATH = '/t-save'

function createCompareSelection() {
  const opportunityIds = investorResultMatches.map((match) => match.id)
  const storedSelection = getInvestorCompareSelection()
  const pendingInvestment = getPendingInvestment()
  const restoredId = storedSelection?.selectedOpportunityId
  const pendingId = pendingInvestment?.opportunityKey
  const selectedOpportunityId = opportunityIds.includes(restoredId)
    ? restoredId
    : opportunityIds.includes(pendingId)
      ? pendingId
      : opportunityIds[0]

  return {
    opportunityIds,
    selectedOpportunityId,
  }
}

const comparisonRows = Object.freeze([
  Object.freeze({
    label: 'Fit score',
    value: (match) => `${match.fit}%`,
    className: 'investor-compare__fit-value',
  }),
  Object.freeze({ label: 'Type', value: (match) => match.type }),
  Object.freeze({ label: 'Scale', value: (match) => match.scale }),
  Object.freeze({ label: 'Target segment', value: (match) => match.segment }),
  Object.freeze({ label: 'Region insight', value: (match) => match.insight }),
])

function createOpportunityHeading(match) {
  const bestMatch = match.rank === 'Best Match'

  return createElement('th', {
    className: 'investor-compare__opportunity-heading',
    attributes: { scope: 'col' },
    children: [
      createBadge(
        match.rank,
        bestMatch ? 'gold' : 'brand',
        [
          'investor-compare__rank',
          bestMatch
            ? 'investor-compare__rank--best'
            : 'investor-compare__rank--alternative',
        ].join(' '),
      ),
      createElement('p', {
        className: 'investor-compare__region',
        text: match.region,
      }),
    ],
  })
}

function createComparisonRow(row) {
  return createElement('tr', {
    children: [
      createElement('th', {
        className: 'investor-compare__criterion',
        attributes: { scope: 'row' },
        text: row.label,
      }),
      ...investorResultMatches.map((match) =>
        createElement('td', {
          className: [
            'investor-compare__value',
            row.className ?? '',
          ].filter(Boolean).join(' '),
          text: row.value(match),
        }),
      ),
    ],
  })
}

function createComparisonTable() {
  return createElement('table', {
    className: 'investor-compare__table',
    children: [
      createElement('caption', {
        className: 'visually-hidden',
        text: 'Side-by-side comparison of the three recommended tourism investment opportunities.',
      }),
      createElement('thead', {
        children: [
          createElement('tr', {
            children: [
              createElement('th', {
                className: 'investor-compare__criteria-heading',
                attributes: { scope: 'col' },
                text: 'Criteria',
              }),
              ...investorResultMatches.map(createOpportunityHeading),
            ],
          }),
        ],
      }),
      createElement('tbody', {
        children: comparisonRows.map(createComparisonRow),
      }),
    ],
  })
}

function createTableCard() {
  return createCard({
    tagName: 'div',
    className: 'investor-compare__table-card',
    children: [
      createElement('p', {
        className: 'investor-compare__scroll-hint',
        text: 'Scroll sideways to compare every opportunity.',
      }),
      createElement('div', {
        className: 'investor-compare__table-region',
        attributes: {
          role: 'region',
          'aria-label': 'Opportunity comparison table. Scroll horizontally to compare all opportunities.',
          tabindex: '0',
        },
        children: [createComparisonTable()],
      }),
    ],
  })
}

export function createInvestorComparePage({ path = '/ni-compare', router } = {}) {
  let mounted = false
  let destroyed = false
  let savePending = false
  const compareSelection = createCompareSelection()

  const header = createSiteHeader({ currentPath: path })
  const pageController = new AbortController()
  let headerCleanup = () => {}
  const saveStatus = createElement('p', {
    className: 'investor-compare__save-status',
    attributes: {
      role: 'status',
      'aria-live': 'polite',
      'aria-atomic': 'true',
    },
  })

  const main = createElement('main', {
    className: 'investor-compare-main',
    attributes: { id: 'main-content', tabindex: '-1' },
    children: [
      createElement('section', {
        className: 'investor-compare',
        attributes: { 'aria-labelledby': 'investor-compare-title' },
        children: [
          createElement('header', {
            className: 'investor-compare__overview animate-rise',
            children: [
              createElement('div', {
                className: 'investor-compare__intro',
                children: [
                  createEyebrow('Side by side'),
                  createElement('h1', {
                    className: 'investor-compare__title',
                    attributes: { id: 'investor-compare-title' },
                    text: 'Compare your matches',
                  }),
                ],
              }),
              createElement('div', {
                className: 'investor-compare__header-actions',
                children: [
                  createButtonLink({
                    href: RESULTS_PATH,
                    label: 'Back to results',
                    variant: 'outline',
                    className: 'investor-compare__header-action',
                  }),
                  createButtonLink({
                    href: QUESTIONNAIRE_PATH,
                    label: 'Update criteria',
                    variant: 'outline',
                    className: 'investor-compare__header-action',
                  }),
                ],
              }),
            ],
          }),
          createTableCard(),
          createElement('div', {
            className: 'investor-compare__save-row',
            children: [
              createButtonLink({
                href: SAVE_PATH,
                label: 'Save best match',
                variant: 'gold',
                arrow: true,
                className: 'investor-compare__save',
                attributes: {
                  'aria-label': `Save best match: ${investorResultMatches[0].region}`,
                  'data-investment-save': true,
                },
              }),
              saveStatus,
            ],
          }),
        ],
      }),
    ],
  })

  const page = createElement('div', {
    className: 'investor-compare-page paper',
    children: [header, main],
  })

  const handleClick = (event) => {
    const saveLink = event.target instanceof Element
      ? event.target.closest('[data-investment-save]')
      : null

    if (!(saveLink instanceof HTMLAnchorElement)) {
      return
    }

    event.preventDefault()

    if (savePending) {
      return
    }

    const user = getCurrentUser()

    if (!user) {
      saveStatus.classList.add('is-error')
      saveStatus.setAttribute('role', 'alert')
      saveStatus.replaceChildren(
        document.createTextNode('Sign in before saving this opportunity. '),
        createElement('a', {
          attributes: { href: AUTH_PATH, 'data-router-link': true },
          text: 'Use the existing account access',
        }),
        document.createTextNode(', then return to your comparison.'),
      )
      return
    }

    savePending = true
    saveLink.setAttribute('aria-disabled', 'true')
    saveLink.setAttribute('aria-busy', 'true')
    saveStatus.classList.remove('is-error')
    saveStatus.setAttribute('role', 'status')
    saveStatus.textContent = 'Saving your opportunity…'

    void savePendingInvestorOpportunity(user, {
      selectedOpportunityId: compareSelection.selectedOpportunityId,
    })
      .then(async () => {
        if (destroyed) {
          return
        }

        saveStatus.textContent = 'Opportunity saved.'
        await router?.navigate(SAVE_PATH)
      })
      .catch(() => {
        if (destroyed) {
          return
        }

        saveStatus.classList.add('is-error')
        saveStatus.setAttribute('role', 'alert')
        saveStatus.textContent = 'We could not save this opportunity. Your comparison is still available — please try again.'
      })
      .finally(() => {
        savePending = false

        if (destroyed) {
          return
        }

        saveLink.removeAttribute('aria-disabled')
        saveLink.removeAttribute('aria-busy')
      })
  }

  return {
    element: page,

    mount() {
      if (mounted || destroyed) {
        return
      }

      mounted = true
      saveInvestorCompareSelection(compareSelection)
      headerCleanup = mountSiteHeader(header, { signal: pageController.signal })
      page.addEventListener('click', handleClick, { signal: pageController.signal })
    },

    destroy() {
      if (destroyed) {
        return
      }

      destroyed = true
      pageController.abort()
      headerCleanup()
    },
  }
}
