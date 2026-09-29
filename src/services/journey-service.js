import { createJourney } from '../repositories/journey-repository.js'
import {
  clearPendingJourney,
  getPendingJourney,
} from './guest-session-service.js'

let saveInFlight = null

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
    const journeyId = await createJourney(user.uid, pendingJourney)
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
