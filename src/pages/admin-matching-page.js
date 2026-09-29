import { createAdminShell } from '../components/admin-shell.js'
import { createBadge, createCard } from '../components/ui.js'
import { adminMatchingPresentation as presentation } from '../data/admin-matching-presentation-data.js'
import { createElement } from '../utils/dom.js'
import { mountRevealObserver } from '../utils/reveal.js'

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

function createQuestionsPanel(mode) {
  return createElement('section', {
    className: 'admin-matching-panel__content animate-fade',
    children: [
      createPanelHeading(
        'Questions & options',
        `A compact view of ${mode.shortLabel.toLowerCase()} inputs and the configuration areas they affect.`,
        'Presentation data',
      ),
      createElement('div', {
        className: 'admin-matching-questions',
        children: mode.questions.map(createQuestionCard),
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

function createRulesPanel(mode) {
  return createElement('section', {
    className: 'admin-matching-panel__content animate-fade',
    children: [
      createPanelHeading(
        'Rules & weights',
        'Conditions remain separate from rendering so a future engine can evaluate them independently.',
        'Rule-based + weighted',
      ),
      createElement('ul', {
        className: 'admin-matching-effect-coverage',
        attributes: { 'aria-label': 'Supported matching effect types' },
        children: mode.effectCoverage.map((effect) =>
          createElement('li', {
            children: [
              createElement('span', { text: effect.label }),
              createElement('small', { text: effect.state }),
            ],
          }),
        ),
      }),
      createRulesTable(mode),
      createElement('p', {
        className: 'admin-matching-panel__note',
        text: 'Illustrative configuration only · no production score is calculated on this screen.',
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
              disabled: true,
              'aria-describedby': 'admin-matching-publish-note',
            },
            text: 'Publish changes',
          }),
          createElement('p', {
            className: 'admin-matching-panel__note',
            attributes: { id: 'admin-matching-publish-note' },
            text: 'Publishing is unavailable while this screen uses presentation-only data.',
          }),
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
  const state = { mode: 'tourist', section: 'categories' }
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
    panel.replaceChildren(panelFactories[state.section](mode))
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

  function handleClick(event) {
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
  return { element: main, handleClick, handleKeydown }
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
      matchingView.element.addEventListener('click', matchingView.handleClick, {
        signal: pageController.signal,
      })
      matchingView.element.addEventListener('keydown', matchingView.handleKeydown, {
        signal: pageController.signal,
      })
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
