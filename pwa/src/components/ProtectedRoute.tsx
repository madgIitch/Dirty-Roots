// pwa/app/components/ProtectedRoute.tsx  
'use client';  
  
import { useEffect, useState } from 'react';  
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';  
import { useRouter } from 'next/navigation';  
  
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {  
  const [loading, setLoading] = useState(true);  
  const [authenticated, setAuthenticated] = useState(false);  
  const router = useRouter();  
  const auth = getAuth();  
  
  useEffect(() => {  
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {  
      if (user && !user.isAnonymous) {  
        // Solo usuarios autenticados con email (no anónimos)  
        setAuthenticated(true);  
      } else {  
        // Redirigir al login de administradores si no hay usuario o es anónimo  
        router.push('/auth');  
      }  
      setLoading(false);  
    });  
  
    return () => unsubscribe();  
  }, [auth, router]);  
  
  if (loading) {  
    return (  
      <div style={{  
        display: 'flex',  
        alignItems: 'center',  
        justifyContent: 'center',  
        height: '100vh',  
        background: '#0B0B0B'  
      }}>  
        <div style={{  
          display: 'inline-block',  
          width: '48px',  
          height: '48px',  
          border: '4px solid #A4CB3E',  
          borderTopColor: 'transparent',  
          borderRadius: '50%',  
          animation: 'spin 1s linear infinite'  
        }}></div>  
        <style jsx>{`  
          @keyframes spin {  
            to { transform: rotate(360deg); }  
          }  
        `}</style>  
      </div>  
    );  
  }  
  
  if (!authenticated) return null;  
  
  return <>{children}</>;  
}