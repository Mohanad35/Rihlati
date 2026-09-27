import { homeAssets } from '../assets/home-assets.js'
import { createSiteFooter, createSiteHeader, mountSiteHeader } from '../components/site-shell.js'
import { createButtonLink, createCard, createEyebrow, createIcon } from '../components/ui.js'
import { routePaths } from '../data/home-presentation-data.js'
import { createElement } from '../utils/dom.js'

const TOURIST_QUESTIONNAIRE_PATH = '/t-questionnaire'

const entryBenefits = Object.freeze([
  {
    icon: 'clock',
    title: 'Takes about 2 minutes',
    description: 'Five short, elegant steps.',
  },
  {
    icon: 'compass',
    title: 'Personalized, not generic',
    description: 'Every stop is chosen for a reason.',
  },
  {
    icon: 'map',
    title: 'See it on the map',
    description: 'Your route, drawn day by day.',
  },
])

function createEntryHeading() {
  const heading = createElement('h1', {
    className: 'tourist-entry__title',
    attributes: { id: 'tourist-entry-title' },
  })

  heading.append(
    document.createTextNode('Let’s understand how '),
    createElement('span', { text: 'you' }),
    document.createTextNode(' like to travel.'),
  )

  return heading
}

function createBenefitItem({ icon, title, description }) {
  return createElement('li', {
    className: 'tourist-entry-benefit',
    children: [
      createElement('span', {
        className: 'tourist-entry-benefit__icon',
        children: [createIcon(icon)],
      }),
      createElement('div', {
        className: 'tourist-entry-benefit__copy',
        children: [
          createElement('strong', { text: title }),
          createElement('span', { text: description }),
        ],
      }),
    ],
  })
}

function createEntryCopy() {
  return createElement('div', {
    className: 'tourist-entry__copy animate-rise',
    children: [
      createEyebrow('Tourist journey'),
      createEntryHeading(),
      createElement('p', {
        className: 'tourist-entry__lead',
        text: 'Answer a few thoughtful questions and Rihlati will compose a personalized route across Jordan — matched to your taste, pace, and time.',
      }),
      createElement('ul', {
        className: 'tourist-entry__benefits',
        children: entryBenefits.map(createBenefitItem),
      }),
      createElement('div', {
        className: 'tourist-entry__actions',
        children: [
          createButtonLink({
            href: TOURIST_QUESTIONNAIRE_PATH,
            label: 'Begin personalization',
            size: 'large',
            arrow: true,
          }),
          createButtonLink({
            href: routePaths.myJourneys,
            label: 'View saved journeys',
            variant: 'ghost',
            size: 'large',
          }),
        ],
      }),
      createElement('p', {
        className: 'tourist-entry__guest-note',
        text: 'Guest-first — no account needed to start.',
      }),
    ],
  })
}

function createEntryVisual() {
  return createElement('div', {
    className: 'tourist-entry__visual animate-scale-in',
    children: [
      createCard({
        tagName: 'div',
        className: 'tourist-entry-card',
        children: [
          createElement('img', {
            className: 'tourist-entry-card__hero-image',
            attributes: {
              src: homeAssets.wadiRum,
              alt: 'Wadi Rum',
              fetchpriority: 'high',
              decoding: 'async',
            },
          }),
          createElement('div', {
            className: 'tourist-entry-card__meta',
            children: [
              createElement('img', {
                className: 'tourist-entry-card__thumbnail',
                attributes: {
                  src: homeAssets.petra,
                  alt: '',
                  'aria-hidden': 'true',
                  decoding: 'async',
                },
              }),
              createElement('div', {
                className: 'tourist-entry-card__copy',
                children: [
                  createElement('strong', { text: 'Jordan, made personal' }),
                  createElement('span', { text: 'Petra · Wadi Rum · Dead Sea · Amman' }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  })
}

function createTouristEntryMain() {
  return createElement('main', {
    className: 'tourist-entry-main',
    attributes: { id: 'main-content', tabindex: '-1' },
    children: [
      createElement('section', {
        className: 'tourist-entry',
        attributes: { 'aria-labelledby': 'tourist-entry-title' },
        children: [
          createElement('div', {
            className: 'container tourist-entry__grid',
            children: [createEntryCopy(), createEntryVisual()],
          }),
        ],
      }),
    ],
  })
}

export function createTouristEntryPage({ path = routePaths.touristEntry } = {}) {
  const header = createSiteHeader({ currentPath: path })
  const page = createElement('div', {
    className: 'tourist-entry-page',
    children: [header, createTouristEntryMain(), createSiteFooter({ currentPath: path })],
  })

  const pageController = new AbortController()
  let headerCleanup = () => {}
  let mounted = false
  let destroyed = false

  return {
    element: page,

    mount() {
      if (mounted || destroyed) {
        return
      }

      mounted = true
      headerCleanup = mountSiteHeader(header, { signal: pageController.signal })
    },

    destroy() {
      if (!mounted || destroyed) {
        return
      }

      destroyed = true
      pageController.abort()
      headerCleanup()
    },
  }
}
