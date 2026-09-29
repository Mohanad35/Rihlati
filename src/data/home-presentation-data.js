import { homeAssets } from '../assets/home-assets.js'

export const routePaths = Object.freeze({
  home: '/',
  touristEntry: '/tourist-entry',
  investorEntry: '/investor-entry',
  insights: '/insights',
  myJourneys: '/t-my-journeys',
  myInvestments: '/ni-my-investments',
  adminLogin: '/admin/login',
})

export const heroPrinciples = Object.freeze([
  { title: 'Understand', description: 'We learn your preferences' },
  { title: 'Match', description: 'Right places, right pace' },
  { title: 'Visualize', description: 'See your route come alive' },
  { title: 'Guide', description: 'Tips that actually help' },
])

export const audiencePaths = Object.freeze([
  {
    title: 'Travellers',
    description: 'Get a personalized route that matches your pace, taste, and time.',
    action: 'Plan my trip',
    href: routePaths.touristEntry,
    image: homeAssets.deadSeaPhoto,
    imageAlt: 'The Dead Sea shoreline and surrounding Jordanian landscape',
    tone: 'terracotta',
  },
  {
    title: 'New investors',
    description: 'Discover tourism opportunities matched to your criteria and region.',
    action: 'Find opportunities',
    href: routePaths.investorEntry,
    image: homeAssets.investorNew,
    imageAlt: 'Petra and the Jordanian flag representing tourism investment in Jordan',
    tone: 'gold',
  },
  {
    title: 'Existing businesses',
    description: 'See which travellers fit your business and how you could partner.',
    action: 'Discover fit',
    href: routePaths.investorEntry,
    image: homeAssets.investorExisting,
    imageAlt: 'A contemporary tourism business destination in Jordan',
    tone: 'brand',
  },
])

export const processSteps = Object.freeze([
  {
    icon: 'heart',
    title: 'Understand',
    description: 'A short, elegant questionnaire captures who you are and how you like to travel.',
  },
  {
    icon: 'compass',
    title: 'Match',
    description: 'Your answers are matched to regions, experiences, and a pace that fits.',
  },
  {
    icon: 'map',
    title: 'Visualize',
    description: 'Your journey is drawn across Jordan — day by day, stop by stop.',
  },
  {
    icon: 'bulb',
    title: 'Guide',
    description: '“Why this place” explanations and honest, practical tips at every step.',
  },
])

/**
 * Prototype percentages below exist only to reproduce the approved Home visual.
 * They are not destination coordinates, governorate data, or a reusable map model.
 */
export const journeyPreviewStops = Object.freeze([
  {
    name: 'Amman — Old City',
    day: 1,
    region: 'Central',
    type: 'Culture & City',
    time: 'Half day',
    image: homeAssets.jordanMap,
    imageAlt: 'Relief illustration of Jordan',
    x: 46,
    y: 34,
  },
  {
    name: 'Dead Sea',
    day: 2,
    region: 'Jordan Valley',
    type: 'Relaxation & Nature',
    time: 'Full day',
    image: homeAssets.deadSea,
    imageAlt: 'Illustrated Dead Sea landscape',
    x: 30,
    y: 50,
  },
  {
    name: 'Petra',
    day: 3,
    region: 'Ma’an',
    type: 'Heritage & Wonder',
    time: 'Full day',
    image: homeAssets.petra,
    imageAlt: 'The Treasury at Petra',
    x: 33,
    y: 70,
  },
  {
    name: 'Wadi Rum',
    day: 4,
    region: 'Aqaba',
    type: 'Desert & Adventure',
    time: 'Overnight',
    image: homeAssets.wadiRum,
    imageAlt: 'Rock formations in Wadi Rum',
    x: 34,
    y: 77,
  },
])

export const investorFeatures = Object.freeze([
  { icon: 'compass', label: 'Opportunity Matching', tone: 'brand' },
  { icon: 'pin', label: 'Location Context', tone: 'brand' },
  { icon: 'users', label: 'Audience Insights', tone: 'brand' },
  { icon: 'scale', label: 'Best Match Comparison', tone: 'gold' },
])

/** Home-only presentation percentages; never use these as final location data. */
export const investorPreviewPoints = Object.freeze([
  {
    name: 'Wadi Rum',
    region: 'Southern Desert',
    label: 'Wadi Rum',
    match: 'Best Match',
    x: 34,
    y: 77,
  },
  {
    name: 'Ajloun',
    region: 'Northern Highlands',
    label: 'Ajloun',
    match: 'Alternative',
    x: 33,
    y: 26,
  },
  {
    name: 'Dead Sea',
    region: 'Jordan Valley',
    label: 'Dead Sea',
    match: 'Alternative',
    x: 30,
    y: 50,
  },
])
