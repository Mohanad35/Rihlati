import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js'
import { firestoreDb } from '../firebase/firestore-db.js'

const JOURNEYS_COLLECTION = 'journeys'

export async function createJourney(ownerId, journey) {
  if (typeof ownerId !== 'string' || ownerId.length === 0) {
    throw new TypeError('A Journey requires an authenticated owner.')
  }

  if (!journey || typeof journey !== 'object' || Array.isArray(journey)) {
    throw new TypeError('A pending Journey snapshot is required.')
  }

  const {
    schemaVersion,
    journeyKey,
    title,
    summary,
    preferences,
    stops,
  } = journey
  const timestamp = serverTimestamp()
  const documentReference = await addDoc(collection(firestoreDb, JOURNEYS_COLLECTION), {
    ownerId,
    schemaVersion,
    journeyKey,
    title,
    summary,
    preferences,
    stops,
    createdAt: timestamp,
    updatedAt: timestamp,
  })

  return documentReference.id
}

export async function getJourneysByOwner(ownerId) {
  if (typeof ownerId !== 'string' || ownerId.length === 0) {
    throw new TypeError('An authenticated Journey owner is required.')
  }

  const ownerQuery = query(
    collection(firestoreDb, JOURNEYS_COLLECTION),
    where('ownerId', '==', ownerId),
  )
  const snapshot = await getDocs(ownerQuery)

  return snapshot.docs.map((documentSnapshot) => ({
    id: documentSnapshot.id,
    ...documentSnapshot.data(),
  }))
}
