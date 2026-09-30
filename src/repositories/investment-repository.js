import {
  addDoc,
  collection,
  serverTimestamp,
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
