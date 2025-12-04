// pages/api/invitations/process.ts  
import type { NextApiRequest, NextApiResponse } from 'next';  
import admin from 'firebase-admin';  
import { adminDb } from '@/src/lib/firebase-admin';  
  
export default async function handler(  
  req: NextApiRequest,  
  res: NextApiResponse  
) {  
  if (req.method !== 'POST') {  
    return res.status(405).json({ error: 'Method not allowed' });  
  }  
  
  try {  
    const { inviteCode, registeredUid } = req.body;  
      
    // Lógica de processInvitationRegistration con Admin SDK  
    const inviteRef = adminDb.collection('invitations').doc(inviteCode);  
    const inviteSnap = await inviteRef.get();  
      
    if (!inviteSnap.exists || inviteSnap.data()?.used) {  
      return res.status(400).json({ error: 'Invitación inválida' });  
    }  
      
    const inviterUid = inviteSnap.data()?.inviterUid;  
      
    // Actualizar invitación  
    await inviteRef.update({  
      used: true,  
      registeredUid,  
      usedAt: admin.firestore.FieldValue.serverTimestamp()  
    });  
      
    // Actualizar perfil del inviter con Admin SDK (sin restricciones de reglas)  
    const profileRef = adminDb.collection('userProfiles').doc(inviterUid);  
    const profile = await profileRef.get();  
      
    if (profile.exists) {  
      const invitedFriends = profile.data()?.challengeProgress?.invitedFriends || [];  
      if (!invitedFriends.includes(registeredUid)) {  
        await profileRef.update({  
          challengeProgress: {  
            ...profile.data()?.challengeProgress,  
            invitedFriends: [...invitedFriends, registeredUid]  
          },  
          updatedAt: admin.firestore.FieldValue.serverTimestamp()  
        });  
      }  
    }  
      
    res.status(200).json({ success: true });  
  } catch (error) {  
    console.error('Error processing invitation:', error);  
    res.status(500).json({ error: 'Error procesando invitación' });  
  }  
}