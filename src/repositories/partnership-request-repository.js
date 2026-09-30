import {
  addDoc,
  collection,
  serverTimestamp,
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