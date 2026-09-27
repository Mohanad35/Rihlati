import { homeAssets } from '../assets/home-assets.js'

/**
 * Mock journey content copied from the approved prototype.
 *
 * `prototypeMapPosition` exists only to reproduce the current result artwork.
 * These x/y values are not governorate coordinates and are not part of the
 * future Destination -> governorateId map domain model.
 */
export const touristJourneyStops = Object.freeze([
  Object.freeze({
    day: 1,
    name: 'Amman — Old City',
    nameAr: 'عمّان',
    region: 'Central',
    type: 'Culture & City',
    time: 'Half day',
    why: 'You marked culture and local food as priorities. Amman’s downtown pairs Roman heritage with a lived-in café scene — an easy, grounding start.',
    tip: 'Start early at the Citadel for soft light, then walk down to Rainbow Street for lunch.',
    image: homeAssets.jordanMap,
    imageAlt: 'Relief map of Jordan',
    prototypeMapPosition: Object.freeze({ x: 46, y: 34 }),
  }),
  Object.freeze({
    day: 2,
    name: 'Dead Sea',
    nameAr: 'البحر الميت',
    region: 'Jordan Valley',
    type: 'Relaxation & Nature',
    time: 'Full day',
    why: 'A slower, restorative day suits your “balanced pace” preference before the desert legs of the trip.',
    tip: 'Float mid-morning, rinse well, and stay for sunset over the valley.',
    image: homeAssets.deadSea,
    imageAlt: 'Illustrated Dead Sea landscape',
    prototypeMapPosition: Object.freeze({ x: 30, y: 50 }),
  }),
  Object.freeze({
    day: 3,
    name: 'Petra',
    nameAr: 'البتراء',
    region: 'Ma’an',
    type: 'Heritage & Wonder',
    time: 'Full day',
    why: 'Your top-ranked interest was iconic heritage. Petra is the anchor of the route and worth an unhurried full day.',
    tip: 'Enter the Siq at opening; consider Petra by Night if your dates align.',
    image: homeAssets.petra,
    imageAlt: 'The Treasury at Petra',
    prototypeMapPosition: Object.freeze({ x: 33, y: 70 }),
  }),
  Object.freeze({
    day: 4,
    name: 'Wadi Rum',
    nameAr: 'وادي رم',
    region: 'Aqaba',
    type: 'Desert & Adventure',
    time: 'Overnight',
    why: 'You chose immersive nature and a memorable overnight — a desert camp under the stars fits perfectly.',
    tip: 'Book a Bedouin camp with a jeep sunset tour; nights get cold, pack a layer.',
    image: homeAssets.wadiRum,
    imageAlt: 'Rock formations in Wadi Rum',
    prototypeMapPosition: Object.freeze({ x: 34, y: 77 }),
  }),
])
