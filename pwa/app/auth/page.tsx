// pwa/app/auth/page.tsx  
'use client';  
  
import { useState } from 'react';  
import { useRouter } from 'next/navigation';  
import { useForm } from 'react-hook-form';  
import { z } from 'zod';  
import { zodResolver } from '@hookform/resolvers/zod';  
import { auth } from '@/src/lib/firebase';  
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';  
  
const authSchema = z.object({  
  email: z.string().email('Email inválido'),  
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),  
});  
  
type AuthFormValues = z.infer<typeof authSchema>;  
  
export default function AuthPage() {  
  const [isLogin, setIsLogin] = useState(true);  
  const [error, setError] = useState('');  
  const [loading, setLoading] = useState(false);  
  const router = useRouter();  
    
  const { register, handleSubmit, formState } = useForm<AuthFormValues>({  
    resolver: zodResolver(authSchema),  
  });  
  
  const onSubmit = handleSubmit(async (values) => {  
    setError('');  
    setLoading(true);  
      
    try {  
      if (isLogin) {  
        await signInWithEmailAndPassword(auth, values.email, values.password);  
      } else {  
        await createUserWithEmailAndPassword(auth, values.email, values.password);  
      }  
      router.push('/');  
    } catch (error: any) {  
      setError(error.message || 'Error de autenticación');  
    } finally {  
      setLoading(false);  
    }  
  });  
  
  return (  
    <main className="flex min-h-screen items-center justify-center p-4">  
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4">  
        <h1 className="text-2xl font-semibold text-center">  
          {isLogin ? 'Iniciar Sesión' : 'Registrarse'}  
        </h1>  
          
        {error && (  
          <div className="rounded border border-red-500 bg-red-500/10 p-3">  
            <p className="text-red-500 text-sm">{error}</p>  
          </div>  
        )}  
  
        <div>  
          <label className="block text-sm mb-1">Email</label>  
          <input  
            type="email"  
            {...register('email')}  
            className="w-full rounded border px-3 py-2 bg-transparent"  
            placeholder="tu@email.com"  
          />  
          {formState.errors.email && (  
            <p className="text-red-500 text-sm mt-1">{formState.errors.email.message}</p>  
          )}  
        </div>  
  
        <div>  
          <label className="block text-sm mb-1">Contraseña</label>  
          <input  
            type="password"  
            {...register('password')}  
            className="w-full rounded border px-3 py-2 bg-transparent"  
            placeholder="••••••••"  
          />  
          {formState.errors.password && (  
            <p className="text-red-500 text-sm mt-1">{formState.errors.password.message}</p>  
          )}  
        </div>  
  
        <button  
          type="submit"  
          disabled={loading}  
          className="w-full px-4 py-2 rounded bg-emerald-500 text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed"  
        >  
          {loading ? 'Cargando...' : (isLogin ? 'Entrar' : 'Crear Cuenta')}  
        </button>  
  
        <button  
          type="button"  
          onClick={() => setIsLogin(!isLogin)}  
          className="w-full text-sm opacity-70 hover:opacity-100 transition"  
        >  
          {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}  
        </button>  
      </form>  
    </main>  
  );  
}