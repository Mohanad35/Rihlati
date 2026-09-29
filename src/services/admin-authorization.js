import {
  doc,
  getDoc,
} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js'
import { firestoreDb } from '../firebase/firestore-db.js'

const ADMINS_COLLECTION = 'admins'

export async function isAdmin(uid) {
  if (!uid) return false

  const snapshot = await getDoc(doc(firestoreDb, ADMINS_COLLECTION, uid))

  return snapshot.exists()
}
