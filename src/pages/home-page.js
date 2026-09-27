import { homeAssets } from '../assets/home-assets.js'
import { createSiteFooter, createSiteHeader, mountSiteHeader } from '../components/site-shell.js'
import {
  createBadge,
  createButtonLink,
  createCard,
  createEyebrow,
  createIcon,
  createRouteLine,
  createSectionHeading,
  createTextLink,
} from '../components/ui.js'
import {
  audiencePaths,
  heroPrinciples,
  investorFeatures,
  investorPreviewPoints,
  journeyPreviewStops,
  processSteps,
  routePaths,
} from '../data/home-presentation-data.js'
import { createElement } from '../utils/dom.js'
import { mountRevealObserver } from '../utils/reveal.js'
import { createHomeMapPresentation } from './home-map-presentation.js'

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'

function createHeroUnderline() {
  const svg = document.createElementNS(SVG_NAMESPACE, 'svg')
  svg.setAttribute('class', 'home-hero__underline')
  svg.setAttribute('viewBox', '0 0 200 12')
  svg.setAttribute('preserveAspectRatio', 'none')
  svg.setAttribute('aria-hidden', 'true')

  const path = document.createElementNS(SVG_NAMESPACE, 'path')
  path.setAttribute('d', 'M2 9C50 3 150 3 198 9')
  path.setAttribute('fill', 'none')
  path.setAttribute('stroke', 'currentColor')
  path.setAttribute('stroke-width', '4')
  path.setAttribute('stroke-linecap', 'round')
  svg.append(path)
  return svg
}

function createHeroHeading() {
  const emphasis = createElement('span', {
    className: 'home-hero__emphasis',
    children: [document.createTextNode('beautifully'), createHeroUnderline()],
  })
  const heading = createElement('h1', { attributes: { id: 'home-hero-title' } })

  heading.append(
    document.createTextNode('Your Jordan, '),
    createElement('span', { className: 'home-hero__brand-word', text: 'understood' }),
    document.createTextNode(' —'),
    createElement('br'),
    document.createTextNode('then '),
    emphasis,
    document.createTextNode(' guided.'),
  )

  return heading
}

function createPrincipleList() {
  return createElement('ol', {
    className: 'home-principles',
    attributes: { 'aria-label': 'The Rihlati approach' },
    children: heroPrinciples.map((item, index) =>
      createElement('li', {
        className: 'home-principles__item',
        children: [
          createElement('span', { className: 'home-principles__number', text: String(index + 1) }),
          createElement('span', {
            className: 'home-principles__copy',
            children: [
              createElement('strong', { text: item.title }),
              createElement('span', { text: item.description }),
            ],
          }),
        ],
      }),
    ),
  })
}

function createFloatingDestination({ className, image, title, description }) {
  return createElement('div', {
    className: `home-floating-card ${className}`,
    children: [
      createElement('img', {
        attributes: { src: image, alt: '', 'aria-hidden': 'true', decoding: 'async' },
      }),
      createElement('strong', { text: title }),
      createElement('span', { text: description }),
    ],
  })
}

function createHeroSection() {
  const heroVisual = createCard({
    tagName: 'div',
    className: 'home-hero__visual animate-scale-in',
    children: [
      createHomeMapPresentation({
        points: journeyPreviewStops,
        activeIndex: 2,
        variant: 'route',
        clipId: 'home-hero-map-clip',
        className: 'home-hero__map',
      }),
      createFloatingDestination({
        className: 'home-floating-card--petra animate-float',
        image: homeAssets.petra,
        title: 'Petra · Day 3',
        description: 'Heritage & wonder',
      }),
      createFloatingDestination({
        className: 'home-floating-card--wadi animate-float-slow',
        image: homeAssets.wadiRum,
        title: 'Wadi Rum · Day 4',
        description: 'Desert & stars',
      }),
    ],
  })

  return createElement('section', {
    className: 'home-hero',
    attributes: { 'aria-labelledby': 'home-hero-title' },
    children: [
      createElement('span', {
        className: 'home-hero__glow home-hero__glow--gold',
        attributes: { 'aria-hidden': 'true' },
      }),
      createElement('span', {
        className: 'home-hero__glow home-hero__glow--terracotta',
        attributes: { 'aria-hidden': 'true' },
      }),
      createElement('div', {
        className: 'container home-hero__grid',
        children: [
          createElement('div', {
            className: 'home-hero__copy animate-rise',
            children: [
              createEyebrow('Personalized journeys through Jordan'),
              createHeroHeading(),
              createElement('p', {
                className: 'home-hero__lead',
                text: 'Rihlati learns what you love, matches it to the right places, visualizes your route across the kingdom, and guides you — for travellers and tourism investors alike.',
              }),
              createElement('div', {
                className: 'home-hero__actions',
                children: [
                  createButtonLink({
                    href: routePaths.touristEntry,
                    label: 'Discover my journey',
                    size: 'large',
                    arrow: true,
                  }),
                  createButtonLink({
                    href: routePaths.investorEntry,
                    label: 'Explore investment',
                    variant: 'outline',
                    size: 'large',
                  }),
                ],
              }),
              createPrincipleList(),
            ],
          }),
          heroVisual,
        ],
      }),
    ],
  })
}

