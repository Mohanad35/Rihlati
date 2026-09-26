import { createFoundationPage } from '../pages/foundation-page.js'

export const routes = [
  {
    path: '/',
    title: 'Rihlati Vanilla Foundation',
    createPage: ({ path }) => createFoundationPage({ path }),
  },
  {
    path: '/foundation/lifecycle',
    title: 'Lifecycle Check · Rihlati Vanilla Foundation',
    createPage: ({ path }) => createFoundationPage({ path, variant: 'lifecycle' }),
  },
]

export const notFoundRoute = {
  title: 'Route Fallback · Rihlati Vanilla Foundation',
  createPage: ({ path }) =>
    createFoundationPage({
      path,
      variant: 'not-found',
      requestedPath: path,
    }),
}
