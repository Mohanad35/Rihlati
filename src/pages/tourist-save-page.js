import { homeAssets } from '../assets/home-assets.js'
import { createSiteHeader, mountSiteHeader } from '../components/site-shell.js'
import {
  createButtonLink,
  createCard,
  createEyebrow,
  createIcon,
} from '../components/ui.js'
import { routePaths } from '../data/home-presentation-data.js'
import { createElement } from '../utils/dom.js'

const JOURNEY_PATH = '/t-journey'

const saveGateFields = Object.freeze([
  Object.freeze({
    id: 'save-gate-full-name',
    label: 'Full name',
    type: 'text',
    autocomplete: 'off',
    error: 'Enter your full name.',
  }),
  Object.freeze({
    id: 'save-gate-email',
    label: 'Email address',
    type: 'email',
    autocomplete: 'off',
    error: 'Enter your email address.',
    typeError: 'Enter a valid email address.',
  }),
  Object.freeze({
    id: 'save-gate-password',
    label: 'Password',
    type: 'password',
    autocomplete: 'off',
    error: 'Enter a password.',
  }),
])

function createJourneyPreview() {
  return createElement('div', {
    className: 'tourist-save-preview',
    children: [
      createElement('img', {
        className: 'tourist-save-preview__image',
        attributes: {
          src: homeAssets.petra,
          alt: '',
          'aria-hidden': 'true',
          decoding: 'async',
        },
      }),
      createElement('div', {
        className: 'tourist-save-preview__copy',
        children: [
          createElement('strong', { text: 'Heritage & Desert Escape' }),
          createElement('span', { text: '4 days · 4 stops · balanced pace' }),
        ],
      }),
    ],
  })
}

function createSaveExplanation() {
  return createElement('div', {
    className: 'tourist-save__copy animate-rise',
    children: [
      createEyebrow('Save your journey'),
      createElement('h1', {
        className: 'tourist-save__title',
        attributes: { id: 'tourist-save-title' },
        text: 'Keep this route — create an account or sign in.',
      }),
      createElement('p', {
        className: 'tourist-save__lead',
        text: 'You explored as a guest. To save your Heritage & Desert Escape and pick up where you left off, we’ll preserve it to your account.',
      }),
      createJourneyPreview(),
    ],
  })
}

function createAccountModeDisplay() {
  return createElement('div', {
    className: 'tourist-save-modes',
    attributes: { 'aria-label': 'Account access mode' },
    children: [
      createElement('span', {
        className: 'tourist-save-modes__item is-active',
        text: 'Create account',
        attributes: { 'aria-current': 'true' },
      }),
      createElement('span', {
        className: 'tourist-save-modes__item',
        text: 'Sign in',
      }),
    ],
  })
}

function createFormField(field) {
  const errorId = `${field.id}-error`
  const input = createElement('input', {
    className: 'tourist-save-field__input',
    attributes: {
      id: field.id,
      type: field.type,
      placeholder: field.label,
      required: true,
      autocomplete: field.autocomplete,
      'aria-describedby': errorId,
      'data-save-gate-field': true,
      ...(field.typeError ? { 'data-type-error': field.typeError } : {}),
      'data-required-error': field.error,
    },
  })

  return createElement('div', {
    className: 'tourist-save-field',
    children: [
      createElement('label', {
        className: 'tourist-save-field__label',
        text: field.label,
        attributes: { for: field.id },
      }),
      input,
      createElement('p', {
        className: 'tourist-save-field__error',
        attributes: {
          id: errorId,
          'aria-live': 'polite',
        },
      }),
    ],
  })
}

function createSaveFormCard() {
  return createCard({
    tagName: 'div',
    className: 'tourist-save-card animate-scale-in',
    children: [
      createAccountModeDisplay(),
      createElement('form', {
        className: 'tourist-save-form',
        attributes: {
          'aria-label': 'Create account and save journey',
          autocomplete: 'off',
          novalidate: true,
          'data-save-gate-form': true,
        },
        children: [
          createElement('div', {
            className: 'tourist-save-form__fields',
            children: saveGateFields.map(createFormField),
          }),
          createElement('button', {
            className: 'button button--primary button--full tourist-save-form__submit',
            text: 'Create account & save',
            attributes: { type: 'submit' },
          }),
          createElement('p', {
            className: 'tourist-save-form__note',
            text: 'Prototype — no real account is created.',
          }),
        ],
      }),
    ],
  })
}

