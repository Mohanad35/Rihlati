import { homeAssets } from '../assets/home-assets.js'
import { createCard, createBadge } from '../components/ui.js'
import { adminDashboardPresentation as dashboard } from '../data/admin-dashboard-presentation-data.js'
import { createElement } from '../utils/dom.js'
import { mountRevealObserver } from '../utils/reveal.js'

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
})

function createAdminIcon(name, className = 'admin-icon') {
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

function createAdminNavigationButton(item, { mobile = false } = {}) {
  return createElement('button', {
    className: [
      mobile ? 'admin-mobile-nav__item' : 'admin-sidebar__item',
      item.active ? 'is-active' : '',
    ].filter(Boolean).join(' '),
    attributes: {
      type: 'button',
      ...(item.active ? { 'aria-current': 'page' } : { 'aria-disabled': 'true' }),
      ...(!item.active ? { title: `${item.label} will be added in a later phase` } : {}),
    },
    children: [
      createAdminIcon(item.icon),
      createElement('span', { text: item.label }),
      ...(!item.active && !mobile
        ? [createElement('span', { className: 'admin-sidebar__soon', text: 'Soon' })]
        : []),
    ],
  })
}

function createAdminSidebar() {
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
        children: dashboard.navigation.map((item) => createAdminNavigationButton(item)),
      }),
      createElement('a', {
        className: 'admin-sidebar__exit',
        attributes: { href: '/', 'data-router-link': true },
        children: [createAdminIcon('logout'), createElement('span', { text: 'Exit admin' })],
      }),
    ],
  })
}

function createAdminTopbar() {
  return createElement('header', {
    className: 'admin-topbar glass',
    children: [
      createElement('div', {
        children: [
          createElement('p', { className: 'admin-topbar__eyebrow', text: 'Rihlati Admin' }),
          createElement('h1', {
            className: 'admin-topbar__title',
            attributes: { id: 'admin-dashboard-title' },
            text: 'Dashboard',
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

function createAdminMobileNavigation() {
  return createElement('nav', {
    className: 'admin-mobile-nav',
    attributes: { 'aria-label': 'Admin sections' },
    children: dashboard.navigation.map((item) =>
      createAdminNavigationButton(item, { mobile: true }),
    ),
  })
}

function createMetricCard(metric) {
  return createCard({
    className: 'admin-metric reveal',
    attributes: { 'aria-label': `${metric.label}: ${metric.value}` },
    children: [
      createElement('p', { className: 'admin-metric__label', text: metric.label }),
      createElement('p', { className: 'admin-metric__value', text: metric.value }),
      createElement('div', {
        className: 'admin-metric__context',
        children: [
          createElement('span', {
            className: [
              'admin-metric__delta',
              metric.attention ? 'is-attention' : '',
            ].filter(Boolean).join(' '),
            text: metric.delta,
          }),
          createElement('span', { className: 'admin-metric__note', text: metric.note }),
        ],
      }),
    ],
  })
}

function createTravellerSegment(segment) {
  return createElement('li', {
    className: 'admin-segment',
    children: [
      createElement('div', {
        className: 'admin-segment__label-row',
        children: [
          createElement('span', { className: 'admin-segment__label', text: segment.label }),
          createElement('span', { className: 'admin-segment__share', text: `${segment.share}%` }),
        ],
      }),
      createElement('div', {
        className: 'admin-segment__track',
        attributes: {
          role: 'progressbar',
          'aria-label': segment.label,
          'aria-valuemin': '0',
          'aria-valuemax': '100',
          'aria-valuenow': String(segment.share),
        },
        children: [
          createElement('span', {
            className: 'admin-segment__bar',
            attributes: { style: `width: ${segment.share}%` },
          }),
        ],
      }),
    ],
  })
}

function createSegmentPanel() {
  return createCard({
    tagName: 'section',
    className: 'admin-panel admin-segments reveal',
    attributes: { 'aria-labelledby': 'admin-segments-title' },
    children: [
      createElement('div', {
        className: 'admin-panel__heading',
        children: [
          createElement('h2', {
            className: 'admin-panel__title',
            attributes: { id: 'admin-segments-title' },
            text: 'Traveller segment mix',
          }),
          createBadge('Last 30 days', 'brand'),
        ],
      }),
      createElement('ul', {
        className: 'admin-segments__list',
        children: dashboard.travellerSegments.map(createTravellerSegment),
      }),
    ],
  })
}

function createAttentionPanel() {
  return createCard({
    tagName: 'section',
    className: 'admin-panel admin-attention reveal',
    attributes: { 'aria-labelledby': 'admin-attention-title' },
    children: [
      createElement('h2', {
        className: 'admin-panel__title',
        attributes: { id: 'admin-attention-title' },
        text: 'Needs attention',
      }),
      createElement('ul', {
        className: 'admin-attention__list',
        children: dashboard.attentionItems.map((item) =>
          createElement('li', {
            className: 'admin-attention__item',
            children: [
              createElement('span', {
                className: `admin-attention__dot admin-attention__dot--${item.tone}`,
                attributes: { 'aria-hidden': 'true' },
              }),
              createElement('span', { text: item.label }),
            ],
          }),
        ),
      }),
      createElement('button', {
        className: 'button button--outline button--small button--full admin-attention__review',
        attributes: { type: 'button', disabled: true },
        text: 'Review all',
      }),
    ],
  })
}

function createAdminDashboardMain() {
  return createElement('main', {
    className: 'admin-dashboard-main animate-fade',
    attributes: {
      id: 'main-content',
      tabindex: '-1',
      'aria-labelledby': 'admin-dashboard-title',
    },
    children: [
      createElement('p', {
        className: 'admin-dashboard__data-note',
        text: 'Dashboard preview · Presentation data',
      }),
      createElement('section', {
        className: 'admin-metrics',
        attributes: { 'aria-label': 'Platform overview metrics' },
        children: dashboard.metrics.map(createMetricCard),
      }),
      createElement('div', {
        className: 'admin-dashboard__panels',
        children: [createSegmentPanel(), createAttentionPanel()],
      }),
    ],
  })
}

export function createAdminDashboardPage() {
  let mounted = false
  let destroyed = false
  let revealCleanup = () => {}

  const page = createElement('div', {
    className: 'admin-page',
    children: [
      createElement('div', {
        className: 'admin-shell',
        children: [
          createAdminSidebar(),
          createElement('div', {
            className: 'admin-workspace',
            children: [
              createAdminTopbar(),
              createAdminMobileNavigation(),
              createAdminDashboardMain(),
            ],
          }),
        ],
      }),
    ],
  })

  return {
    element: page,

    mount() {
      if (mounted || destroyed) {
        return
      }

      mounted = true
      revealCleanup = mountRevealObserver(page)
    },

    destroy() {
      if (destroyed) {
        return
      }

      destroyed = true
      revealCleanup()
    },
  }
}
