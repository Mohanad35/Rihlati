import { homeAssets } from '../assets/home-assets.js'

export const touristDestinations = Object.freeze([
  Object.freeze({
    id: 'amman-old-city',
    name: 'Amman — Old City',
    nameAr: 'عمّان',
    region: 'Central',
    type: 'Culture & City',
    time: 'Half day',
    image: homeAssets.jordanMap,
    imageAlt: 'Relief map of Jordan',

    routeOrder: 40,
    cluster: 'central',

    experienceTags: Object.freeze([
      'Ancient heritage',
      'Local food',
      'Culture & museums',
      'Markets & crafts',
    ]),

    styleTags: Object.freeze([
      'Iconic & essential',
      'Balanced mix',
      'Immersive & slow',
    ]),

    travellerTags: Object.freeze([
      'Solo explorer',
      'Couple',
      'Family',
      'Friends',
    ]),

    paceTags: Object.freeze([
      'Short & relaxed',
      'Balanced week',
      'Full discovery',
    ]),

    preferenceTags: Object.freeze([
      'Keep travel time low',
      'Photography spots',
    ]),

    why:
      'Amman combines heritage, local food, neighbourhood life, and an easy introduction to Jordan.',

    tip:
      'Start around the Citadel and downtown, then leave time for food and local neighbourhoods.',
  }),

  Object.freeze({
    id: 'jerash',
    name: 'Jerash',
    nameAr: 'جرش',
    region: 'Northern Jordan',
    type: 'Heritage & Archaeology',
    time: 'Half day',
    image: homeAssets.jordanMap,
    imageAlt: 'Relief map of Jordan',

    routeOrder: 20,
    cluster: 'north',

   experienceTags: Object.freeze([
  'Ancient heritage',
  'Culture & museums',
]),

    styleTags: Object.freeze([
      'Iconic & essential',
      'Balanced mix',
    ]),

    travellerTags: Object.freeze([
      'Solo explorer',
      'Couple',
      'Family',
      'Friends',
    ]),

    paceTags: Object.freeze([
      'Balanced week',
      'Full discovery',
    ]),

    preferenceTags: Object.freeze([
      'Photography spots',
    ]),

    why:
      'Jerash adds a strong archaeological experience for travellers interested in ancient heritage and history.',

    tip:
      'Allow enough time to walk through the main archaeological area without rushing.',
  }),

  Object.freeze({
    id: 'ajloun',
    name: 'Ajloun',
    nameAr: 'عجلون',
    region: 'Northern Highlands',
    type: 'Nature & Heritage',
    time: 'Full day',
    image: homeAssets.jordanMap,
    imageAlt: 'Relief map of Jordan',

    routeOrder: 10,
    cluster: 'north',

    experienceTags: Object.freeze([
      'Nature & hikes',
      'Ancient heritage',
      'Local food',
    ]),

    styleTags: Object.freeze([
      'Off the beaten path',
      'Balanced mix',
      'Immersive & slow',
    ]),

    travellerTags: Object.freeze([
      'Solo explorer',
      'Couple',
      'Family',
      'Friends',
    ]),

    paceTags: Object.freeze([
      'Balanced week',
      'Full discovery',
    ]),

    preferenceTags: Object.freeze([
      'Photography spots',
      'Include a rest day',
    ]),

    why:
      'Ajloun works well for travellers who want greener landscapes, quieter experiences, and a mix of nature and heritage.',

    tip:
      'Keep the day flexible so the route can combine scenery, walking, and local stops.',
  }),

  Object.freeze({
    id: 'madaba',
    name: 'Madaba',
    nameAr: 'مادبا',
    region: 'Central Jordan',
    type: 'Heritage & Culture',
    time: 'Half day',
    image: homeAssets.jordanMap,
    imageAlt: 'Relief map of Jordan',

    routeOrder: 50,
    cluster: 'central',

    experienceTags: Object.freeze([
      'Ancient heritage',
      'Culture & museums',
      'Local food',
    ]),

    styleTags: Object.freeze([
      'Balanced mix',
      'Immersive & slow',
    ]),

    travellerTags: Object.freeze([
      'Solo explorer',
      'Couple',
      'Family',
    ]),

    paceTags: Object.freeze([
      'Short & relaxed',
      'Balanced week',
      'Full discovery',
    ]),

    preferenceTags: Object.freeze([
      'Keep travel time low',
    ]),

    why:
      'Madaba adds cultural depth without requiring a major detour from a central Jordan route.',

    tip:
      'Pair it with another nearby central-Jordan experience rather than treating it as a rushed standalone stop.',
  }),

  Object.freeze({
    id: 'dead-sea',
    name: 'Dead Sea',
    nameAr: 'البحر الميت',
    region: 'Jordan Valley',
    type: 'Relaxation & Nature',
    time: 'Full day',
    image: homeAssets.deadSea,
    imageAlt: 'Illustrated Dead Sea landscape',

    routeOrder: 60,
    cluster: 'valley',

    experienceTags: Object.freeze([
      'Wellness & spa',
      'Beaches & water',
      'Nature & hikes',
    ]),

    styleTags: Object.freeze([
      'Balanced mix',
      'Immersive & slow',
    ]),

    travellerTags: Object.freeze([
      'Solo explorer',
      'Couple',
      'Family',
      'Friends',
    ]),

    paceTags: Object.freeze([
      'Short & relaxed',
      'Balanced week',
      'Full discovery',
    ]),

    preferenceTags: Object.freeze([
      'Prefer warm weather',
      'Include a rest day',
      'Sunset moments',
    ]),

    why:
      'The Dead Sea provides a slower wellness-focused stop and works naturally as a rest point within a broader journey.',

    tip:
      'Leave room in the schedule for a relaxed afternoon and sunset rather than treating the stop as a quick visit.',
  }),

  Object.freeze({
    id: 'dana',
    name: 'Dana',
    nameAr: 'ضانا',
    region: 'Southern Highlands',
    type: 'Nature & Hiking',
    time: 'Full day',
    image: homeAssets.jordanMap,
    imageAlt: 'Relief map of Jordan',

    routeOrder: 70,
    cluster: 'south-highlands',

    experienceTags: Object.freeze([
      'Nature & hikes',
      'Local food',
    ]),

    styleTags: Object.freeze([
      'Off the beaten path',
      'Immersive & slow',
      'Balanced mix',
    ]),

    travellerTags: Object.freeze([
      'Solo explorer',
      'Couple',
      'Friends',
    ]),

    paceTags: Object.freeze([
      'Balanced week',
      'Full discovery',
    ]),

    preferenceTags: Object.freeze([
      'Photography spots',
      'Sunset moments',
    ]),

    why:
      'Dana fits travellers who value landscapes, hiking, quieter places, and slower regional discovery.',

    tip:
      'Give the landscape enough time; this stop works better when it is not squeezed between long travel legs.',
  }),

  Object.freeze({
    id: 'petra',
    name: 'Petra',
    nameAr: 'البتراء',
    region: 'Ma’an',
    type: 'Heritage & Wonder',
    time: 'Full day',
    image: homeAssets.petra,
    imageAlt: 'The Treasury at Petra',

    routeOrder: 80,
    cluster: 'south',

    experienceTags: Object.freeze([
      'Ancient heritage',
      'Culture & museums',
      'Nature & hikes',
    ]),

    styleTags: Object.freeze([
      'Iconic & essential',
      'Balanced mix',
      'Immersive & slow',
    ]),

    travellerTags: Object.freeze([
      'Solo explorer',
      'Couple',
      'Family',
      'Friends',
    ]),

    paceTags: Object.freeze([
      'Short & relaxed',
      'Balanced week',
      'Full discovery',
    ]),

    preferenceTags: Object.freeze([
      'Photography spots',
      'Sunset moments',
    ]),

    why:
      'Petra is a strong match for travellers prioritising iconic heritage, archaeology, and a memorable walking experience.',

    tip:
      'Treat Petra as a full experience rather than a quick photo stop.',
  }),

  Object.freeze({
    id: 'wadi-rum',
    name: 'Wadi Rum',
    nameAr: 'وادي رم',
    region: 'Southern Desert',
    type: 'Desert & Adventure',
    time: 'Overnight',
    image: homeAssets.wadiRum,
    imageAlt: 'Rock formations in Wadi Rum',

    routeOrder: 90,
    cluster: 'south',

    experienceTags: Object.freeze([
      'Desert & stars',
      'Nature & hikes',
    ]),

    styleTags: Object.freeze([
      'Iconic & essential',
      'Off the beaten path',
      'Immersive & slow',
      'Balanced mix',
    ]),

    travellerTags: Object.freeze([
      'Solo explorer',
      'Couple',
      'Family',
      'Friends',
    ]),

    paceTags: Object.freeze([
      'Short & relaxed',
      'Balanced week',
      'Full discovery',
    ]),

    preferenceTags: Object.freeze([
      'Overnight in the desert',
      'Sunset moments',
      'Photography spots',
      'Prefer warm weather',
    ]),

    why:
      'Wadi Rum strongly fits travellers looking for desert landscapes, stars, adventure, and an overnight experience.',

    tip:
      'An overnight stay gives the destination more value than a quick daytime stop.',
  }),

  Object.freeze({
    id: 'aqaba',
    name: 'Aqaba',
    nameAr: 'العقبة',
    region: 'Red Sea',
    type: 'Coast & Relaxation',
    time: 'Full day',
    image: homeAssets.jordanMap,
    imageAlt: 'Relief map of Jordan',

    routeOrder: 100,
    cluster: 'south',

    experienceTags: Object.freeze([
      'Beaches & water',
      'Wellness & spa',
      'Local food',
    ]),

    styleTags: Object.freeze([
      'Balanced mix',
      'Immersive & slow',
    ]),

    travellerTags: Object.freeze([
      'Solo explorer',
      'Couple',
      'Family',
      'Friends',
    ]),

    paceTags: Object.freeze([
      'Balanced week',
      'Full discovery',
    ]),

    preferenceTags: Object.freeze([
      'Prefer warm weather',
      'Include a rest day',
      'Sunset moments',
    ]),

    why:
      'Aqaba adds coast, relaxation, food, and water-based experiences to longer journeys through southern Jordan.',

    tip:
      'Use Aqaba as a slower finish after more active heritage or desert days.',
  }),
])