import { homeAssets } from '../assets/home-assets.js'
import { investorAssets } from '../assets/investor-assets.js'
import { createSiteFooter, createSiteHeader, mountSiteHeader } from '../components/site-shell.js'
import { createBadge, createButtonLink, createCard, createEyebrow } from '../components/ui.js'
import { routePaths } from '../data/home-presentation-data.js'
import { createElement } from '../utils/dom.js'

const NEW_INVESTOR_PATH = '/ni-questionnaire'
const EXISTING_BUSINESS_PATH = '/ei-discovery'
const PARTNERSHIP_TRACKING_PATH = '/ei-submitted'

const investorPaths = Object.freeze([
  Object.freeze({
    id: 'new-investor',
    badge: 'New investor',
    badgeTone: 'gold',
    title: 'I want to start a tourism investment',
    description: 'Discover opportunities matched to your budget, region, and the traveller segments you want to serve.',
    image: investorAssets.ecoLodge,
    cta: 'Find opportunities',
    href: NEW_INVESTOR_PATH,
  }),
  Object.freeze({
    id: 'existing-business',
    badge: 'Existing business',
    badgeTone: 'brand',
    title: 'I already have a tourism business',
    description: 'Understand which travellers fit your business and how you could partner with Rihlati.',
    image: homeAssets.jordanMap,
    cta: 'Discover my fit',
    href: EXISTING_BUSINESS_PATH,
    secondaryCta: 'Track my partnership request',
    secondaryHref: PARTNERSHIP_TRACKING_PATH, 
  }),
])

function createInvestorPathCard(option) {
  const titleId = `investor-entry-${option.id}-title`
  const card = createCard({
    tagName: 'article',
    hover: true,
    className: 'investor-entry-card',
    attributes: { 'aria-labelledby': titleId },
    children: [
      createElement('div', {
        className: 'investor-entry-card__visual',
        children: [
          createElement('img', {
            className: 'investor-entry-card__image',
            attributes: {
              src: option.image,
              alt: '',
              'aria-hidden': 'true',
              decoding: 'async',
            },
          }),
          createBadge(option.badge, option.badgeTone, 'investor-entry-card__badge'),
        ],
      }),
      createElement('div', {
        className: 'investor-entry-card__body',
        children: [
          createElement('h2', {
            className: 'investor-entry-card__title',
            text: option.title,
            attributes: { id: titleId },
          }),
          createElement('p', {
            className: 'investor-entry-card__description',
            text: option.description,
          }),
         createButtonLink({
  href: option.href,
  label: option.cta,
  arrow: true,
  className: 'investor-entry-card__action',
}),

...(option.secondaryCta && option.secondaryHref
  ? [
      createButtonLink({
        href: option.secondaryHref,
        label: option.secondaryCta,
        variant: 'outline',
        className: 'investor-entry-card__action',
      }),
    ]
  : []),
        ],
      }),
    ],
  })

  return createElement('div', {
    className: 'investor-entry-card-wrap animate-rise',
    children: [card],
  })
}

function createInvestorEntryMain() {
  return createElement('main', {
    className: 'investor-entry-main',
    attributes: { id: 'main-content', tabindex: '-1' },
    children: [
      createElement('section', {
        className: 'investor-entry',
        attributes: { 'aria-labelledby': 'investor-entry-title' },
        children: [
          createElement('div', {
            className: 'container investor-entry__inner',
            children: [
              createElement('div', {
                className: 'investor-entry__heading animate-rise',
                children: [
                  createEyebrow('Investment guidance'),
                  createElement('h1', {
                    className: 'investor-entry__title',
                    text: 'Which describes you best?',
                    attributes: { id: 'investor-entry-title' },
                  }),
                  createElement('p', {
                    className: 'investor-entry__lead',
                    text: 'Rihlati tailors the flow to where you are. Choose a path to begin.',
                  }),
                ],
              }),
              createElement('div', {
                className: 'investor-entry__grid',
                children: investorPaths.map(createInvestorPathCard),
              }),
              createElement('p', {
                className: 'investor-entry__disclaimer',
                text: 'Rihlati provides guidance and context only. It does not offer booking, payments, or any guarantee of investment success.',
              }),
            ],
          }),
        ],
      }),
    ],
  })
}

export function createInvestorEntryPage({ path = routePaths.investorEntry } = {}) {
  const header = createSiteHeader({ currentPath: path })
  const pageController = new AbortController()
  const page = createElement('div', {
    className: 'investor-entry-page paper',
    children: [header, createInvestorEntryMain(), createSiteFooter({ currentPath: path })],
  })

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
