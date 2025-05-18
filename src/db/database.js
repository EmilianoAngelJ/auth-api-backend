import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Import your service account credentials JSON file
import serviceAccount from './db-credential.json' with { type: 'json' };

// Initialize Firebase Admin SDK with your service account credentials
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

export { db };
