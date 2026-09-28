import { homeAssets } from '../assets/home-assets.js'
import {
  createArrow,
  createBadge,
  createCard,
  createEyebrow,
  createIcon,
} from '../components/ui.js'
import { routePaths } from '../data/home-presentation-data.js'
import { createElement } from '../utils/dom.js'

const NEXT_PATH = '/ei-match'
const STEP_LABELS = Object.freeze(['Business', 'Location', 'Audience', 'Category', 'Experience'])

const QUESTIONS = Object.freeze([
  {
    key: 'biz',
    title: 'What type of business do you run?',
    type: 'option',
    options: [
      { label: 'Accommodation', icon: 'building' },
      { label: 'Tour / experience', icon: 'compass' },
      { label: 'Wellness / spa', icon: 'heart' },
      { label: 'Food & hospitality', icon: 'star' },
    ],
  },
  {
    key: 'loc',
    title: 'Where are you located?',
    type: 'option',
    options: [
      { label: 'Southern desert', icon: 'map' },
      { label: 'Jordan Valley', icon: 'map' },
      { label: 'Northern highlands', icon: 'map' },
      { label: 'Central / Amman', icon: 'map' },
    ],
  },
  {
    key: 'aud',
    title: 'Who is your current audience?',
    hint: 'Select any.',
    type: 'chip',
    multi: true,
    options: ['Domestic', 'Regional', 'International', 'Groups', 'Independent travellers']
      .map((label) => ({ label })),
  },
  {
    key: 'cat',
    title: 'Your tourism category',
    type: 'chip',
    multi: true,
    options: ['Adventure', 'Heritage', 'Wellness', 'Nature', 'Family', 'Luxury']
      .map((label) => ({ label })),
  },
  {
    key: 'exp',
    title: 'What experience do you offer?',
    hint: 'Select any.',
    type: 'chip',
    multi: true,
    options: [
      'Overnight stay',
      'Guided tour',
      'Dining',
      'Activities',
      'Relaxation',
      'Cultural immersion',
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
    attributes: { 'aria-label': 'Business discovery progress' },
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
      'data-business-discovery-action': 'select',
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
      'data-business-discovery-action': 'select',
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
      'data-business-discovery-action': action,
    },
    children: [
      createElement('span', { className: 'button__label', text: label }),
      ...(arrow ? [createArrow()] : []),
    ],
  })
}

export function createBusinessDiscoveryPage({ router } = {}) {
  if (!router || typeof router.navigate !== 'function') {
    throw new TypeError('Business Discovery requires the application router.')
  }

  let currentStep = 0
  let direction = 'right'
  let answers = {}
  let mounted = false
  let destroyed = false

  const pageController = new AbortController()
  const stepBadge = createBadge(
    `Existing business · Step 1/${QUESTIONS.length}`,
    'brand',
    'tourist-questionnaire__badge',
  )
  stepBadge.setAttribute('aria-live', 'polite')

  const stepperHost = createElement('div', { className: 'tourist-questionnaire__stepper-host' })
  const questionHost = createElement('div', { className: 'tourist-questionnaire__question-host' })
  const progressFill = createElement('span', { className: 'questionnaire-progress__fill' })
  const progressTrack = createElement('div', {
    className: 'questionnaire-progress',
    attributes: {
      role: 'progressbar',
      'aria-label': 'Business discovery completion',
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
    attributes: { 'aria-labelledby': 'business-discovery-question-title' },
    children: [questionHost],
  })

  const page = createElement('div', {
    className: 'business-discovery-page tourist-questionnaire-page paper',
    children: [
      createElement('main', {
        className: 'business-discovery tourist-questionnaire',
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
    const hintId = question.hint ? 'business-discovery-question-hint' : undefined

    const panel = createElement('div', {
      className: `tourist-questionnaire__question animate-slide-${direction}`,
      children: [
        createEyebrow(STEP_LABELS[currentStep]),
        createElement('h1', {
          className: 'tourist-questionnaire__title',
          text: question.title,
          attributes: { id: 'business-discovery-question-title', tabindex: '-1' },
        }),
        ...(question.hint
          ? [
              createElement('p', {
                className: 'tourist-questionnaire__hint',
                text: question.hint,
                attributes: { id: hintId },
              }),
            ]
          : []),
        createElement('div', {
          className: question.type === 'option'
            ? 'tourist-questionnaire__options'
            : 'tourist-questionnaire__chips',
          attributes: {
            role: 'group',
            'aria-labelledby': 'business-discovery-question-title',
            ...(hintId ? { 'aria-describedby': hintId } : {}),
          },
          children: options,
        }),
      ],
    })

    stepBadge.textContent = `Existing business · Step ${currentStep + 1}/${QUESTIONS.length}`
    stepperHost.replaceChildren(createStepper(currentStep))
    questionHost.replaceChildren(panel)
    progressTrack.setAttribute('aria-valuenow', String(progress))
    progressTrack.setAttribute('aria-valuetext', `Step ${currentStep + 1} of ${QUESTIONS.length}`)
    progressFill.style.width = `${progress}%`
    continueButton.querySelector('.button__label').textContent =
      currentStep === QUESTIONS.length - 1 ? 'See tourist match' : 'Continue'
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
      console.error('[RIHLATI] Business Discovery navigation failed.', error)
    })
  }

  const handleClick = (event) => {
    const target = event.target instanceof Element
      ? event.target.closest('[data-business-discovery-action]')
      : null

    if (!(target instanceof HTMLButtonElement)) {
      return
    }

    const action = target.dataset.businessDiscoveryAction

    if (action === 'select') {
      selectOption(target.dataset.option)
      return
    }

    if (action === 'back') {
      if (currentStep === 0) {
        navigate(routePaths.investorEntry)
        return
      }

      direction = 'left'
      currentStep -= 1
      renderStep({ focusHeading: true })
      return
    }

    if (action === 'continue' && canContinue()) {
      if (currentStep === QUESTIONS.length - 1) {
        navigate(NEXT_PATH)
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
