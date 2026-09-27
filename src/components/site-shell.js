import { homeAssets } from '../assets/home-assets.js'
import { routePaths } from '../data/home-presentation-data.js'
import { createElement } from '../utils/dom.js'
import { createButtonLink } from './ui.js'

const primaryNavigation = Object.freeze([
  { label: 'Discover', href: routePaths.touristEntry },
  { label: 'Invest', href: routePaths.investorEntry },
  { label: 'Insights', href: routePaths.insights },
  { label: 'My Journeys', href: routePaths.myJourneys },
])

const footerNavigation = Object.freeze([
  {
    title: 'Discover',
    links: [
      { label: 'Start a journey', href: routePaths.touristEntry },
      { label: 'My Journeys', href: routePaths.myJourneys },
    ],
  },
  {
    title: 'Invest',
    links: [
      { label: 'New investment', href: routePaths.investorEntry },
      { label: 'My Investments', href: routePaths.myInvestments },
    ],
  },
  {
    title: 'Platform',
    links: [
      { label: 'Explore & Insights', href: routePaths.insights },
      { label: 'Admin', href: routePaths.adminLogin },
      { label: 'Home', href: routePaths.home },
    ],
  },
])

function createLogoLink({ light = false, eager = false } = {}) {
  return createElement('a', {
    className: light ? 'site-logo site-logo--light' : 'site-logo',
    attributes: {
      href: routePaths.home,
      'data-router-link': true,
      'aria-label': 'Rihlati home',
    },
    children: [
      createElement('img', {
        attributes: {
          src: homeAssets.logo,
          alt: 'Rihlati — رحلتي — Your Journey in Jordan',
          draggable: 'false',
          decoding: 'async',
          ...(eager ? { fetchpriority: 'high' } : { loading: 'lazy' }),
        },
      }),
    ],
  })
}

function createNavigationLink({ label, href, currentPath, className }) {
  return createElement('a', {
    className,
    text: label,
    attributes: {
      href,
      'data-router-link': true,
      ...(href === currentPath ? { 'aria-current': 'page' } : {}),
    },
  })
}

export function createSiteHeader({ currentPath = routePaths.home } = {}) {
  const navigation = createElement('nav', {
    className: 'site-nav',
    attributes: { 'aria-label': 'Primary navigation' },
    children: primaryNavigation.map((item) =>
      createNavigationLink({ ...item, currentPath, className: 'site-nav__link' }),
    ),
  })

  return createElement('header', {
    className: 'site-header',
    attributes: { 'data-site-header': true },
    children: [
      createElement('div', {
        className: 'container site-header__inner',
        children: [
          createLogoLink({ eager: true }),
          navigation,
          createElement('div', {
            className: 'site-header__actions',
            children: [
              createButtonLink({
                href: routePaths.adminLogin,
                label: 'Admin',
                variant: 'ghost',
                size: 'small',
                className: 'site-header__admin',
              }),
              createButtonLink({
                href: routePaths.touristEntry,
                label: 'Plan a journey',
                size: 'small',
                arrow: true,
                className: 'site-header__cta',
              }),
            ],
          }),
        ],
      }),
    ],
  })
}

export function mountSiteHeader(header, { signal } = {}) {
  if (!(header instanceof HTMLElement)) {
    return () => {}
  }

  let frameId = null
  let destroyed = false

  const updateHeader = () => {
    frameId = null
    header.classList.toggle('is-scrolled', window.scrollY > 20)
  }

  const requestUpdate = () => {
    if (frameId === null) {
      frameId = window.requestAnimationFrame(updateHeader)
    }
  }

  updateHeader()
  window.addEventListener('scroll', requestUpdate, { passive: true, signal })

  return () => {
    if (destroyed) {
      return
    }

    destroyed = true

    if (frameId !== null) {
      window.cancelAnimationFrame(frameId)
      frameId = null
    }
  }
}

function createFooterGroup({ title, links }) {
  const titleId = `footer-${title.toLowerCase().replaceAll(' ', '-')}`

  return createElement('nav', {
    className: 'site-footer__group',
    attributes: { 'aria-labelledby': titleId },
    children: [
      createElement('h2', { text: title, attributes: { id: titleId } }),
      createElement('ul', {
        children: links.map((link) =>
          createElement('li', {
            children: [
              createNavigationLink({
                ...link,
                currentPath: '',
                className: 'site-footer__link',
              }),
            ],
          }),
        ),
      }),
    ],
  })
}

export function createSiteFooter({ currentPath = routePaths.home } = {}) {
  return createElement('footer', {
    className: 'site-footer',
    children: [
      createElement('div', {
        className: 'container site-footer__grid',
        children: [
          createElement('div', {
            className: 'site-footer__brand',
            children: [
              createLogoLink({ light: true }),
              createElement('p', {
                text: 'Personalized tourism and tourism-investment guidance for Jordan. Understand, match, visualize, guide.',
              }),
            ],
          }),
          ...footerNavigation.map((group) => createFooterGroup(group)),
        ],
      }),
      createElement('div', {
        className: 'site-footer__legal-wrap',
        children: [
          createElement('div', {
            className: 'container site-footer__legal',
            children: [
              createElement('p', { text: '© 2026 Rihlati — رحلتي. A concept prototype.' }),
              createElement('p', { text: 'Amman · Petra · Wadi Rum · Dead Sea' }),
            ],
          }),
        ],
      }),
    ],
  })
}
