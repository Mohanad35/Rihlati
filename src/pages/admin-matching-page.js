import { createAdminShell } from '../components/admin-shell.js'
import { createBadge, createCard } from '../components/ui.js'
import { adminMatchingPresentation as presentation } from '../data/admin-matching-presentation-data.js'
import { createElement } from '../utils/dom.js'
import { mountRevealObserver } from '../utils/reveal.js'
import {
  getAdminMatchingConfig,
  saveAdminMatchingDraft,
  publishAdminMatchingConfig,
} from '../services/matching-config-service.js'

function createPanelHeading(title, description, badge = '') {
  return createElement('div', {
    className: 'admin-matching-panel__heading',
    children: [
      createElement('div', {
        children: [
          createElement('h2', { className: 'admin-matching-panel__title', text: title }),
          createElement('p', { className: 'admin-matching-panel__description', text: description }),
        ],
      }),
      ...(badge ? [createBadge(badge, 'sand')] : []),
    ],
  })
}

function createCategoriesPanel(mode) {
  return createElement('section', {
    className: 'admin-matching-panel__content animate-fade',
    children: [
      createPanelHeading(
        `${mode.shortLabel} matching categories`,
        'The approved criteria flow, organized before questions, options, and rules are connected.',
        `${mode.categories.length} categories`,
      ),
      createElement('ol', {
        className: 'admin-matching-categories',
        children: mode.categories.map((category, index) =>
          createElement('li', {
            className: 'admin-matching-category',
            children: [
              createElement('span', {
                className: 'admin-matching-category__index',
                attributes: { 'aria-hidden': 'true' },
                text: String(index + 1).padStart(2, '0'),
              }),
              createElement('span', { className: 'admin-matching-category__label', text: category }),
              createBadge('Configured', 'brand'),
            ],
          }),
        ),
      }),
      createElement('aside', {
        className: 'admin-matching-capabilities',
        attributes: { 'aria-label': `${mode.label} configuration coverage` },
        children: [
          createElement('h3', { text: 'Configuration coverage' }),
          createElement('ul', {
            children: mode.capabilities.map((item) =>
              createElement('li', {
                children: [
                  createElement('span', { attributes: { 'aria-hidden': 'true' }, text: '✓' }),
                  createElement('span', { text: item }),
                ],
              }),
            ),
          }),
        ],
      }),
    ],
  })
}

function createQuestionCard(question, index) {
  return createCard({
    tagName: 'article',
    className: 'admin-matching-question',
    children: [
      createElement('div', {
        className: 'admin-matching-question__topline',
        children: [
          createElement('span', { className: 'admin-matching-question__number', text: `Q${index + 1}` }),
          createElement('span', { className: 'admin-matching-question__feeds', text: `Feeds: ${question.feeds}` }),
        ],
      }),
      createElement('h3', { text: question.label }),
      createElement('div', {
        className: 'admin-matching-question__group',
        children: [
          createElement('p', { text: 'Available options' }),
          createElement('ul', {
            className: 'admin-matching-option-list',
            children: question.options.map((option) =>
              createElement('li', { text: option }),
            ),
          }),
        ],
      }),
      createElement('div', {
        className: 'admin-matching-question__group',
        children: [
          createElement('p', { text: 'Associated tags' }),
          createElement('div', {
            className: 'admin-matching-tags',
            children: question.tags.map((tag) => createBadge(tag, 'sand')),
          }),
        ],
      }),
    ],
  })
}

