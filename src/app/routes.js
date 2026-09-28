import { createFoundationPage } from '../pages/foundation-page.js'
import { createHomePage } from '../pages/home-page.js'
import { createBusinessDiscoveryPage } from '../pages/business-discovery-page.js'
import { createInvestorEntryPage } from '../pages/investor-entry-page.js'
import { createInvestorComparePage } from '../pages/investor-compare-page.js'
import { createInvestorMatchingPage } from '../pages/investor-matching-page.js'
import { createInvestorResultPage } from '../pages/investor-result-page.js'
import { createJourneyGeneratingPage } from '../pages/journey-generating-page.js'
import { createMyInvestmentsPage } from '../pages/my-investments-page.js'
import { createMyJourneysPage } from '../pages/my-journeys-page.js'
import { createNewInvestorQuestionnairePage } from '../pages/new-investor-questionnaire-page.js'
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
    path: '/investor-entry',
    title: 'Tourism Investment Guidance | Rihlati — رحلتي',
    createPage: ({ path }) => createInvestorEntryPage({ path }),
  },
  {
    path: '/ei-discovery',
    title: 'Business Discovery | Rihlati — رحلتي',
    createPage: ({ router }) => createBusinessDiscoveryPage({ router }),
  },
  {
    path: '/ni-questionnaire',
    title: 'Investment Criteria | Rihlati — رحلتي',
    createPage: ({ router }) => createNewInvestorQuestionnairePage({ router }),
  },
  {
    path: '/ni-matching',
    title: 'Finding Investment Matches | Rihlati — رحلتي',
    createPage: ({ router }) => createInvestorMatchingPage({ router }),
  },
  {
    path: '/ni-result',
    title: 'Tourism Opportunity Matches | Rihlati — رحلتي',
    createPage: ({ path }) => createInvestorResultPage({ path }),
  },
  {
    path: '/ni-compare',
    title: 'Compare Tourism Opportunities | Rihlati — رحلتي',
    createPage: ({ path }) => createInvestorComparePage({ path }),
  },
  {
    path: '/ni-my-investments',
    title: 'My Investments | Rihlati — رحلتي',
    createPage: ({ path }) => createMyInvestmentsPage({ path }),
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
    path: '/t-my-journeys',
    title: 'My Journeys | Rihlati — رحلتي',
    createPage: ({ path }) => createMyJourneysPage({ path }),
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
