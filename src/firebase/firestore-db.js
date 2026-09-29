import { getFirestore } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js'
import { firebaseApp } from './firebase-app.js'

export const firestoreDb = getFirestore(firebaseApp)