function createEditableQuestionCard(question, index) {
  return createCard({
    tagName: 'article',
    className: 'admin-matching-question',
    children: [
      createElement('div', {
        className: 'admin-matching-question__topline',
        children: [
          createElement('span', {
            className: 'admin-matching-question__number',
            text: `Q${index + 1}`,
          }),

          createElement('label', {
            children: [
              createElement('input', {
                attributes: {
                  type: 'checkbox',
                  checked: question.enabled,
                  'data-config-question-enabled': question.id,
                },
              }),
              document.createTextNode(' Enabled'),
            ],
          }),
        ],
      }),

      createElement('div', {
        className: 'admin-matching-question__group',
        children: [
          createElement('label', {
            children: [
              createElement('strong', {
                text: 'Question title',
              }),

              createElement('input', {
                className: 'input',
                attributes: {
                  type: 'text',
                  value: question.title ?? '',
                  'data-config-question-title': question.id,
                },
              }),
            ],
          }),
        ],
      }),

      createElement('div', {
        className: 'admin-matching-question__group',
        children: [
          createElement('label', {
            children: [
              createElement('strong', {
                text: 'Hint',
              }),

              createElement('input', {
                className: 'input',
                attributes: {
                  type: 'text',
                  value: question.hint ?? '',
                  'data-config-question-hint': question.id,
                },
              }),
            ],
          }),
        ],
      }),

      createElement('div', {
        className: 'admin-matching-question__group',
        children: [
          createElement('p', {
            text: 'Answer options',
          }),

          createElement('div', {
            className: 'admin-matching-questions',
            children: question.options.map((option) =>
              createElement('div', {
                className: 'admin-matching-option-list',
                children: [
                  createElement('input', {
                    className: 'input',
                    attributes: {
                      type: 'text',
                      value: option.label ?? '',
                      'data-config-option-label': option.id,
                      'data-config-question-id': question.id,
                      'aria-label': `Label for ${option.label}`,
                    },
                  }),

                  createElement('input', {
                    className: 'input',
                    attributes: {
                      type: 'text',
                      value: option.value ?? '',
                      'data-config-option-value': option.id,
                      'data-config-question-id': question.id,
                      'aria-label': `Value for ${option.label}`,
                    },
                  }),

                  createElement('label', {
                    children: [
                      createElement('input', {
                        attributes: {
                          type: 'checkbox',
                          checked: option.enabled,
                          'data-config-option-enabled': option.id,
                          'data-config-question-id': question.id,
                        },
                      }),

                      document.createTextNode(' Enabled'),
                    ],
                  }),
                ],
              }),
            ),
          }),
        ],
      }),
    ],
  })
}

function createQuestionsPanel(mode, config) {
  const questions =
    Array.isArray(config?.questions)
      ? config.questions
      : []

  return createElement('section', {
    className: 'admin-matching-panel__content animate-fade',

    children: [
      createPanelHeading(
        'Questions & options',
        `Manage the questions and answer options used by ${mode.shortLabel.toLowerCase()} matching.`,
        `${questions.length} questions`,
      ),

      ...(questions.length > 0
        ? [
            createElement('div', {
              className: 'admin-matching-questions',
              children: questions
                .slice()
                .sort(
                  (a, b) =>
                    (a.order ?? 0) -
                    (b.order ?? 0),
                )
                .map(createEditableQuestionCard),
            }),
          ]
        : [
            createElement('p', {
              className: 'admin-matching-panel__note',
              text: 'No configurable questions are available yet.',
            }),
          ]),

      createElement('button', {
        className: 'button button--primary button--medium',
        attributes: {
          type: 'button',
          'data-save-matching-draft': true,
        },
        text: 'Save draft',
      }),

      createElement('p', {
        className: 'admin-matching-panel__note',
        attributes: {
          'data-matching-draft-status': true,
          'aria-live': 'polite',
        },
        text: 'Changes are not saved yet.',
      }),
    ],
  })
}

function createRulesTable(mode) {
  return createElement('div', {
    className: 'admin-matching-rules-table-wrap',
    children: [
      createElement('table', {
        className: 'admin-matching-rules-table',
        children: [
          createElement('caption', {
            className: 'sr-only',
            text: `${mode.label} presentation rules and weights`,
          }),
          createElement('thead', {
            children: [
              createElement('tr', {
                children: [
                  createElement('th', { attributes: { scope: 'col' }, text: 'Condition' }),
                  createElement('th', { attributes: { scope: 'col' }, text: 'Target' }),
                  createElement('th', { attributes: { scope: 'col' }, text: 'Effect' }),
                  createElement('th', { attributes: { scope: 'col' }, text: 'Priority' }),
                ],
              }),
            ],
          }),
          createElement('tbody', {
            children: mode.rules.map((rule) =>
              createElement('tr', {
                children: [
                  createElement('th', {
                    attributes: { scope: 'row', 'data-label': 'Condition' },
                    text: rule.condition,
                  }),
                  createElement('td', { attributes: { 'data-label': 'Target' }, text: rule.target }),
                  createElement('td', {
                    attributes: { 'data-label': 'Effect' },
                    children: [
                      createElement('span', {
                        className: `admin-matching-effect admin-matching-effect--${rule.effectType
                          .toLowerCase()
                          .replaceAll(' ', '-')}`,
                        text: `${rule.effectType}: ${rule.effect}`,
                      }),
                    ],
                  }),
                  createElement('td', {
                    attributes: { 'data-label': 'Priority' },
                    children: [createBadge(rule.priority, 'brand')],
                  }),
                ],
              }),
            ),
          }),
        ],
      }),
    ],
  })
}

