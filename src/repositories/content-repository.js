import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js'
import { firestoreDb } from '../firebase/firestore-db.js'

const CONTENT_COLLECTION = 'content'

export async function createContentItem(content) {
  if (!content) {
    throw new Error('Content data is required')
  }

  const {
    title,
    contentType,
    category,
    targetAudience,
    location = '',
    summary,
    imageUrl = '',
    status,
  } = content

  const timestamp = serverTimestamp()

  const documentReference = await addDoc(
    collection(firestoreDb, CONTENT_COLLECTION),
    {
      schemaVersion: 1,
      title,
      contentType,
      category,
      targetAudience,
      location,
      summary,
      imageUrl,
      status,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  )

  return documentReference.id
}

export async function getAllContentItems() {
  const snapshot = await getDocs(
    collection(firestoreDb, CONTENT_COLLECTION),
  )

  return snapshot.docs.map((documentSnapshot) => ({
    id: documentSnapshot.id,
    ...documentSnapshot.data(),
  }))
}

export async function getPublishedContentItems() {
  const publishedQuery = query(
    collection(firestoreDb, CONTENT_COLLECTION),
    where('status', '==', 'Published'),
  )

  const snapshot = await getDocs(publishedQuery)

  return snapshot.docs.map((documentSnapshot) => ({
    id: documentSnapshot.id,
    ...documentSnapshot.data(),
  }))
}

export async function updateContentItem(contentId, content) {
  if (!contentId) {
    throw new Error('Content ID is required')
  }

  if (!content) {
    throw new Error('Content data is required')
  }

  const {
    title,
    contentType,
    category,
    targetAudience,
    location = '',
    summary,
    imageUrl = '',
    status,
  } = content

  await updateDoc(
    doc(
      firestoreDb,
      CONTENT_COLLECTION,
      contentId,
    ),
    {
      title,
      contentType,
      category,
      targetAudience,
      location,
      summary,
      imageUrl,
      status,
      updatedAt: serverTimestamp(),
    },
  )
}

export async function deleteContentItem(contentId) {
  if (!contentId) {
    throw new Error('Content ID is required')
  }

  await deleteDoc(
    doc(
      firestoreDb,
      CONTENT_COLLECTION,
      contentId,
    ),
  )
}