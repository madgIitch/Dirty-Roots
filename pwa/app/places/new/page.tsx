// src/app/places/new/page.tsx
"use client";

import PlaceForm from "@/src/components/PlaceForm";

export default function NewPlacePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Añadir lugar calmado</h1>
      <PlaceForm />
    </div>
  );
}
