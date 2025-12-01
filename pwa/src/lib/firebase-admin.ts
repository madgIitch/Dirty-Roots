import admin from 'firebase-admin';  
import { getApps } from 'firebase-admin/app';  
  
console.log('=== FIREBASE ADMIN DEBUG ===');  
console.log('Environment variables:');  
console.log('PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);  
console.log('CLIENT_EMAIL:', process.env.FIREBASE_ADMIN_CLIENT_EMAIL);  
console.log('PRIVATE_KEY exists:', !!process.env.FIREBASE_ADMIN_PRIVATE_KEY);  
  
if (!getApps().length) {  
  try {  
    admin.initializeApp({  
      credential: admin.credential.cert({  
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,  
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,  
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),  
      }),  
      databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`,  
    });  
    console.log('✅ Firebase Admin initialized successfully');  
  } catch (error) {  
    console.error('❌ Error initializing Firebase Admin:', error);  
    throw error;  
  }  
}  
  
export const adminAuth = admin.auth();  
export const adminDb = admin.firestore();
export { admin };
