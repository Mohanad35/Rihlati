const SESSION_KEYS = Object.freeze({
  touristAnswers: 'rihlati.tourist.answers',
  pendingJourney: 'rihlati.tourist.pendingJourney',
  investorAnswers: 'rihlati.investor.answers',
  pendingInvestment: 'rihlati.investor.pendingOpportunity',
  investorCompareSelection: 'rihlati.investor.compareSelection',
  businessProfile: 'rihlati.business.profile',
  businessFlowContext: 'rihlati.business.flowContext',
  pendingPartnership: 'rihlati.business.pendingPartnership',
})

function getSessionStorage() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

function writeJson(key, value) {
  const storage = getSessionStorage()
  if (!storage) {
    return false
  }

  try {
    storage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

function readJson(key) {
  const storage = getSessionStorage()
  if (!storage) {
    return null
  }

  try {
    const value = storage.getItem(key)
    return value === null ? null : JSON.parse(value)
  } catch {
    return null
  }
}

function remove(key) {
  const storage = getSessionStorage()
  if (!storage) {
    return
  }

  try {
    storage.removeItem(key)
  } catch {
    // Temporary guest state is optional when browser storage is unavailable.
  }
}

export function saveTouristAnswers(answers) {
  return writeJson(SESSION_KEYS.touristAnswers, answers)
}

export function getTouristAnswers() {
  return readJson(SESSION_KEYS.touristAnswers)
}

export function clearTouristAnswers() {
  remove(SESSION_KEYS.touristAnswers)
}

export function savePendingJourney(journey) {
  return writeJson(SESSION_KEYS.pendingJourney, journey)
}

export function getPendingJourney() {
  return readJson(SESSION_KEYS.pendingJourney)
}

export function clearPendingJourney() {
  remove(SESSION_KEYS.pendingJourney)
}

export function saveInvestorAnswers(answers) {
  return writeJson(SESSION_KEYS.investorAnswers, answers)
}

export function getInvestorAnswers() {
  return readJson(SESSION_KEYS.investorAnswers)
}

export function clearInvestorAnswers() {
  remove(SESSION_KEYS.investorAnswers)
}

export function savePendingInvestment(investment) {
  return writeJson(SESSION_KEYS.pendingInvestment, investment)
}

export function getPendingInvestment() {
  return readJson(SESSION_KEYS.pendingInvestment)
}

export function clearPendingInvestment() {
  remove(SESSION_KEYS.pendingInvestment)
}

export function saveInvestorCompareSelection(selection) {
  return writeJson(SESSION_KEYS.investorCompareSelection, selection)
}

export function getInvestorCompareSelection() {
  return readJson(SESSION_KEYS.investorCompareSelection)
}

export function clearInvestorCompareSelection() {
  remove(SESSION_KEYS.investorCompareSelection)
}

export function saveBusinessProfile(profile) {
  return writeJson(SESSION_KEYS.businessProfile, profile)
}

export function getBusinessProfile() {
  return readJson(SESSION_KEYS.businessProfile)
}

export function clearBusinessProfile() {
  remove(SESSION_KEYS.businessProfile)
}

export function saveBusinessFlowContext(context) {
  return writeJson(SESSION_KEYS.businessFlowContext, context)
}

export function getBusinessFlowContext() {
  return readJson(SESSION_KEYS.businessFlowContext)
}

export function clearBusinessFlowContext() {
  remove(SESSION_KEYS.businessFlowContext)
}

export function savePendingPartnership(partnership) {
  return writeJson(SESSION_KEYS.pendingPartnership, partnership)
}

export function getPendingPartnership() {
  return readJson(SESSION_KEYS.pendingPartnership)
}

export function clearPendingPartnership() {
  remove(SESSION_KEYS.pendingPartnership)
}
