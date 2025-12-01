import { adminAuth, adminDb, admin } from '@/src/lib/firebase-admin';
import type { NextApiRequest, NextApiResponse } from 'next';  

  
interface CreateAdminRequest {  
  email: string;  
  displayName: string;  
  password: string;  
  ownerEmail: string;  
}  
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {  
  if (req.method !== 'POST') {  
    return res.status(405).json({ error: 'Method not allowed' });  
  }  
  
  try {  
    const { email, displayName, password, ownerEmail } = req.body as CreateAdminRequest;  
  
    // Verify owner permissions  
    const ownerDoc = await adminDb.collection('admins').doc(ownerEmail).get();  
    if (!ownerDoc.exists || ownerDoc.data()?.role !== 'owner') {  
      return res.status(403).json({ error: 'No tienes permisos de owner' });  
    }  
  
    // Create user in Firebase Auth  
    await adminAuth.createUser({  
      email,  
      password,  
      displayName,  
    });  
  
    // Add to Firestore  
    await adminDb.collection('admins').doc(email).set({  
      email,  
      displayName,  
      role: 'admin',  
      createdBy: ownerDoc.data()?.createdBy,  
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });  
  
    res.status(200).json({ success: true });  
  } catch (error: unknown) {  
    console.error('Error creating admin:', error);  
    res.status(500).json({ error: error instanceof Error ? error.message : 'Error creating admin' });  
  }  
}