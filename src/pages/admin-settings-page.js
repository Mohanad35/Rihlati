import { createAdminShell } from '../components/admin-shell.js'
import { createBadge, createCard } from '../components/ui.js'
import { adminSettingsPresentation as presentation } from '../data/admin-settings-presentation-data.js'
import { createElement } from '../utils/dom.js'
import { mountRevealObserver } from '../utils/reveal.js'

function getWorkspaceLabel(value) {
  return presentation.matchingWorkspaceOptions.find((option) => option.value === value)?.label
    ?? 'Tourist Matching'
}

function createSelectField({ id, name, label, description, options, value }) {
  const helpId = `${id}-help`

  return createElement('div', {
    className: 'admin-settings-field',
    children: [
      createElement('label', { attributes: { for: id }, text: label }),
      createElement('select', {
        attributes: { id, name, 'aria-describedby': helpId },
        children: options.map((option) => {
          const optionValue = typeof option === 'string' ? option : option.value
          const optionLabel = typeof option === 'string' ? option : option.label
          return createElement('option', {
            attributes: { value: optionValue, selected: optionValue === value },
            text: optionLabel,
          })
        }),
      }),
      createElement('p', {
        className: 'admin-settings-field__help',
        attributes: { id: helpId },
        text: description,
      }),
    ],
  })
}

function createToggle({ id, name, label, description, checked }) {
  return createElement('label', {
    className: 'admin-settings-toggle',
    attributes: { for: id },
    children: [
      createElement('input', {
        className: 'admin-settings-toggle__input',
        attributes: {
          id,
          name,
          type: 'checkbox',
          checked,
          'data-settings-toggle': name,
        },
      }),
      createElement('span', {
        className: 'admin-settings-toggle__control',
        attributes: { 'aria-hidden': 'true' },
      }),
      createElement('span', {
        className: 'admin-settings-toggle__text',
        children: [
          createElement('span', { className: 'admin-settings-toggle__label', text: label }),
          createElement('span', {
            className: 'admin-settings-toggle__description',
            text: description,
          }),
        ],
      }),
      createElement('span', {
        className: 'admin-settings-toggle__state',
        attributes: { 'data-settings-toggle-state': name, 'aria-hidden': 'true' },
        text: checked ? 'On' : 'Off',
      }),
    ],
  })
}

function createOverviewItem(label, value, key) {
  return createElement('div', {
    className: 'admin-settings-overview__item',
    children: [
      createElement('dt', { className: 'admin-settings-overview__label', text: label }),
      createElement('dd', {
        className: 'admin-settings-overview__value',
        attributes: { 'data-settings-overview': key },
        text: value,
      }),
    ],
  })
}

