// src/types/place.ts  
import { Timestamp } from "firebase/firestore";  
  
export interface Place {  
  id?: string;  
  name: string;  
  city?: string;  
  description?: string;  
  photo?: string | null;  
  coords: { lat: number; lng: number };  
  geohash: string;  
  tags?: string[];  
  noiseLevel?: number;  
  createdBy: string;  
  createdAt: Timestamp;  
  status?: "approved" | "pending";  
}