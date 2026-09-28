import { touristJourneyStops } from './tourist-journey-presentation-data.js'

const businessStop = Object.freeze({
  ...touristJourneyStops[3],
  name: 'Cedar Valley Camps',
  type: 'Your business',
  why: 'Recommended as the overnight desert stop for adventure-led travellers finishing the southern route.',
  imageAlt: 'Rock formations around Cedar Valley Camps in Wadi Rum',
  rank: 'Best Match',
})

export const existingBusinessSimulationPresentation = Object.freeze({
  mapStops: Object.freeze(
    touristJourneyStops.map((stop, index) => index === 3 ? businessStop : stop),
  ),
  journeyStops: Object.freeze([touristJourneyStops[2], businessStop]),
  recommendation: Object.freeze({
    badge: 'Recommended stop',
    title: 'Day 4 · Cedar Valley Camps',
    description: 'In a “Heritage & Desert Escape” route, your camp is surfaced as the natural overnight after Petra — matched to adventure-and-desert travellers.',
  }),
})
