import { createAdminIcon, createAdminShell } from '../components/admin-shell.js'
import { createBadge, createCard } from '../components/ui.js'
import { adminUsersPresentation as presentation } from '../data/admin-users-presentation-data.js'
import { createElement } from '../utils/dom.js'
import { mountRevealObserver } from '../utils/reveal.js'
import { getAllUsers } from '../repositories/user-repository.js'
import { getJourneysByOwner } from '../repositories/journey-repository.js'
import { getInvestmentsByOwner } from '../repositories/investment-repository.js'


function mapFirestoreUser(user) {
  const personas =
    Array.isArray(user.personas)
      ? user.personas
      : []

  let role = 'Tourist'

  if (
    personas.includes('tourist')
    && personas.includes('investor')
  ) {
    role = 'Tourist & Investor'
  } else if (personas.includes('investor')) {
    role = 'Investor'
  }

  return {
    id: user.id,
    name:
      user.displayName
      || user.email
      || 'Unnamed user',
    email: user.email ?? '',
    role,
    personas,
    country: '—',
    activity: 'Loading activity…',
    status: 'Registered',
    createdAt: user.createdAt,
  }
}

function isInvestor(user) {
  return user.role.includes('Investor')
}

function userMatchesFilter(user, filter) {
  if (filter === 'Tourists') {
    return user.personas.includes('tourist')
  }

  if (filter === 'Investors') {
    return user.personas.includes('investor')
  }

  return true
}

function createStatus(status) {
  return createElement('span', {
    className: `admin-user-status admin-user-status--${status.toLowerCase()}`,
    children: [
      createElement('span', {
        className: 'admin-user-status__dot',
        attributes: { 'aria-hidden': 'true' },
      }),
      createElement('span', { text: status }),
    ],
  })
}

function createUserIdentity(user) {
  return createElement('span', {
    className: 'admin-user-identity',
    children: [
      createElement('span', {
        className: 'admin-user-identity__avatar',
        attributes: { 'aria-hidden': 'true' },
        text: user.name[0],
      }),
      createElement('span', {
        children: [
          createElement('span', { className: 'admin-user-identity__name', text: user.name }),
          createElement('span', { className: 'admin-user-identity__country', text: user.country }),
        ],
      }),
    ],
  })
}

function createUserRow(user, selected) {
  return createElement('tr', {
    className: ['admin-users-table__row', selected ? 'is-selected' : ''].filter(Boolean).join(' '),
    children: [
      createElement('th', {
        className: 'admin-users-table__name-cell',
        attributes: { scope: 'row' },
        children: [
          createElement('button', {
            className: 'admin-users-table__select',
            attributes: {
              type: 'button',
              'data-user-id': user.id,
              'data-user-view': 'table',
              'aria-pressed': String(selected),
              'aria-label': `View ${user.name}`,
            },
            children: [createUserIdentity(user)],
          }),
        ],
      }),
      createElement('td', {
        children: [createBadge(user.role, user.role === 'Tourist' ? 'terracotta' : 'gold')],
      }),
      createElement('td', { className: 'admin-users-table__activity', text: user.activity }),
      createElement('td', { children: [createStatus(user.status)] }),
    ],
  })
}

function createUserCard(user, selected) {
  return createElement('button', {
    className: ['admin-user-card', selected ? 'is-selected' : ''].filter(Boolean).join(' '),
    attributes: {
      type: 'button',
      'data-user-id': user.id,
      'data-user-view': 'card',
      'aria-pressed': String(selected),
    },
    children: [
      createElement('span', {
        className: 'admin-user-card__top',
        children: [createUserIdentity(user), createStatus(user.status)],
      }),
      createElement('span', {
        className: 'admin-user-card__meta',
        children: [
          createBadge(user.role, user.role === 'Tourist' ? 'terracotta' : 'gold'),
          createElement('span', { text: user.activity }),
        ],
      }),
    ],
  })
}

function createProfileSection(label, children) {
  return createElement('section', {
    className: 'admin-user-profile__section',
    children: [
      createElement('h3', { className: 'admin-user-profile__label', text: label }),
      ...children,
    ],
  })
}

