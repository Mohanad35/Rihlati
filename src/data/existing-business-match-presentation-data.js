export const existingBusinessMatchPresentation = Object.freeze({
  business: Object.freeze({
    name: 'Cedar Valley Camps',
    location: 'Wadi Rum',
    type: 'Desert camp',
  }),
  travellerProfiles: Object.freeze([
    Object.freeze({ label: 'Adventure & Desert', share: 38 }),
    Object.freeze({ label: 'Heritage & Culture', share: 27 }),
    Object.freeze({ label: 'Wellness & Slow', share: 21 }),
    Object.freeze({ label: 'Family & Discovery', share: 14 }),
  ]),
  insights: Object.freeze([
    Object.freeze({
      icon: 'users',
      label: 'Best-fit segment',
      value: 'Adventure & Desert',
      description: 'Your overnight desert experience aligns with the largest active segment.',
    }),
    Object.freeze({
      icon: 'clock',
      label: 'Typical stay',
      value: '1–2 nights',
      description: 'Travellers on desert legs favor a short, immersive overnight.',
    }),
    Object.freeze({
      icon: 'star',
      label: 'Interest signal',
      value: 'High',
      description: 'Desert & stars ranks among the top requested experiences.',
    }),
    Object.freeze({
      icon: 'map',
      label: 'Journey placement',
      value: 'Day 4 stop',
      description: 'Fits naturally after Petra in a heritage-and-desert route.',
    }),
  ]),
  // Temporary source presentation coordinates, not canonical governorate locations.
  demandPoints: Object.freeze([
    Object.freeze({ x: 34, y: 77, label: 'Your business', rank: 'Best Match' }),
    Object.freeze({ x: 33, y: 70, label: 'Petra' }),
    Object.freeze({ x: 30, y: 50, label: 'Dead Sea' }),
  ]),
})
