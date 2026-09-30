import { createAdminShell } from '../components/admin-shell.js'
import { createBadge, createCard } from '../components/ui.js'
import {
  adminPartnershipsPresentation as presentation,
  partnershipStatuses,
} from '../data/admin-partnerships-presentation-data.js'
import { createElement } from '../utils/dom.js'
import { mountRevealObserver } from '../utils/reveal.js'
import { getCurrentUser } from '../services/auth-service.js'
import {
  getAdminPartnershipRequests,
  updateAdminPartnershipStatus,
} from '../services/partnership-request-service.js'
const statusByLabel = new Map(partnershipStatuses.map((status) => [status.label, status]))

function createStatusBadge(statusLabel) {
  const status = statusByLabel.get(statusLabel)
  return createBadge(statusLabel, status?.tone ?? 'sand', 'admin-partnership-status')
}

function createRequestIdentity(request) {
  return createElement('span', {
    className: 'admin-partnership-identity',
    children: [
      createElement('span', { className: 'admin-partnership-identity__name', text: request.business }),
      createElement('span', { className: 'admin-partnership-identity__type', text: request.type }),
    ],
  })
}

function createRequestButton(request, selected, view) {
  return createElement('button', {
    className: 'admin-partnership-view',
    attributes: {
      type: 'button',
      'data-partnership-id': request.id,
      'data-partnership-view': view,
      'aria-pressed': String(selected),
      'aria-controls': 'admin-partnership-detail',
      'aria-label': `View partnership request from ${request.business}`,
    },
    text: selected ? 'Viewing' : 'View request',
  })
}

function createRequestRow(request, status, selected) {
  return createElement('tr', {
    className: ['admin-partnerships-table__row', selected ? 'is-selected' : '']
      .filter(Boolean)
      .join(' '),
    children: [
      createElement('th', {
        attributes: { scope: 'row' },
        children: [createRequestIdentity(request)],
      }),
      createElement('td', { text: request.region }),
      createElement('td', { text: request.submitted }),
      createElement('td', { children: [createStatusBadge(status)] }),
      createElement('td', {
        className: 'admin-partnerships-table__action',
        children: [createRequestButton(request, selected, 'table')],
      }),
    ],
  })
}

function createRequestCard(request, status, selected) {
  return createElement('li', {
    children: [
      createCard({
        tagName: 'article',
        className: ['admin-partnership-card', selected ? 'is-selected' : '']
          .filter(Boolean)
          .join(' '),
        children: [
          createElement('div', {
            className: 'admin-partnership-card__topline',
            children: [createRequestIdentity(request), createStatusBadge(status)],
          }),
          createElement('dl', {
            className: 'admin-partnership-card__meta',
            children: [
              createElement('div', {
                children: [
                  createElement('dt', { text: 'Region' }),
                  createElement('dd', { text: request.region }),
                ],
              }),
              createElement('div', {
                children: [
                  createElement('dt', { text: 'Submitted' }),
                  createElement('dd', { text: request.submitted }),
                ],
              }),
            ],
          }),
          createRequestButton(request, selected, 'card'),
        ],
      }),
    ],
  })
}

function createDetailItem(label, value) {
  return createElement('div', {
    children: [
      createElement('dt', { text: label }),
      createElement('dd', { text: value }),
    ],
  })
}

function createStatusTimeline(currentStatus) {
  const currentIndex = partnershipStatuses.findIndex((status) => status.label === currentStatus)

  return createElement('ol', {
    className: 'admin-partnership-timeline',
    attributes: { 'aria-label': 'Canonical partnership status flow' },
    children: partnershipStatuses.map((status, index) => {
      const state = index < currentIndex ? 'complete' : index === currentIndex ? 'current' : 'upcoming'
      return createElement('li', {
        className: `admin-partnership-timeline__step is-${state}`,
        attributes: index === currentIndex ? { 'aria-current': 'step' } : {},
        children: [
          createElement('span', {
            className: 'admin-partnership-timeline__marker',
            attributes: { 'aria-hidden': 'true' },
            text: index < currentIndex ? '✓' : String(index + 1),
          }),
          createElement('span', {
            children: [
              createElement('strong', { text: status.label }),
              createElement('small', { text: status.description }),
            ],
          }),
        ],
      })
    }),
  })
}