function createProfileContent(user) {
  const createdDate =
    typeof user.createdAt?.toDate === 'function'
      ? user.createdAt.toDate().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : 'Not available'

  const personaLabels =
    user.personas.length > 0
      ? user.personas.map((persona) =>
          persona === 'tourist'
            ? 'Tourist'
            : 'Investor',
        )
      : ['Unknown']

  return [
    createElement('div', {
      className: 'admin-user-profile__header',

      children: [
        createElement('span', {
          className: 'admin-user-profile__avatar',

          attributes: {
            'aria-hidden': 'true',
          },

          text:
            user.name?.[0]?.toUpperCase()
            ?? '?',
        }),

        createElement('div', {
          children: [
            createElement('h2', {
              className: 'admin-user-profile__name',
              text: user.name,
            }),

            createElement('p', {
              className: 'admin-user-profile__meta',
              text: user.role,
            }),
          ],
        }),
      ],
    }),

    createElement('div', {
      className: 'admin-user-profile__details',

      children: [
        createProfileSection(
          'Account type',
          [
            createElement('div', {
              className: 'admin-user-profile__tags',

              children:
                personaLabels.map(
                  (persona) =>
                    createBadge(
                      persona,
                      'sand',
                    ),
                ),
            }),
          ],
        ),

        createProfileSection(
          'Email address',
          [
            createElement('p', {
              className:
                'admin-user-profile__summary',

              text:
                user.email
                || 'Not available',
            }),
          ],
        ),

        createProfileSection(
          'Joined Rihlati',
          [
            createElement('p', {
              className:
                'admin-user-profile__summary',

              text: createdDate,
            }),
          ],
        ),

        createProfileSection(
          'Account ID',
          [
            createElement('p', {
              className:
                'admin-user-profile__summary',

              text: user.id,
            }),
          ],
        ),
      ],
    }),
  ]
}
function createUsersView() {
 const state = {
  filter: 'All',
  selectedUserId: '',
  users: [],
}
  const filterButtons = new Map()
  const tableBody = createElement('tbody')
  const mobileList = createElement('div', {
    className: 'admin-users-mobile-list',
    attributes: { 'aria-label': 'Platform users' },
  })
  const profilePanel = createCard({
    tagName: 'aside',
    className: 'admin-user-profile reveal',
    attributes: {
      'aria-label': 'Selected user details',
      'aria-live': 'polite',
      'aria-atomic': 'true',
    },
  })

  const filters = createElement('div', {
    className: 'admin-user-filters',
    attributes: { role: 'group', 'aria-label': 'Filter users by type' },
    children: presentation.filters.map((filter) => {
      const button = createElement('button', {
        className: 'admin-user-filters__button',
        attributes: {
          type: 'button',
          'data-user-filter': filter,
          'aria-pressed': String(filter === state.filter),
        },
        text: filter,
      })
      filterButtons.set(filter, button)
      return button
    }),
  })

  const table = createElement('table', {
    className: 'admin-users-table',
    children: [
      createElement('caption', { className: 'sr-only', text: 'Rihlati platform users' }),
      createElement('thead', {
        children: [
          createElement('tr', {
            children: [
              createElement('th', { attributes: { scope: 'col' }, text: 'Name' }),
              createElement('th', { attributes: { scope: 'col' }, text: 'Role' }),
              createElement('th', {
                className: 'admin-users-table__activity',
                attributes: { scope: 'col' },
                text: 'Activity',
              }),
              createElement('th', { attributes: { scope: 'col' }, text: 'Status' }),
            ],
          }),
        ],
      }),
      tableBody,
    ],
  })

  const main = createElement('main', {
    className: 'admin-users-main animate-fade',
    attributes: {
      id: 'main-content',
      tabindex: '-1',
      'aria-labelledby': 'admin-users-title',
    },
    children: [
      createElement('div', {
        className: 'admin-users__toolbar',
        children: [
          filters,
          createElement('p', {
            className: 'admin-users__data-note',
            text: 'User preview · Presentation data',
          }),
        ],
      }),
      createElement('div', {
        className: 'admin-users__layout',
        children: [
          createElement('div', {
            children: [
              createCard({ className: 'admin-users-table-card reveal', children: [table] }),
              mobileList,
            ],
          }),
          profilePanel,
        ],
      }),
    ],
  })

  function getVisibleUsers() {
return state.users.filter(
  (user) =>
    userMatchesFilter(
      user,
      state.filter,
    ),
)  }

  function reconcileSelection(visibleUsers) {
    if (!visibleUsers.some((user) => user.id === state.selectedUserId)) {
      state.selectedUserId = visibleUsers[0]?.id ?? ''
    }
  }

  function render() {
    const visibleUsers = getVisibleUsers()
    reconcileSelection(visibleUsers)

    for (const [filter, button] of filterButtons) {
      const active = filter === state.filter
      button.classList.toggle('is-active', active)
      button.setAttribute('aria-pressed', String(active))
    }

    tableBody.replaceChildren(
      ...visibleUsers.map((user) => createUserRow(user, user.id === state.selectedUserId)),
    )
    mobileList.replaceChildren(
      ...visibleUsers.map((user) => createUserCard(user, user.id === state.selectedUserId)),
    )

const selectedUser =
  state.users.find(
    (user) =>
      user.id === state.selectedUserId,
  )

if (!selectedUser) {
  profilePanel.replaceChildren(
    createElement('p', {
      className: 'admin-user-profile__summary',
      text: 'Loading users…',
    }),
  )

  return
}

profilePanel.replaceChildren(
  ...createProfileContent(selectedUser),
)
  }

  function handleClick(event) {
    const filterButton = event.target.closest('[data-user-filter]')
    if (filterButton) {
      state.filter = filterButton.dataset.userFilter
      render()
      return
    }

    const userButton = event.target.closest('[data-user-id]')
    if (!userButton) {
      return
    }

    state.selectedUserId = userButton.dataset.userId
    const view = userButton.dataset.userView
    render()
    main.querySelector(`[data-user-id="${state.selectedUserId}"][data-user-view="${view}"]`)
      ?.focus({ preventScroll: true })
  }

  async function loadUserActivities() {
  const activityResults =
    await Promise.all(
      state.users.map(
        async (user) => {
          try {
            const [
              journeys,
              investments,
            ] = await Promise.all([
              getJourneysByOwner(user.id),
              getInvestmentsByOwner(user.id),
            ])

            return {
              userId: user.id,
              journeyCount:
                journeys.length,
              investmentCount:
                investments.length,
            }
          } catch (error) {
            console.error(
              `Failed to load activity for ${user.id}:`,
              error,
            )

            return {
              userId: user.id,
              journeyCount: 0,
              investmentCount: 0,
            }
          }
        },
      ),
    )

  for (const result of activityResults) {
    const user =
      state.users.find(
        (item) =>
          item.id === result.userId,
      )

    if (!user) {
      continue
    }

    const journeyLabel =
      result.journeyCount === 1
        ? '1 saved journey'
        : `${result.journeyCount} saved journeys`

    const investmentLabel =
      result.investmentCount === 1
        ? '1 saved investment'
        : `${result.investmentCount} saved investments`

    user.activity =
      `${journeyLabel} · ${investmentLabel}`
  }

  render()
}

  function setUsers(users) {
  state.users =
    users.map(mapFirestoreUser)

  state.selectedUserId =
    state.users[0]?.id ?? ''

  render()
  void loadUserActivities()
}

  render()

  return {
  element: main,
  handleClick,
  setUsers,
}
}

export function createAdminUsersPage() {
  let mounted = false
  let destroyed = false
  let revealCleanup = () => {}

  const pageController = new AbortController()
  const usersView = createUsersView()
  const page = createAdminShell({
    activeSection: 'users',
    title: 'Users',
    titleId: 'admin-users-title',
    main: usersView.element,
  })

  return {
    element: page,

    mount() {
      if (mounted || destroyed) {
        return
      }

      mounted = true

      void getAllUsers()
  .then((users) => {
    if (destroyed) {
      return
    }

    usersView.setUsers(users)
  })
  .catch((error) => {
    console.error(
      'Failed to load admin users:',
      error,
    )
  })
      usersView.element.addEventListener('click', usersView.handleClick, {
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
