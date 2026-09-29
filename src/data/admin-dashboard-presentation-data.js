export const adminDashboardPresentation = Object.freeze({
  navigation: Object.freeze([
    Object.freeze({ id: 'dashboard', label: 'Dashboard', icon: 'dashboard', href: '/admin' }),
    Object.freeze({ id: 'users', label: 'Users', icon: 'users', href: '/admin/users' }),
    Object.freeze({
      id: 'matching',
      label: 'Matching',
      icon: 'matching',
      href: '/admin/matching',
    }),
    Object.freeze({ id: 'content', label: 'Content', icon: 'content' }),
    Object.freeze({
      id: 'partnerships',
      label: 'Partnerships',
      icon: 'partnerships',
      href: '/admin/partnerships',
    }),
    Object.freeze({ id: 'settings', label: 'Settings', icon: 'settings' }),
  ]),
  metrics: Object.freeze([
    Object.freeze({
      label: 'Registered users',
      value: '4,820',
      delta: '+6.2%',
      note: 'Tourists & investors',
      attention: false,
    }),
    Object.freeze({
      label: 'Journeys generated',
      value: '11,340',
      delta: '+9.1%',
      note: 'Last 30 days',
      attention: false,
    }),
    Object.freeze({
      label: 'Saved items',
      value: '2,915',
      delta: '+3.4%',
      note: 'Journeys & opportunities',
      attention: false,
    }),
    Object.freeze({
      label: 'Pending partnerships',
      value: '18',
      delta: 'Needs review',
      note: 'Existing investors',
      attention: true,
    }),
  ]),
  travellerSegments: Object.freeze([
    Object.freeze({ label: 'Adventure & Desert', share: 38 }),
    Object.freeze({ label: 'Heritage & Culture', share: 27 }),
    Object.freeze({ label: 'Wellness & Slow', share: 21 }),
    Object.freeze({ label: 'Family & Discovery', share: 14 }),
  ]),
  attentionItems: Object.freeze([
    Object.freeze({ label: '18 partnership requests pending', tone: 'terracotta' }),
    Object.freeze({ label: '3 content items in review', tone: 'gold' }),
    Object.freeze({ label: '1 matching rule unpublished', tone: 'brand' }),
  ]),
})
