import { investorResultMatches } from './investor-result-presentation-data.js'

/**
 * Presentation-only saved-state references from the approved prototype.
 * They are not authenticated records and are intentionally replaceable by
 * future persistent data without changing the page rendering contract.
 */
const savedInvestmentReferences = Object.freeze([
  Object.freeze({
    savedId: 'i1',
    matchId: 'wadi-rum-southern-desert',
    status: 'Best match saved',
  }),
  Object.freeze({
    savedId: 'i2',
    matchId: 'ajloun-northern-highlands',
    status: 'Comparing',
    sourceTypeLabel: 'Nature retreat',
  }),
])

function resolveSavedInvestment(reference) {
  const match = investorResultMatches.find(({ id }) => id === reference.matchId)

  if (!match) {
    throw new Error(`Missing investor match for saved presentation item: ${reference.matchId}`)
  }

  return Object.freeze({
    ...match,
    savedId: reference.savedId,
    status: reference.status,
    type: reference.sourceTypeLabel ?? match.type,
  })
}

export const savedInvestmentPresentations = Object.freeze(
  savedInvestmentReferences.map(resolveSavedInvestment),
)
