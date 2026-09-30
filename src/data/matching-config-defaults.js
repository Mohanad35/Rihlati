export const matchingConfigDefaults = Object.freeze({
  schemaVersion: 1,

  tourist: Object.freeze({
    questions: Object.freeze([]),
    weights: Object.freeze({}),
    rules: Object.freeze([]),
  }),

  investor: Object.freeze({
    questions: Object.freeze([
      Object.freeze({
        id: 'investor-type',
        key: 'type',
        title: 'What type of investment are you exploring?',
        hint: 'Conceptual direction only.',
        type: 'option',
        multi: false,
        enabled: true,
        order: 1,

        options: Object.freeze([
          Object.freeze({
            id: 'accommodation',
            value: 'Accommodation',
            label: 'Accommodation',
            description: 'Lodges, camps, boutique stays',
            icon: 'building',
            enabled: true,
            order: 1,
            tags: Object.freeze(['Accommodation']),
          }),

          Object.freeze({
            id: 'experiences',
            value: 'Experiences',
            label: 'Experiences',
            description: 'Tours, activities, adventure',
            icon: 'compass',
            enabled: true,
            order: 2,
            tags: Object.freeze(['Experiences']),
          }),

          Object.freeze({
            id: 'wellness',
            value: 'Wellness',
            label: 'Wellness',
            description: 'Spa, retreat, recovery',
            icon: 'heart',
            enabled: true,
            order: 3,
            tags: Object.freeze(['Wellness']),
          }),

          Object.freeze({
            id: 'food-hospitality',
            value: 'Food & hospitality',
            label: 'Food & hospitality',
            description: 'Dining, cafés, culture',
            icon: 'star',
            enabled: true,
            order: 4,
            tags: Object.freeze(['Food & hospitality']),
          }),
        ]),
      }),

      Object.freeze({
        id: 'investor-budget',
        key: 'budget',
        title: 'Indicative budget range',
        hint: 'Helps scope the opportunity.',
        type: 'option',
        multi: false,
        enabled: true,
        order: 2,

        options: Object.freeze([
          Object.freeze({
            id: 'budget-entry',
            value: 'Entry (< $250k)',
            label: 'Entry (< $250k)',
            icon: 'chart',
            enabled: true,
            order: 1,
            tags: Object.freeze(['Entry (< $250k)']),
          }),

          Object.freeze({
            id: 'budget-mid',
            value: 'Mid ($250k–$1M)',
            label: 'Mid ($250k–$1M)',
            icon: 'chart',
            enabled: true,
            order: 2,
            tags: Object.freeze(['Mid ($250k–$1M)']),
          }),

          Object.freeze({
            id: 'budget-growth',
            value: 'Growth ($1M–$5M)',
            label: 'Growth ($1M–$5M)',
            icon: 'chart',
            enabled: true,
            order: 3,
            tags: Object.freeze(['Growth ($1M–$5M)']),
          }),

          Object.freeze({
            id: 'budget-major',
            value: 'Major ($5M+)',
            label: 'Major ($5M+)',
            icon: 'chart',
            enabled: true,
            order: 4,
            tags: Object.freeze(['Major ($5M+)']),
          }),
        ]),
      }),

      Object.freeze({
        id: 'investor-segment',
        key: 'segment',
        title: 'Which traveller segment do you want to serve?',
        hint: 'Choose any that apply.',
        type: 'chip',
        multi: true,
        enabled: true,
        order: 3,

        options: Object.freeze([
          Object.freeze({
            id: 'segment-adventure-desert',
            value: 'Adventure & desert',
            label: 'Adventure & desert',
            enabled: true,
            order: 1,
            tags: Object.freeze(['Adventure & desert']),
          }),

          Object.freeze({
            id: 'segment-heritage-culture',
            value: 'Heritage & culture',
            label: 'Heritage & culture',
            enabled: true,
            order: 2,
            tags: Object.freeze(['Heritage & culture']),
          }),

          Object.freeze({
            id: 'segment-wellness-slow',
            value: 'Wellness & slow',
            label: 'Wellness & slow',
            enabled: true,
            order: 3,
            tags: Object.freeze(['Wellness & slow']),
          }),

          Object.freeze({
            id: 'segment-family-discovery',
            value: 'Family & discovery',
            label: 'Family & discovery',
            enabled: true,
            order: 4,
            tags: Object.freeze(['Family & discovery']),
          }),

          Object.freeze({
            id: 'segment-luxury',
            value: 'Luxury',
            label: 'Luxury',
            enabled: true,
            order: 5,
            tags: Object.freeze(['Luxury']),
          }),

          Object.freeze({
            id: 'segment-eco-conscious',
            value: 'Eco-conscious',
            label: 'Eco-conscious',
            enabled: true,
            order: 6,
            tags: Object.freeze(['Eco-conscious']),
          }),
        ]),
      }),

      Object.freeze({
        id: 'investor-region',
        key: 'region',
        title: 'Region preference',
        hint: 'Where do you see this?',
        type: 'option',
        multi: false,
        enabled: true,
        order: 4,

        options: Object.freeze([
          Object.freeze({
            id: 'region-southern-desert',
            value: 'Southern desert',
            label: 'Southern desert',
            description: 'Wadi Rum, Aqaba',
            icon: 'map',
            enabled: true,
            order: 1,
            tags: Object.freeze(['Southern desert']),
          }),

          Object.freeze({
            id: 'region-jordan-valley',
            value: 'Jordan Valley',
            label: 'Jordan Valley',
            description: 'Dead Sea',
            icon: 'map',
            enabled: true,
            order: 2,
            tags: Object.freeze(['Jordan Valley']),
          }),

          Object.freeze({
            id: 'region-northern-highlands',
            value: 'Northern highlands',
            label: 'Northern highlands',
            description: 'Ajloun, Jerash',
            icon: 'map',
            enabled: true,
            order: 3,
            tags: Object.freeze(['Northern highlands']),
          }),

          Object.freeze({
            id: 'region-open-guidance',
            value: 'Open to guidance',
            label: 'Open to guidance',
            description: 'Show me the best fit',
            icon: 'compass',
            enabled: true,
            order: 4,
            tags: Object.freeze(['Open to guidance']),
          }),
        ]),
      }),

      Object.freeze({
        id: 'investor-scale-environment',
        key: 'scale',
        title: 'Project scale & environment',
        hint: 'Last step.',
        type: 'chip',
        multi: true,
        enabled: true,
        order: 5,

        options: Object.freeze([
          Object.freeze({
            id: 'scale-boutique-small',
            value: 'Boutique / small',
            label: 'Boutique / small',
            group: 'project-scale',
            enabled: true,
            order: 1,
            tags: Object.freeze(['Boutique / small']),
          }),

          Object.freeze({
            id: 'scale-mid-size',
            value: 'Mid-size',
            label: 'Mid-size',
            group: 'project-scale',
            enabled: true,
            order: 2,
            tags: Object.freeze(['Mid-size']),
          }),

          Object.freeze({
            id: 'scale-large',
            value: 'Large',
            label: 'Large',
            group: 'project-scale',
            enabled: true,
            order: 3,
            tags: Object.freeze(['Large']),
          }),

          Object.freeze({
            id: 'environment-low-impact',
            value: 'Low environmental impact',
            label: 'Low environmental impact',
            group: 'environment',
            enabled: true,
            order: 4,
            tags: Object.freeze(['Low environmental impact']),
          }),

          Object.freeze({
            id: 'environment-off-grid',
            value: 'Off-grid friendly',
            label: 'Off-grid friendly',
            group: 'environment',
            enabled: true,
            order: 5,
            tags: Object.freeze(['Off-grid friendly']),
          }),

          Object.freeze({
            id: 'environment-near-attractions',
            value: 'Near key attractions',
            label: 'Near key attractions',
            group: 'environment',
            enabled: true,
            order: 6,
            tags: Object.freeze(['Near key attractions']),
          }),
        ]),
      }),
    ]),

    weights: Object.freeze({
      segment: 6,
      type: 5,
      region: 4,
      environment: 3,
    }),

    rules: Object.freeze([
      Object.freeze({
        id: 'investor-budget-hard-filter',
        label: 'Budget compatibility',
        type: 'hard-filter',
        criterion: 'budget',
        behavior: 'exclude-incompatible',
        enabled: true,
        order: 1,
      }),

      Object.freeze({
        id: 'investor-scale-hard-filter',
        label: 'Project scale compatibility',
        type: 'hard-filter',
        criterion: 'scale',
        optionGroup: 'project-scale',
        behavior: 'exclude-incompatible',
        enabled: true,
        order: 2,
      }),

      Object.freeze({
        id: 'investor-open-region-guidance',
        label: 'Open region guidance',
        type: 'conditional',
        criterion: 'region',
        triggerValue: 'Open to guidance',
        behavior: 'full-region-score',
        enabled: true,
        order: 3,
      }),
    ]),

    supplyAdjustments: Object.freeze({
      strong: 0,
      good: -1,
      competitive: -2,
    }),
  }),
})