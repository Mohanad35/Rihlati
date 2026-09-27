import { homeAssets } from '../assets/home-assets.js'
import {
  createArrow,
  createBadge,
  createCard,
  createEyebrow,
  createIcon,
  createRouteLine,
} from '../components/ui.js'
import { routePaths } from '../data/home-presentation-data.js'
import { createElement } from '../utils/dom.js'

const GENERATING_PATH = '/t-generating'
const STEP_LABELS = Object.freeze(['Who', 'Experiences', 'Style', 'Pace', 'Final'])

const QUESTIONS = Object.freeze([
  {
    key: 'who',
    title: 'Who are you travelling as?',
    hint: 'This helps us set the tone and pace.',
    type: 'option',
    options: [
      { label: 'Solo explorer', description: 'Freedom and flexibility', icon: 'compass' },
      { label: 'Couple', description: 'Shared, memorable moments', icon: 'heart' },
      { label: 'Family', description: 'Comfort and easy pace', icon: 'users' },
      { label: 'Friends', description: 'Adventure together', icon: 'star' },
    ],
  },
  {
    key: 'exp',
    title: 'What kind of experiences do you enjoy?',
    hint: 'Pick as many as you like.',
    type: 'chip',
    multi: true,
    options: [
      'Ancient heritage',
      'Desert & stars',
      'Nature & hikes',
      'Local food',
      'Wellness & spa',
      'Culture & museums',
      'Beaches & water',
      'Markets & crafts',
    ].map((label) => ({ label })),
  },
  {
    key: 'style',
    title: 'Your travel style and trip mood',
    hint: 'What should this trip feel like?',
    type: 'option',
    options: [
      { label: 'Iconic & essential', description: 'The must-see wonders', icon: 'star' },
      { label: 'Off the beaten path', description: 'Quiet, local, authentic', icon: 'leaf' },
      { label: 'Balanced mix', description: 'Highlights with room to breathe', icon: 'compass' },
      { label: 'Immersive & slow', description: 'Fewer places, deeper stays', icon: 'heart' },
    ],
  },
  {
    key: 'pace',
    title: 'Duration, pace & environment',
    hint: 'How long and how fast?',
    type: 'option',
    options: [
      { label: 'Short & relaxed', description: '3–4 days, gentle pace', icon: 'clock' },
      { label: 'Balanced week', description: '5–7 days, steady rhythm', icon: 'map' },
      { label: 'Full discovery', description: '8+ days, see it all', icon: 'compass' },
    ],
  },
  {
    key: 'final',
    title: 'A few final preferences',
    hint: 'Last touches to tune your route.',
    type: 'chip',
    multi: true,
    options: [
      'Prefer warm weather',
      'Overnight in the desert',
      'Keep travel time low',
      'Include a rest day',
      'Sunset moments',
      'Photography spots',
    ].map((label) => ({ label })),
  },
])

function createQuestionnaireLogo() {
  return createElement('a', {
    className: 'tourist-questionnaire__logo',
    attributes: {
      href: routePaths.home,
      'data-router-link': true,
      'aria-label': 'Rihlati home',
    },
    children: [
      createElement('img', {
        attributes: {
          src: homeAssets.logo,
          alt: 'Rihlati — رحلتي — Your Journey in Jordan',
          draggable: 'false',
          fetchpriority: 'high',
          decoding: 'async',
        },
      }),
    ],
  })
}

function createStepper(currentStep) {
  return createElement('ol', {
    className: 'questionnaire-stepper',
    attributes: { 'aria-label': 'Questionnaire progress' },
    children: STEP_LABELS.map((label, index) => {
      const done = index < currentStep
      const active = index === currentStep

      return createElement('li', {
        className: [
          'questionnaire-stepper__item',
          done ? 'is-done' : '',
          active ? 'is-active' : '',
        ].filter(Boolean).join(' '),
        attributes: {
          ...(active ? { 'aria-current': 'step' } : {}),
          'aria-label': `${label}${done ? ', completed' : active ? ', current step' : ''}`,
        },
        children: [
          createElement('span', {
            className: 'questionnaire-stepper__identity',
            attributes: { 'aria-hidden': 'true' },
            children: [
              createElement('span', {
                className: 'questionnaire-stepper__circle',
                children: done
                  ? [createIcon('check', { className: 'questionnaire-stepper__check' })]
                  : [document.createTextNode(String(index + 1))],
              }),
              createElement('span', { className: 'questionnaire-stepper__label', text: label }),
            ],
          }),
          ...(index < STEP_LABELS.length - 1
            ? [
                createElement('span', {
                  className: 'questionnaire-stepper__connector',
                  attributes: { 'aria-hidden': 'true' },
                  children: [createElement('span')],
                }),
              ]
            : []),
        ],
      })
    }),
  })
}

