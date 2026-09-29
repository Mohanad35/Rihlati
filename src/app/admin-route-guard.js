import { isAdmin } from '../services/admin-authorization.js'
import {
  observeAuthState,
  signOutCurrentUser,
} from '../services/auth-service.js'
import { createElement } from '../utils/dom.js'

const ADMIN_LOGIN_PATH = '/admin/login'

function createAuthorizationLoader() {
  return createElement('main', {
    className: 'admin-auth-loading paper',
    attributes: {
      id: 'main-content',
      tabindex: '-1',
      'aria-labelledby': 'admin-auth-loading-title',
    },
    children: [
      createElement('span', {
        className: 'admin-auth-loading__spinner',
        attributes: { 'aria-hidden': 'true' },
      }),
      createElement('h1', {
        className: 'admin-auth-loading__title',
        attributes: { id: 'admin-auth-loading-title' },
        text: 'Verifying admin access',
      }),
      createElement('p', {
        className: 'admin-auth-loading__copy',
        text: 'Checking your RIHLATI administrator permissions…',
      }),
    ],
  })
}

function getAdminLoginPath(state = '') {
  return state ? `${ADMIN_LOGIN_PATH}?state=${encodeURIComponent(state)}` : ADMIN_LOGIN_PATH
}

export function createAdminRouteGuard({ context, createPage }) {
  let mounted = false
  let destroyed = false
  let authorizationSequence = 0
  let protectedPage = null
  let protectedUid = null
  let signingOut = false
  let authCleanup = () => {}

  const pageController = new AbortController()
  const signOutStatus = createElement('p', {
    className: 'admin-sign-out-status',
    attributes: {
      role: 'alert',
      'aria-live': 'assertive',
      'data-admin-sign-out-status': true,
    },
  })
  const element = createElement('div', {
    className: 'admin-route-guard',
    children: [createAuthorizationLoader()],
  })

  const isInactive = () => destroyed || context.signal.aborted

  const redirectToLogin = (state = '') => {
    if (!isInactive()) {
      void context.router.navigate(getAdminLoginPath(state), { replace: true })
    }
  }

  const mountProtectedPage = (user) => {
    if (isInactive() || protectedPage || protectedUid === user.uid) {
      return
    }

    const nextPage = createPage(context)

    if (!nextPage || !(nextPage.element instanceof Node)) {
      throw new TypeError('Protected Admin route did not return a valid page element.')
    }

    protectedPage = nextPage
    protectedUid = user.uid
    element.replaceChildren(nextPage.element, signOutStatus)
    nextPage.mount?.(context)
  }

  const authorizeUser = async (user) => {
    const sequence = ++authorizationSequence

    if (!user) {
      if (!signingOut) {
        redirectToLogin()
      }
      return
    }

    let authorized = false

    try {
      authorized = await isAdmin(user.uid)
    } catch {
      if (sequence === authorizationSequence) {
        redirectToLogin('unavailable')
      }
      return
    }

    if (isInactive() || sequence !== authorizationSequence) {
      return
    }

    if (!authorized) {
      redirectToLogin('unauthorized')
      return
    }

    mountProtectedPage(user)
  }

  const setSignOutBusy = (busy) => {
    element.querySelectorAll('[data-admin-sign-out]').forEach((button) => {
      button.disabled = busy
      button.setAttribute('aria-busy', String(busy))
    })
  }

  const handleClick = async (event) => {
    if (!(event.target instanceof Element)) {
      return
    }

    const signOutButton = event.target.closest('[data-admin-sign-out]')

    if (!(signOutButton instanceof HTMLButtonElement) || signingOut) {
      return
    }

    signingOut = true
    signOutStatus.textContent = ''
    setSignOutBusy(true)

    try {
      await signOutCurrentUser()

      if (!isInactive()) {
        await context.router.navigate(ADMIN_LOGIN_PATH, { replace: true })
      }
    } catch {
      if (!isInactive()) {
        signOutStatus.textContent = 'We could not sign you out. Check your connection and try again.'
        setSignOutBusy(false)
        signingOut = false
      }
    }
  }

  return {
    element,

    mount() {
      if (mounted || destroyed) {
        return
      }

      mounted = true
      element.addEventListener('click', handleClick, { signal: pageController.signal })
      authCleanup = observeAuthState((user) => {
        void authorizeUser(user)
      })
    },

    destroy() {
      if (destroyed) {
        return
      }

      destroyed = true
      authorizationSequence += 1
      pageController.abort()
      authCleanup()
      protectedPage?.destroy?.()
      protectedPage = null
    },
  }
}
