import { createFoundationPage } from '../pages/foundation-page.js'
import { createHomePage } from '../pages/home-page.js'

export const routes = [
  {
    path: '/',
    title: 'Rihlati — رحلتي | Personalized Jordan Journeys',
    createPage: ({ path }) => createHomePage({ path }),
  },
  {
    path: '/foundation/lifecycle',
    title: 'Lifecycle Check · Rihlati Vanilla Foundation',
    createPage: ({ path }) => createFoundationPage({ path, variant: 'lifecycle' }),
  },
]

export const notFoundRoute = {
  title: 'Route Not Available · Rihlati',
  createPage: ({ path }) =>
    createFoundationPage({
      path,
      variant: 'not-found',
      requestedPath: path,
    }),
}