function createAudienceCard(item) {
  return createCard({
    className: 'home-audience-card card--hover reveal',
    attributes: { 'aria-label': item.title },
    children: [
      createElement('div', {
        className: 'home-audience-card__image-wrap',
        children: [
          createElement('img', {
            className: 'home-audience-card__image',
            attributes: {
              src: item.image,
              alt: item.imageAlt,
              loading: 'lazy',
              decoding: 'async',
            },
          }),
        ],
      }),
      createElement('div', {
        className: 'home-audience-card__body',
        children: [
          createBadge(item.title, item.tone),
          createElement('p', { text: item.description }),
          createTextLink({ href: item.href, label: item.action }),
        ],
      }),
    ],
  })
}

function createAudienceSection() {
  return createElement('section', {
    className: 'container home-audiences',
    attributes: { 'aria-label': 'Choose your Rihlati path' },
    children: audiencePaths.map(createAudienceCard),
  })
}

function createProcessStep(step) {
  return createElement('li', {
    className: 'home-process-step',
    children: [
      createElement('span', {
        className: 'home-process-step__icon',
        children: [createIcon(step.icon)],
      }),
      createElement('div', {
        children: [
          createElement('h3', { text: step.title }),
          createElement('p', { text: step.description }),
        ],
      }),
    ],
  })
}

function createJourneyStopRow(stop) {
  return createElement('li', {
    className: 'home-journey-stop',
    children: [
      createElement('img', {
        attributes: {
          src: stop.image,
          alt: stop.imageAlt,
          loading: 'lazy',
          decoding: 'async',
        },
      }),
      createElement('div', {
        className: 'home-journey-stop__copy',
        children: [
          createElement('strong', { text: `Day ${stop.day} · ${stop.name}` }),
          createElement('span', { text: `${stop.type} · ${stop.time}` }),
        ],
      }),
      createElement('span', { className: 'home-journey-stop__region', text: stop.region }),
    ],
  })
}

function createJourneyPreview() {
  return createCard({
    className: 'home-journey-preview reveal',
    children: [
      createRouteLine({ className: 'home-journey-preview__route' }),
      createElement('div', {
        className: 'home-journey-preview__content',
        children: [
          createBadge('Sample match', 'sand'),
          createElement('h3', { text: 'Heritage & Desert Escape' }),
          createElement('p', {
            className: 'home-journey-preview__meta',
            text: '4 days · balanced pace · culture-led',
          }),
          createElement('ol', {
            className: 'home-journey-preview__stops',
            children: journeyPreviewStops.map(createJourneyStopRow),
          }),
          createButtonLink({
            href: routePaths.touristEntry,
            label: 'Build mine',
            full: true,
            arrow: true,
          }),
        ],
      }),
    ],
  })
}

function createProcessSection() {
  return createElement('section', {
    className: 'container home-process',
    attributes: { 'aria-labelledby': 'home-process-title' },
    children: [
      createElement('div', {
        className: 'home-process__copy reveal',
        children: [
          createSectionHeading({
            eyebrow: 'How Rihlati works',
            title: 'A calm, intelligent path from taste to trip.',
            description: 'No booking noise, no endless directories. Just an understanding of what you want, matched to Jordan and drawn as a route you can actually follow.',
            id: 'home-process-title',
          }),
          createElement('ol', {
            className: 'home-process__steps',
            children: processSteps.map(createProcessStep),
          }),
        ],
      }),
      createJourneyPreview(),
    ],
  })
}

