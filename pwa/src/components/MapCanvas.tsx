// src/components/MapCanvas.tsx  
"use client";  
  
import { useEffect, useRef } from "react";  
import L from "leaflet";  
import "leaflet/dist/leaflet.css";  
  
type Props = {  
  height?: string;  
  center?: { lat: number; lng: number };  
  zoom?: number;  
  selectable?: boolean;  
  onSelectPosition?: (lat: number, lng: number) => void;  
  markers?: { id: string; lat: number; lng: number }[];  
};  
  
export default function MapCanvas({  
  height = "60vh",  
  center = { lat: 50.0, lng: 10.0 },  
  zoom = 5,  
  selectable = false,  
  onSelectPosition,  
  markers = [],  
}: Props) {  
  const mapRef = useRef<HTMLDivElement | null>(null);  
  const instanceRef = useRef<L.Map | null>(null);  
  const markerRef = useRef<L.Marker | null>(null);  
  const listRef = useRef<L.Marker[]>([]);  
  
  useEffect(() => {  
    if (!mapRef.current || instanceRef.current) return;  
  
    const map = L.map(mapRef.current, {  
      center: [center.lat, center.lng],  
      zoom,  
      zoomControl: true,  
      scrollWheelZoom: false,  
    });  
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {  
      attribution: '© OpenStreetMap contributors',  
      maxZoom: 18,  
    }).addTo(map);  
  
    instanceRef.current = map;  
  
    if (selectable && onSelectPosition) {  
      map.on('click', (e: L.LeafletMouseEvent) => {  
        const { lat, lng } = e.latlng;  
          
        if (markerRef.current) {  
          map.removeLayer(markerRef.current);  
        }  
          
        const icon = L.divIcon({  
          html: '<div class="custom-marker">📍</div>',  
          className: 'custom-leaflet-marker',  
          iconSize: [30, 30],  
          iconAnchor: [15, 30],  
        });  
          
        markerRef.current = L.marker([lat, lng], { icon }).addTo(map);  
        onSelectPosition(lat, lng);  
      });  
    }  
  
    return () => {  
      listRef.current.forEach(m => map.removeLayer(m));  
      if (markerRef.current) map.removeLayer(markerRef.current);  
      map.remove();  
      instanceRef.current = null;  
    };  
  }, []);  
  
  useEffect(() => {  
    const map = instanceRef.current;  
    if (!map) return;  
      
    listRef.current.forEach(m => map.removeLayer(m));  
      
    const icon = L.divIcon({  
      html: '<div class="custom-marker">🌿</div>',  
      className: 'custom-leaflet-marker',  
      iconSize: [30, 30],  
      iconAnchor: [15, 30],  
    });  
      
    listRef.current = markers.map(m =>  
      L.marker([m.lat, m.lng], { icon }).addTo(map)  
    );  
  }, [markers]);  
  
  return <div ref={mapRef} style={{ width: "100%", height }} />;  
}