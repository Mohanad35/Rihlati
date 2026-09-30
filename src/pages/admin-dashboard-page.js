import { createAdminShell } from '../components/admin-shell.js'
import { createCard, createBadge } from '../components/ui.js'
import { adminDashboardPresentation as dashboard } from '../data/admin-dashboard-presentation-data.js'
import {
  getAdminDashboardCounts,
  getTravellerSegmentMix,
} from '../repositories/admin-dashboard-repository.js'
import { createElement } from '../utils/dom.js'
import { mountRevealObserver } from '../utils/reveal.js'

const liveMetricDefinitions = Object.freeze([
  Object.freeze({
    key: 'registeredUsers',
    label: 'Registered users',
    delta: 'Live data',
    note: 'Tourists & investors',
    attention: false,
  }),

  Object.freeze({
    key: 'savedJourneys',
    label: 'Saved journeys',
    delta: 'Live data',
    note: 'Stored journeys',
    attention: false,
  }),

  Object.freeze({
    key: 'savedInvestments',
    label: 'Saved investments',
    delta: 'Live data',
    note: 'Stored opportunities',
    attention: false,
  }),

  Object.freeze({
    key: 'pendingPartnerships',
    label: 'Pending partnerships',
    delta: 'Needs review',
    note: 'New requests',
    attention: true,
  }),
])

function createMetricCard(metric) {
  return createCard({
    className: 'admin-metric reveal',

    attributes: {
      'aria-label': `${metric.label}: ${metric.value}`,
      'data-dashboard-metric-card': metric.key,
    },

    children: [
      createElement('p', {
        className: 'admin-metric__label',
        text: metric.label,
      }),

      createElement('p', {
        className: 'admin-metric__value',

        attributes: {
          'data-dashboard-metric-value': metric.key,
        },

        text: metric.value,
      }),

      createElement('div', {
        className: 'admin-metric__context',

        children: [
          createElement('span', {
            className: [
              'admin-metric__delta',
              metric.attention
                ? 'is-attention'
                : '',
            ]
              .filter(Boolean)
              .join(' '),

            text: metric.delta,
          }),

          createElement('span', {
            className: 'admin-metric__note',
            text: metric.note,
          }),
        ],
      }),
    ],
  })
}

function createTravellerSegment(segment) {
  return createElement('li', {
    className: 'admin-segment',

    attributes: {
      'data-traveller-segment': segment.label,
    },

    children: [
      createElement('div', {
        className: 'admin-segment__label-row',

        children: [
          createElement('span', {
            className: 'admin-segment__label',
            text: segment.label,
          }),

          createElement('span', {
            className: 'admin-segment__share',

            attributes: {
              'data-traveller-segment-share': true,
            },

            text: `${segment.share}%`,
          }),
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

            attributes: {
              'data-traveller-segment-bar': true,
              style: `width: ${segment.share}%`,
            },
          }),
        ],
      }),
    ],
  })
}

function createSegmentPanel() {
  const initialSegments =
    dashboard.travellerSegments.map(
      (segment) => ({
        ...segment,
        share: 0,
      }),
    )

  return createCard({
    tagName: 'section',
    className: 'admin-panel admin-segments reveal',

    attributes: {
      'aria-labelledby': 'admin-segments-title',
    },

    children: [
      createElement('div', {
        className: 'admin-panel__heading',

        children: [
          createElement('h2', {
            className: 'admin-panel__title',

            attributes: {
              id: 'admin-segments-title',
            },

            text: 'Traveller segment mix',
          }),

          createBadge(
            'Live Firestore data',
            'brand',
          ),
        ],
      }),

      createElement('ul', {
        className: 'admin-segments__list',

        children:
          initialSegments.map(
            createTravellerSegment,
          ),
      }),
    ],
  })
}

