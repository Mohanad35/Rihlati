import { investorOpportunities } from '../data/investor-opportunities-data.js'

import {
  matchingConfigDefaults,
} from '../data/matching-config-defaults.js'


function asArray(value) {
  return Array.isArray(value)
    ? value
    : []
}


function intersection(
  values,
  supportedValues,
) {
  const supported =
    new Set(
      Array.isArray(supportedValues)
        ? supportedValues
        : [],
    )

  return values.filter(
    (value) =>
      supported.has(value),
  )
}


function getSafeConfig(config) {
  if (
    config
    && typeof config === 'object'
  ) {
    return config
  }

  return matchingConfigDefaults
    .investor
}


function getWeight(
  config,
  key,
) {
  const value =
    config?.weights?.[key]

  if (
    typeof value === 'number'
    && Number.isFinite(value)
  ) {
    return value
  }

  return (
    matchingConfigDefaults
      .investor
      .weights[key]
    ?? 0
  )
}


function getSupplyAdjustment(
  config,
  supplySignal,
) {
  const value =
    config
      ?.supplyAdjustments
      ?.[supplySignal]

  if (
    typeof value === 'number'
    && Number.isFinite(value)
  ) {
    return value
  }

  return (
    matchingConfigDefaults
      .investor
      .supplyAdjustments
      ?.[supplySignal]
    ?? 0
  )
}


function getQuestionByKey(
  config,
  key,
) {
  return asArray(
    config?.questions,
  ).find(
    (question) =>
      question?.key === key,
  ) ?? null
}


function getOptionValuesByGroup(
  config,
  questionKey,
  group,
) {
  const question =
    getQuestionByKey(
      config,
      questionKey,
    )

  if (!question) {
    return []
  }

  return asArray(
    question.options,
  )
    .filter(
      (option) =>
        option?.enabled !== false
        && option?.group
          === group,
    )
    .map(
      (option) =>
        option.value
        ?? option.label,
    )
    .filter(Boolean)
}


function getEnabledRule(
  config,
  predicate,
) {
  return asArray(
    config?.rules,
  ).find(
    (rule) =>
      rule?.enabled !== false
      && predicate(rule),
  ) ?? null
}


function getBudgetHardFilterRule(
  config,
) {
  return getEnabledRule(
    config,
    (rule) =>
      rule.type
        === 'hard-filter'
      && rule.criterion
        === 'budget'
      && rule.behavior
        === 'exclude-incompatible',
  )
}


function getScaleHardFilterRule(
  config,
) {
  return getEnabledRule(
    config,
    (rule) =>
      rule.type
        === 'hard-filter'
      && rule.criterion
        === 'scale'
      && rule.behavior
        === 'exclude-incompatible',
  )
}


function getOpenRegionRule(
  config,
) {
  return getEnabledRule(
    config,
    (rule) =>
      rule.criterion
        === 'region'
      && rule.behavior
        === 'full-region-score',
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
    score:
      values.length
      * weight,
  }
}


function getProjectScaleAnswers(
  answers,
  config,
) {
  const selectedValues =
    asArray(
      answers?.scale,
    )

  const projectScaleOptions =
    getOptionValuesByGroup(
      config,
      'scale',
      'project-scale',
    )

  return selectedValues.filter(
    (value) =>
      projectScaleOptions.includes(
        value,
      ),
  )
}


function getEnvironmentAnswers(
  answers,
  config,
) {
  const selectedValues =
    asArray(
      answers?.scale,
    )

  const environmentOptions =
    getOptionValuesByGroup(
      config,
      'scale',
      'environment',
    )

  return selectedValues.filter(
    (value) =>
      environmentOptions.includes(
        value,
      ),
  )
}


function getHardFilterResult(
  opportunity,
  answers,
  config,
) {
  const exclusionReasons = []

  const budgetRule =
    getBudgetHardFilterRule(
      config,
    )

  if (
    budgetRule
    && answers?.budget
    && !opportunity
      .budgetTags
      ?.includes(
        answers.budget,
      )
  ) {
    exclusionReasons.push({
      category:
        'Budget',

      value:
        answers.budget,

      reason:
        'Opportunity is outside the selected budget band.',
    })
  }


  const scaleRule =
    getScaleHardFilterRule(
      config,
    )

  const projectScaleAnswers =
    getProjectScaleAnswers(
      answers,
      config,
    )

  if (
    scaleRule
    && projectScaleAnswers
      .length > 0
    && intersection(
      projectScaleAnswers,
      opportunity.scaleTags,
    ).length === 0
  ) {
    exclusionReasons.push({
      category:
        'Project scale',

      values:
        projectScaleAnswers,

      reason:
        'Opportunity does not support the selected project scale.',
    })
  }


  return {
    excluded:
      exclusionReasons.length > 0,

    exclusionReasons,
  }
}