function createInvestorFeature(feature) {
  return createElement('li', {
    className: 'home-investor-feature',
    children: [
      createElement('span', {
        className: `home-investor-feature__icon home-investor-feature__icon--${feature.tone}`,
        children: [createIcon(feature.icon)],
      }),
      createElement('strong', { text: feature.label }),
    ],
  })
}

function createInvestorPreview() {
  return createElement('div', {
    className: 'home-investor-preview',
    children: [
      createElement('span', {
        className: 'badge badge--gold home-investor-preview__badge',
        children: [
          createIcon('star', { className: 'home-investor-preview__badge-icon' }),
          createElement('span', { text: 'Best Match' }),
        ],
      }),
      createHomeMapPresentation({
        points: investorPreviewPoints,
        activeIndex: 0,
        variant: 'markers',
        clipId: 'home-investor-map-clip',
        className: 'home-investor-preview__map',
      }),
    ],
  })
}

function createInvestorSection() {
  const investorCard = createCard({
    className: 'home-investor-card reveal',
    children: [
      createElement('div', {
        className: 'home-investor-card__intro',
        children: [
          createEyebrow('For tourism investors'),
          createElement('h2', { text: 'Discover the right match.', attributes: { id: 'home-investor-title' } }),
          createButtonLink({
            href: routePaths.investorEntry,
            label: 'Explore opportunities',
            variant: 'gold',
            arrow: true,
          }),
        ],
      }),
      createElement('div', {
        className: 'home-investor-card__visuals',
        children: [
          createElement('ul', {
            className: 'home-investor-features',
            children: investorFeatures.map(createInvestorFeature),
          }),
          createInvestorPreview(),
        ],
      }),
    ],
  })

  return createElement('section', {
    className: 'container home-investor',
    attributes: { 'aria-labelledby': 'home-investor-title' },
    children: [investorCard],
  })
}

function createFinalCallToAction() {
  return createElement('section', {
    className: 'container home-final-cta',
    attributes: { 'aria-labelledby': 'home-final-cta-title' },
    children: [
      createElement('div', {
        className: 'home-final-cta__panel reveal',
        children: [
          createElement('p', {
            className: 'home-final-cta__arabic',
            text: 'ابدأ رحلتك',
            attributes: { lang: 'ar', dir: 'rtl' },
          }),
          createElement('h2', {
            text: 'Ready to see your Jordan drawn out, stop by stop?',
            attributes: { id: 'home-final-cta-title' },
          }),
          createElement('div', {
            className: 'home-final-cta__actions',
            children: [
              createButtonLink({
                href: routePaths.touristEntry,
                label: 'Start as a traveller',
                size: 'large',
                arrow: true,
              }),
              createButtonLink({
                href: routePaths.investorEntry,
                label: 'Start as an investor',
                variant: 'outline',
                size: 'large',
              }),
            ],
          }),
        ],
      }),
    ],
  })
}

function createHomeMain() {
  return createElement('main', {
    className: 'home-main',
    attributes: { id: 'main-content', tabindex: '-1' },
    children: [
      createHeroSection(),
      createAudienceSection(),
      createProcessSection(),
      createInvestorSection(),
      createFinalCallToAction(),
    ],
  })
}

export function createHomePage({ path = routePaths.home } = {}) {
  const header = createSiteHeader({ currentPath: path })
  const page = createElement('div', {
    className: 'home-page',
    children: [header, createHomeMain(), createSiteFooter({ currentPath: path })],
  })

  const pageController = new AbortController()
  let revealCleanup = () => {}
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
      revealCleanup = mountRevealObserver(page)
      headerCleanup = mountSiteHeader(header, { signal: pageController.signal })
    },

    destroy() {
      if (!mounted || destroyed) {
        return
      }

      destroyed = true
      pageController.abort()
      headerCleanup()
      revealCleanup()
    },
  }
}
