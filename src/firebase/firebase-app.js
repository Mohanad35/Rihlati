import {
  getApp,
  getApps,
  initializeApp,
} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js'
import { firebaseConfig } from './firebase-config.js'

export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
