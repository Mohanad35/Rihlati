import { createPartnershipRequest } from '../repositories/partnership-request-repository.js';

import {
  clearPendingPartnership,
  getPendingPartnership,
} from './guest-session-service.js';

let saveInFlight = null;

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