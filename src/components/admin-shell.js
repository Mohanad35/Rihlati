import { homeAssets } from '../assets/home-assets.js'
import { adminDashboardPresentation as admin } from '../data/admin-dashboard-presentation-data.js'
import { createElement } from '../utils/dom.js'

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'

const adminIconPaths = Object.freeze({
  dashboard: 'M3 3v18h18M18 17V9M13 17V5M8 17v-3',
  users: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zm14 14v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
  matching: 'M12 3v18M5 7l-3 6h6L5 7zm14 0l-3 6h6l-3-6zM3 21h18M8 7h8',
  content: 'M6 2h9l5 5v15H6V2zm9 0v6h5M9 13h7M9 17h7',
  partnerships: 'M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 13v.01M9 17v.01',
  settings: 'M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7zm7.4-3.5a7.7 7.7 0 00-.1-1l2-1.6-2-3.4-2.5 1a8.5 8.5 0 00-1.7-1L14.7 3h-4L10.3 6a8.5 8.5 0 00-1.7 1L6.1 6 4 9.4 6.1 11a7.7 7.7 0 000 2L4 14.6 6.1 18l2.5-1a8.5 8.5 0 001.7 1l.4 3h4l.4-3a8.5 8.5 0 001.7-1l2.5 1 2-3.4-2-1.6a7.7 7.7 0 00.1-1z',
  search: 'M11 19a8 8 0 100-16 8 8 0 000 16zm6 0l4 4',
  bell: 'M18 8a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4',
  logout: 'M10 17l5-5-5-5M15 12H3M21 19V5a2 2 0 00-2-2h-5',
  map: 'M9 20l-6 3V6l6-3m0 17l6 3m-6-3V3m6 20l6-3V3l-6 3m0 14V6',
})

export function createAdminIcon(name, className = 'admin-icon') {
  const svg = document.createElementNS(SVG_NAMESPACE, 'svg')
  const path = document.createElementNS(SVG_NAMESPACE, 'path')

  svg.setAttribute('class', className)
  svg.setAttribute('viewBox', '0 0 24 24')
  svg.setAttribute('fill', 'none')
  svg.setAttribute('stroke', 'currentColor')
  svg.setAttribute('stroke-width', '1.8')
  svg.setAttribute('stroke-linecap', 'round')
  svg.setAttribute('stroke-linejoin', 'round')
  svg.setAttribute('aria-hidden', 'true')
  path.setAttribute('d', adminIconPaths[name])
  svg.append(path)

  return svg
}

function createNavigationItem(item, activeSection, { mobile = false } = {}) {
  const isActive = item.id === activeSection
  const isImplemented = Boolean(item.href)
  const className = [
    mobile ? 'admin-mobile-nav__item' : 'admin-sidebar__item',
    isActive ? 'is-active' : '',
  ].filter(Boolean).join(' ')
  const children = [
    createAdminIcon(item.icon),
    createElement('span', { text: item.label }),
    ...(!isImplemented && !mobile
      ? [createElement('span', { className: 'admin-sidebar__soon', text: 'Soon' })]
      : []),
  ]

  if (isImplemented) {
    return createElement('a', {
      className,
      attributes: {
        href: item.href,
        'data-router-link': true,
        ...(isActive ? { 'aria-current': 'page' } : {}),
      },
      children,
    })
  }

  return createElement('button', {
    className,
    attributes: {
      type: 'button',
      'aria-disabled': 'true',
      title: `${item.label} will be added in a later phase`,
    },
    children,
  })
}

function createAdminSidebar(activeSection) {
  return createElement('aside', {
    className: 'admin-sidebar',
    attributes: { 'aria-label': 'Admin navigation' },
    children: [
      createElement('a', {
        className: 'admin-sidebar__brand',
        attributes: { href: '/', 'data-router-link': true, 'aria-label': 'Rihlati home' },
        children: [
          createElement('img', {
            attributes: {
              src: homeAssets.logo,
              alt: 'Rihlati — رحلتي',
              fetchpriority: 'high',
              decoding: 'async',
            },
          }),
        ],
      }),
      createElement('nav', {
        className: 'admin-sidebar__nav',
        attributes: { 'aria-label': 'Admin sections' },
        children: admin.navigation.map((item) => createNavigationItem(item, activeSection)),
      }),
      createElement('button', {
        className: 'admin-sidebar__exit',
        attributes: {
          type: 'button',
          'data-admin-sign-out': true,
        },
        children: [createAdminIcon('logout'), createElement('span', { text: 'Sign out' })],
      }),
    ],
  })
}

function createAdminTopbar(title, titleId) {
  return createElement('header', {
    className: 'admin-topbar glass',
    children: [
      createElement('div', {
        children: [
          createElement('p', { className: 'admin-topbar__eyebrow', text: 'Rihlati Admin' }),
          createElement('h1', {
            className: 'admin-topbar__title',
            attributes: { id: titleId },
            text: title,
          }),
        ],
      }),
      createElement('div', {
        className: 'admin-topbar__actions',
        children: [
          createElement('div', {
            className: 'admin-topbar__search',
            attributes: { 'aria-hidden': 'true' },
            children: [createAdminIcon('search'), createElement('span', { text: 'Search…' })],
          }),
          createElement('button', {
            className: 'admin-topbar__notifications',
            attributes: {
              type: 'button',
              disabled: true,
              'aria-label': 'Notifications are not available yet',
            },
            children: [
              createAdminIcon('bell'),
              createElement('span', { className: 'admin-topbar__notification-dot' }),
            ],
          }),
          createElement('button', {
            className: 'admin-topbar__sign-out',
            attributes: {
              type: 'button',
              'data-admin-sign-out': true,
              'aria-label': 'Sign out of Admin',
            },
            children: [createAdminIcon('logout')],
          }),
          createElement('span', {
            className: 'admin-topbar__avatar',
            attributes: { 'aria-label': 'Admin profile' },
            text: 'A',
          }),
        ],
      }),
    ],
  })
}

function createAdminMobileNavigation(activeSection) {
  return createElement('nav', {
    className: 'admin-mobile-nav',
    attributes: { 'aria-label': 'Admin sections' },
    children: admin.navigation.map((item) =>
      createNavigationItem(item, activeSection, { mobile: true }),
    ),
  })
}

export function createAdminShell({ activeSection, title, titleId, main }) {
  return createElement('div', {
    className: 'admin-page',
    children: [
      createElement('div', {
        className: 'admin-shell',
        children: [
          createAdminSidebar(activeSection),
          createElement('div', {
            className: 'admin-workspace',
            children: [
              createAdminTopbar(title, titleId),
              createAdminMobileNavigation(activeSection),
              main,
            ],
          }),
        ],
      }),
    ],
  })
}
