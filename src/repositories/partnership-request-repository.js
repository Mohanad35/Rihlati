import {
  addDoc,
  collection,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
  query,
  where,
} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';
import { firestoreDb } from '../firebase/firestore-db.js';

const PARTNERSHIP_REQUESTS_COLLECTION = 'partnershipRequests';

export async function createPartnershipRequest(ownerId, partnership) {
  if (!ownerId) {
    throw new Error('ownerId is required');
  }

  if (!partnership) {
    throw new Error('Partnership data is required');
  }

  const {
    schemaVersion,
    businessProfile,
    business,
    audienceContext,
    placement,
    review,
  } = partnership;

  const timestamp = serverTimestamp();

  const documentReference = await addDoc(
    collection(firestoreDb, PARTNERSHIP_REQUESTS_COLLECTION),
    {
      ownerId,
      schemaVersion,
      businessProfile,
      business,
      audienceContext,
      placement,
      review,
      status: 'New Request',
      createdAt: timestamp,
      updatedAt: timestamp,
    }
  );

  return documentReference.id;

}

export async function getAllPartnershipRequests() {
  const snapshot = await getDocs(
    collection(firestoreDb, PARTNERSHIP_REQUESTS_COLLECTION)
  );

  return snapshot.docs.map((documentSnapshot) => ({
    id: documentSnapshot.id,
    ...documentSnapshot.data(),
  }));
}

export async function updatePartnershipRequestStatus(
  requestId,
  status
) {
  if (!requestId) {
    throw new Error('Partnership request ID is required');
  }

  if (!status) {
    throw new Error('Partnership status is required');
  }

  await updateDoc(
    doc(
      firestoreDb,
      PARTNERSHIP_REQUESTS_COLLECTION,
      requestId
    ),
    {
      status,
      updatedAt: serverTimestamp(),
    }
  );
}

export async function getPartnershipRequestsByOwner(ownerId) {
  if (!ownerId) {
    throw new Error('ownerId is required');
  }

  const partnershipQuery = query(
    collection(firestoreDb, PARTNERSHIP_REQUESTS_COLLECTION),
    where('ownerId', '==', ownerId)
  );

  const snapshot = await getDocs(partnershipQuery);

  return snapshot.docs.map((documentSnapshot) => ({
    id: documentSnapshot.id,
    ...documentSnapshot.data(),
  }));
}