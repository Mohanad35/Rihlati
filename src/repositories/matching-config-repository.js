import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js'

import { firestoreDb } from '../firebase/firestore-db.js'

const MATCHING_CONFIG_COLLECTION =
  'matchingConfigs'

const PUBLISHED_MATCHING_CONFIG_COLLECTION =
  'publishedMatchingConfigs'

const SUPPORTED_MODES = Object.freeze([
  'tourist',
  'investor',
])

function validateMode(mode) {
  if (!SUPPORTED_MODES.includes(mode)) {
    throw new Error(
      `[RIHLATI] Unsupported matching mode: ${mode}`,
    )
  }
}

function getMatchingConfigDocument(mode) {
  validateMode(mode)

  return doc(
    firestoreDb,
    MATCHING_CONFIG_COLLECTION,
    mode,
  )
}

function getPublishedConfigDocument(mode) {
  validateMode(mode)

  return doc(
    firestoreDb,
    PUBLISHED_MATCHING_CONFIG_COLLECTION,
    mode,
  )
}

export async function getMatchingConfig(mode) {
  const snapshot = await getDoc(
    getMatchingConfigDocument(mode),
  )

  if (!snapshot.exists()) {
    return null
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  }
}

export async function getPublicPublishedMatchingConfig(
  mode,
) {
  const snapshot = await getDoc(
    getPublishedConfigDocument(mode),
  )

  if (!snapshot.exists()) {
    return null
  }

  return snapshot.data()?.config ?? null
}

export async function saveMatchingDraft(
  mode,
  config,
) {
  validateMode(mode)

  if (!config || typeof config !== 'object') {
    throw new Error(
      '[RIHLATI] Matching draft config is required.',
    )
  }

  await setDoc(
    getMatchingConfigDocument(mode),
    {
      mode,
      draft: config,
      draftUpdatedAt: serverTimestamp(),
    },
    {
      merge: true,
    },
  )
}

export async function publishMatchingConfig(
  mode,
  config,
) {
  validateMode(mode)

  if (!config || typeof config !== 'object') {
    throw new Error(
      '[RIHLATI] Published matching config is required.',
    )
  }

  await setDoc(
    getMatchingConfigDocument(mode),
    {
      mode,
      published: config,
      publishedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    {
      merge: true,
    },
  )

  await setDoc(
    getPublishedConfigDocument(mode),
    {
      mode,
      config,
      publishedAt: serverTimestamp(),
    },
  )
}