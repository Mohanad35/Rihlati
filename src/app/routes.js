import { createFoundationPage } from '../pages/foundation-page.js'
import { createHomePage } from '../pages/home-page.js'
import { createJourneyGeneratingPage } from '../pages/journey-generating-page.js'
import { createTouristEntryPage } from '../pages/tourist-entry-page.js'
import { createTouristJourneyPage } from '../pages/tourist-journey-page.js'
import { createTouristQuestionnairePage } from '../pages/tourist-questionnaire-page.js'
import { createTouristSavePage } from '../pages/tourist-save-page.js'

export const routes = [
  {
    path: '/',
    title: 'Rihlati — رحلتي | Personalized Jordan Journeys',
    createPage: ({ path }) => createHomePage({ path }),
  },
  {
    path: '/tourist-entry',
    title: 'Start Your Tourist Journey | Rihlati — رحلتي',
    createPage: ({ path }) => createTouristEntryPage({ path }),
  },
  {
    path: '/t-questionnaire',
    title: 'Personalize Your Journey | Rihlati — رحلتي',
    createPage: ({ router }) => createTouristQuestionnairePage({ router }),
  },
  {
    path: '/t-generating',
    title: 'Building Your Journey | Rihlati — رحلتي',
    createPage: ({ router }) => createJourneyGeneratingPage({ router }),
  },
  {
    path: '/t-journey',
    title: 'Heritage & Desert Escape | Rihlati — رحلتي',
    createPage: ({ path, router }) => createTouristJourneyPage({ path, router }),
  },
  {
    path: '/t-save',
    title: 'Save Your Journey | Rihlati — رحلتي',
    createPage: ({ path }) => createTouristSavePage({ path }),
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
