import {
  createJourney,
  getJourneysByOwner,
} from '../repositories/journey-repository.js'
import {
  clearPendingJourney,
  getPendingJourney,
} from './guest-session-service.js'

let saveInFlight = null

function normalizeAssetUrl(value) {
  if (typeof value !== 'string') {
    return value
  }

  try {
    const url = new URL(value, window.location.origin)
    const isLocalDevelopmentAsset = ['localhost', '127.0.0.1'].includes(url.hostname)
      && url.pathname.startsWith('/src/assets/')
    const isCurrentAppAsset = url.origin === window.location.origin
      && url.pathname.startsWith('/src/assets/')

    if (isLocalDevelopmentAsset || isCurrentAppAsset) {
      return `${url.pathname}${url.search}${url.hash}`
    }
  } catch {
    return value
  }

  return value
}

function normalizeJourneyAssets(journey) {
  if (!journey || typeof journey !== 'object' || !Array.isArray(journey.stops)) {
    return journey
  }

  return {
    ...journey,
    stops: journey.stops.map((stop) => ({
      ...stop,
      image: normalizeAssetUrl(stop.image),
    })),
  }
}

function getCreatedAtMilliseconds(journey) {
  if (typeof journey?.createdAt?.toMillis === 'function') {
    return journey.createdAt.toMillis()
  }

  const milliseconds = new Date(journey?.createdAt ?? 0).getTime()
  return Number.isFinite(milliseconds) ? milliseconds : 0
}

function createJourneySaveError(code, message) {
  const error = new Error(message)
  error.code = code
  return error
}

export function savePendingTouristJourney(user) {
  if (!user?.uid) {
    return Promise.reject(createJourneySaveError(
      'journey/auth-required',
      'An authenticated user is required to save a Journey.',
    ))
  }

  if (saveInFlight) {
    return saveInFlight
  }

  const pendingJourney = getPendingJourney()
  if (!pendingJourney) {
    return Promise.reject(createJourneySaveError(
      'journey/missing-pending',
      'No pending Journey is available to save.',
    ))
  }

  const operation = (async () => {
    const journeyId = await createJourney(user.uid, normalizeJourneyAssets(pendingJourney))
    clearPendingJourney()
    return { journeyId }
  })()

  saveInFlight = operation
  const releaseSave = () => {
    if (saveInFlight === operation) {
      saveInFlight = null
    }
  }
  void operation.then(releaseSave, releaseSave)

  return operation
}

export async function getCurrentUserJourneys(user) {
  if (!user?.uid) {
    throw createJourneySaveError(
      'journey/auth-required',
      'An authenticated user is required to load Journeys.',
    )
  }

  const journeys = await getJourneysByOwner(user.uid)

  return journeys
    .map(normalizeJourneyAssets)
    .sort((first, second) => getCreatedAtMilliseconds(second) - getCreatedAtMilliseconds(first))
}
