// src/components/PlaceForm.tsx  
"use client";  
  
import { useState } from "react";  
import { useForm } from "react-hook-form";  
import { z } from "zod";  
import { zodResolver } from "@hookform/resolvers/zod";  
import MapCanvas from "./MapCanvas";  
import { addPlace } from "@/src/lib/firestore";  
import { auth } from "@/src/lib/firebase";  
  
// Función para convertir DMS a decimal  
function parseDMS(dmsString: string): { lat: number; lng: number } | null {  
  // Regex para formato: 52°31'12.0"N 13°24'18.0"E  
  const regex = /(\d+)°(\d+)'([\d.]+)"([NS])\s+(\d+)°(\d+)'([\d.]+)"([EW])/;  
  const match = dmsString.trim().match(regex);  
    
  if (!match) return null;  
    
  const [_, latDeg, latMin, latSec, latDir, lngDeg, lngMin, lngSec, lngDir] = match;  
    
  let lat = parseInt(latDeg) + parseInt(latMin) / 60 + parseFloat(latSec) / 3600;  
  let lng = parseInt(lngDeg) + parseInt(lngMin) / 60 + parseFloat(lngSec) / 3600;  
    
  if (latDir === 'S') lat = -lat;  
  if (lngDir === 'W') lng = -lng;  
    
  return { lat, lng };  
}  
  
// Schema actualizado con city, photo y coordsInput  
const schema = z.object({  
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),  
  city: z.string().min(2, "La ciudad debe tener al menos 2 caracteres"),  
  description: z.string().optional(),  
  photo: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),  
  coordsInput: z.string().optional(), // Campo para DMS  
  tags: z.string().optional(),  
  noiseLevel: z.string().optional(),  
});  
  
type FormValues = z.infer<typeof schema>;  
  
export default function PlaceForm() {  
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);  
  const { register, handleSubmit, formState, reset } = useForm<FormValues>({  
    resolver: zodResolver(schema),  
  });  
  
  const onSubmit = handleSubmit(async (values) => {  
    let finalCoords = coords;  
      
    // Si hay coordsInput, intentar parsear DMS  
    if (values.coordsInput && values.coordsInput.trim()) {  
      const parsed = parseDMS(values.coordsInput);  
      if (parsed) {  
        finalCoords = parsed;  
      } else {  
        alert('Formato de coordenadas inválido. Usa: 52°31\'12.0"N 13°24\'18.0"E');  
        return;  
      }  
    }  
      
    if (!finalCoords) {  
      alert("Debes proporcionar coordenadas (texto o clic en mapa).");  
      return;  
    }  
      
    // Transformar noiseLevel a número  
    const noiseLevel = values.noiseLevel && values.noiseLevel !== ""   
      ? Number(values.noiseLevel)   
      : undefined;  
      
    const uid = auth.currentUser?.uid;  
    if (!uid) {  
      alert("Debes estar autenticado para crear un lugar.");  
      return;  
    }  
      
    await addPlace({  
      name: values.name,  
      city: values.city,  
      description: values.description || "",  
      photo: values.photo || null,  
      coords: finalCoords,  
      tags: values.tags ? values.tags.split(",").map(t => t.trim()).filter(Boolean) : [],  
      noiseLevel: noiseLevel ?? 0,  
      createdBy: uid,  
    });  
      
    reset();  
    setCoords(null);  
    alert("Lugar creado ✅");  
  });  
  
  return (  
    <div className="space-y-4">  
      <MapCanvas selectable onSelectPosition={(lat, lng) => setCoords({ lat, lng })} />  
        
      <form onSubmit={onSubmit} className="space-y-3">  
        <div>  
          <label className="block text-sm mb-1">Nombre del lugar</label>  
          <input   
            {...register("name")}   
            className="w-full rounded border px-3 py-2 bg-transparent"   
            placeholder="Secret Courtyard, Berlin"   
          />  
          {formState.errors.name && (  
            <p className="text-red-500 text-sm mt-1">{formState.errors.name.message}</p>  
          )}  
        </div>  
  
        <div>  
          <label className="block text-sm mb-1">Ciudad</label>  
          <input   
            {...register("city")}   
            className="w-full rounded border px-3 py-2 bg-transparent"   
            placeholder="Berlin"   
          />  
          {formState.errors.city && (  
            <p className="text-red-500 text-sm mt-1">{formState.errors.city.message}</p>  
          )}  
        </div>  
  
        <div>  
          <label className="block text-sm mb-1">Descripción</label>  
          <textarea   
            {...register("description")}   
            className="w-full rounded border px-3 py-2 bg-transparent"   
            rows={3}   
            placeholder="A hidden patio where plants grow unbothered..."   
          />  
        </div>  
  
        <div>  
          <label className="block text-sm mb-1">Foto URL (opcional)</label>  
          <input   
            {...register("photo")}   
            className="w-full rounded border px-3 py-2 bg-transparent"   
            placeholder="https://ejemplo.com/foto.jpg"   
          />  
          {formState.errors.photo && (  
            <p className="text-red-500 text-sm mt-1">{formState.errors.photo.message}</p>  
          )}  
        </div>  
  
        <div>  
          <label className="block text-sm mb-1">  
            Coordenadas DMS (formato: 52°31'12.0"N 13°24'18.0"E)  
          </label>  
          <input   
            {...register("coordsInput")}   
            className="w-full rounded border px-3 py-2 bg-transparent"   
            placeholder={`52°31'12.0"N 13°24'18.0"E`}   
          />  
          <p className="text-xs opacity-70 mt-1">  
            O haz clic en el mapa para seleccionar ubicación  
          </p>  
        </div>  
  
        <div className="grid grid-cols-2 gap-3">  
          <div>  
            <label className="block text-sm mb-1">Tags (separados por comas)</label>  
            <input   
              {...register("tags")}   
              className="w-full rounded border px-3 py-2 bg-transparent"   
              placeholder="quiet,park,coffee"   
            />  
          </div>  
          <div>  
            <label className="block text-sm mb-1">Nivel de ruido (0–5)</label>  
            <input   
              type="number"   
              {...register("noiseLevel")}   
              className="w-full rounded border px-3 py-2 bg-transparent"   
              min={0}   
              max={5}   
            />  
          </div>  
        </div>  
  
        <button   
          type="submit"   
          className="w-full px-4 py-2 rounded bg-emerald-500 text-black font-medium hover:bg-emerald-600 transition"  
        >  
          Guardar lugar  
        </button>  
          
        {coords && (  
          <p className="text-sm opacity-70">  
            📍 Coordenadas: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}  
          </p>  
        )}  
      </form>  
    </div>  
  );  
}