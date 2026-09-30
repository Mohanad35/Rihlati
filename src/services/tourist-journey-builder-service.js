import {
  rankTouristDestinations,
} from './tourist-matching-service.js'

const JOURNEY_PROFILES = Object.freeze({
  'Short & relaxed': Object.freeze({
    durationDays: 4,
    stopCount: 3,
    paceLabel: 'Relaxed pace',
  }),

  'Balanced week': Object.freeze({
    durationDays: 6,
    stopCount: 5,
    paceLabel: 'Balanced pace',
  }),

  'Full discovery': Object.freeze({
    durationDays: 9,
    stopCount: 7,
    paceLabel: 'Full discovery',
  }),
})

function getJourneyProfile(pace) {
  return (
    JOURNEY_PROFILES[pace]
    ?? JOURNEY_PROFILES['Balanced week']
  )
}

export function buildTouristJourney(answers) {
  const safeAnswers =
    answers && typeof answers === 'object'
      ? answers
      : {}

  const profile =
    getJourneyProfile(safeAnswers.pace)

  const rankedMatches =
    rankTouristDestinations(
      safeAnswers,
    )

  const selectedMatches =
    rankedMatches
      .slice(
        0,
        profile.stopCount,
      )
      .sort(
        (a, b) =>
          a.destination.routeOrder
          - b.destination.routeOrder,
      )

  const stops =
    selectedMatches.map(
      (match, index) => ({
        day: index + 1,

        id:
          match.destination.id,

        name:
          match.destination.name,

        nameAr:
          match.destination.nameAr,

        region:
          match.destination.region,

        type:
          match.destination.type,

        time:
          match.destination.time,

        image:
          match.destination.image,

        imageAlt:
          match.destination.imageAlt,

        why:
          match.destination.why,

        tip:
          match.destination.tip,

        matchPercentage:
          match.matchPercentage,

        matchReasons:
          match.reasons,
      }),
    )

  return {
    schemaVersion: 1,

    journeyKey:
      `matched-${safeAnswers.pace
        ?.toLowerCase()
        .replaceAll(' ', '-')
        .replaceAll('&', 'and')
        ?? 'journey'}`,

    title:
      'Your Jordan Journey',

    summary: {
      durationDays:
        profile.durationDays,

      stopCount:
        stops.length,

      pace:
        profile.paceLabel,

      focus:
        'Personalized match',
    },

    preferences:
      safeAnswers,

    stops,

    matches:
      rankedMatches.map(
        (match) => ({
          destinationId:
            match.destination.id,

          score:
            match.rawScore,

          matchPercentage:
            match.matchPercentage,
        }),
      ),
  }
}