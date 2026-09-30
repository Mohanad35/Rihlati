import {
  createInvestment,
  getInvestmentsByOwner,
} from '../repositories/investment-repository.js'
import {
  clearInvestorCompareSelection,
  clearPendingInvestment,
  getInvestorCompareSelection,
  getPendingInvestment,
} from './guest-session-service.js'

let saveInFlight = null

function createInvestmentSaveError(code, message) {
  const error = new Error(message)
  error.code = code
  return error
}

function resolveSelectedOpportunity(pendingInvestment, explicitSelectionId) {
  if (!Array.isArray(pendingInvestment.matches) || pendingInvestment.matches.length === 0) {
    throw createInvestmentSaveError(
      'investment/invalid-pending',
      'The pending Investment does not contain any opportunity matches.',
    )
  }

  const availableIds = pendingInvestment.matches
    .map((match) => match?.id)
    .filter((id) => typeof id === 'string' && id.length > 0)
  const compareSelection = getInvestorCompareSelection()
  const compareSelectionId = compareSelection?.selectedOpportunityId

  if (
    compareSelectionId != null
    && (typeof compareSelectionId !== 'string' || !availableIds.includes(compareSelectionId))
  ) {
    throw createInvestmentSaveError(
      'investment/invalid-selection',
      'The compared opportunity is not available in the pending Investment.',
    )
  }

  const claimedSelectionId = explicitSelectionId ?? compareSelectionId

  if (claimedSelectionId != null) {
    if (typeof claimedSelectionId !== 'string' || !availableIds.includes(claimedSelectionId)) {
      throw createInvestmentSaveError(
        'investment/invalid-selection',
        'The selected opportunity is not available in the pending Investment.',
      )
    }

    return claimedSelectionId
  }

  if (
    typeof pendingInvestment.opportunityKey !== 'string'
    || !availableIds.includes(pendingInvestment.opportunityKey)
  ) {
    throw createInvestmentSaveError(
      'investment/invalid-selection',
      'The pending Investment does not have a valid selected opportunity.',
    )
  }

  return pendingInvestment.opportunityKey
}

export function savePendingInvestorOpportunity(user, { selectedOpportunityId } = {}) {
  if (!user?.uid) {
    return Promise.reject(createInvestmentSaveError(
      'investment/auth-required',
      'An authenticated user is required to save an Investment.',
    ))
  }

  if (saveInFlight) {
    return saveInFlight
  }

  const pendingInvestment = getPendingInvestment()
  if (!pendingInvestment) {
    return Promise.reject(createInvestmentSaveError(
      'investment/missing-pending',
      'No pending Investment is available to save.',
    ))
  }

  let opportunityKey

  try {
    opportunityKey = resolveSelectedOpportunity(pendingInvestment, selectedOpportunityId)
  } catch (error) {
    return Promise.reject(error)
  }

  const operation = (async () => {
    const investmentId = await createInvestment(user.uid, {
      ...pendingInvestment,
      opportunityKey,
    })
    clearPendingInvestment()
    clearInvestorCompareSelection()
    return { investmentId }
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

function getCreatedAtMilliseconds(investment) {
  if (typeof investment?.createdAt?.toMillis === 'function') {
    return investment.createdAt.toMillis()
  }

  const milliseconds = new Date(investment?.createdAt ?? 0).getTime()
  return Number.isFinite(milliseconds) ? milliseconds : 0
}

function normalizeInvestment(investment) {
  return {
    ...investment,
    criteria: investment?.criteria && typeof investment.criteria === 'object'
      ? { ...investment.criteria }
      : {},
    matches: Array.isArray(investment?.matches)
      ? investment.matches.map((match) => ({ ...match }))
      : [],
    context: investment?.context && typeof investment.context === 'object'
      ? { ...investment.context }
      : {},
  }
}

export async function getCurrentUserInvestments(user) {
  if (!user?.uid) {
    throw createInvestmentSaveError(
      'investment/auth-required',
      'An authenticated user is required to load Investments.',
    )
  }

  const investments = await getInvestmentsByOwner(user.uid)

  return investments
    .map(normalizeInvestment)
    .sort((first, second) => getCreatedAtMilliseconds(second) - getCreatedAtMilliseconds(first))
}
