import { homeAssets } from '../assets/home-assets.js'
import { createCard, createEyebrow } from '../components/ui.js'
import { isAdmin } from '../services/admin-authorization.js'
import {
  observeAuthState,
  signInWithEmailPassword,
  signOutCurrentUser,
} from '../services/auth-service.js'
import { createElement } from '../utils/dom.js'

const ADMIN_PATH = '/admin'

function createBrandLink() {
  return createElement('a', {
    className: 'admin-login__brand',
    attributes: {
      href: '/',
      'data-router-link': true,
      'aria-label': 'Rihlati home',
    },
    children: [
      createElement('img', {
        attributes: {
          src: homeAssets.logo,
          alt: 'Rihlati — رحلتي',
          fetchpriority: 'high',
          decoding: 'async',
        },
      }),
    ],
  })
}

function createLoadingState() {
  return createCard({
    tagName: 'section',
    className: 'admin-login-card admin-login-card--centered animate-scale-in',
    children: [
      createElement('span', {
        className: 'admin-auth-loading__spinner',
        attributes: { 'aria-hidden': 'true' },
      }),
      createElement('h1', {
        className: 'admin-login__title',
        attributes: { id: 'admin-login-title' },
        text: 'Checking admin access',
      }),
      createElement('p', {
        className: 'admin-login__copy',
        text: 'Verifying your RIHLATI administrator permissions…',
      }),
    ],
  })
}

function createLoginField({ id, label, type, autocomplete }) {
  return createElement('div', {
    className: 'admin-login-field',
    children: [
      createElement('label', {
        className: 'admin-login-field__label',
        attributes: { for: id },
        text: label,
      }),
      createElement('input', {
        className: 'admin-login-field__input',
        attributes: {
          id,
          name: type === 'email' ? 'email' : 'password',
          type,
          autocomplete,
          required: true,
          ...(type === 'password' ? { minlength: 6 } : {}),
        },
      }),
    ],
  })
}

function createLoginFormState(notice = '') {
  const heading = createElement('h1', {
    className: 'admin-login__title',
    attributes: {
      id: 'admin-login-title',
      tabindex: '-1',
    },
    text: 'Admin sign in',
  })
  const form = createElement('form', {
    className: 'admin-login-form',
    attributes: {
      'data-admin-login-form': true,
      'aria-label': 'Admin sign in',
    },
    children: [
      createLoginField({
        id: 'admin-login-email',
        label: 'Email address',
        type: 'email',
        autocomplete: 'email',
      }),
      createLoginField({
        id: 'admin-login-password',
        label: 'Password',
        type: 'password',
        autocomplete: 'current-password',
      }),
      createElement('button', {
        className: 'button button--primary button--full admin-login-form__submit',
        text: 'Sign in to Admin',
        attributes: {
          type: 'submit',
          'data-admin-login-submit': true,
        },
      }),
      createElement('p', {
        className: 'admin-login-form__status',
        attributes: {
          role: 'alert',
          'aria-live': 'assertive',
          'data-admin-login-status': true,
        },
      }),
    ],
  })

  const element = createCard({
    tagName: 'section',
    className: 'admin-login-card animate-scale-in',
    children: [
      createBrandLink(),
      createEyebrow('Protected workspace'),
      heading,
      createElement('p', {
        className: 'admin-login__copy',
        text: 'Sign in with an account listed in RIHLATI’s administrator registry.',
      }),
      ...(notice
        ? [createElement('p', { className: 'admin-login__notice', text: notice })]
        : []),
      form,
      createElement('a', {
        className: 'admin-login__home-link',
        text: 'Return to Rihlati',
        attributes: { href: '/', 'data-router-link': true },
      }),
    ],
  })

  return { element, heading }
}

function createUnauthorizedState(user, { verificationUnavailable = false } = {}) {
  const heading = createElement('h1', {
    className: 'admin-login__title',
    attributes: {
      id: 'admin-login-title',
      tabindex: '-1',
    },
    text: verificationUnavailable ? 'Access could not be verified' : 'Admin access required',
  })
  const message = verificationUnavailable
    ? 'You are signed in, but RIHLATI could not verify administrator access. Check your connection or use another account.'
    : 'This account is signed in, but it is not listed as a RIHLATI administrator.'

  const element = createCard({
    tagName: 'section',
    className: 'admin-login-card admin-login-card--centered animate-scale-in',
    children: [
      createBrandLink(),
      createElement('span', {
        className: 'admin-login__access-badge',
        text: 'Access restricted',
      }),
      heading,
      createElement('p', { className: 'admin-login__copy', text: message }),
      ...(user?.email
        ? [createElement('p', {
          className: 'admin-login__account',
          text: `Current account: ${user.email}`,
        })]
        : []),
      createElement('button', {
        className: 'button button--primary button--full',
        text: 'Sign out & use another account',
        attributes: {
          type: 'button',
          'data-admin-login-sign-out': true,
        },
      }),
      createElement('p', {
        className: 'admin-login-form__status',
        attributes: {
          role: 'alert',
          'aria-live': 'assertive',
          'data-admin-login-status': true,
        },
      }),
      createElement('a', {
        className: 'admin-login__home-link',
        text: 'Return to Rihlati',
        attributes: { href: '/', 'data-router-link': true },
      }),
    ],
  })

  return { element, heading }
}

