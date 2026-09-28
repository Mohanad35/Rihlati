export const partnershipTrackingPresentation = Object.freeze({
  title: 'Partnership request submitted',
  description: 'Thank you — here’s what happens next.',
  notice: 'Tracking preview — this request is not stored yet.',
  stages: Object.freeze([
    Object.freeze({
      label: 'New Request',
      description: 'We’ve received your request',
      current: true,
    }),
    Object.freeze({
      label: 'Under Review',
      description: 'Our team assesses fit & context',
      current: false,
    }),
    Object.freeze({
      label: 'Contact Requested',
      description: 'An alignment call is requested',
      current: false,
    }),
    Object.freeze({
      label: 'In Discussion',
      description: 'We discuss placement together',
      current: false,
    }),
    Object.freeze({
      label: 'Partner',
      description: 'You appear as a recommended stop',
      current: false,
    }),
  ]),
})
