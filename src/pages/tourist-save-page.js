import { homeAssets } from '../assets/home-assets.js'
import { createSiteHeader, mountSiteHeader } from '../components/site-shell.js'
import {
  createButtonLink,
  createCard,
  createEyebrow,
  createIcon,
} from '../components/ui.js'
import { routePaths } from '../data/home-presentation-data.js'
import {
  getCurrentUser,
  observeAuthState,
  registerWithEmailPassword,
  signInWithEmailPassword,
} from '../services/auth-service.js'
import {
  createUserProfile,
  getUserProfile,
} from '../repositories/user-repository.js'
import { createElement } from '../utils/dom.js'

const JOURNEY_PATH = '/t-journey'
const ACCOUNT_MODES = Object.freeze({
  REGISTER: 'register',
  SIGN_IN: 'sign-in',
})

const saveGateFields = Object.freeze([
  Object.freeze({
    id: 'save-gate-full-name',
    name: 'displayName',
    label: 'Full name',
    type: 'text',
    autocomplete: 'name',
    error: 'Enter your full name.',
  }),
  Object.freeze({
    id: 'save-gate-email',
    name: 'email',
    label: 'Email address',
    type: 'email',
    autocomplete: 'email',
    error: 'Enter your email address.',
    typeError: 'Enter a valid email address.',
  }),
  Object.freeze({
    id: 'save-gate-password',
    name: 'password',
    label: 'Password',
    type: 'password',
    autocomplete: 'new-password',
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
        text: 'You explored as a guest. Create an account or sign in now so this journey can be connected to your account when journey saving is enabled.',
      }),
      createJourneyPreview(),
    ],
  })
}

function createAccountModeButton({ label, mode, active = false }) {
  return createElement('button', {
    className: `tourist-save-modes__item${active ? ' is-active' : ''}`,
    text: label,
    attributes: {
      type: 'button',
      'data-save-gate-mode': mode,
      'aria-pressed': active,
    },
  })
}

