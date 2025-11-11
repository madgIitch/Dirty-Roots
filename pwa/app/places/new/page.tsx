// src/app/places/new/page.tsx  
"use client";  
  
import { useRouter } from "next/navigation";  
import PlaceForm from "@/src/components/PlaceForm";  
import Link from "next/link";  
  
export default function NewPlacePage() {  
  const router = useRouter();  
  
  return (  
    <main className="min-h-screen p-4 max-w-4xl mx-auto">  
      <div className="mb-6 flex items-center justify-between">  
        <div>  
          <h1 className="text-2xl font-semibold mb-2">Añadir lugar calmado</h1>  
          <p className="text-sm opacity-70">  
            Comparte un lugar tranquilo que hayas descubierto  
          </p>  
        </div>  
        <Link   
          href="/places"   
          className="px-4 py-2 rounded border opacity-70 hover:opacity-100 transition text-sm"  
        >  
          ← Volver  
        </Link>  
      </div>  
        
      <PlaceForm />  
    </main>  
  );  
}