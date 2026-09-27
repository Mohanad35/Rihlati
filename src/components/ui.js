import { createElement } from '../utils/dom.js'

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'

const iconPaths = Object.freeze({
  compass: 'M12 2a10 10 0 100 20 10 10 0 000-20zm3.5 6.5-2 5-5 2 2-5 5-2z',
  users: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zm14 14v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
  heart: 'M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z',
  map: 'M9 20l-6 3V6l6-3m0 17l6 3m-6-3V3m6 20l6-3V3l-6 3m0 14V6',
  clock: 'M12 22a10 10 0 100-20 10 10 0 000 20zm0-16v6l4 2',
  pin: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1116 0zm-8 3a3 3 0 100-6 3 3 0 000 6z',
  bulb: 'M9 18h6M10 22h4M12 2a7 7 0 00-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0012 2z',
  star: 'M12 2l3 6.5 7 .9-5 4.8 1.3 7L12 18l-6.3 3.2L7 14.2 2 9.4l7-.9L12 2z',
  scale: 'M12 3v18M5 7l-3 6h6l-3-6zm14 0l-3 6h6l-3-6zM3 21h18M8 7h8',
})

function createSvgElement(tagName, attributes = {}) {
  const element = document.createElementNS(SVG_NAMESPACE, tagName)

  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, String(value))
  }

  return element
}

export function createIcon(name, { className = 'icon', label = '' } = {}) {
  const pathData = iconPaths[name]

  if (!pathData) {
    throw new Error(`Unknown Rihlati icon: ${name}`)
  }

  const svg = createSvgElement('svg', {
    class: className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '1.8',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    ...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': 'true' }),
  })

  svg.append(createSvgElement('path', { d: pathData }))
  return svg
}

export function createArrow({ className = 'button__arrow' } = {}) {
  const svg = createSvgElement('svg', {
    class: className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'aria-hidden': 'true',
  })

  svg.append(createSvgElement('path', { d: 'M5 12h14M13 6l6 6-6 6' }))
  return svg
}

export function createButtonLink({
  href,
  label,
  variant = 'primary',
  size = 'medium',
  full = false,
  arrow = false,
  className = '',
  attributes = {},
}) {
  const classes = [
    'button',
    `button--${variant}`,
    `button--${size}`,
    full ? 'button--full' : '',
    className,
  ].filter(Boolean).join(' ')

  return createElement('a', {
    className: classes,
    attributes: {
      href,
      'data-router-link': true,
      ...attributes,
    },
    children: [
      createElement('span', { text: label }),
      ...(arrow ? [createArrow()] : []),
    ],
  })
}

export function createTextLink({ href, label, className = '' }) {
  return createElement('a', {
    className: ['text-link', className].filter(Boolean).join(' '),
    attributes: { href, 'data-router-link': true },
    children: [createElement('span', { text: label }), createArrow({ className: 'text-link__arrow' })],
  })
}

export function createBadge(label, tone = 'brand', className = '') {
  return createElement('span', {
    className: ['badge', `badge--${tone}`, className].filter(Boolean).join(' '),
    text: label,
  })
}

export function createEyebrow(label) {
  return createElement('p', { className: 'eyebrow', text: label })
}

export function createCard({
  tagName = 'article',
  className = '',
  hover = false,
  attributes = {},
  children = [],
} = {}) {
  return createElement(tagName, {
    className: ['card', hover ? 'card--hover' : '', className].filter(Boolean).join(' '),
    attributes,
    children,
  })
}

export function createSectionHeading({ eyebrow, title, description = '', id, className = '' }) {
  return createElement('div', {
    className: ['section-heading', className].filter(Boolean).join(' '),
    children: [
      createEyebrow(eyebrow),
      createElement('h2', { text: title, attributes: { id } }),
      ...(description ? [createElement('p', { text: description })] : []),
    ],
  })
}

export function createRouteLine({ className = '', path = 'M20 200 C 90 120, 60 60, 150 70 S 260 160, 340 90' } = {}) {
  const svg = createSvgElement('svg', {
    class: ['route-line', className].filter(Boolean).join(' '),
    viewBox: '0 0 360 240',
    'aria-hidden': 'true',
  })
  const backgroundPath = createSvgElement('path', {
    d: path,
    fill: 'none',
    stroke: 'var(--color-border)',
    'stroke-width': '2.5',
    'stroke-linecap': 'round',
    'stroke-dasharray': '2 8',
  })
  const foregroundPath = createSvgElement('path', {
    class: 'route-line__draw',
    d: path,
    fill: 'none',
    stroke: 'var(--color-terracotta)',
    'stroke-width': '2.5',
    'stroke-linecap': 'round',
    'stroke-dasharray': '600',
    'stroke-dashoffset': '600',
  })

  svg.append(backgroundPath, foregroundPath)
  return svg
}