function createStatusControl(request, currentStatus) {
  const selectId = `admin-partnership-status-${request.id}`

  return createElement('div', {
    className: 'admin-partnership-detail__status-control',
    children: [
      createElement('label', { attributes: { for: selectId }, text: 'Change status preview' }),
      createElement('select', {
        attributes: {
          id: selectId,
          'data-partnership-status-select': true,
          'data-partnership-id': request.id,
        },
        children: partnershipStatuses.map((status) =>
          createElement('option', {
            attributes: { value: status.label, selected: status.label === currentStatus },
            text: status.label,
          }),
        ),
      }),
      createElement('p', {
        text: 'Presentation only · this status resets when the page is destroyed or reloaded.',
      }),
    ],
  })
}

function createDetailContent(request, status) {
  return [
    createElement('div', {
      className: 'admin-partnership-detail__heading',
      children: [
        createElement('div', {
          children: [
            createElement('p', { text: 'Partnership request' }),
            createElement('h2', {
              attributes: { id: 'admin-partnership-detail-title' },
              text: request.business,
            }),
          ],
        }),
        createStatusBadge(status),
      ],
    }),
    createElement('p', {
      className: 'admin-partnership-detail__subtitle',
      text: `${request.type} · ${request.region}`,
    }),
    createElement('dl', {
      className: 'admin-partnership-detail__summary',
      children: [
        createDetailItem('Best-fit audience', request.audience),
        createDetailItem('Requested placement', request.placement),
        createDetailItem('Experience', request.experience),
        createDetailItem('Submitted', request.submitted),
      ],
    }),
    createElement('section', {
      className: 'admin-partnership-detail__workflow',
      attributes: { 'aria-labelledby': 'admin-partnership-workflow-title' },
      children: [
        createElement('h3', {
          attributes: { id: 'admin-partnership-workflow-title' },
          text: 'Request progress',
        }),
        createStatusTimeline(status),
      ],
    }),
    createStatusControl(request, status),
  ]
}

function createEmptyDetail() {
  return [
    createElement('div', {
      className: 'admin-partnership-detail__empty',
      children: [
        createElement('h2', {
          attributes: { id: 'admin-partnership-detail-title' },
          text: 'No request in this status',
        }),
        createElement('p', {
          text: 'Choose another status filter to inspect a presentation request.',
        }),
      ],
    }),
  ]
}