function createRulesPanel(mode, config) {
  if (!config) {
    return createElement('section', {
      className:
        'admin-matching-panel__content animate-fade',

      children: [
        createPanelHeading(
          'Rules & weights',
          'Loading matching configuration...',
          'Loading',
        ),
      ],
    })
  }

  const weights =
    config.weights ?? {}

  const supplyAdjustments =
    config.supplyAdjustments ?? {}

  const rules =
    Array.isArray(config.rules)
      ? config.rules
      : []

  const createNumberField = (
    label,
    value,
    dataAttribute,
    key,
  ) =>
    createElement('label', {
      className:
        'admin-matching-question__group',

      children: [
        createElement('strong', {
          text: label,
        }),

        createElement('input', {
          className: 'input',

          attributes: {
            type: 'number',
            step: '1',
            value: value ?? 0,
            [dataAttribute]: key,
          },
        }),
      ],
    })

  return createElement('section', {
    className:
      'admin-matching-panel__content animate-fade',

    children: [
      createPanelHeading(
        'Rules & weights',
        `Configure how ${mode.shortLabel.toLowerCase()} matching scores and filters opportunities.`,
        'Live configuration',
      ),

      createElement('div', {
        className: 'admin-matching-questions',

        children: [
          createCard({
            tagName: 'article',
            className:
              'admin-matching-question',

            children: [
              createElement('h3', {
                text: 'Scoring weights',
              }),

              createElement('p', {
                className:
                  'admin-matching-panel__note',

                text:
                  'Higher values give that criterion more influence in the final matching score.',
              }),

              createNumberField(
                'Traveller segment',
                weights.segment,
                'data-config-weight',
                'segment',
              ),

              createNumberField(
                'Investment type',
                weights.type,
                'data-config-weight',
                'type',
              ),

              createNumberField(
                'Region',
                weights.region,
                'data-config-weight',
                'region',
              ),

              createNumberField(
                'Environment',
                weights.environment,
                'data-config-weight',
                'environment',
              ),
            ],
          }),

          createCard({
            tagName: 'article',
            className:
              'admin-matching-question',

            children: [
              createElement('h3', {
                text: 'Supply adjustments',
              }),

              createElement('p', {
                className:
                  'admin-matching-panel__note',

                text:
                  'These values adjust the score according to the opportunity supply signal.',
              }),

              createNumberField(
                'Strong supply signal',
                supplyAdjustments.strong,
                'data-config-supply-adjustment',
                'strong',
              ),

              createNumberField(
                'Good supply signal',
                supplyAdjustments.good,
                'data-config-supply-adjustment',
                'good',
              ),

              createNumberField(
                'Competitive supply signal',
                supplyAdjustments.competitive,
                'data-config-supply-adjustment',
                'competitive',
              ),
            ],
          }),

          createCard({
            tagName: 'article',
            className:
              'admin-matching-question',

            children: [
              createElement('h3', {
                text: 'Matching rules',
              }),

              createElement('p', {
                className:
                  'admin-matching-panel__note',

                text:
                  'Enable or disable rules used by the published matching engine.',
              }),

              ...rules
                .slice()
                .sort(
                  (a, b) =>
                    (a.order ?? 0)
                    - (b.order ?? 0),
                )
                .map((rule) =>
                  createElement('label', {
                    className:
                      'admin-matching-question__group',

                    children: [
                      createElement('div', {
                        className:
                          'admin-matching-question__topline',

                        children: [
                          createElement('strong', {
                            text:
                              rule.label
                              ?? rule.id,
                          }),

                          createElement('input', {
                            attributes: {
                              type: 'checkbox',

                              checked:
                                rule.enabled
                                !== false,

                              'data-config-rule-enabled':
                                rule.id,
                            },
                          }),
                        ],
                      }),

                      createElement('small', {
                        text:
                          `${rule.type ?? 'rule'} · ${rule.criterion ?? 'general'}`,
                      }),
                    ],
                  }),
                ),
            ],
          }),
        ],
      }),

      createElement('button', {
        className:
          'button button--primary button--medium',

        attributes: {
          type: 'button',
          'data-save-matching-draft': true,
        },

        text: 'Save draft',
      }),

      createElement('p', {
        className:
          'admin-matching-panel__note',

        attributes: {
          'data-matching-draft-status':
            true,

          'aria-live':
            'polite',
        },

        text:
          'Changes are not saved yet.',
      }),
    ],
  })
}
function createHardFiltersPanel(mode) {
  return createElement('section', {
    className: 'admin-matching-panel__content animate-fade',
    children: [
      createPanelHeading(
        'Hard filters',
        'Required constraints remove incompatible results before weighted ranking would begin.',
        'Presentation only',
      ),
      createElement('div', {
        className: 'admin-matching-filters',
        children: mode.hardFilters.map((filter) =>
          createCard({
            tagName: 'article',
            className: 'admin-matching-filter',
            children: [
              createElement('div', {
                className: 'admin-matching-filter__topline',
                children: [
                  createBadge('Hard filter', 'terracotta'),
                  createElement('span', { text: 'Required constraint' }),
                ],
              }),
              createElement('h3', { text: filter.label }),
              createElement('p', { text: filter.condition }),
              createElement('div', {
                className: 'admin-matching-filter__result',
                children: [
                  createElement('span', { attributes: { 'aria-hidden': 'true' }, text: '→' }),
                  createElement('strong', { text: filter.result }),
                ],
              }),
            ],
          }),
        ),
      }),
    ],
  })
}

