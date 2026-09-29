import { createFoundationPage } from '../pages/foundation-page.js'
import { createAdminRouteGuard } from './admin-route-guard.js'
import { createAdminDashboardPage } from '../pages/admin-dashboard-page.js'
import { createAdminContentPage } from '../pages/admin-content-page.js'
import { createAdminLoginPage } from '../pages/admin-login-page.js'
import { createAdminMatchingPage } from '../pages/admin-matching-page.js'
import { createAdminPartnershipsPage } from '../pages/admin-partnerships-page.js'
import { createAdminSettingsPage } from '../pages/admin-settings-page.js'
import { createAdminUsersPage } from '../pages/admin-users-page.js'
import { createHomePage } from '../pages/home-page.js'
import { createBusinessDiscoveryPage } from '../pages/business-discovery-page.js'
import { createBusinessMatchPage } from '../pages/business-match-page.js'
import { createBusinessSimulationPage } from '../pages/business-simulation-page.js'
import { createPartnershipSubmittedPage } from '../pages/partnership-submitted-page.js'
import { createPartnershipSummaryPage } from '../pages/partnership-summary-page.js'
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
    path: '/admin/login',
    title: 'Admin Sign In | Rihlati — رحلتي',
    createPage: ({ router, url }) => createAdminLoginPage({ router, url }),
  },
  {
    path: '/admin',
    title: 'Admin Dashboard | Rihlati — رحلتي',
    createPage: (context) => createAdminRouteGuard({
      context,
      createPage: createAdminDashboardPage,
    }),
  },
  {
    path: '/admin/users',
    title: 'Admin Users | Rihlati — رحلتي',
    createPage: (context) => createAdminRouteGuard({
      context,
      createPage: createAdminUsersPage,
    }),
  },
  {
    path: '/admin/matching',
    title: 'Admin Matching | Rihlati — رحلتي',
    createPage: (context) => createAdminRouteGuard({
      context,
      createPage: createAdminMatchingPage,
    }),
  },
  {
    path: '/admin/content',
    title: 'Admin Content | Rihlati — رحلتي',
    createPage: (context) => createAdminRouteGuard({
      context,
      createPage: createAdminContentPage,
    }),
  },
  {
    path: '/admin/partnerships',
    title: 'Admin Partnerships | Rihlati — رحلتي',
    createPage: (context) => createAdminRouteGuard({
      context,
      createPage: createAdminPartnershipsPage,
    }),
  },
  {
    path: '/admin/settings',
    title: 'Admin Settings | Rihlati — رحلتي',
    createPage: (context) => createAdminRouteGuard({
      context,
      createPage: createAdminSettingsPage,
    }),
  },
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
    path: '/ei-match',
    title: 'Business Tourist Match | Rihlati — رحلتي',
    createPage: ({ path }) => createBusinessMatchPage({ path }),
  },
  {
    path: '/ei-simulation',
    title: 'Journey Placement Simulation | Rihlati — رحلتي',
    createPage: ({ path }) => createBusinessSimulationPage({ path }),
  },
  {
    path: '/ei-summary',
    title: 'Partnership Summary | Rihlati — رحلتي',
    createPage: ({ path }) => createPartnershipSummaryPage({ path }),
  },
  {
    path: '/ei-submitted',
    title: 'Partnership Request Status | Rihlati — رحلتي',
    createPage: ({ path }) => createPartnershipSubmittedPage({ path }),
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
