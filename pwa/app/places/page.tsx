// src/app/places/page.tsx
"use client";

import { useEffect, useState } from "react";
import MapCanvas from "@/src/components/MapCanvas";
import { ensureAnonAuth } from "@/src/lib/firebase";
import { listLatestPlaces } from "@/src/lib/firestore";

export default function PlacesPage() {
  const [places, setPlaces] = useState<any[]>([]);
  useEffect(() => {
    ensureAnonAuth();
    (async () => {
      const data = await listLatestPlaces(100);
      setPlaces(data);
    })();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
      <MapCanvas
        height="70vh"
        markers={places.map(p => ({ id: p.id, lat: p.coords.lat, lng: p.coords.lng }))}
      />
      <aside className="space-y-2 max-h-[70vh] overflow-auto">
        <h2 className="text-lg font-semibold">Lugares calmados</h2>
        {places.map(p => (
          <div className="rounded border p-3" key={p.id}>
            <div className="font-medium">{p.name}</div>
            <div className="text-sm opacity-80">{p.description}</div>
            {p.tags?.length ? <div className="mt-1 text-xs opacity-70">#{p.tags.join(" #")}</div> : null}
          </div>
        ))}
      </aside>
    </div>
  );
}
