import {
  createPartnershipRequest,
  getAllPartnershipRequests,
  updatePartnershipRequestStatus,
  getPartnershipRequestsByOwner,
} from '../repositories/partnership-request-repository.js';

import {
  clearPendingPartnership,
  getPendingPartnership,
} from './guest-session-service.js';

let saveInFlight = null;

const PARTNERSHIP_STATUSES = new Set([
  'New Request',
  'Under Review',
  'Contact Requested',
  'In Discussion',
  'Partner',
]);

function createPartnershipSaveError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

export function savePendingPartnershipRequest(user) {
  if (!user?.uid) {
    return Promise.reject(
      createPartnershipSaveError(
        'auth-required',
        'You must be signed in to submit a partnership request.'
      )
    );
  }

  if (saveInFlight) {
    return saveInFlight;
  }

  const pendingPartnership = getPendingPartnership();

  if (!pendingPartnership) {
    return Promise.reject(
      createPartnershipSaveError(
        'missing-partnership',
        'No pending partnership request was found.'
      )
    );
  }

  const operation = (async () => {
    const requestId = await createPartnershipRequest(
      user.uid,
      pendingPartnership
    );

    clearPendingPartnership();

    return {
      requestId,
      status: 'New Request',
    };
  })();

  saveInFlight = operation;

  const releaseSave = () => {
    if (saveInFlight === operation) {
      saveInFlight = null;
    }
  };

  void operation.then(releaseSave, releaseSave);

  return operation;
}

function getReviewValue(review, label) {
  if (!Array.isArray(review?.rows)) {
    return ''
  }

  const row = review.rows.find((item) => item?.label === label)

  return typeof row?.value === 'string'
    ? row.value
    : ''
}

function formatSubmittedDate(timestamp) {
  if (typeof timestamp?.toDate !== 'function') {
    return 'Unknown date'
  }

  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(timestamp.toDate())
}

function mapPartnershipRequestForAdmin(request) {
  return {
    id: request.id,

    business:
      request.business?.name
      || getReviewValue(request.review, 'Business')
      || 'Unnamed business',

    type:
      getReviewValue(request.review, 'Type')
      || request.business?.type
      || 'Not specified',

    region:
      getReviewValue(request.review, 'Location')
      || request.business?.location
      || 'Not specified',

    submitted: formatSubmittedDate(request.createdAt),

    initialStatus:
      request.status
      || 'New Request',

    audience:
      getReviewValue(request.review, 'Best-fit segment')
      || 'Not specified',

    placement:
      getReviewValue(request.review, 'Journey placement')
      || 'Not specified',

    experience:
      getReviewValue(request.review, 'Experience')
      || 'Not specified',
  }
}

export async function getAdminPartnershipRequests(user) {
  if (!user?.uid) {
    throw createPartnershipSaveError(
      'auth-required',
      'You must be signed in to view partnership requests.'
    )
  }

  const requests = await getAllPartnershipRequests()

  return [...requests]
    .sort((a, b) => {
      const aTime = typeof a.createdAt?.toMillis === 'function'
        ? a.createdAt.toMillis()
        : 0

      const bTime = typeof b.createdAt?.toMillis === 'function'
        ? b.createdAt.toMillis()
        : 0

      return bTime - aTime
    })
    .map(mapPartnershipRequestForAdmin)
}

export async function updateAdminPartnershipStatus(
  user,
  requestId,
  status
) {
  if (!user?.uid) {
    throw createPartnershipSaveError(
      'auth-required',
      'You must be signed in to update partnership requests.'
    );
  }

  if (!requestId) {
    throw createPartnershipSaveError(
      'missing-request-id',
      'Partnership request ID is required.'
    );
  }

  if (!PARTNERSHIP_STATUSES.has(status)) {
    throw createPartnershipSaveError(
      'invalid-status',
      'Invalid partnership status.'
    );
  }

  await updatePartnershipRequestStatus(
    requestId,
    status
  );

  return {
    requestId,
    status,
  };
}

export async function getCurrentUserPartnershipRequests(user) {
  if (!user?.uid) {
    throw createPartnershipSaveError(
      'auth-required',
      'You must be signed in to view your partnership requests.'
    );
  }

  const requests = await getPartnershipRequestsByOwner(user.uid);

  return [...requests].sort((a, b) => {
    const aTime = typeof a.createdAt?.toMillis === 'function'
      ? a.createdAt.toMillis()
      : 0;

    const bTime = typeof b.createdAt?.toMillis === 'function'
      ? b.createdAt.toMillis()
      : 0;

    return bTime - aTime;
  });
}