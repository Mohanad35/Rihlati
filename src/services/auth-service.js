import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  signOut,
} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js'
import { firebaseApp } from '../firebase/firebase-app.js'

const auth = getAuth(firebaseApp)

export function registerWithEmailPassword(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
}

export function signInWithEmailPassword(email, password) {
  return firebaseSignInWithEmailAndPassword(auth, email, password)
}

export function signOutCurrentUser() {
  return signOut(auth)
}

export function observeAuthState(callback) {
  return onAuthStateChanged(auth, callback)
}

export function getCurrentUser() {
  return auth.currentUser
}
