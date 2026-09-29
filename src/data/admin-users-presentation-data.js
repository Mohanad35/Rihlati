export const adminUsersPresentation = Object.freeze({
  filters: Object.freeze(['All', 'Tourists', 'Investors']),
  users: Object.freeze([
    Object.freeze({ id: 'lina-haddad', name: 'Lina Haddad', role: 'Tourist', country: 'Germany', activity: 'Generated 3 journeys', status: 'Active' }),
    Object.freeze({ id: 'omar-khalil', name: 'Omar Khalil', role: 'New Investor', country: 'Jordan', activity: 'Saved 2 opportunities', status: 'Active' }),
    Object.freeze({ id: 'sofia-rossi', name: 'Sofia Rossi', role: 'Tourist', country: 'Italy', activity: 'Saved 1 journey', status: 'Active' }),
    Object.freeze({ id: 'cedar-valley-camps', name: 'Cedar Valley Camps', role: 'Existing Investor', country: 'Jordan', activity: 'Partnership request', status: 'Pending' }),
    Object.freeze({ id: 'yusuf-nassar', name: 'Yusuf Nassar', role: 'New Investor', country: 'KSA', activity: 'Updated criteria', status: 'Active' }),
    Object.freeze({ id: 'emma-wright', name: 'Emma Wright', role: 'Tourist', country: 'UK', activity: 'Generated 1 journey', status: 'Dormant' }),
  ]),
  profiles: Object.freeze({
    tourist: Object.freeze({
      typeLabel: 'Travel profile',
      tags: Object.freeze(['Balanced pace', 'Heritage', 'Desert & stars', 'Local food']),
      savedLabel: 'Saved journeys',
      savedItems: Object.freeze(['Heritage & Desert Escape', 'Slow North & Green Hills']),
      summaryLabel: 'Activity summary',
    }),
    investor: Object.freeze({
      typeLabel: 'Investor type',
      tags: Object.freeze(['New investor', 'Accommodation', 'Southern desert']),
      savedLabel: 'Saved results',
      savedItems: Object.freeze(['Wadi Rum eco-lodge — 92% fit', 'Ajloun retreat — 84% fit']),
      summaryLabel: 'Relationship status',
      summary: 'Active lead · last active 2 days ago',
    }),
  }),
})
