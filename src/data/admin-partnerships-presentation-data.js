export const partnershipStatuses = Object.freeze([
  Object.freeze({
    label: 'New Request',
    description: 'We’ve received the request',
    tone: 'terracotta',
  }),
  Object.freeze({
    label: 'Under Review',
    description: 'The team assesses fit and context',
    tone: 'gold',
  }),
  Object.freeze({
    label: 'Contact Requested',
    description: 'An alignment call is requested',
    tone: 'sand',
  }),
  Object.freeze({
    label: 'In Discussion',
    description: 'Journey placement is discussed together',
    tone: 'brand',
  }),
  Object.freeze({
    label: 'Partner',
    description: 'The business can appear as a recommended stop',
    tone: 'brand',
  }),
])

export const adminPartnershipsPresentation = Object.freeze({
  filters: Object.freeze(['All', ...partnershipStatuses.map((status) => status.label)]),
  requests: Object.freeze([
    Object.freeze({
      id: 'cedar-valley-camps',
      business: 'Cedar Valley Camps',
      type: 'Desert camp · Accommodation',
      region: 'Wadi Rum — Southern Desert',
      submitted: '2 days ago',
      initialStatus: 'New Request',
      audience: 'Adventure & Desert travellers',
      placement: 'Day 4 overnight stop',
      experience: 'Overnight stay · Activities · Cultural immersion',
    }),
    Object.freeze({
      id: 'olive-terrace-retreat',
      business: 'Olive Terrace Retreat',
      type: 'Nature retreat',
      region: 'Ajloun',
      submitted: '4 days ago',
      initialStatus: 'Under Review',
      audience: 'Not specified in source data',
      placement: 'Recommended overnight stop',
      experience: 'Not specified in source data',
    }),
    Object.freeze({
      id: 'saltwater-wellness',
      business: 'Saltwater Wellness',
      type: 'Wellness spa',
      region: 'Dead Sea',
      submitted: '1 week ago',
      initialStatus: 'Partner',
      audience: 'Not specified in source data',
      placement: 'Recommended overnight stop',
      experience: 'Not specified in source data',
    }),
  ]),
})
