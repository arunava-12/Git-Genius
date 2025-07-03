import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Debug: Log configuration (remove in production)
if (typeof window !== 'undefined') {
  console.log('Firebase Config:', {
    apiKey: firebaseConfig.apiKey ? '***' : 'MISSING',
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    appId: firebaseConfig.appId ? '***' : 'MISSING'
  })
}

// Initialize Firebase client
let app
try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
} catch (error) {
  console.error('Firebase initialization error:', error)
  throw error
}

const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

export { auth, googleProvider }
