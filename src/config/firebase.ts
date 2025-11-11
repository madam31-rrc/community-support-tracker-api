import admin from 'firebase-admin';
import { env } from './env';

let initialized = false;
export function getFirebase() {
  if (!initialized) {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: env.firebase.projectId,
          clientEmail: env.firebase.clientEmail,
          privateKey: env.firebase.privateKey
        })
      });
    }
    initialized = true;
  }
  return admin;
}
