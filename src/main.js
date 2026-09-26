import { Router } from './app/router.js'
import { notFoundRoute, routes } from './app/routes.js'
import { mountSkipLink } from './utils/accessibility.js'
import { requireElement } from './utils/dom.js'

async function bootstrap() {
  const appRoot = requireElement('[data-app-root]')
  const router = new Router({
    root: appRoot,
    routes,
    notFoundRoute,
    transitionDuration: 240,
  })

  await router.start()
  mountSkipLink()
}

bootstrap().catch((error) => {
  console.error('[RIHLATI] Foundation bootstrap failed.', error)
  document.body.dataset.appError = 'true'
})
