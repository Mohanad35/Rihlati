import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js'
import { firestoreDb } from '../firebase/firestore-db.js'

const USERS_COLLECTION = 'users'
const ALLOWED_PERSONAS = new Set(['tourist', 'investor'])

function getUserDocument(uid) {
  return doc(firestoreDb, USERS_COLLECTION, uid)
}

function normalizePersonas(personas) {
  if (!Array.isArray(personas) || personas.length === 0) {
    throw new TypeError('A user profile requires at least one persona.')
  }

  const normalizedPersonas = [...new Set(personas)]

  if (normalizedPersonas.some((persona) => !ALLOWED_PERSONAS.has(persona))) {
    throw new TypeError('User personas may contain only "tourist" and "investor".')
  }

  return normalizedPersonas
}

export function createUserProfile(uid, { displayName, email, personas }) {
  const timestamp = serverTimestamp()

  return setDoc(getUserDocument(uid), {
    displayName,
    email,
    personas: normalizePersonas(personas),
    createdAt: timestamp,
    updatedAt: timestamp,
  })
}

export async function getUserProfile(uid) {
  const snapshot = await getDoc(getUserDocument(uid))

  return snapshot.exists() ? snapshot.data() : null
}

export async function getAllUsers() {
  const snapshot = await getDocs(
    collection(
      firestoreDb,
      USERS_COLLECTION,
    ),
  )

  return snapshot.docs.map(
    (documentSnapshot) => ({
      id: documentSnapshot.id,
      ...documentSnapshot.data(),
    }),
  )
}

export function updateUserProfile(uid, updates) {
  const allowedUpdates = {}

  if (Object.hasOwn(updates, 'displayName')) allowedUpdates.displayName = updates.displayName
  if (Object.hasOwn(updates, 'email')) allowedUpdates.email = updates.email
  if (Object.hasOwn(updates, 'personas')) {
    allowedUpdates.personas = normalizePersonas(updates.personas)
  }

  return updateDoc(getUserDocument(uid), {
    ...allowedUpdates,
    updatedAt: serverTimestamp(),
  })
}
