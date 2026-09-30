import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js'
import { firestoreDb } from '../firebase/firestore-db.js'

const INVESTMENTS_COLLECTION = 'investments'

export async function createInvestment(ownerId, investment) {
  if (typeof ownerId !== 'string' || ownerId.length === 0) {
    throw new TypeError('An Investment requires an authenticated owner.')
  }

  if (!investment || typeof investment !== 'object' || Array.isArray(investment)) {
    throw new TypeError('A pending Investment snapshot is required.')
  }

  const {
    schemaVersion,
    opportunityKey,
    criteria,
    matches,
    context,
  } = investment
  const timestamp = serverTimestamp()
  const documentReference = await addDoc(collection(firestoreDb, INVESTMENTS_COLLECTION), {
    ownerId,
    schemaVersion,
    opportunityKey,
    criteria,
    matches,
    context,
    createdAt: timestamp,
    updatedAt: timestamp,
  })

  return documentReference.id
}

export async function getInvestmentsByOwner(ownerId) {
  if (typeof ownerId !== 'string' || ownerId.length === 0) {
    throw new TypeError('An authenticated Investment owner is required.')
  }

  const ownerQuery = query(
    collection(firestoreDb, INVESTMENTS_COLLECTION),
    where('ownerId', '==', ownerId),
  )
  const snapshot = await getDocs(ownerQuery)

  return snapshot.docs.map((documentSnapshot) => ({
    id: documentSnapshot.id,
    ...documentSnapshot.data(),
  }))
}
