// pwa/app/components/ProtectedRoute.tsx  
'use client';  
  
import { useEffect, useState } from 'react';  
import { getAuth, onAuthStateChanged } from 'firebase/auth';  
import { useRouter } from 'next/navigation';  
  
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {  
  const [loading, setLoading] = useState(true);  
  const [authenticated, setAuthenticated] = useState(false);  
  const router = useRouter();  
  const auth = getAuth();  
  
  useEffect(() => {  
    const unsubscribe = onAuthStateChanged(auth, (user) => {  
      if (user) {  
        setAuthenticated(true);  
      } else {  
        router.push('/auth');  
      }  
      setLoading(false);  
    });  
  
    return () => unsubscribe();  
  }, [auth, router]);  
  
  if (loading) return <div>Cargando...</div>;  
  if (!authenticated) return null;  
  
  return <>{children}</>;  
}