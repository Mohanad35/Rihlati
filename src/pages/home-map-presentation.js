import { homeAssets } from '../assets/home-assets.js'
import { createIcon } from '../components/ui.js'
import { createElement } from '../utils/dom.js'

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'
const MAP_CLIP_POLYGON = '40,16 54,30 49,44 68,46 62,66 50,88 30,92 15,70 22,50 27,36 31,24'

function createSvgElement(tagName, attributes = {}) {
  const element = document.createElementNS(SVG_NAMESPACE, tagName)

  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, String(value))
  }

  return element
}

function createRouteOverlay(points, clipId) {
  const svg = createSvgElement('svg', {
    class: 'home-map__route',
    viewBox: '0 0 100 100',
    preserveAspectRatio: 'none',
    'aria-hidden': 'true',
  })
  const definitions = createSvgElement('defs')
  const clipPath = createSvgElement('clipPath', { id: clipId })
  clipPath.append(createSvgElement('polygon', { points: MAP_CLIP_POLYGON }))
  definitions.append(clipPath)

  const routePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')
  const routeGroup = createSvgElement('g', { 'clip-path': `url(#${clipId})` })
  routeGroup.append(
    createSvgElement('path', {
      d: routePath,
      class: 'home-map__route-shadow',
      fill: 'none',
      'vector-effect': 'non-scaling-stroke',
    }),
    createSvgElement('path', {
      d: routePath,
      class: 'home-map__route-draw',
      fill: 'none',
      'vector-effect': 'non-scaling-stroke',
    }),
  )

  svg.append(definitions, routeGroup)
  return svg
}

function createMarker(point, index, { activeIndex, variant }) {
  const isActive = index === activeIndex
  const isBestMatch = variant === 'markers' && point.match === 'Best Match'
  const marker = createElement('span', {
    className: [
      'home-map__marker',
      isActive ? 'is-active' : '',
      isBestMatch ? 'is-best-match' : '',
    ].filter(Boolean).join(' '),
    attributes: {
      'aria-hidden': 'true',
    },
    children: [
      ...((isActive || isBestMatch)
        ? [createElement('span', { className: 'home-map__pulse' })]
        : []),
      createElement('span', {
        className: 'home-map__marker-dot',
        children: isBestMatch
          ? [createIcon('star', { className: 'home-map__marker-star' })]
          : [createElement('span', { className: 'home-map__marker-number', text: String(index + 1) })],
      }),
      createElement('span', {
        className: 'home-map__marker-label',
        text: point.label ?? point.name,
      }),
    ],
  })

  marker.style.setProperty('--marker-x', `${point.x}%`)
  marker.style.setProperty('--marker-y', `${point.y}%`)
  marker.style.setProperty('--marker-delay', `${0.4 + index * 0.25}s`)
  return marker
}

/**
 * Reproduces only the static map composition used on Home. It intentionally
 * exposes no destination or governorate API and owns no final location model.
 */
export function createHomeMapPresentation({
  points,
  activeIndex = -1,
  variant = 'route',
  clipId,
  className = '',
}) {
  const placeNames = points.map((point) => point.label ?? point.name)
  const bestMatch = points.find((point) => point.match === 'Best Match')
  const mapSummary = variant === 'route'
    ? `Sample Jordan journey route: ${placeNames.join(', ')}.`
    : `Investment opportunity preview. Best match: ${bestMatch?.label ?? bestMatch?.name ?? placeNames[0]}. Alternatives: ${placeNames.filter((name) => name !== (bestMatch?.label ?? bestMatch?.name)).join(', ')}.`

  const square = createElement('div', {
    className: 'home-map__square',
    children: [
      createElement('img', {
        className: 'home-map__relief',
        attributes: {
          src: homeAssets.jordanMap,
          alt: 'Relief map of Jordan',
          decoding: 'async',
          fetchpriority: variant === 'route' ? 'high' : 'auto',
        },
      }),
      ...(variant === 'route' ? [createRouteOverlay(points, clipId)] : []),
      createElement('div', {
        className: 'home-map__markers',
        attributes: { 'aria-hidden': 'true' },
        children: points.map((point, index) =>
          createMarker(point, index, { activeIndex, variant }),
        ),
      }),
    ],
  })

  return createElement('figure', {
    className: ['home-map', `home-map--${variant}`, className].filter(Boolean).join(' '),
    children: [
      square,
      createElement('figcaption', { className: 'visually-hidden', text: mapSummary }),
    ],
  })
}
