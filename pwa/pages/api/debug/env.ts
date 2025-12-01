import type { NextApiRequest, NextApiResponse } from 'next';  
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {  
  res.status(200).json({  
    environment: process.env.NODE_ENV,  
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,  
    hasAdminEmail: !!process.env.FIREBASE_ADMIN_CLIENT_EMAIL,  
    hasAdminKey: !!process.env.FIREBASE_ADMIN_PRIVATE_KEY,  
  });  
}