function createAttentionPanel() {
  const attentionItems = [
    {
      key: 'pendingPartnerships',
      label: 'partnership requests pending',
      tone: 'terracotta',
    },
    {
      key: 'contentInReview',
      label: 'content items in review',
      tone: 'gold',
    },
    {
      key: 'draftContent',
      label: 'draft content items',
      tone: 'brand',
    },
  ]

  return createCard({
    tagName: 'section',
    className: 'admin-panel admin-attention reveal',

    attributes: {
      'aria-labelledby': 'admin-attention-title',
    },

    children: [
      createElement('h2', {
        className: 'admin-panel__title',

        attributes: {
          id: 'admin-attention-title',
        },

        text: 'Needs attention',
      }),

      createElement('ul', {
        className: 'admin-attention__list',

        children: attentionItems.map((item) =>
          createElement('li', {
            className: 'admin-attention__item',

            children: [
              createElement('span', {
                className:
                  `admin-attention__dot admin-attention__dot--${item.tone}`,

                attributes: {
                  'aria-hidden': 'true',
                },
              }),

              createElement('span', {
                attributes: {
                  'data-dashboard-attention': item.key,
                  'data-dashboard-attention-label': item.label,
                },

                text: `— ${item.label}`,
              }),
            ],
          }),
        ),
      }),

      createElement('button', {
        className:
          'button button--outline button--small button--full admin-attention__review',

        attributes: {
          type: 'button',
          disabled: true,
        },

        text: 'Review all',
      }),
    ],
  })
}

function createAdminDashboardMain() {
  const metrics =
    liveMetricDefinitions.map(
      (metric) => ({
        ...metric,
        value: '—',
      }),
    )

  return createElement('main', {
    className:
      'admin-dashboard-main animate-fade',

    attributes: {
      id: 'main-content',
      tabindex: '-1',
      'aria-labelledby':
        'admin-dashboard-title',
    },

    children: [
      createElement('p', {
        className:
          'admin-dashboard__data-note',

        text:
          'Overview metrics · Live Firestore data',
      }),

      createElement('section', {
        className: 'admin-metrics',

        attributes: {
          'aria-label':
            'Platform overview metrics',
        },

        children:
          metrics.map(
            createMetricCard,
          ),
      }),

      createElement('div', {
        className:
          'admin-dashboard__panels',

        children: [
          createSegmentPanel(),
          createAttentionPanel(),
        ],
      }),
    ],
  })
}

export function createAdminDashboardPage() {
  let mounted = false
  let destroyed = false
  let revealCleanup = () => {}

  const main =
    createAdminDashboardMain()

  const page = createAdminShell({
    activeSection: 'dashboard',
    title: 'Dashboard',
    titleId: 'admin-dashboard-title',
    main,
  })

  return {
    element: page,

    mount() {
      if (mounted || destroyed) {
        return
      }

      mounted = true

      void getAdminDashboardCounts()
        .then((counts) => {
          if (destroyed) {
            return
          }

          for (
            const metric
            of liveMetricDefinitions
          ) {
            const value =
              counts[metric.key] ?? 0

            const valueElement =
              main.querySelector(
                `[data-dashboard-metric-value="${metric.key}"]`,
              )

            const cardElement =
              main.querySelector(
                `[data-dashboard-metric-card="${metric.key}"]`,
              )

            if (valueElement) {
              valueElement.textContent =
                Number(value)
                  .toLocaleString('en-US')
            }

            if (cardElement) {
              cardElement.setAttribute(
                'aria-label',
                `${metric.label}: ${value}`,
              )
            }
          }

          const attentionElements =
  main.querySelectorAll(
    '[data-dashboard-attention]',
  )

for (const element of attentionElements) {
  const key =
    element.dataset.dashboardAttention

  const label =
    element.dataset.dashboardAttentionLabel

  const value =
    counts[key] ?? 0

  element.textContent =
    `${Number(value).toLocaleString('en-US')} ${label}`
}
        }
      
      )

      void getTravellerSegmentMix()
  .then((segments) => {
    if (destroyed) {
      return
    }

    for (const segment of segments) {
      const row =
        main.querySelector(
          `[data-traveller-segment="${segment.label}"]`,
        )

      if (!row) {
        continue
      }

      const shareElement =
        row.querySelector(
          '[data-traveller-segment-share]',
        )

      const barElement =
        row.querySelector(
          '[data-traveller-segment-bar]',
        )

      const trackElement =
        row.querySelector(
          '.admin-segment__track',
        )

      if (shareElement) {
        shareElement.textContent =
          `${segment.share}%`
      }

      if (barElement) {
        barElement.style.width =
          `${segment.share}%`
      }

      if (trackElement) {
        trackElement.setAttribute(
          'aria-valuenow',
          String(segment.share),
        )
      }
    }
  })
  .catch((error) => {
    console.error(
      'Failed to load traveller segment mix:',
      error,
    )
  })
      
        .catch((error) => {
          console.error(
            'Failed to load dashboard statistics:',
            error,
          )
        })

      revealCleanup =
        mountRevealObserver(page)
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