function getMaximumPossibleScore(
  answers,
  config,
) {
  const segments =
    asArray(
      answers?.segment,
    )

  const environments =
    getEnvironmentAnswers(
      answers,
      config,
    )

  const segmentWeight =
    getWeight(
      config,
      'segment',
    )

  const typeWeight =
    getWeight(
      config,
      'type',
    )

  const regionWeight =
    getWeight(
      config,
      'region',
    )

  const environmentWeight =
    getWeight(
      config,
      'environment',
    )


  let score = 0


  score +=
    segments.length
    * segmentWeight


  if (answers?.type) {
    score += typeWeight
  }


  if (answers?.region) {
    score += regionWeight
  }


  score +=
    environments.length
    * environmentWeight


  return score
}


export function scoreInvestorOpportunity(
  opportunity,
  answers,
  config = matchingConfigDefaults.investor,
) {
  if (!opportunity) {
    throw new Error(
      'Investment opportunity is required.',
    )
  }


  const safeAnswers =
    answers
    && typeof answers
      === 'object'
      ? answers
      : {}


  const safeConfig =
    getSafeConfig(config)


  const hardFilterResult =
    getHardFilterResult(
      opportunity,
      safeAnswers,
      safeConfig,
    )


  if (
    hardFilterResult.excluded
  ) {
    return {
      opportunity,
      excluded: true,

      exclusionReasons:
        hardFilterResult
          .exclusionReasons,

      rawScore: 0,

      matchPercentage: 0,

      reasons: [],
    }
  }


  const segmentWeight =
    getWeight(
      safeConfig,
      'segment',
    )

  const typeWeight =
    getWeight(
      safeConfig,
      'type',
    )

  const regionWeight =
    getWeight(
      safeConfig,
      'region',
    )

  const environmentWeight =
    getWeight(
      safeConfig,
      'environment',
    )


  const matchedSegments =
    intersection(
      asArray(
        safeAnswers.segment,
      ),

      opportunity.segmentTags,
    )


  const matchedType =
    safeAnswers.type
    && opportunity
      .typeTags
      ?.includes(
        safeAnswers.type,
      )
      ? [
          safeAnswers.type,
        ]
      : []


  const openRegionRule =
    getOpenRegionRule(
      safeConfig,
    )


  const openRegionValue =
    openRegionRule
      ?.triggerValue


  const matchedRegion =
    openRegionRule
    && safeAnswers.region
      === openRegionValue
      ? [
          safeAnswers.region,
        ]
      : safeAnswers.region
        && opportunity
          .regionTags
          ?.includes(
            safeAnswers.region,
          )
          ? [
              safeAnswers.region,
            ]
          : []


  const matchedEnvironment =
    intersection(
      getEnvironmentAnswers(
        safeAnswers,
        safeConfig,
      ),

      opportunity
        .environmentTags,
    )


  const reasons = [
    createMatchReason(
      'Traveller segment',
      matchedSegments,
      segmentWeight,
    ),

    createMatchReason(
      'Investment type',
      matchedType,
      typeWeight,
    ),

    createMatchReason(
      'Region',
      matchedRegion,
      regionWeight,
    ),

    createMatchReason(
      'Environment',
      matchedEnvironment,
      environmentWeight,
    ),
  ].filter(Boolean)


  const supplyAdjustment =
    getSupplyAdjustment(
      safeConfig,
      opportunity.supplySignal,
    )


  const rawScore =
    reasons.reduce(
      (total, reason) =>
        total
        + reason.score,
      0,
    )
    + supplyAdjustment


  const maximumPossibleScore =
    getMaximumPossibleScore(
      safeAnswers,
      safeConfig,
    )


  const matchPercentage =
    maximumPossibleScore > 0
      ? Math.round(
          (
            rawScore
            / maximumPossibleScore
          )
          * 100,
        )
      : 0


  return {
    opportunity,

    excluded: false,

    exclusionReasons: [],

    rawScore,

    supplyAdjustment,

    matchPercentage:
      Math.max(
        0,
        Math.min(
          matchPercentage,
          100,
        ),
      ),

    reasons,
  }
}


export function rankInvestorOpportunities(
  answers,
  config = matchingConfigDefaults.investor,
) {
  const safeConfig =
    getSafeConfig(config)

  return investorOpportunities
    .map(
      (opportunity) =>
        scoreInvestorOpportunity(
          opportunity,
          answers,
          safeConfig,
        ),
    )
    .filter(
      (result) =>
        !result.excluded,
    )
    .sort(
      (a, b) =>
        b.rawScore
        - a.rawScore,
    )
}


export function getInvestorMatchingWeights(
  config = matchingConfigDefaults.investor,
) {
  const safeConfig =
    getSafeConfig(config)

  return {
    segment:
      getWeight(
        safeConfig,
        'segment',
      ),

    type:
      getWeight(
        safeConfig,
        'type',
      ),

    region:
      getWeight(
        safeConfig,
        'region',
      ),

    environment:
      getWeight(
        safeConfig,
        'environment',
      ),
  }
}