function createOptionCard(option, selected) {
  return createElement('button', {
    className: ['questionnaire-option', selected ? 'is-selected' : ''].filter(Boolean).join(' '),
    attributes: {
      type: 'button',
      'data-questionnaire-action': 'select',
      'data-option': option.label,
      'aria-pressed': selected ? 'true' : 'false',
    },
    children: [
      createElement('span', {
        className: 'questionnaire-option__icon',
        attributes: { 'aria-hidden': 'true' },
        children: [createIcon(option.icon)],
      }),
      createElement('span', {
        className: 'questionnaire-option__body',
        children: [
          createElement('span', {
            className: 'questionnaire-option__heading',
            children: [
              createElement('span', { className: 'questionnaire-option__label', text: option.label }),
              createElement('span', {
                className: 'questionnaire-option__indicator',
                attributes: { 'aria-hidden': 'true' },
                children: selected
                  ? [createIcon('check', { className: 'questionnaire-option__check' })]
                  : [],
              }),
            ],
          }),
          createElement('span', {
            className: 'questionnaire-option__description',
            text: option.description,
          }),
        ],
      }),
    ],
  })
}

function createChip(option, selected) {
  return createElement('button', {
    className: ['questionnaire-chip', selected ? 'is-selected' : ''].filter(Boolean).join(' '),
    text: option.label,
    attributes: {
      type: 'button',
      'data-questionnaire-action': 'select',
      'data-option': option.label,
      'aria-pressed': selected ? 'true' : 'false',
    },
  })
}

function createControlButton({ label, action, variant = 'primary', arrow = false }) {
  return createElement('button', {
    className: `button button--${variant}`,
    attributes: {
      type: 'button',
      'data-questionnaire-action': action,
    },
    children: [
      createElement('span', { className: 'button__label', text: label }),
      ...(arrow ? [createArrow()] : []),
    ],
  })
}