function getAuthErrorMessage(error) {
  const messages = {
    'auth/invalid-credential': 'The email or password is incorrect. Check your details and try again.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/network-request-failed': 'We could not reach the authentication service. Check your connection and try again.',
    'auth/too-many-requests': 'Too many attempts were made. Wait a moment, then try again.',
    'auth/user-disabled': 'This account is currently unavailable.',
    'auth/user-not-found': 'The email or password is incorrect. Check your details and try again.',
    'auth/wrong-password': 'The email or password is incorrect. Check your details and try again.',
  }

  return messages[error?.code] ?? 'We could not complete sign in. Please try again.'
}

export function createAdminLoginPage({ router, url }) {
  let mounted = false
  let destroyed = false
  let isSubmitting = false
  let signingOut = false
  let authorizationSequence = 0
  let authCleanup = () => {}

  const pageController = new AbortController()
  const content = createElement('div', {
    className: 'admin-login__content',
    children: [createLoadingState()],
  })
  const main = createElement('main', {
    className: 'admin-login-main',
    attributes: {
      id: 'main-content',
      tabindex: '-1',
      'aria-labelledby': 'admin-login-title',
    },
    children: [content],
  })
  const page = createElement('div', {
    className: 'admin-login-page paper',
    children: [main],
  })

  const focusHeading = (heading) => {
    window.requestAnimationFrame(() => {
      if (!destroyed && heading.isConnected) {
        heading.focus({ preventScroll: true })
      }
    })
  }

  const renderLoginForm = (notice = '') => {
    if (destroyed) return
    const state = createLoginFormState(notice)
    content.replaceChildren(state.element)
    focusHeading(state.heading)
  }

  const renderUnauthorized = (user, options) => {
    if (destroyed) return
    const state = createUnauthorizedState(user, options)
    content.replaceChildren(state.element)
    focusHeading(state.heading)
  }

  const renderLoading = () => {
    if (!destroyed) {
      content.replaceChildren(createLoadingState())
    }
  }

  const setLoginBusy = (form, busy) => {
    isSubmitting = busy
    form.setAttribute('aria-busy', String(busy))
    const submit = form.querySelector('[data-admin-login-submit]')

    if (submit instanceof HTMLButtonElement) {
      submit.disabled = busy
      submit.textContent = busy ? 'Verifying access…' : 'Sign in to Admin'
    }
  }

  const checkAuthenticatedUser = async (user) => {
    if (isSubmitting || signingOut) {
      return
    }

    const sequence = ++authorizationSequence

    if (!user) {
      const state = url.searchParams.get('state')
      renderLoginForm(state === 'unauthorized'
        ? 'Sign in with an authorized administrator account.'
        : '')
      return
    }

    renderLoading()

    try {
      const authorized = await isAdmin(user.uid)

      if (destroyed || sequence !== authorizationSequence) {
        return
      }

      if (authorized) {
        await router.navigate(ADMIN_PATH, { replace: true })
      } else {
        renderUnauthorized(user)
      }
    } catch {
      if (!destroyed && sequence === authorizationSequence) {
        renderUnauthorized(user, { verificationUnavailable: true })
      }
    }
  }

  const handleSubmit = async (event) => {
    const form = event.target

    if (!(form instanceof HTMLFormElement) || !form.matches('[data-admin-login-form]')) {
      return
    }

    event.preventDefault()

    if (isSubmitting || !form.reportValidity()) {
      return
    }

    const emailInput = form.querySelector('#admin-login-email')
    const passwordInput = form.querySelector('#admin-login-password')
    const status = form.querySelector('[data-admin-login-status]')

    if (!(emailInput instanceof HTMLInputElement) || !(passwordInput instanceof HTMLInputElement)) {
      return
    }

    if (status) status.textContent = ''
    setLoginBusy(form, true)

    try {
      const credential = await signInWithEmailPassword(
        emailInput.value.trim(),
        passwordInput.value,
      )

      let authorized = false

      try {
        authorized = await isAdmin(credential.user.uid)
      } catch {
        if (!destroyed) {
          renderUnauthorized(credential.user, { verificationUnavailable: true })
        }
        return
      }

      if (destroyed) return

      if (authorized) {
        await router.navigate(ADMIN_PATH, { replace: true })
      } else {
        renderUnauthorized(credential.user)
      }
    } catch (error) {
      if (!destroyed && status) {
        status.textContent = getAuthErrorMessage(error)
      }
    } finally {
      if (!destroyed && form.isConnected) {
        setLoginBusy(form, false)
      }
    }
  }

  const handleClick = async (event) => {
    if (!(event.target instanceof Element)) return
    const button = event.target.closest('[data-admin-login-sign-out]')

    if (!(button instanceof HTMLButtonElement) || signingOut) {
      return
    }

    signingOut = true
    button.disabled = true
    button.setAttribute('aria-busy', 'true')
    const status = content.querySelector('[data-admin-login-status]')
    if (status) status.textContent = ''

    try {
      await signOutCurrentUser()

      if (!destroyed) {
        renderLoginForm('You are signed out. Sign in with an administrator account.')
      }
    } catch {
      if (!destroyed) {
        if (status) status.textContent = 'We could not sign you out. Check your connection and try again.'
        button.disabled = false
        button.setAttribute('aria-busy', 'false')
      }
    } finally {
      signingOut = false
    }
  }

  return {
    element: page,

    mount() {
      if (mounted || destroyed) return
      mounted = true
      page.addEventListener('submit', handleSubmit, { signal: pageController.signal })
      page.addEventListener('click', handleClick, { signal: pageController.signal })
      authCleanup = observeAuthState((user) => {
        void checkAuthenticatedUser(user)
      })
    },

    destroy() {
      if (destroyed) return
      destroyed = true
      authorizationSequence += 1
      page.querySelector('[data-admin-login-form]')?.reset()
      pageController.abort()
      authCleanup()
    },
  }
}
