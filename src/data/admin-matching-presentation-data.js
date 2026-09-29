const tourist = Object.freeze({
  id: 'tourist',
  label: 'Tourist Matching',
  shortLabel: 'Tourist',
  tone: 'terracotta',
  description: 'Maps traveller answers to regions, experiences, and pace.',
  capabilities: Object.freeze([
    'Preference weighting',
    'Regional coverage rules',
    'Pace & duration logic',
    'Experience tagging',
  ]),
  categories: Object.freeze([
    'Who you are',
    'Experiences',
    'Travel style',
    'Pace & duration',
    'Final preferences',
  ]),
  questions: Object.freeze([
    Object.freeze({
      label: 'Who are you travelling as?',
      options: Object.freeze(['Couple', 'Family']),
      tags: Object.freeze(['family']),
      feeds: 'Preference weighting',
    }),
    Object.freeze({
      label: 'What experiences do you enjoy?',
      options: Object.freeze(['Heritage', 'Desert & stars', 'Wellness', 'Nature']),
      tags: Object.freeze(['heritage', 'desert', 'wellness', 'nature']),
      feeds: 'Experience tagging',
    }),
    Object.freeze({
      label: 'Your travel style & mood',
      options: Object.freeze(['Relaxed', 'Balanced week']),
      tags: Object.freeze(['culture', 'food']),
      feeds: 'Pace & duration logic',
    }),
    Object.freeze({
      label: 'Duration, pace & environment',
      options: Object.freeze(['4 days', 'Balanced week']),
      tags: Object.freeze(['adventure', 'nature']),
      feeds: 'Regional coverage rules',
    }),
    Object.freeze({
      label: 'Final preferences',
      options: Object.freeze(['Food', 'Adventure', 'Culture']),
      tags: Object.freeze(['food', 'adventure', 'culture']),
      feeds: 'Preference weighting',
    }),
  ]),
  rules: Object.freeze([
    Object.freeze({
      condition: 'If “Desert & stars”',
      target: 'Wadi Rum overnight',
      effect: 'Boost',
      effectType: 'Positive weight',
      priority: 'High',
    }),
    Object.freeze({
      condition: 'If pace “Relaxed”',
      target: 'Journey stops',
      effect: 'Cap at 4',
      effectType: 'Conditional effect',
      priority: 'High',
    }),
    Object.freeze({
      condition: 'If “Family”',
      target: 'Easy-access sites',
      effect: 'Prefer',
      effectType: 'Positive weight',
      priority: 'Medium',
    }),
  ]),
  effectCoverage: Object.freeze([
    Object.freeze({ label: 'Positive weight', state: 'Configured' }),
    Object.freeze({ label: 'Negative weight', state: 'Supported concept' }),
    Object.freeze({ label: 'Exclusion', state: 'Supported concept' }),
    Object.freeze({ label: 'Conditional effect', state: 'Configured' }),
  ]),
  hardFilters: Object.freeze([
    Object.freeze({
      label: 'Journey duration',
      condition: 'Available days cannot support the proposed route',
      result: 'Exclude incompatible route',
    }),
    Object.freeze({
      label: 'Accessibility requirement',
      condition: 'A required access need is not supported',
      result: 'Exclude incompatible experience',
    }),
  ]),
  preview: Object.freeze({
    title: 'Test the tourist flow',
    description: 'Simulate answers to preview the generated match.',
    inputs: Object.freeze([
      Object.freeze({ label: 'Travelling as', value: 'Couple' }),
      Object.freeze({ label: 'Experiences', value: 'Heritage, Desert' }),
      Object.freeze({ label: 'Pace', value: 'Balanced week' }),
    ]),
    resultLabel: 'Preview result',
    result: 'Heritage & Desert Escape',
    summary: '4 days · Amman → Dead Sea → Petra → Wadi Rum',
  }),
})

