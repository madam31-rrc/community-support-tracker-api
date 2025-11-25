import admin from 'firebase-admin';
import * as path from 'path';

let initialized = false;

export function getFirebaseApp(): admin.app.App {
  if (!initialized) {
    const serviceAccount = require(path.join(__dirname, '../../serviceAccountKey.json'));
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
    });
    
    initialized = true;
    console.log('✅ Firebase Admin initialized successfully');
    console.log('📦 Project ID:', serviceAccount.project_id);
  }
  return admin.app();
}