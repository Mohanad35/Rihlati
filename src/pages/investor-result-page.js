import { homeAssets } from '../assets/home-assets.js'
import { createSiteHeader, mountSiteHeader } from '../components/site-shell.js'
import {
  createButtonLink,
  createCard,
  createEyebrow,
  createIcon,
} from '../components/ui.js'
import {
  investorResultContext,
  investorResultMatches,
} from '../data/investor-result-presentation-data.js'
import { createElement } from '../utils/dom.js'

const QUESTIONNAIRE_PATH = '/ni-questionnaire'
const COMPARE_PATH = '/ni-compare'
const SAVE_PATH = '/ni-my-investments'

function createInvestmentMap(matches, activeIndex = 0) {
  const markers = matches.map((match, index) => {
    const active = index === activeIndex
    const best = match.rank === 'Best Match'
    const marker = createElement('button', {
      className: [
        'investor-result-map__marker',
        active ? 'is-active' : '',
        best ? 'is-best-match' : '',
      ].filter(Boolean).join(' '),
      attributes: {
        type: 'button',
        'data-investor-result-action': 'select-match',
        'data-match-index': index,
        'aria-label': `Select ${match.rank.toLowerCase()}: ${match.region}, ${match.fit}% fit`,
        'aria-pressed': active ? 'true' : 'false',
      },
      children: [
        createElement('span', {
          className: 'investor-result-map__marker-content',
          attributes: { 'aria-hidden': 'true' },
          children: [
            createElement('span', {
              className: 'investor-result-map__pulse',
              attributes: active || best ? {} : { hidden: true },
            }),
            createElement('span', {
              className: 'investor-result-map__marker-dot',
              text: best ? '★' : String(index + 1),
            }),
            createElement('span', {
              className: 'investor-result-map__marker-label',
              text: match.mapLabel,
            }),
          ],
        }),
      ],
    })

    marker.style.setProperty('--marker-x', `${match.prototypeMapPosition.x}%`)
    marker.style.setProperty('--marker-y', `${match.prototypeMapPosition.y}%`)
    marker.style.setProperty('--marker-delay', `${0.4 + index * 0.25}s`)
    return marker
  })

  const element = createElement('section', {
    className: 'investor-result-map',
    attributes: { 'aria-label': 'Investment opportunity match map' },
    children: [
      createElement('div', {
        className: 'investor-result-map__canvas',
        children: [
          createElement('img', {
            className: 'investor-result-map__image',
            attributes: {
              src: homeAssets.jordanMap,
              alt: 'Relief map of Jordan',
              draggable: 'false',
              decoding: 'async',
            },
          }),
          ...markers,
        ],
      }),
    ],
  })

  return {
    element,

    setActive(nextIndex) {
      markers.forEach((marker, index) => {
        const active = index === nextIndex
        const best = matches[index].rank === 'Best Match'
        marker.classList.toggle('is-active', active)
        marker.setAttribute('aria-pressed', active ? 'true' : 'false')
        marker.querySelector('.investor-result-map__pulse').hidden = !(active || best)
      })
    },
  }
}

function createNavigationAction({ href, label, icon = null }) {
  return createElement('a', {
    className: 'button button--outline investor-result__action',
    attributes: {
      href,
      'data-router-link': true,
    },
    children: [
      ...(icon
        ? [
            createElement('span', {
              className: 'investor-result__action-icon',
              attributes: { 'aria-hidden': 'true' },
              children: [createIcon(icon)],
            }),
          ]
        : []),
      createElement('span', { text: label }),
    ],
  })
}

function createRankBadge(match) {
  const best = match.rank === 'Best Match'

  return createElement('span', {
    className: [
      'badge',
      best ? 'badge--gold' : '',
      'investor-match-card__rank',
      best ? 'investor-match-card__rank--best' : 'investor-match-card__rank--alternative',
    ].filter(Boolean).join(' '),
    children: [
      ...(best
        ? [createIcon('star', { className: 'investor-match-card__rank-icon' })]
        : []),
      createElement('span', { text: match.rank }),
    ],
  })
}

function createFitProgress(match) {
  const fill = createElement('span', {
    className: [
      'investor-match-card__fit-fill',
      match.rank === 'Best Match' ? 'investor-match-card__fit-fill--best' : '',
    ].filter(Boolean).join(' '),
  })
  fill.style.width = `${match.fit}%`

  return createElement('div', {
    className: 'investor-match-card__fit-track',
    attributes: {
      role: 'progressbar',
      'aria-label': `${match.region} fit score`,
      'aria-valuemin': '0',
      'aria-valuemax': '100',
      'aria-valuenow': String(match.fit),
      'aria-valuetext': `${match.fit}% fit`,
    },
    children: [fill],
  })
}

function createIndicatorRow(label, value) {
  return createElement('div', {
    className: 'investor-match-card__indicator',
    children: [
      createElement('dt', { text: label }),
      createElement('dd', { text: value }),
    ],
  })
}