export function createTouristQuestionnairePage({ router } = {}) {
  if (!router || typeof router.navigate !== 'function') {
    throw new TypeError('Tourist Questionnaire requires the application router.')
  }

  let currentStep = 0
  let direction = 'right'
  let answers = {}
  let mounted = false
  let destroyed = false

  const pageController = new AbortController()
  const stepBadge = createBadge(`Step 1 of ${QUESTIONS.length}`, 'sand', 'tourist-questionnaire__badge')
  stepBadge.setAttribute('aria-live', 'polite')

  const stepperHost = createElement('div', { className: 'tourist-questionnaire__stepper-host' })
  const questionHost = createElement('div', { className: 'tourist-questionnaire__question-host' })
  const progressFill = createElement('span', { className: 'questionnaire-progress__fill' })
  const progressTrack = createElement('div', {
    className: 'questionnaire-progress',
    attributes: {
      role: 'progressbar',
      'aria-label': 'Questionnaire completion',
      'aria-valuemin': '0',
      'aria-valuemax': '100',
      'aria-valuenow': '20',
      'aria-valuetext': `Step 1 of ${QUESTIONS.length}`,
    },
    children: [progressFill],
  })

  const backButton = createControlButton({
    label: 'Back',
    action: 'back',
    variant: 'outline',
  })
  const continueButton = createControlButton({
    label: 'Continue',
    action: 'continue',
    arrow: true,
  })

  const questionCard = createCard({
    tagName: 'section',
    className: 'tourist-questionnaire__card',
    attributes: { 'aria-labelledby': 'questionnaire-question-title' },
    children: [
      createElement('div', {
        className: 'tourist-questionnaire__route-art',
        attributes: { 'aria-hidden': 'true' },
        children: [createRouteLine({ animate: false })],
      }),
      questionHost,
    ],
  })

  const page = createElement('div', {
    className: 'tourist-questionnaire-page',
    children: [
      createElement('main', {
        className: 'tourist-questionnaire',
        attributes: { id: 'main-content', tabindex: '-1' },
        children: [
          createElement('header', {
            className: 'tourist-questionnaire__header',
            children: [
              createElement('div', {
                className: 'tourist-questionnaire__header-row',
                children: [createQuestionnaireLogo(), stepBadge],
              }),
              stepperHost,
            ],
          }),
          questionCard,
          createElement('div', {
            className: 'tourist-questionnaire__controls',
            children: [
              backButton,
              createElement('div', {
                className: 'tourist-questionnaire__progress-wrap',
                children: [progressTrack],
              }),
              continueButton,
            ],
          }),
        ],
      }),
    ],
  })

  const getCurrentQuestion = () => QUESTIONS[currentStep]

  const isSelected = (label) => {
    const question = getCurrentQuestion()
    const answer = answers[question.key]

    return question.multi
      ? (Array.isArray(answer) ? answer : []).includes(label)
      : answer === label
  }

  const canContinue = () => {
    const question = getCurrentQuestion()
    const answer = answers[question.key]

    return question.multi
      ? Array.isArray(answer) && answer.length > 0
      : typeof answer === 'string' && answer.length > 0
  }

  const syncAnswerControls = () => {
    questionHost.querySelectorAll('[data-option]').forEach((control) => {
      if (!(control instanceof HTMLButtonElement)) {
        return
      }

      const selected = isSelected(control.dataset.option)
      control.classList.toggle('is-selected', selected)
      control.setAttribute('aria-pressed', selected ? 'true' : 'false')

      const indicator = control.querySelector('.questionnaire-option__indicator')
      if (indicator) {
        indicator.replaceChildren(
          ...(selected ? [createIcon('check', { className: 'questionnaire-option__check' })] : []),
        )
      }
    })

    continueButton.disabled = !canContinue()
  }

  const renderStep = ({ focusHeading = false } = {}) => {
    const question = getCurrentQuestion()
    const progress = Math.round(((currentStep + 1) / QUESTIONS.length) * 100)
    const options = question.options.map((option) =>
      question.type === 'option'
        ? createOptionCard(option, isSelected(option.label))
        : createChip(option, isSelected(option.label)),
    )

    const panel = createElement('div', {
      className: `tourist-questionnaire__question animate-slide-${direction}`,
      children: [
        createEyebrow(STEP_LABELS[currentStep]),
        createElement('h1', {
          className: 'tourist-questionnaire__title',
          text: question.title,
          attributes: { id: 'questionnaire-question-title', tabindex: '-1' },
        }),
        createElement('p', {
          className: 'tourist-questionnaire__hint',
          text: question.hint,
          attributes: { id: 'questionnaire-question-hint' },
        }),
        createElement('div', {
          className: question.type === 'option'
            ? 'tourist-questionnaire__options'
            : 'tourist-questionnaire__chips',
          attributes: {
            role: 'group',
            'aria-labelledby': 'questionnaire-question-title',
            'aria-describedby': 'questionnaire-question-hint',
          },
          children: options,
        }),
      ],
    })

    stepBadge.textContent = `Step ${currentStep + 1} of ${QUESTIONS.length}`
    stepperHost.replaceChildren(createStepper(currentStep))
    questionHost.replaceChildren(panel)
    progressTrack.setAttribute('aria-valuenow', String(progress))
    progressTrack.setAttribute('aria-valuetext', `Step ${currentStep + 1} of ${QUESTIONS.length}`)
    progressFill.style.width = `${progress}%`
    continueButton.querySelector('.button__label').textContent =
      currentStep === QUESTIONS.length - 1 ? 'Build my journey' : 'Continue'
    syncAnswerControls()

    if (focusHeading) {
      panel.querySelector('h1')?.focus({ preventScroll: true })
    }
  }

  const selectOption = (label) => {
    const question = getCurrentQuestion()

    if (question.multi) {
      const current = Array.isArray(answers[question.key]) ? answers[question.key] : []
      answers = {
        ...answers,
        [question.key]: current.includes(label)
          ? current.filter((item) => item !== label)
          : [...current, label],
      }
    } else {
      answers = { ...answers, [question.key]: label }
    }

    syncAnswerControls()
  }

  const navigate = (path) => {
    void router.navigate(path).catch((error) => {
      console.error('[RIHLATI] Questionnaire navigation failed.', error)
    })
  }

  const handleClick = (event) => {
    const target = event.target instanceof Element
      ? event.target.closest('[data-questionnaire-action]')
      : null

    if (!(target instanceof HTMLButtonElement)) {
      return
    }

    const action = target.dataset.questionnaireAction

    if (action === 'select') {
      selectOption(target.dataset.option)
      return
    }

    if (action === 'back') {
      if (currentStep === 0) {
        navigate(routePaths.touristEntry)
        return
      }

      direction = 'left'
      currentStep -= 1
      renderStep({ focusHeading: true })
      return
    }

    if (action === 'continue' && canContinue()) {
      if (currentStep === QUESTIONS.length - 1) {
        navigate(GENERATING_PATH)
        return
      }

      direction = 'right'
      currentStep += 1
      renderStep({ focusHeading: true })
    }
  }

  renderStep()

  return {
    element: page,

    mount() {
      if (mounted || destroyed) {
        return
      }

      mounted = true
      page.addEventListener('click', handleClick, { signal: pageController.signal })
    },

    destroy() {
      if (!mounted || destroyed) {
        return
      }

      destroyed = true
      pageController.abort()
      answers = {}
    },
  }
}