const investor = Object.freeze({
  id: 'investor',
  label: 'Investor Matching',
  shortLabel: 'Investor',
  tone: 'gold',
  description: 'Maps investment criteria to demand and opportunity fit.',
  capabilities: Object.freeze([
    'Segment demand model',
    'Budget banding',
    'Regional supply signals',
    'Fit scoring',
  ]),
  categories: Object.freeze([
    'Investment type',
    'Budget range',
    'Tourism segment',
    'Region preference',
    'Environment preference',
    'Project scale',
  ]),
  questions: Object.freeze([
    Object.freeze({
      label: 'What type of tourism investment are you considering?',
      options: Object.freeze(['Eco-lodge', 'Nature retreat', 'Wellness facilities']),
      tags: Object.freeze(['desert', 'nature', 'wellness']),
      feeds: 'Fit scoring',
    }),
    Object.freeze({
      label: 'Which audience should the opportunity serve?',
      options: Object.freeze([
        'Adventure & experience travellers',
        'Slow & wellness travellers',
        'Wellness & relaxation travellers',
      ]),
      tags: Object.freeze(['adventure', 'wellness']),
      feeds: 'Segment demand model',
    }),
    Object.freeze({
      label: 'What project scale are you considering?',
      options: Object.freeze(['Boutique (12–20 keys)', 'Small (6–12 keys)', 'Mid (20–40 keys)']),
      tags: Object.freeze(['investment scale']),
      feeds: 'Budget banding',
    }),
    Object.freeze({
      label: 'Which region do you prefer?',
      options: Object.freeze(['Southern Desert', 'Northern Highlands', 'Jordan Valley']),
      tags: Object.freeze(['regional preference']),
      feeds: 'Regional supply signals',
    }),
  ]),
  rules: Object.freeze([
    Object.freeze({
      condition: 'If target segment aligns',
      target: 'Audience opportunity fit',
      effect: 'Boost',
      effectType: 'Positive weight',
      priority: 'High',
    }),
    Object.freeze({
      condition: 'If supply signal is less favourable',
      target: 'Regional opportunity fit',
      effect: 'Reduce',
      effectType: 'Negative weight',
      priority: 'Medium',
    }),
    Object.freeze({
      condition: 'If budget band is incompatible',
      target: 'Opportunity',
      effect: 'Exclude',
      effectType: 'Exclusion',
      priority: 'Required',
    }),
    Object.freeze({
      condition: 'If preferred region is selected',
      target: 'Regional supply signal',
      effect: 'Prioritize',
      effectType: 'Conditional effect',
      priority: 'Medium',
    }),
  ]),
  effectCoverage: Object.freeze([
    Object.freeze({ label: 'Positive weight', state: 'Illustrated' }),
    Object.freeze({ label: 'Negative weight', state: 'Illustrated' }),
    Object.freeze({ label: 'Exclusion', state: 'Illustrated' }),
    Object.freeze({ label: 'Conditional effect', state: 'Illustrated' }),
  ]),
  hardFilters: Object.freeze([
    Object.freeze({
      label: 'Budget range',
      condition: 'Opportunity falls outside the selected budget band',
      result: 'Exclude opportunity',
    }),
    Object.freeze({
      label: 'Project scale',
      condition: 'Opportunity does not support the required scale',
      result: 'Exclude opportunity',
    }),
    Object.freeze({
      label: 'Required region',
      condition: 'Location is outside a region marked as required',
      result: 'Exclude location',
    }),
  ]),
  preview: Object.freeze({
    title: 'Test the investor flow',
    description: 'Inspect how sample criteria connect to a presentation-only match.',
    inputs: Object.freeze([
      Object.freeze({ label: 'Investment type', value: 'Eco-lodge' }),
      Object.freeze({ label: 'Scale', value: 'Boutique (12–20 keys)' }),
      Object.freeze({ label: 'Audience', value: 'Adventure & experience travellers' }),
    ]),
    resultLabel: 'Preview result · 92% match',
    result: 'Wadi Rum — Southern Desert',
    summary: 'Eco-lodge · Desert stay · Adventure & experience travellers',
  }),
})

export const adminMatchingPresentation = Object.freeze({
  sections: Object.freeze([
    Object.freeze({ id: 'categories', label: 'Categories' }),
    Object.freeze({ id: 'questions', label: 'Questions & Options' }),
    Object.freeze({ id: 'rules', label: 'Rules & Weights' }),
    Object.freeze({ id: 'filters', label: 'Hard Filters' }),
    Object.freeze({ id: 'preview', label: 'Test & Preview' }),
    Object.freeze({ id: 'publish', label: 'Publish' }),
  ]),
  modes: Object.freeze({ tourist, investor }),
})
