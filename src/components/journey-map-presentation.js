import { homeAssets } from '../assets/home-assets.js'
import { createElement } from '../utils/dom.js'

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'
const MAP_CLIP_POLYGON = '40,16 54,30 49,44 68,46 62,66 50,88 30,92 15,70 22,50 27,36 31,24'
let mapInstance = 0

function createSvgElement(tagName, attributes = {}) {
  const element = document.createElementNS(SVG_NAMESPACE, tagName)

  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, String(value))
  }

  return element
}

function createRouteSvg(stops, clipId) {
  const routePath = stops
    .map(({ prototypeMapPosition }, index) => {
      const command = index === 0 ? 'M' : 'L'
      return `${command} ${prototypeMapPosition.x} ${prototypeMapPosition.y}`
    })
    .join(' ')

  const svg = createSvgElement('svg', {
    class: 'journey-map__route',
    viewBox: '0 0 100 100',
    preserveAspectRatio: 'none',
    'aria-hidden': 'true',
  })
  const definitions = createSvgElement('defs')
  const clipPath = createSvgElement('clipPath', {
    id: clipId,
    clipPathUnits: 'userSpaceOnUse',
  })
  const group = createSvgElement('g', { 'clip-path': `url(#${clipId})` })

  clipPath.append(createSvgElement('polygon', { points: MAP_CLIP_POLYGON }))
  definitions.append(clipPath)
  group.append(
    createSvgElement('path', {
      class: 'journey-map__route-shadow',
      d: routePath,
      fill: 'none',
      stroke: '#ffffff',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      opacity: '0.7',
      'vector-effect': 'non-scaling-stroke',
    }),
    createSvgElement('path', {
      class: 'journey-map__route-line',
      d: routePath,
      fill: 'none',
      stroke: 'var(--color-terracotta)',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-dasharray': '400',
      'stroke-dashoffset': '400',
      'vector-effect': 'non-scaling-stroke',
    }),
  )
  svg.append(definitions, group)
  return svg
}

function createMarker(stop, index, activeIndex, interactive) {
  const active = index === activeIndex
  const best = stop.rank === 'Best Match'
  const marker = createElement(interactive ? 'button' : 'span', {
    className: [
      'journey-map__marker',
      active ? 'is-active' : '',
      best ? 'is-best' : '',
    ].filter(Boolean).join(' '),
    attributes: {
      ...(interactive
        ? {
            type: 'button',
            'data-journey-action': 'select-stop',
            'data-stop-index': index,
            'aria-label': `Select stop ${index + 1}: ${stop.name}`,
            'aria-pressed': active ? 'true' : 'false',
          }
        : { 'aria-hidden': 'true' }),
    },
    children: [
      createElement('span', {
        className: 'journey-map__marker-content',
        attributes: { 'aria-hidden': 'true' },
        children: [
          createElement('span', {
            className: 'journey-map__pulse',
            attributes: active || best ? {} : { hidden: true },
          }),
          createElement('span', {
            className: 'journey-map__marker-dot',
            text: best ? '★' : String(index + 1),
          }),
          createElement('span', {
            className: 'journey-map__marker-label',
            text: stop.name,
          }),
        ],
      }),
    ],
  })

  marker.style.setProperty('--marker-x', `${stop.prototypeMapPosition.x}%`)
  marker.style.setProperty('--marker-y', `${stop.prototypeMapPosition.y}%`)
  marker.style.setProperty('--marker-delay', `${0.4 + index * 0.25}s`)
  return marker
}

export function createJourneyMapPresentation({ stops, activeIndex = 0, interactive = true }) {
  const clipId = `journey-map-clip-${++mapInstance}`
  const markers = stops.map((stop, index) => createMarker(stop, index, activeIndex, interactive))
  const element = createElement('section', {
    className: 'journey-map',
    attributes: { 'aria-label': 'Journey route map' },
    children: [
      createElement('div', {
        className: 'journey-map__canvas',
        children: [
          createElement('img', {
            className: 'journey-map__image',
            attributes: {
              src: homeAssets.jordanMap,
              alt: 'Relief map of Jordan',
              draggable: 'false',
              decoding: 'async',
            },
          }),
          createRouteSvg(stops, clipId),
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
        marker.classList.toggle('is-active', active)
        if (marker instanceof HTMLButtonElement) {
          marker.setAttribute('aria-pressed', active ? 'true' : 'false')
        }
        marker.querySelector('.journey-map__pulse').hidden =
          !(active || marker.classList.contains('is-best'))
      })
    },
  }
}
