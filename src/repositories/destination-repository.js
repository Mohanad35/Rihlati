import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js'

import { firestoreDb } from '../firebase/firestore-db.js'

const DESTINATIONS_COLLECTION = 'destinations'

export async function createDestination(destination) {
  if (
    !destination
    || typeof destination !== 'object'
    || Array.isArray(destination)
  ) {
    throw new TypeError(
      'Destination data is required.',
    )
  }

  const timestamp =
    serverTimestamp()

  const documentReference =
    await addDoc(
      collection(
        firestoreDb,
        DESTINATIONS_COLLECTION,
      ),
      {
        name: destination.name,
        governorateId:
          destination.governorateId,

        category:
          destination.category,

        description:
          destination.description,

        imageUrl:
          destination.imageUrl ?? '',

        touristTags:
          Array.isArray(
            destination.touristTags,
          )
            ? destination.touristTags
            : [],

        investorTags:
          Array.isArray(
            destination.investorTags,
          )
            ? destination.investorTags
            : [],

        status:
          destination.status
          ?? 'Published',

        createdAt: timestamp,
        updatedAt: timestamp,
      },
    )

  return documentReference.id
}

export async function getAllDestinations() {
  const snapshot =
    await getDocs(
      collection(
        firestoreDb,
        DESTINATIONS_COLLECTION,
      ),
    )

  return snapshot.docs.map(
    (documentSnapshot) => ({
      id: documentSnapshot.id,
      ...documentSnapshot.data(),
    }),
  )
}

export async function updateDestination(
  destinationId,
  updates,
) {
  if (!destinationId) {
    throw new Error(
      'Destination ID is required.',
    )
  }

  await updateDoc(
    doc(
      firestoreDb,
      DESTINATIONS_COLLECTION,
      destinationId,
    ),
    {
      ...updates,
      updatedAt:
        serverTimestamp(),
    },
  )
}

export async function deleteDestination(
  destinationId,
) {
  if (!destinationId) {
    throw new Error(
      'Destination ID is required.',
    )
  }

  await deleteDoc(
    doc(
      firestoreDb,
      DESTINATIONS_COLLECTION,
      destinationId,
    ),
  )
}