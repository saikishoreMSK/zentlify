// Server-side Firebase Admin SDK.
//
// Used ONLY in API route handlers. The Admin SDK authenticates with a service
// account and bypasses Firestore security rules, so it must never be imported
// into client components. Writes are gated by the admin's NextAuth session in
// the route handlers before this is touched.

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getServiceAccount() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Private keys in env vars usually have literal "\n" sequences; restore them.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin credentials. Set FIREBASE_PROJECT_ID, " +
        "FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in the environment."
    );
  }

  return { projectId, clientEmail, privateKey };
}

// Lazily initialize so importing this module (e.g. during `next build`) never
// throws when credentials aren't present — only an actual write does.
let _db = null;

export function getAdminDb() {
  if (_db) return _db;
  const app =
    getApps().length > 0
      ? getApps()[0]
      : initializeApp({ credential: cert(getServiceAccount()) });
  _db = getFirestore(app);
  return _db;
}