function createPartnershipsView(initialRequests = []) {
  const state = {
    requests: initialRequests,
    filter: 'All',
    selectedRequestId: initialRequests[0]?.id ?? '',
    statuses: new Map(
      initialRequests.map((request) => [request.id, request.initialStatus]),
    ),
    message: '',
  }

  const filterButtons = new Map()
  const tableBody = createElement('tbody')
  const mobileList = createElement('ul', {
    className: 'admin-partnerships-mobile-list',
    attributes: { 'aria-label': 'Partnership requests' },
  })
  const resultCount = createElement('p', {
    className: 'admin-partnerships__result-count',
    attributes: { 'aria-live': 'polite', 'aria-atomic': 'true' },
  })
  const statusAnnouncement = createElement('p', {
    className: 'visually-hidden',
    attributes: { 'aria-live': 'polite', 'aria-atomic': 'true' },
  })
  const detailPanel = createCard({
    tagName: 'aside',
    className: 'admin-partnership-detail reveal',
    attributes: {
      id: 'admin-partnership-detail',
      'aria-labelledby': 'admin-partnership-detail-title',
    },
  })

  const filters = createElement('div', {
    className: 'admin-partnership-filters',
    attributes: { role: 'group', 'aria-label': 'Filter requests by status' },
    children: presentation.filters.map((filter) => {
      const button = createElement('button', {
        className: 'admin-partnership-filters__button',
        attributes: {
          type: 'button',
          'data-partnership-filter': filter,
          'aria-pressed': String(filter === state.filter),
        },
        text: filter,
      })
      filterButtons.set(filter, button)
      return button
    }),
  })

  const table = createElement('table', {
    className: 'admin-partnerships-table',
    children: [
      createElement('caption', {
        className: 'visually-hidden',
        text: 'Existing business partnership requests',
      }),
      createElement('thead', {
        children: [
          createElement('tr', {
            children: [
              createElement('th', { attributes: { scope: 'col' }, text: 'Business' }),
              createElement('th', { attributes: { scope: 'col' }, text: 'Region' }),
              createElement('th', { attributes: { scope: 'col' }, text: 'Submitted' }),
              createElement('th', { attributes: { scope: 'col' }, text: 'Status' }),
              createElement('th', { attributes: { scope: 'col' }, text: 'Action' }),
            ],
          }),
        ],
      }),
      tableBody,
    ],
  })

  const main = createElement('main', {
    className: 'admin-partnerships-main animate-fade',
    attributes: {
      id: 'main-content',
      tabindex: '-1',
      'aria-labelledby': 'admin-partnerships-title',
    },
    children: [
      createElement('div', {
        className: 'admin-partnerships__intro reveal',
        children: [
          createElement('div', {
            children: [
              createElement('p', { className: 'admin-partnerships__eyebrow', text: 'Existing businesses' }),
              createElement('h2', { text: 'Partnership request management' }),
              createElement('p', {
                text: 'Review journey-placement context and track each request through the approved partnership workflow.',
              }),
            ],
          }),
          createBadge('Presentation data', 'brand'),
        ],
      }),
      createElement('div', {
        className: 'admin-partnerships__toolbar',
        children: [filters, resultCount],
      }),
      createElement('div', {
        className: 'admin-partnerships__layout',
        children: [
          createElement('section', {
            className: 'admin-partnerships__requests',
            attributes: { 'aria-label': 'Partnership request list' },
            children: [
              createCard({ className: 'admin-partnerships-table-card reveal', children: [table] }),
              mobileList,
            ],
          }),
          detailPanel,
        ],
      }),
      statusAnnouncement,
    ],
  })

  function getStatus(request) {
    return state.statuses.get(request.id) ?? request.initialStatus
  }

  function getVisibleRequests() {
    if (state.filter === 'All') {
      return state.requests
    }

   return state.requests.filter(
  (request) => getStatus(request) === state.filter
)
  }

  function reconcileSelection(visibleRequests) {
    if (!visibleRequests.some((request) => request.id === state.selectedRequestId)) {
      state.selectedRequestId = visibleRequests[0]?.id ?? ''
    }
  }

  function render() {
    const visibleRequests = getVisibleRequests()
    reconcileSelection(visibleRequests)

    for (const [filter, button] of filterButtons) {
      const active = filter === state.filter
      button.classList.toggle('is-active', active)
      button.setAttribute('aria-pressed', String(active))
    }

    resultCount.textContent = `${visibleRequests.length} ${visibleRequests.length === 1 ? 'request' : 'requests'}`

    if (visibleRequests.length) {
      tableBody.replaceChildren(
        ...visibleRequests.map((request) =>
          createRequestRow(
            request,
            getStatus(request),
            request.id === state.selectedRequestId,
          ),
        ),
      )
      mobileList.replaceChildren(
        ...visibleRequests.map((request) =>
          createRequestCard(
            request,
            getStatus(request),
            request.id === state.selectedRequestId,
          ),
        ),
      )
    } else {
      tableBody.replaceChildren(
        createElement('tr', {
          children: [
            createElement('td', {
              className: 'admin-partnerships__empty-row',
              attributes: { colspan: '5' },
              text: 'No presentation requests currently use this status.',
            }),
          ],
        }),
      )
      mobileList.replaceChildren(
        createElement('li', {
          className: 'admin-partnerships__empty-card',
          text: 'No presentation requests currently use this status.',
        }),
      )
    }

    const selectedRequest = state.requests.find(
      (request) => request.id === state.selectedRequestId,
    )
    detailPanel.replaceChildren(
      ...(selectedRequest
        ? createDetailContent(selectedRequest, getStatus(selectedRequest))
        : createEmptyDetail()),
    )
    statusAnnouncement.textContent = state.message
  }

  function handleClick(event) {
    const filterButton = event.target.closest('[data-partnership-filter]')
    if (filterButton) {
      state.filter = filterButton.dataset.partnershipFilter
      state.message = ''
      render()
      return
    }

    const requestButton = event.target.closest('[data-partnership-id][data-partnership-view]')
    if (!requestButton) {
      return
    }

    state.selectedRequestId = requestButton.dataset.partnershipId
    state.message = ''
    const view = requestButton.dataset.partnershipView
    render()
    main.querySelector(
      `[data-partnership-id="${state.selectedRequestId}"][data-partnership-view="${view}"]`,
    )?.focus({ preventScroll: true })
  }

  async function handleChange(event) {
  const statusSelect = event.target.closest(
    '[data-partnership-status-select]'
  )

  if (!statusSelect) {
    return
  }

  const requestId = statusSelect.dataset.partnershipId
  const request = state.requests.find(
    (item) => item.id === requestId
  )

  const nextStatus = statusSelect.value

  if (
    !request ||
    !statusByLabel.has(nextStatus)
  ) {
    return
  }

  const previousStatus = getStatus(request)

  if (nextStatus === previousStatus) {
    return
  }

  const user = getCurrentUser()

  if (!user) {
    statusSelect.value = previousStatus
    state.message = 'You must be signed in as an Admin to update this request.'
    statusAnnouncement.textContent = state.message
    return
  }

  statusSelect.disabled = true
  statusSelect.setAttribute('aria-busy', 'true')

  state.message =
    `Updating ${request.business} to ${nextStatus}...`

  statusAnnouncement.textContent = state.message

  try {
    await updateAdminPartnershipStatus(
      user,
      requestId,
      nextStatus
    )

    state.statuses.set(
      requestId,
      nextStatus
    )

    state.message =
      `Status changed to ${nextStatus} for ${request.business}.`

    render()

    const replacementSelect = main.querySelector(
      `[data-partnership-status-select][data-partnership-id="${requestId}"]`
    )

    replacementSelect?.focus({
      preventScroll: true,
    })
  } catch (error) {
    console.error(
      'Failed to update partnership status:',
      error
    )

    statusSelect.value = previousStatus

    state.message =
      `We could not update the status for ${request.business}. Please try again.`

    statusAnnouncement.textContent = state.message

    statusSelect.disabled = false
    statusSelect.removeAttribute('aria-busy')
  }
}

  function setRequests(requests) {
  const nextRequests = Array.isArray(requests)
    ? requests
    : []

  state.requests = nextRequests

  state.statuses = new Map(
    nextRequests.map((request) => [
      request.id,
      request.initialStatus,
    ]),
  )

  if (
    !nextRequests.some(
      (request) => request.id === state.selectedRequestId
    )
  ) {
    state.selectedRequestId = nextRequests[0]?.id ?? ''
  }

  state.message = ''

  render()
}

  render()
  return {
  element: main,
  handleClick,
  handleChange,
  setRequests,
}
}

export function createAdminPartnershipsPage() {
  let mounted = false
  let destroyed = false
  let revealCleanup = () => {}

  const pageController = new AbortController()
  const partnershipsView = createPartnershipsView()
  const page = createAdminShell({
    activeSection: 'partnerships',
    title: 'Partnerships',
    titleId: 'admin-partnerships-title',
    main: partnershipsView.element,
  })

  return {
    element: page,

    mount() {
      if (mounted || destroyed) {
        return
      }

      mounted = true
      const user = getCurrentUser()

if (user) {
  void getAdminPartnershipRequests(user)
    .then((requests) => {
      if (destroyed) {
        return
      }

      partnershipsView.setRequests(requests)
    })
    .catch((error) => {
      if (destroyed) {
        return
      }

      console.error('Failed to load partnership requests:', error)
    })
}
      partnershipsView.element.addEventListener('click', partnershipsView.handleClick, {
        signal: pageController.signal,
      })
      partnershipsView.element.addEventListener('change', partnershipsView.handleChange, {
        signal: pageController.signal,
      })
      revealCleanup = mountRevealObserver(page)
    },

    destroy() {
      if (destroyed) {
        return
      }

      destroyed = true
      pageController.abort()
      revealCleanup()
    },
  }
}
