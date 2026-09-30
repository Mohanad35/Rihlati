import { touristDestinations } from '../data/tourist-destinations-data.js'

const MATCH_WEIGHTS = Object.freeze({
  experience: 6,
  finalPreference: 5,
  style: 4,
  pace: 3,
  traveller: 2,
})

function asArray(value) {
  return Array.isArray(value)
    ? value
    : []
}

function intersection(values, supportedValues) {
  const supported = new Set(
    Array.isArray(supportedValues)
      ? supportedValues
      : [],
  )

  return values.filter(
    (value) => supported.has(value),
  )
}

function createMatchReason(
  category,
  values,
  weight,
) {
  if (!values.length) {
    return null
  }

  return {
    category,
    values,
    weight,
    score: values.length * weight,
  }
}

function getMaximumPossibleScore(answers) {
  const experiences =
    asArray(answers?.exp)

  const finalPreferences =
    asArray(answers?.final)

  let score = 0

  score +=
    experiences.length
    * MATCH_WEIGHTS.experience

  score +=
    finalPreferences.length
    * MATCH_WEIGHTS.finalPreference

  if (answers?.style) {
    score += MATCH_WEIGHTS.style
  }

  if (answers?.pace) {
    score += MATCH_WEIGHTS.pace
  }

  if (answers?.who) {
    score += MATCH_WEIGHTS.traveller
  }

  return score
}

export function scoreTouristDestination(
  destination,
  answers,
) {
  if (!destination) {
    throw new Error(
      'Destination is required.',
    )
  }

  const safeAnswers =
    answers && typeof answers === 'object'
      ? answers
      : {}

  const matchedExperiences =
    intersection(
      asArray(safeAnswers.exp),
      destination.experienceTags,
    )

  const matchedFinalPreferences =
    intersection(
      asArray(safeAnswers.final),
      destination.preferenceTags,
    )

  const matchedStyle =
    safeAnswers.style
    && destination.styleTags?.includes(
      safeAnswers.style,
    )
      ? [safeAnswers.style]
      : []

  const matchedPace =
    safeAnswers.pace
    && destination.paceTags?.includes(
      safeAnswers.pace,
    )
      ? [safeAnswers.pace]
      : []

  const matchedTraveller =
    safeAnswers.who
    && destination.travellerTags?.includes(
      safeAnswers.who,
    )
      ? [safeAnswers.who]
      : []

  const reasons = [
    createMatchReason(
      'Experiences',
      matchedExperiences,
      MATCH_WEIGHTS.experience,
    ),

    createMatchReason(
      'Final preferences',
      matchedFinalPreferences,
      MATCH_WEIGHTS.finalPreference,
    ),

    createMatchReason(
      'Travel style',
      matchedStyle,
      MATCH_WEIGHTS.style,
    ),

    createMatchReason(
      'Pace',
      matchedPace,
      MATCH_WEIGHTS.pace,
    ),

    createMatchReason(
      'Traveller type',
      matchedTraveller,
      MATCH_WEIGHTS.traveller,
    ),
  ].filter(Boolean)

  const rawScore =
    reasons.reduce(
      (total, reason) =>
        total + reason.score,
      0,
    )

  const maximumPossibleScore =
    getMaximumPossibleScore(
      safeAnswers,
    )

  const matchPercentage =
    maximumPossibleScore > 0
      ? Math.round(
          (
            rawScore
            / maximumPossibleScore
          ) * 100,
        )
      : 0

  return {
    destination,
    rawScore,
    matchPercentage:
      Math.min(
        matchPercentage,
        100,
      ),
    reasons,
  }
}

export function rankTouristDestinations(
  answers,
) {
  return touristDestinations
    .map(
      (destination) =>
        scoreTouristDestination(
          destination,
          answers,
        ),
    )
    .sort((a, b) => {
      if (
        b.rawScore
        !== a.rawScore
      ) {
        return (
          b.rawScore
          - a.rawScore
        )
      }

      return (
        a.destination.routeOrder
        - b.destination.routeOrder
      )
    })
}

export function getTouristMatchingWeights() {
  return {
    ...MATCH_WEIGHTS,
  }
}