function createGateState() {
  return createElement('div', {
    className: 'tourist-save__gate',
    children: [createSaveExplanation(), createSaveFormCard()],
  })
}

// Presentation-only prototype state. It does not create an account, transmit
// credentials, or persist a journey, and can be replaced by Firebase later.
function createPresentationSuccessState() {
  const heading = createElement('h1', {
    className: 'tourist-save-success__title',
    text: 'Journey saved',
    attributes: {
      id: 'tourist-save-title',
      tabindex: '-1',
    },
  })

  const element = createElement('div', {
    className: 'tourist-save-success animate-scale-in',
    children: [
      createElement('span', {
        className: 'tourist-save-success__icon animate-pop',
        attributes: { 'aria-hidden': 'true' },
        children: [createIcon('check')],
      }),
      heading,
      createElement('p', {
        className: 'tourist-save-success__copy',
        text: 'Your Heritage & Desert Escape is in My Journeys.',
      }),
      createElement('div', {
        className: 'tourist-save-success__actions',
        children: [
          createButtonLink({
            href: routePaths.myJourneys,
            label: 'Go to My Journeys',
            arrow: true,
          }),
          createButtonLink({
            href: JOURNEY_PATH,
            label: 'Back to journey',
            variant: 'outline',
          }),
        ],
      }),
    ],
  })

  return { element, heading }
}

function getFieldError(input) {
  if (input.validity.valueMissing) {
    return input.dataset.requiredError ?? 'Complete this field.'
  }

  if (input.validity.typeMismatch) {
    return input.dataset.typeError ?? 'Enter a valid value.'
  }

  return ''
}

function renderFieldValidation(input) {
  const error = getFieldError(input)
  const errorElement = document.getElementById(`${input.id}-error`)

  if (error) {
    input.setAttribute('aria-invalid', 'true')
  } else {
    input.removeAttribute('aria-invalid')
  }

  if (errorElement) {
    errorElement.textContent = error
  }

  return !error
}

export function createTouristSavePage({ path = '/t-save' } = {}) {
  let mounted = false
  let destroyed = false
  let saved = false

  const header = createSiteHeader({ currentPath: path })
  const content = createElement('div', {
    className: 'tourist-save__content',
    children: [createGateState()],
  })
  const main = createElement('main', {
    className: 'tourist-save-main',
    attributes: { id: 'main-content', tabindex: '-1' },
    children: [
      createElement('section', {
        className: 'tourist-save',
        attributes: { 'aria-labelledby': 'tourist-save-title' },
        children: [content],
      }),
    ],
  })
  const page = createElement('div', {
    className: 'tourist-save-page paper',
    children: [header, main],
  })
  const pageController = new AbortController()
  let headerCleanup = () => {}

  const renderSuccess = () => {
    if (saved || destroyed) {
      return
    }

    saved = true
    const success = createPresentationSuccessState()
    content.replaceChildren(success.element)
    window.requestAnimationFrame(() => {
      if (!destroyed && success.heading.isConnected) {
        success.heading.focus({ preventScroll: true })
      }
    })
  }

  const handleSubmit = (event) => {
    const form = event.target

    if (!(form instanceof HTMLFormElement) || !form.matches('[data-save-gate-form]')) {
      return
    }

    event.preventDefault()
    const fields = [...form.querySelectorAll('[data-save-gate-field]')]
    let firstInvalid = null

    fields.forEach((input) => {
      const valid = renderFieldValidation(input)

      if (!valid && firstInvalid === null) {
        firstInvalid = input
      }
    })

    if (firstInvalid) {
      firstInvalid.focus()
      return
    }

    form.reset()
    renderSuccess()
  }

  const handleInput = (event) => {
    const input = event.target

    if (!(input instanceof HTMLInputElement) || !input.matches('[data-save-gate-field]')) {
      return
    }

    if (input.hasAttribute('aria-invalid')) {
      renderFieldValidation(input)
    }
  }

  return {
    element: page,

    mount() {
      if (mounted || destroyed) {
        return
      }

      mounted = true
      headerCleanup = mountSiteHeader(header, { signal: pageController.signal })
      page.addEventListener('submit', handleSubmit, { signal: pageController.signal })
      page.addEventListener('input', handleInput, { signal: pageController.signal })
    },

    destroy() {
      if (destroyed) {
        return
      }

      destroyed = true
      page.querySelector('[data-save-gate-form]')?.reset()
      pageController.abort()
      headerCleanup()
    },
  }
}