function createPreviewPanel(mode) {
  return createElement('section', {
    className: 'admin-matching-panel__content animate-fade',
    children: [
      createPanelHeading(mode.preview.title, mode.preview.description, 'Static preview'),
      createElement('div', {
        className: 'admin-matching-preview',
        children: [
          createElement('div', {
            className: 'admin-matching-preview__inputs',
            children: [
              createElement('h3', { text: 'Input criteria' }),
              createElement('dl', {
                children: mode.preview.inputs.flatMap((input) => [
                  createElement('dt', { text: input.label }),
                  createElement('dd', { text: input.value }),
                ]),
              }),
              createElement('button', {
                className: 'button button--outline button--small',
                attributes: { type: 'button', 'data-run-matching-preview': true },
                text: 'Run preview',
              }),
              createElement('p', {
                className: 'admin-matching-preview__status',
                attributes: {
                  'data-matching-preview-status': true,
                  'aria-live': 'polite',
                  'aria-atomic': 'true',
                },
                text: 'Ready to inspect presentation data.',
              }),
            ],
          }),
          createCard({
            className: `admin-matching-preview__result admin-matching-preview__result--${mode.tone}`,
            children: [
              createBadge(mode.preview.resultLabel, mode.tone),
              createElement('h3', { text: mode.preview.result }),
              createElement('p', { text: mode.preview.summary }),
              createElement('small', { text: 'Preview only · no live scoring performed' }),
            ],
          }),
        ],
      }),
    ],
  })
}

function createPublishPanel(mode) {
  return createElement('section', {
    className: 'admin-matching-panel__content admin-matching-publish animate-fade',
    children: [
      createPanelHeading(
        'Publish configuration',
        `Review the ${mode.label} presentation state before a future backend publish workflow is introduced.`,
        'Draft preview',
      ),
      createCard({
        className: 'admin-matching-publish__card',
        children: [
          createElement('div', {
            className: 'admin-matching-publish__state',
            children: [
              createElement('span', {
                className: 'admin-matching-publish__mark',
                attributes: { 'aria-hidden': 'true' },
                text: '✓',
              }),
              createElement('div', {
                children: [
                  createElement('h3', { text: `${mode.label} configuration overview` }),
                  createElement('p', {
                    text: `${mode.categories.length} categories · ${mode.questions.length} question groups · ${mode.rules.length} illustrated rules`,
                  }),
                ],
              }),
            ],
          }),
          createElement('ul', {
            className: 'admin-matching-publish__checks',
            children: [
              createElement('li', { text: 'Configuration is not connected to Firestore.' }),
              createElement('li', { text: 'No production recommendations are affected.' }),
              createElement('li', { text: 'Publishing will be enabled in a later backend phase.' }),
            ],
          }),
          createElement('button', {
  className: 'button button--primary button--medium',
  attributes: {
    type: 'button',
    'data-publish-matching-config': true,
    'aria-describedby': 'admin-matching-publish-note',
  },
  text: 'Publish changes',

          }),
          createElement('p', {
            className: 'admin-matching-panel__note',
            attributes: { id: 'admin-matching-publish-note' },
text: 'Publishing saves the current matching configuration to Firestore.',          }),
        ],
      }),
    ],
  })
}

