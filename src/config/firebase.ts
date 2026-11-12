/**
 * firebase.ts  — Firebase initialisation (placeholder)
 * Full configuration wired in Phase 2.
 *
 * We use environment variables (EXPO_PUBLIC_FIREBASE_*) so the config
 * is never hard-coded in source control.  See .env.example for the list
 * of variables you need to set before Phase 2.
 *
 * HOW TO SET UP (Phase 2 steps):
 *  1. Create a Firebase project at https://console.firebase.google.com
 *  2. Add a Web app to get the config object
 *  3. Copy .env.example → .env and fill in the values
 *  4. Enable Email/Password sign-in under Authentication → Sign-in method
 */

// TODO (Phase 2): uncomment and configure Firebase
// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
//
// const firebaseConfig = {
//   apiKey:            process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
//   authDomain:        process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId:         process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket:     process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId:             process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
// };
//
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);

export {}; // keeps TypeScript happy until Phase 2 uncomments the above
