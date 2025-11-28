'use client';  
  
import { useEffect, useState } from 'react';  
import { auth } from '@/src/lib/firebase';  
import { useRouter } from 'next/navigation';  
import { getAdminByEmail, Admin } from '@/src/lib/firestore';  
  
export default function OwnerRoute({ children }: { children: React.ReactNode }) {  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState<string | null>(null);  
  const router = useRouter();  
  
  useEffect(() => {  
    const checkOwnerRole = async () => {  
      try {  
        setError(null);  
        const user = auth.currentUser;  
          
        // Verificar que el usuario existe y no es anónimo  
        if (!user || user.isAnonymous) {  
          router.push('/auth');  
          return;  
        }  
  
        // Verificar si el usuario tiene rol de owner  
        const admin: Admin | null = await getAdminByEmail(user.email || '');  
        if (!admin || admin.role !== 'owner') {  
          router.push('/auth');  
          return;  
        }  
  
        // Usuario verificado como owner  
        setLoading(false);  
      } catch (error) {  
        console.error('Error verificando rol de owner:', error);  
        setError('Error verificando permisos');  
        setTimeout(() => {  
          router.push('/auth');  
        }, 2000);  
      }  
    };  
  
    checkOwnerRole();  
  }, [router]);  
  
  if (loading) {  
    return (  
      <div style={{   
        display: 'flex',   
        justifyContent: 'center',   
        alignItems: 'center',   
        height: '100vh',   
        background: '#0B0B0B',  
        flexDirection: 'column',  
        gap: '16px'  
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
        <div style={{ color: '#B6B9BF', fontSize: '16px' }}>  
          Verificando permisos de administrador...  
        </div>  
        {error && (  
          <div style={{ color: '#FF60A8', fontSize: '14px', textAlign: 'center' }}>  
            {error}  
          </div>  
        )}  
        <style jsx>{`  
          @keyframes spin {  
            to { transform: rotate(360deg); }  
          }  
        `}</style>  
      </div>  
    );  
  }  
  
  return <>{children}</>;  
}