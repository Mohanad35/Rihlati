import {
  collection,
  getCountFromServer,
  getDocs,
  query,
  where,
} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js'

import { firestoreDb } from '../firebase/firestore-db.js'


const SEGMENTS = Object.freeze([
  'Adventure & Desert',
  'Heritage & Culture',
  'Wellness & Slow',
  'Family & Discovery',
])

async function getCollectionCount(collectionName) {
  const snapshot = await getCountFromServer(
    collection(
      firestoreDb,
      collectionName,
    ),
  )

  return snapshot.data().count
}

async function getFilteredCollectionCount(
  collectionName,
  field,
  operator,
  value,
) {
  const filteredQuery = query(
    collection(
      firestoreDb,
      collectionName,
    ),
    where(
      field,
      operator,
      value,
    ),
  )

  const snapshot =
    await getCountFromServer(filteredQuery)

  return snapshot.data().count
}

function classifyTravellerSegment(journey) {
  const preferences =
    journey?.preferences ?? {}

  const experiences =
    Array.isArray(preferences.exp)
      ? preferences.exp
      : []

  const finalPreferences =
    Array.isArray(preferences.final)
      ? preferences.final
      : []

  const scores = {
    'Adventure & Desert': 0,
    'Heritage & Culture': 0,
    'Wellness & Slow': 0,
    'Family & Discovery': 0,
  }

  if (experiences.includes('Desert & stars')) {
    scores['Adventure & Desert'] += 4
  }

  if (experiences.includes('Nature & hikes')) {
    scores['Adventure & Desert'] += 3
  }

  if (
    finalPreferences.includes(
      'Overnight in the desert',
    )
  ) {
    scores['Adventure & Desert'] += 3
  }

  if (experiences.includes('Ancient heritage')) {
    scores['Heritage & Culture'] += 4
  }

  if (
    experiences.includes(
      'Culture & museums',
    )
  ) {
    scores['Heritage & Culture'] += 4
  }

  if (experiences.includes('Local food')) {
    scores['Heritage & Culture'] += 2
  }

  if (
    experiences.includes(
      'Markets & crafts',
    )
  ) {
    scores['Heritage & Culture'] += 2
  }

  if (experiences.includes('Wellness & spa')) {
    scores['Wellness & Slow'] += 4
  }

  if (
    preferences.style ===
    'Immersive & slow'
  ) {
    scores['Wellness & Slow'] += 3
  }

  if (
    preferences.pace ===
    'Short & relaxed'
  ) {
    scores['Wellness & Slow'] += 2
  }

  if (
    finalPreferences.includes(
      'Include a rest day',
    )
  ) {
    scores['Wellness & Slow'] += 2
  }

  if (preferences.who === 'Family') {
    scores['Family & Discovery'] += 4
  }

  if (
    preferences.style ===
    'Balanced mix'
  ) {
    scores['Family & Discovery'] += 2
  }

  if (
    preferences.pace ===
    'Full discovery'
  ) {
    scores['Family & Discovery'] += 2
  }

  let selectedSegment =
    SEGMENTS[0]

  for (const segment of SEGMENTS) {
    if (
      scores[segment]
      > scores[selectedSegment]
    ) {
      selectedSegment = segment
    }
  }

  return selectedSegment
}

export async function getTravellerSegmentMix() {
  const snapshot = await getDocs(
    collection(
      firestoreDb,
      'journeys',
    ),
  )

  const counts = Object.fromEntries(
    SEGMENTS.map(
      (segment) => [
        segment,
        0,
      ],
    ),
  )

  for (
    const documentSnapshot
    of snapshot.docs
  ) {
    const segment =
      classifyTravellerSegment(
        documentSnapshot.data(),
      )

    counts[segment] += 1
  }

  const total =
    snapshot.size

  return SEGMENTS.map(
    (label) => ({
      label,

      count:
        counts[label],

      share:
        total > 0
          ? Math.round(
              (
                counts[label]
                / total
              )
              * 100,
            )
          : 0,
    }),
  )
}

export async function getAdminDashboardCounts() {
  const [
    registeredUsers,
    savedJourneys,
    savedInvestments,
    pendingPartnerships,
    contentInReview,
    draftContent,
  ] = await Promise.all([
    getCollectionCount('users'),

    getCollectionCount('journeys'),

    getCollectionCount('investments'),

    getFilteredCollectionCount(
      'partnershipRequests',
      'status',
      '==',
      'New Request',
    ),

    getFilteredCollectionCount(
      'content',
      'status',
      '==',
      'In review',
    ),

    getFilteredCollectionCount(
      'content',
      'status',
      '==',
      'Draft',
    ),
  ])

  return {
    registeredUsers,
    savedJourneys,
    savedInvestments,
    pendingPartnerships,
    contentInReview,
    draftContent,
  }
}