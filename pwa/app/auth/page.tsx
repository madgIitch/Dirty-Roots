// pwa/app/auth/page.tsx  
'use client';  
  
import { useState } from 'react';  
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';  
  
export default function AuthPage() {  
  const [isLogin, setIsLogin] = useState(true);  
  const [email, setEmail] = useState('');  
  const [password, setPassword] = useState('');  
  const auth = getAuth();  
  
  const handleSubmit = async (e: React.FormEvent) => {  
    e.preventDefault();  
    try {  
      if (isLogin) {  
        await signInWithEmailAndPassword(auth, email, password);  
      } else {  
        await createUserWithEmailAndPassword(auth, email, password);  
      }  
      // Redirigir al dashboard o home  
    } catch (error) {  
      console.error('Error de autenticación:', error);  
    }  
  };  
  
  return (  
    <main className="flex min-h-screen items-center justify-center">  
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">  
        <h1>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</h1>  
        <input  
          type="email"  
          value={email}  
          onChange={(e) => setEmail(e.target.value)}  
          placeholder="Email"  
          required  
        />  
        <input  
          type="password"  
          value={password}  
          onChange={(e) => setPassword(e.target.value)}  
          placeholder="Contraseña"  
          required  
        />  
        <button type="submit">  
          {isLogin ? 'Entrar' : 'Crear Cuenta'}  
        </button>  
        <button type="button" onClick={() => setIsLogin(!isLogin)}>  
          {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}  
        </button>  
      </form>  
    </main>  
  );  
}