const panelFactories = Object.freeze({
  categories: createCategoriesPanel,
  questions: createQuestionsPanel,
  rules: createRulesPanel,
  filters: createHardFiltersPanel,
  preview: createPreviewPanel,
  publish: createPublishPanel,
})

function createModeButton(mode, active) {
  return createElement('button', {
    className: [
      'admin-matching-mode',
      `admin-matching-mode--${mode.tone}`,
      active ? 'is-active' : '',
    ].filter(Boolean).join(' '),
    attributes: {
      type: 'button',
      'data-matching-mode': mode.id,
      'aria-pressed': String(active),
    },
    children: [
      createElement('span', {
        className: 'admin-matching-mode__topline',
        children: [
          createElement('strong', { text: mode.label }),
          createElement('span', { text: active ? 'Selected' : 'Choose' }),
        ],
      }),
      createElement('span', { className: 'admin-matching-mode__description', text: mode.description }),
    ],
  })
}

function createMatchingView() {
  const state = {
  mode: 'tourist',
  section: 'categories',
  configs: {
    tourist: null,
    investor: null,
  },
}
  const modeButtons = new Map()
  const sectionButtons = new Map()
  const modeOrder = Object.keys(presentation.modes)
  const sectionOrder = presentation.sections.map((section) => section.id)

  const modes = createElement('div', {
    className: 'admin-matching-modes',
    attributes: { role: 'group', 'aria-label': 'Choose matching system' },
    children: Object.values(presentation.modes).map((mode) => {
      const button = createModeButton(mode, mode.id === state.mode)
      modeButtons.set(mode.id, button)
      return button
    }),
  })

  const tabs = createElement('div', {
    className: 'admin-matching-tabs',
    attributes: { role: 'tablist', 'aria-label': 'Matching configuration sections' },
    children: presentation.sections.map((section) => {
      const active = section.id === state.section
      const button = createElement('button', {
        className: ['admin-matching-tabs__button', active ? 'is-active' : '']
          .filter(Boolean)
          .join(' '),
        attributes: {
          id: `admin-matching-tab-${section.id}`,
          type: 'button',
          role: 'tab',
          'data-matching-section': section.id,
          'aria-selected': String(active),
          'aria-controls': 'admin-matching-panel',
          tabindex: active ? '0' : '-1',
        },
        text: section.label,
      })
      sectionButtons.set(section.id, button)
      return button
    }),
  })

  const panel = createCard({
    tagName: 'div',
    className: 'admin-matching-panel',
    attributes: {
      id: 'admin-matching-panel',
      role: 'tabpanel',
      tabindex: '0',
      'aria-live': 'polite',
      'aria-atomic': 'true',
    },
  })

  const main = createElement('main', {
    className: 'admin-matching-main animate-fade',
    attributes: {
      id: 'main-content',
      tabindex: '-1',
      'aria-labelledby': 'admin-matching-title',
    },
    children: [
      createElement('header', {
        className: 'admin-matching-intro reveal',
        children: [
          createElement('div', {
            children: [
              createElement('p', {
                className: 'admin-matching-intro__eyebrow',
                text: 'Rihlati Matching Engine',
              }),
              createElement('h2', { text: 'Rule-based matching, clearly configured' }),
              createElement('p', {
                text: 'Organize criteria, weights, filters, previews, and future publishing without mixing matching logic with the interface.',
              }),
            ],
          }),
          createBadge('Presentation configuration', 'brand'),
        ],
      }),
      modes,
      createElement('section', {
        className: 'admin-matching-workspace reveal',
        attributes: { 'aria-label': 'Matching configuration workspace' },
        children: [tabs, panel],
      }),
    ],
  })

  function render() {
    const mode = presentation.modes[state.mode]

    for (const [id, button] of modeButtons) {
      const active = id === state.mode
      button.classList.toggle('is-active', active)
      button.setAttribute('aria-pressed', String(active))
      button.querySelector('.admin-matching-mode__topline span').textContent = active ? 'Selected' : 'Choose'
    }

    for (const [id, button] of sectionButtons) {
      const active = id === state.section
      button.classList.toggle('is-active', active)
      button.setAttribute('aria-selected', String(active))
      button.setAttribute('tabindex', active ? '0' : '-1')
    }

    panel.setAttribute('aria-labelledby', `admin-matching-tab-${state.section}`)
    panel.replaceChildren(
  panelFactories[state.section](
    mode,
    state.configs[state.mode],
  ),
)
  }

  function selectFromKeyboard(event, order, current, selector, update) {
    const direction = {
      ArrowRight: 1,
      ArrowDown: 1,
      ArrowLeft: -1,
      ArrowUp: -1,
    }[event.key]

    if (direction === undefined && event.key !== 'Home' && event.key !== 'End') {
      return false
    }

    event.preventDefault()
    let nextIndex = order.indexOf(current)
    if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = order.length - 1
    } else {
      nextIndex = (nextIndex + direction + order.length) % order.length
    }

    const next = order[nextIndex]
    update(next)
    render()
    main.querySelector(`[${selector}="${next}"]`)?.focus({ preventScroll: true })
    return true
  }

  async function loadConfigs() {
  const [touristConfig, investorConfig] =
    await Promise.all([
      getAdminMatchingConfig('tourist'),
      getAdminMatchingConfig('investor'),
      render()
    ])

  state.configs.tourist = touristConfig
  state.configs.investor = investorConfig
}

