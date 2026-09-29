import { createAdminShell } from '../components/admin-shell.js'
import { createCard, createBadge } from '../components/ui.js'
import { adminDashboardPresentation as dashboard } from '../data/admin-dashboard-presentation-data.js'
import { createElement } from '../utils/dom.js'
import { mountRevealObserver } from '../utils/reveal.js'

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

  const page = createAdminShell({
    activeSection: 'dashboard',
    title: 'Dashboard',
    titleId: 'admin-dashboard-title',
    main: createAdminDashboardMain(),
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
