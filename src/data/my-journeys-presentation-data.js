import { touristJourneyStops } from './tourist-journey-presentation-data.js'

/**
 * Presentation-only saved journeys copied from the prototype's approved mock
 * content. They do not represent authenticated ownership or persisted data.
 * Replace this module with a Firestore-backed repository only in a later phase.
 */
export const savedJourneyPassports = Object.freeze([
  Object.freeze({
    id: 'j1',
    reference: 'RJ-001',
    title: 'Heritage & Desert Escape',
    duration: '4 days',
    stops: 4,
    mood: 'Balanced · Culture-led',
    updated: 'Updated 2 days ago',
    status: 'Saved Journey',
    tone: 'teal',
    summary: 'A balanced, culture-led journey from Amman’s old city through the Dead Sea to Petra and Wadi Rum.',
    destinations: Object.freeze(
      touristJourneyStops.map((stop) =>
        Object.freeze({
          day: stop.day,
          name: stop.name,
          nameAr: stop.nameAr,
        }),
      ),
    ),
  }),
  Object.freeze({
    id: 'j2',
    reference: 'RJ-002',
    title: 'Slow North & Green Hills',
    duration: '3 days',
    stops: 3,
    mood: 'Relaxed · Nature-led',
    updated: 'Updated last week',
    status: 'Saved Journey',
    tone: 'forest',
    summary: 'A relaxed, nature-led three-stop route held as a calm chapter in your Rihlati collection.',
    destinations: Object.freeze([]),
  }),
  Object.freeze({
    id: 'j3',
    reference: 'RJ-003',
    title: 'Family Discovery Loop',
    duration: '5 days',
    stops: 5,
    mood: 'Easy pace · Family',
    updated: 'Draft',
    status: 'Draft Journey',
    tone: 'terracotta',
    summary: 'An easy-paced five-stop family route, kept as a draft and ready for another round of refinement.',
    destinations: Object.freeze([]),
  }),
])