function handleInput(event) {
  const config = state.configs[state.mode]

  if (!config) {
    return
  }

  const weightKey =
  event.target.dataset.configWeight

if (weightKey) {
  const value =
    Number(event.target.value)

  if (
    Number.isFinite(value)
  ) {
    config.weights ??= {}
    config.weights[weightKey] =
      value
  }

  return
}


const supplyKey =
  event.target.dataset
    .configSupplyAdjustment

if (supplyKey) {
  const value =
    Number(event.target.value)

  if (
    Number.isFinite(value)
  ) {
    config.supplyAdjustments ??= {}

    config.supplyAdjustments[
      supplyKey
    ] = value
  }

  return
}


const ruleId =
  event.target.dataset
    .configRuleEnabled

if (ruleId) {
  const rule =
    config.rules?.find(
      (item) =>
        item.id === ruleId,
    )

  if (rule) {
    rule.enabled =
      event.target.checked
  }

  return
}

  const questionId =
    event.target.dataset.configQuestionId
    ?? event.target.dataset.configQuestionTitle
    ?? event.target.dataset.configQuestionHint
    ?? event.target.dataset.configQuestionEnabled

  if (!questionId) {
    return
  }

  const question = config.questions.find(
    (item) => item.id === questionId,
  )

  if (!question) {
    return
  }

  if (event.target.dataset.configQuestionTitle) {
    question.title = event.target.value
    return
  }

  if (event.target.dataset.configQuestionHint) {
    question.hint = event.target.value
    return
  }

  if (event.target.dataset.configQuestionEnabled) {
    question.enabled = event.target.checked
    return
  }

  const optionId =
    event.target.dataset.configOptionLabel
    ?? event.target.dataset.configOptionValue
    ?? event.target.dataset.configOptionEnabled

  if (!optionId) {
    return
  }

  const option = question.options.find(
    (item) => item.id === optionId,
  )

  if (!option) {
    return
  }

  if (event.target.dataset.configOptionLabel) {
    option.label = event.target.value
  }

  if (event.target.dataset.configOptionValue) {
    option.value = event.target.value
  }

  if (event.target.dataset.configOptionEnabled) {
    option.enabled = event.target.checked
  }
}

  async function handleClick(event) {
    const modeButton = event.target.closest('[data-matching-mode]')
    if (modeButton) {
      state.mode = modeButton.dataset.matchingMode
      render()
      return
    }

    const sectionButton = event.target.closest('[data-matching-section]')
    if (sectionButton) {
      state.section = sectionButton.dataset.matchingSection
      render()
      return
    }

    const saveDraftButton =
  event.target.closest(
    '[data-save-matching-draft]',
  )

if (saveDraftButton) {
  const config = state.configs[state.mode]

  if (!config) {
    return
  }

  saveDraftButton.disabled = true
  saveDraftButton.textContent = 'Saving...'

  const status = panel.querySelector(
    '[data-matching-draft-status]',
  )

  try {
    await saveAdminMatchingDraft(
      state.mode,
      config,
    )

    saveDraftButton.textContent = 'Saved'

    if (status) {
      status.textContent =
        'Draft saved successfully.'
    }
  } catch (error) {
    console.error(
      '[RIHLATI] Failed to save matching draft.',
      error,
    )

    saveDraftButton.disabled = false
    saveDraftButton.textContent = 'Save draft'

    if (status) {
      status.textContent =
        'Failed to save draft.'
    }
  }

  return
}

    const publishButton =
  event.target.closest(
    '[data-publish-matching-config]',
  )

if (publishButton) {
  const config = state.configs[state.mode]

  if (!config) {
    console.error(
      '[RIHLATI] Matching configuration is not loaded.',
    )
    return
  }

  publishButton.disabled = true
  publishButton.textContent = 'Publishing...'

  try {
    await publishAdminMatchingConfig(
      state.mode,
      config,
    )

    publishButton.textContent = 'Published'

    const note = panel.querySelector(
      '#admin-matching-publish-note',
    )

    if (note) {
      note.textContent =
        `${presentation.modes[state.mode].label} configuration published successfully.`
    }
  } catch (error) {
    console.error(
      '[RIHLATI] Matching publish failed.',
      error,
    )

    publishButton.disabled = false
    publishButton.textContent =
      'Publish changes'
  }

  return
}

    const previewButton = event.target.closest('[data-run-matching-preview]')
    if (previewButton) {
      const status = panel.querySelector('[data-matching-preview-status]')
      status.textContent = `${presentation.modes[state.mode].label} presentation preview refreshed. No live scoring was run.`
    }
  }

  function handleKeydown(event) {
    if (event.target.matches('[data-matching-mode]')) {
      selectFromKeyboard(
        event,
        modeOrder,
        state.mode,
        'data-matching-mode',
        (next) => { state.mode = next },
      )
      return
    }

    if (event.target.matches('[data-matching-section]')) {
      selectFromKeyboard(
        event,
        sectionOrder,
        state.section,
        'data-matching-section',
        (next) => { state.section = next },
      )
    }
  }

  render()
 return {
  element: main,
  handleClick,
  handleKeydown,
  handleInput,
  loadConfigs,
}
}