function createMatchCard(match) {
  const best = match.rank === 'Best Match'

  return createElement('li', {
    children: [
      createCard({
        className: [
          'investor-match-card',
          best ? 'investor-match-card--best' : '',
        ].filter(Boolean).join(' '),
        hover: true,
        attributes: { 'aria-labelledby': `investor-match-title-${match.id}` },
        children: [
          createElement('div', {
            className: 'investor-match-card__header',
            children: [
              createRankBadge(match),
              createElement('span', {
                className: 'investor-match-card__fit-label',
                text: `${match.fit}% fit`,
              }),
            ],
          }),
          createElement('div', {
            className: 'investor-match-card__body',
            children: [
              createElement('h3', {
                className: 'investor-match-card__region',
                attributes: { id: `investor-match-title-${match.id}` },
                text: match.region,
              }),
              createElement('p', {
                className: 'investor-match-card__type',
                text: match.type,
              }),
              createFitProgress(match),
              createElement('dl', {
                className: 'investor-match-card__indicators',
                children: [
                  createIndicatorRow('Scale', match.scale),
                  createIndicatorRow('Segment', match.segment),
                ],
              }),
              createElement('p', {
                className: 'investor-match-card__reason',
                children: [
                  createElement('strong', { text: 'Why here: ' }),
                  document.createTextNode(match.insight),
                ],
              }),
              createButtonLink({
                href: SAVE_PATH,
                label: 'Save opportunity',
                variant: best ? 'gold' : 'outline',
                size: 'small',
                full: true,
                arrow: true,
                className: 'investor-match-card__save',
                attributes: { 'aria-label': `Save opportunity: ${match.region}` },
              }),
            ],
          }),
        ],
      }),
    ],
  })
}

function createContextualInsight() {
  return createCard({
    tagName: 'aside',
    className: 'investor-result__context',
    attributes: { 'aria-label': investorResultContext.label },
    children: [
      createElement('span', {
        className: 'investor-result__context-icon',
        attributes: { 'aria-hidden': 'true' },
        children: [createIcon('bulb')],
      }),
      createElement('p', {
        children: [
          createElement('strong', { text: `${investorResultContext.label}: ` }),
          document.createTextNode(investorResultContext.text),
        ],
      }),
    ],
  })
}

export function createInvestorResultPage({ path = '/ni-result' } = {}) {
  let activeMatchIndex = 0
  let mounted = false
  let destroyed = false

  const header = createSiteHeader({ currentPath: path })
  const pageController = new AbortController()
  let headerCleanup = () => {}

  const map = createInvestmentMap(investorResultMatches, activeMatchIndex)
  const selectionStatus = createElement('p', {
    className: 'visually-hidden',
    attributes: {
      role: 'status',
      'aria-live': 'polite',
      'aria-atomic': 'true',
    },
  })

  const main = createElement('main', {
    className: 'investor-result-main',
    attributes: { id: 'main-content', tabindex: '-1' },
    children: [
      createElement('section', {
        className: 'investor-result',
        attributes: { 'aria-labelledby': 'investor-result-title' },
        children: [
          createElement('header', {
            className: 'investor-result__overview animate-rise',
            children: [
              createElement('div', {
                className: 'investor-result__intro',
                children: [
                  createEyebrow('Opportunity matches'),
                  createElement('h1', {
                    className: 'investor-result__title',
                    attributes: { id: 'investor-result-title' },
                    text: 'Your strongest tourism opportunities',
                  }),
                  createElement('p', {
                    className: 'investor-result__lead',
                    text: 'Based on your criteria, ranked by fit. Guidance only — Rihlati does not imply guaranteed investment success.',
                  }),
                ],
              }),
              createElement('div', {
                className: 'investor-result__actions',
                children: [
                  createNavigationAction({
                    href: COMPARE_PATH,
                    label: 'Compare matches',
                    icon: 'scale',
                  }),
                  createNavigationAction({
                    href: QUESTIONNAIRE_PATH,
                    label: 'Update criteria',
                  }),
                ],
              }),
            ],
          }),
          createElement('div', {
            className: 'investor-result__grid',
            children: [
              createElement('div', {
                className: 'investor-result__map-column',
                children: [map.element, createContextualInsight(), selectionStatus],
              }),
              createElement('section', {
                attributes: { 'aria-labelledby': 'investor-result-matches-title' },
                children: [
                  createElement('h2', {
                    className: 'visually-hidden',
                    attributes: { id: 'investor-result-matches-title' },
                    text: 'Ranked opportunity matches',
                  }),
                  createElement('ol', {
                    className: 'investor-result__matches',
                    children: investorResultMatches.map(createMatchCard),
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  })

  const page = createElement('div', {
    className: 'investor-result-page paper',
    children: [header, main],
  })

  const handleClick = (event) => {
    const marker = event.target instanceof Element
      ? event.target.closest('[data-investor-result-action="select-match"]')
      : null

    if (!(marker instanceof HTMLButtonElement)) {
      return
    }

    const nextIndex = Number(marker.dataset.matchIndex)

    if (
      !Number.isInteger(nextIndex) ||
      nextIndex < 0 ||
      nextIndex >= investorResultMatches.length ||
      nextIndex === activeMatchIndex
    ) {
      return
    }

    activeMatchIndex = nextIndex
    map.setActive(activeMatchIndex)
    selectionStatus.textContent = `Selected match ${activeMatchIndex + 1}: ${investorResultMatches[activeMatchIndex].region}.`
  }

  return {
    element: page,

    mount() {
      if (mounted || destroyed) {
        return
      }

      mounted = true
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
