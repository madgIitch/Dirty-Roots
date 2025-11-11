// app/page.tsx  
'use client';  
  
import { useEffect, useState } from 'react';  
import { useRouter } from 'next/navigation';  
import { onAuthStateChanged, signOut } from 'firebase/auth';  
import { auth } from '@/src/lib/firebase';  
import Link from 'next/link';  
  
export default function HomePage() {  
  const [loading, setLoading] = useState(true);  
  const [authenticated, setAuthenticated] = useState(false);  
  const router = useRouter();  
  
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
  }, [router]);  
  
  const handleLogout = async () => {  
    try {  
      await signOut(auth);  
      router.push('/auth');  
    } catch (error) {  
      console.error('Error al cerrar sesión:', error);  
    }  
  };  
  
  if (loading) {  
    return (  
      <main className="flex min-h-screen items-center justify-center">  
        <div>Cargando...</div>  
      </main>  
    );  
  }  
  
  if (!authenticated) {  
    return null;  
  }  
  
  return (  
    <main className="flex min-h-screen items-center justify-center p-4">  
      <div className="w-full max-w-md space-y-6">  
        <div className="flex justify-between items-center">  
          <h1 className="text-3xl font-semibold">Dirty Roots PWA</h1>  
          <button  
            onClick={handleLogout}  
            className="px-3 py-1 text-sm rounded border opacity-70 hover:opacity-100 transition"  
          >  
            Cerrar sesión  
          </button>  
        </div>  
        <p className="text-center opacity-80">¿Qué quieres explorar?</p>  
          
        <div className="grid gap-4">  
          <Link href="/places">  
            <div className="rounded border p-6 hover:bg-white/5 transition cursor-pointer">  
              <h2 className="text-xl font-medium mb-2">🗺️ Lugares</h2>  
              <p className="text-sm opacity-70">  
                Descubre y comparte lugares calmados  
              </p>  
            </div>  
          </Link>  
  
          <Link href="/qa">  
            <div className="rounded border p-6 hover:bg-white/5 transition cursor-pointer">  
              <h2 className="text-xl font-medium mb-2">💬 Preguntas</h2>  
              <p className="text-sm opacity-70">  
                Participa en la comunidad de preguntas y respuestas  
              </p>  
            </div>  
          </Link>  
        </div>  
      </div>  
    </main>  
  );  
}