function createSettingsView() {
  const defaults = { ...presentation.defaults }
  const state = { applied: { ...defaults } }

  const form = createElement('form', {
    className: 'admin-settings-form',
    attributes: {
      'data-settings-form': true,
      'aria-describedby': 'admin-settings-persistence-note',
    },
    children: [
      createCard({
        tagName: 'fieldset',
        className: 'admin-settings-panel reveal',
        children: [
          createElement('legend', { text: 'Content workflow' }),
          createElement('div', {
            className: 'admin-settings-panel__heading',
            children: [
              createElement('h2', { text: 'Publishing defaults' }),
              createElement('p', {
                className: 'admin-settings-panel__description',
                text: 'Set a presentation default for new content and preserve the documented review step.',
              }),
            ],
          }),
          createSelectField({
            id: 'admin-settings-content-status',
            name: 'newContentStatus',
            label: 'Default status for new content',
            description: 'Uses the existing Draft and In review content states.',
            options: presentation.contentStatusOptions,
            value: defaults.newContentStatus,
          }),
          createToggle({
            id: 'admin-settings-content-review',
            name: 'reviewBeforePublish',
            label: 'Review before publishing',
            description: 'Keep new content in the review workflow before it can be published.',
            checked: defaults.reviewBeforePublish,
          }),
        ],
      }),
      createCard({
        tagName: 'fieldset',
        className: 'admin-settings-panel reveal',
        children: [
          createElement('legend', { text: 'Matching workflow' }),
          createElement('div', {
            className: 'admin-settings-panel__heading',
            children: [
              createElement('h2', { text: 'Configuration safeguards' }),
              createElement('p', {
                className: 'admin-settings-panel__description',
                text: 'Keep Tourist and Investor configuration separate and preserve the approved preview-to-publish flow.',
              }),
            ],
          }),
          createSelectField({
            id: 'admin-settings-matching-workspace',
            name: 'matchingWorkspace',
            label: 'Default matching workspace',
            description: 'Chooses which independent configuration stream opens first in this preview.',
            options: presentation.matchingWorkspaceOptions,
            value: defaults.matchingWorkspace,
          }),
          createToggle({
            id: 'admin-settings-matching-test',
            name: 'testBeforePublish',
            label: 'Test and preview before publish',
            description: 'Preserve the documented Test & Preview step before publishing configuration.',
            checked: defaults.testBeforePublish,
          }),
          createToggle({
            id: 'admin-settings-explicit-publish',
            name: 'explicitPublish',
            label: 'Require an explicit publish action',
            description: 'Keep configuration changes in preview until an Admin chooses Publish.',
            checked: defaults.explicitPublish,
          }),
        ],
      }),
      createElement('div', {
        className: 'admin-settings-actions',
        children: [
          createElement('button', {
            className: 'admin-settings-apply',
            attributes: { type: 'submit', 'data-settings-apply': true },
            text: 'Apply preview settings',
          }),
          createElement('button', {
            className: 'admin-settings-reset',
            attributes: { type: 'button', 'data-settings-reset': true },
            text: 'Reset preview',
          }),
        ],
      }),
      createElement('p', {
        className: 'admin-settings-note',
        attributes: { id: 'admin-settings-persistence-note' },
        text: 'Presentation only · settings reset when this page is destroyed or reloaded.',
      }),
    ],
  })

  const overview = createCard({
    tagName: 'aside',
    className: 'admin-settings-overview reveal',
    attributes: { 'aria-labelledby': 'admin-settings-overview-title' },
    children: [
      createElement('div', {
        className: 'admin-settings-overview__heading',
        children: [
          createElement('p', { text: 'Current preview' }),
          createElement('h2', {
            attributes: { id: 'admin-settings-overview-title' },
            text: 'Configuration summary',
          }),
        ],
      }),
      createElement('dl', {
        className: 'admin-settings-overview__list',
        children: [
          createOverviewItem('New content status', defaults.newContentStatus, 'contentStatus'),
          createOverviewItem('Content review', 'Required', 'contentReview'),
          createOverviewItem(
            'Matching workspace',
            getWorkspaceLabel(defaults.matchingWorkspace),
            'matchingWorkspace',
          ),
          createOverviewItem('Test & Preview', 'Required', 'matchingPreview'),
          createOverviewItem('Publish action', 'Explicit', 'explicitPublish'),
        ],
      }),
      createElement('section', {
        className: 'admin-settings-overview__workflow',
        attributes: { 'aria-labelledby': 'admin-settings-architecture-title' },
        children: [
          createElement('h3', {
            attributes: { id: 'admin-settings-architecture-title' },
            text: 'Approved architecture',
          }),
          createElement('ul', {
            className: 'admin-settings-overview__workflow-list',
            children: presentation.architecture.map((item) =>
              createElement('li', {
                children: [
                  createElement('span', { text: item.label }),
                  createElement('strong', { text: item.value }),
                ],
              }),
            ),
          }),
        ],
      }),
      createElement('p', {
        className: 'admin-settings-overview__status',
        children: [
          createElement('span', { attributes: { 'aria-hidden': 'true' } }),
          createElement('span', { text: 'No backend connection · preview state only' }),
        ],
      }),
    ],
  })

  const announcement = createElement('p', {
    className: 'visually-hidden',
    attributes: { 'aria-live': 'polite', 'aria-atomic': 'true' },
  })

  const main = createElement('main', {
    className: 'admin-settings-main animate-fade',
    attributes: {
      id: 'main-content',
      tabindex: '-1',
      'aria-labelledby': 'admin-settings-title',
    },
    children: [
      createElement('div', {
        className: 'admin-settings__intro reveal',
        children: [
          createElement('div', {
            className: 'admin-settings__intro-copy',
            children: [
              createElement('p', { className: 'admin-settings__eyebrow', text: 'Platform configuration' }),
              createElement('h2', { text: 'Workflow settings' }),
              createElement('p', {
                text: 'Preview practical defaults for the documented Content and Matching workflows.',
              }),
            ],
          }),
          createBadge('Presentation only', 'brand'),
        ],
      }),
      createElement('div', {
        className: 'admin-settings__layout',
        children: [form, overview],
      }),
      announcement,
    ],
  })

  function readForm() {
    const fields = new FormData(form)
    return {
      newContentStatus: String(fields.get('newContentStatus') ?? defaults.newContentStatus),
      reviewBeforePublish: fields.has('reviewBeforePublish'),
      matchingWorkspace: String(fields.get('matchingWorkspace') ?? defaults.matchingWorkspace),
      testBeforePublish: fields.has('testBeforePublish'),
      explicitPublish: fields.has('explicitPublish'),
    }
  }

  function updateToggleStates() {
    for (const input of form.querySelectorAll('[data-settings-toggle]')) {
      const stateLabel = form.querySelector(
        `[data-settings-toggle-state="${input.dataset.settingsToggle}"]`,
      )
      if (stateLabel) {
        stateLabel.textContent = input.checked ? 'On' : 'Off'
      }
    }
  }

  function renderOverview() {
    const values = {
      contentStatus: state.applied.newContentStatus,
      contentReview: state.applied.reviewBeforePublish ? 'Required' : 'Optional',
      matchingWorkspace: getWorkspaceLabel(state.applied.matchingWorkspace),
      matchingPreview: state.applied.testBeforePublish ? 'Required' : 'Optional',
      explicitPublish: state.applied.explicitPublish ? 'Explicit' : 'Preview only',
    }

    for (const [key, value] of Object.entries(values)) {
      const output = overview.querySelector(`[data-settings-overview="${key}"]`)
      if (output) {
        output.textContent = value
      }
    }
  }

  function handleChange(event) {
    if (!event.target.closest('[data-settings-toggle]')) {
      return
    }
    updateToggleStates()
  }

  function handleSubmit(event) {
    if (!event.target.closest('[data-settings-form]')) {
      return
    }

    event.preventDefault()
    state.applied = readForm()
    renderOverview()
    announcement.textContent = 'Settings preview applied. No settings were saved.'
    form.querySelector('[data-settings-apply]')?.focus({ preventScroll: true })
  }

  function handleClick(event) {
    const resetButton = event.target.closest('[data-settings-reset]')
    if (!resetButton) {
      return
    }

    form.reset()
    state.applied = { ...defaults }
    updateToggleStates()
    renderOverview()
    announcement.textContent = 'Settings preview reset to the documented defaults. Nothing was saved.'
    resetButton.focus({ preventScroll: true })
  }

  return { element: main, handleChange, handleClick, handleSubmit }
}

export function createAdminSettingsPage() {
  let mounted = false
  let destroyed = false
  let revealCleanup = () => {}

  const pageController = new AbortController()
  const settingsView = createSettingsView()
  const page = createAdminShell({
    activeSection: 'settings',
    title: 'Settings',
    titleId: 'admin-settings-title',
    main: settingsView.element,
  })

  return {
    element: page,

    mount() {
      if (mounted || destroyed) {
        return
      }

      mounted = true
      settingsView.element.addEventListener('change', settingsView.handleChange, {
        signal: pageController.signal,
      })
      settingsView.element.addEventListener('click', settingsView.handleClick, {
        signal: pageController.signal,
      })
      settingsView.element.addEventListener('submit', settingsView.handleSubmit, {
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
