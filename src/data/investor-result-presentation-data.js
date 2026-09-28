/**
 * Static prototype recommendations for the approved Investor Result screen.
 * This is presentation data only and is intentionally replaceable by the
 * future Rihlati Matching Engine.
 *
 * prototypeMapPosition reproduces the prototype artwork. These percentages
 * are not canonical governorate coordinates or a final location data model.
 */
export const investorResultMatches = Object.freeze([
  Object.freeze({
    id: 'wadi-rum-southern-desert',
    rank: 'Best Match',
    region: 'Wadi Rum — Southern Desert',
    mapLabel: 'Wadi Rum',
    type: 'Eco-lodge / Desert stay',
    fit: 92,
    scale: 'Boutique (12–20 keys)',
    segment: 'Adventure & experience travellers',
    insight: 'Strong overnight demand and low comparable supply in your budget band align closely with your stated criteria.',
    prototypeMapPosition: Object.freeze({ x: 34, y: 77 }),
  }),
  Object.freeze({
    id: 'ajloun-northern-highlands',
    rank: 'Alternative',
    region: 'Ajloun — Northern Highlands',
    mapLabel: 'Ajloun',
    type: 'Nature retreat / cabins',
    fit: 84,
    scale: 'Small (6–12 keys)',
    segment: 'Slow & wellness travellers',
    insight: 'Green, cooler highlands attract a growing domestic and regional weekend segment.',
    prototypeMapPosition: Object.freeze({ x: 33, y: 26 }),
  }),
  Object.freeze({
    id: 'dead-sea-jordan-valley',
    rank: 'Alternative',
    region: 'Dead Sea — Jordan Valley',
    mapLabel: 'Dead Sea',
    type: 'Wellness / day facilities',
    fit: 79,
    scale: 'Mid (20–40 keys)',
    segment: 'Wellness & relaxation travellers',
    insight: 'Established destination with consistent traffic; higher competition in the premium tier.',
    prototypeMapPosition: Object.freeze({ x: 30, y: 50 }),
  }),
])

export const investorResultContext = Object.freeze({
  label: 'Contextual insight',
  text: 'Demand for desert overnights is concentrated in the south, where comparable supply in your budget band is still limited.',
})