function createAccountModeDisplay() {
  return createElement('div', {
    className: 'tourist-save-modes',
    attributes: {
      role: 'group',
      'aria-label': 'Account access mode',
    },
    children: [
      createAccountModeButton({
        label: 'Create account',
        mode: ACCOUNT_MODES.REGISTER,
        active: true,
      }),
      createAccountModeButton({
        label: 'Sign in',
        mode: ACCOUNT_MODES.SIGN_IN,
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
      name: field.name,
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
    attributes: {
      'data-save-gate-field-container': field.name,
    },
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
            text: 'Create account & continue',
            attributes: {
              type: 'submit',
              'data-save-gate-submit': true,
            },
          }),
          createElement('p', {
            className: 'tourist-save-form__status',
            attributes: {
              role: 'alert',
              'aria-live': 'assertive',
              'data-save-gate-status': true,
            },
          }),
          createElement('p', {
            className: 'tourist-save-form__note',
            text: 'Authentication is secure. Journey saving will be connected in a later step.',
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

function createAuthenticatedState(user, profile) {
  const accountLabel = profile?.displayName?.trim() || user?.email
  const heading = createElement('h1', {
    className: 'tourist-save-success__title',
    text: 'You’re signed in',
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
        text: accountLabel
          ? `Signed in as ${accountLabel}. Your RIHLATI profile is ready. Your journey has not been saved yet.`
          : 'Your RIHLATI profile is ready. Your journey has not been saved yet.',
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

function clearFieldValidation(input) {
  input.removeAttribute('aria-invalid')
  const errorElement = document.getElementById(`${input.id}-error`)

  if (errorElement) {
    errorElement.textContent = ''
  }
}

function getAuthErrorMessage(error) {
  const messages = {
    'auth/email-already-in-use': 'An account already exists for this email. Try signing in instead.',
    'auth/invalid-credential': 'The email or password is incorrect. Check your details and try again.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/network-request-failed': 'We could not reach the authentication service. Check your connection and try again.',
    'auth/operation-not-allowed': 'Email and password access is currently unavailable. Please try again later.',
    'auth/too-many-requests': 'Too many attempts were made. Wait a moment, then try again.',
    'auth/user-disabled': 'This account is currently unavailable. Contact support for help.',
    'auth/user-not-found': 'The email or password is incorrect. Check your details and try again.',
    'auth/weak-password': 'Choose a stronger password with at least 6 characters.',
    'auth/wrong-password': 'The email or password is incorrect. Check your details and try again.',
  }

  return messages[error?.code] ?? 'We could not complete authentication. Please try again.'
}

export function createTouristSavePage({ path = '/t-save' } = {}) {
  let mounted = false
  let destroyed = false
  let authenticated = false
  let isSubmitting = false
  let accountMode = ACCOUNT_MODES.REGISTER
  let profileLoad = null

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
  let authCleanup = () => {}

  const renderAuthenticated = (user, profile) => {
    if (authenticated || destroyed) {
      return
    }

    authenticated = true
    const success = createAuthenticatedState(user, profile)
    content.replaceChildren(success.element)
    window.requestAnimationFrame(() => {
      if (!destroyed && success.heading.isConnected) {
        success.heading.focus({ preventScroll: true })
      }
    })
  }

  const setAccountMode = (nextMode) => {
    if (isSubmitting || nextMode === accountMode || !Object.values(ACCOUNT_MODES).includes(nextMode)) {
      return
    }

    accountMode = nextMode
    const form = page.querySelector('[data-save-gate-form]')
    const nameField = page.querySelector('[data-save-gate-field-container="displayName"]')
    const nameInput = page.querySelector('#save-gate-full-name')
    const passwordInput = page.querySelector('#save-gate-password')
    const submitButton = page.querySelector('[data-save-gate-submit]')
    const status = page.querySelector('[data-save-gate-status]')
    const isRegisterMode = accountMode === ACCOUNT_MODES.REGISTER

    page.querySelectorAll('[data-save-gate-mode]').forEach((button) => {
      const isActive = button.dataset.saveGateMode === accountMode
      button.classList.toggle('is-active', isActive)
      button.setAttribute('aria-pressed', String(isActive))
    })

    if (nameField instanceof HTMLElement && nameInput instanceof HTMLInputElement) {
      nameField.hidden = !isRegisterMode
      nameInput.disabled = !isRegisterMode
      nameInput.required = isRegisterMode
    }

    if (passwordInput instanceof HTMLInputElement) {
      passwordInput.autocomplete = isRegisterMode ? 'new-password' : 'current-password'
    }

    if (form instanceof HTMLFormElement) {
      form.setAttribute('aria-label', isRegisterMode ? 'Create account' : 'Sign in')
    }

    if (submitButton instanceof HTMLButtonElement) {
      submitButton.textContent = isRegisterMode ? 'Create account & continue' : 'Sign in & continue'
    }

    if (status) {
      status.textContent = ''
    }

    page.querySelectorAll('[data-save-gate-field]').forEach(clearFieldValidation)
    page.querySelector('#save-gate-email')?.focus()
  }

  const setSubmitting = (form, submitting, pendingLabel = '') => {
    isSubmitting = submitting
    form.setAttribute('aria-busy', String(submitting))
    const submitButton = form.querySelector('[data-save-gate-submit]')

    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = submitting
      submitButton.textContent = submitting
        ? pendingLabel || (accountMode === ACCOUNT_MODES.REGISTER
          ? 'Creating account…'
          : 'Signing in…')
        : accountMode === ACCOUNT_MODES.REGISTER
          ? 'Create account & continue'
          : 'Sign in & continue'
    }

    page.querySelectorAll('[data-save-gate-mode]').forEach((button) => {
      button.disabled = submitting
    })
  }

  const showProfileMessage = (message, { switchToSignIn = false } = {}) => {
    const form = page.querySelector('[data-save-gate-form]')

    if (!(form instanceof HTMLFormElement) || destroyed) {
      return
    }

    setSubmitting(form, false)

    if (switchToSignIn) {
      setAccountMode(ACCOUNT_MODES.SIGN_IN)
    }

    const status = form.querySelector('[data-save-gate-status]')
    if (status) {
      status.textContent = message
    }
  }

  const loadAuthenticatedProfile = (user) => {
    if (!user?.uid || authenticated || destroyed) {
      return Promise.resolve(null)
    }

    if (profileLoad?.uid === user.uid) {
      return profileLoad.promise
    }

    const promise = (async () => {
      const form = page.querySelector('[data-save-gate-form]')

      if (form instanceof HTMLFormElement) {
        setSubmitting(form, true, 'Checking account…')
      }

      try {
        const profile = await getUserProfile(user.uid)

        if (destroyed) {
          return null
        }

        if (profile) {
          renderAuthenticated(user, profile)
        } else {
          showProfileMessage(
            'You are signed in, but this account does not have a RIHLATI profile yet. Sign in with another account or try again later.',
            { switchToSignIn: true },
          )
        }

        return profile
      } catch {
        if (!destroyed) {
          showProfileMessage(
            'You are signed in, but we could not load your RIHLATI profile. Check your connection and try again.',
            { switchToSignIn: true },
          )
        }

        return null
      } finally {
        if (!destroyed && !authenticated && form instanceof HTMLFormElement && form.isConnected) {
          setSubmitting(form, false)
        }
      }
    })()

    profileLoad = { uid: user.uid, promise }
    void promise.finally(() => {
      if (profileLoad?.promise === promise) {
        profileLoad = null
      }
    })

    return promise
  }

  const handleSubmit = async (event) => {
    const form = event.target

    if (!(form instanceof HTMLFormElement) || !form.matches('[data-save-gate-form]')) {
      return
    }

    event.preventDefault()
    if (isSubmitting) {
      return
    }

    const fields = [...form.querySelectorAll('[data-save-gate-field]:not(:disabled)')]
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

    const status = form.querySelector('[data-save-gate-status]')
    const nameInput = form.querySelector('#save-gate-full-name')
    const emailInput = form.querySelector('#save-gate-email')
    const passwordInput = form.querySelector('#save-gate-password')

    if (!(emailInput instanceof HTMLInputElement) || !(passwordInput instanceof HTMLInputElement)) {
      return
    }

    if (status) {
      status.textContent = ''
    }

    setSubmitting(form, true)
    const submittedMode = accountMode
    let feedbackMessage = ''
    let switchToSignIn = false

    try {
      const credential = submittedMode === ACCOUNT_MODES.REGISTER
        ? await registerWithEmailPassword(emailInput.value.trim(), passwordInput.value)
        : await signInWithEmailPassword(emailInput.value.trim(), passwordInput.value)

      if (destroyed) {
        return
      }

      if (submittedMode === ACCOUNT_MODES.REGISTER) {
        const displayName = nameInput instanceof HTMLInputElement ? nameInput.value.trim() : ''
        const authenticatedEmail = credential.user.email

        if (!authenticatedEmail) {
          feedbackMessage = 'Your account was created, but we could not verify its email for the RIHLATI profile. Please sign in and try again.'
          switchToSignIn = true
          return
        }

        const profile = {
          displayName,
          email: authenticatedEmail,
          personas: ['tourist'],
        }

        try {
          await createUserProfile(credential.user.uid, profile)
        } catch {
          feedbackMessage = 'Your account was created, but we could not finish its RIHLATI profile. Check your connection, then sign in and try again.'
          switchToSignIn = true
          return
        }

        if (!destroyed) {
          form.reset()
          renderAuthenticated(credential.user, profile)
        }

        return
      }

      try {
        const profile = await getUserProfile(credential.user.uid)

        if (destroyed) {
          return
        }

        if (!profile) {
          feedbackMessage = 'You are signed in, but this account does not have a RIHLATI profile yet. Sign in with another account or try again later.'
          return
        }

        form.reset()
        renderAuthenticated(credential.user, profile)
      } catch {
        feedbackMessage = 'You are signed in, but we could not load your RIHLATI profile. Check your connection and try again.'
      }
    } catch (error) {
      if (!destroyed) {
        feedbackMessage = getAuthErrorMessage(error)
      }
    } finally {
      if (!destroyed && !authenticated) {
        setSubmitting(form, false)

        if (switchToSignIn) {
          setAccountMode(ACCOUNT_MODES.SIGN_IN)
        }

        if (status) {
          status.textContent = feedbackMessage
        }
      }
    }
  }

  const handleClick = (event) => {
    if (!(event.target instanceof Element)) {
      return
    }

    const modeButton = event.target.closest('[data-save-gate-mode]')

    if (modeButton instanceof HTMLButtonElement) {
      setAccountMode(modeButton.dataset.saveGateMode)
    }
  }

  const handleInput = (event) => {
    const input = event.target

    if (!(input instanceof HTMLInputElement) || !input.matches('[data-save-gate-field]')) {
      return
    }

    if (input.hasAttribute('aria-invalid')) {
      renderFieldValidation(input)
    }

    const status = page.querySelector('[data-save-gate-status]')
    if (status) {
      status.textContent = ''
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
      page.addEventListener('click', handleClick, { signal: pageController.signal })

      const currentUser = getCurrentUser()
      if (currentUser) {
        void loadAuthenticatedProfile(currentUser)
      }

      authCleanup = observeAuthState((user) => {
        if (user && !isSubmitting) {
          void loadAuthenticatedProfile(user)
        }
      })
    },

    destroy() {
      if (destroyed) {
        return
      }

      destroyed = true
      page.querySelector('[data-save-gate-form]')?.reset()
      pageController.abort()
      authCleanup()
      headerCleanup()
    },
  }
}