export function createAdminMatchingPage() {
  let mounted = false
  let destroyed = false
  let revealCleanup = () => {}

  const pageController = new AbortController()
  const matchingView = createMatchingView()
  const page = createAdminShell({
    activeSection: 'matching',
    title: 'Matching',
    titleId: 'admin-matching-title',
    main: matchingView.element,
  })

  return {
    element: page,

    mount() {
      if (mounted || destroyed) {
        return
      }

      mounted = true

      void matchingView.loadConfigs().catch((error) => {
  console.error(
    '[RIHLATI] Failed to load matching configuration.',
    error,
  )
})

      matchingView.element.addEventListener('click', matchingView.handleClick, {
        signal: pageController.signal,
      })
      matchingView.element.addEventListener('keydown', matchingView.handleKeydown, {
        signal: pageController.signal,
      })
      matchingView.element.addEventListener(
  'input',
  matchingView.handleInput,
  {
    signal: pageController.signal,
  },
)

matchingView.element.addEventListener(
  'change',
  matchingView.handleInput,
  {
    signal: pageController.signal,
  },
)
      revealCleanup = mountRevealObserver(page)
    },

    destroy() {
      if (destroyed) {
        return
      }

      destroyed = true
      pageController.abort()
      revealCleanup()
    },
  }
}
