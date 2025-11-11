// src/lib/geoutils.ts
import { geohashForLocation, geohashQueryBounds, distanceBetween } from "geofire-common";

export type LatLng = { lat: number; lng: number };

export function toGeohash(coords: LatLng) {
  return geohashForLocation([coords.lat, coords.lng]);
}

/** Devuelve los bounds de geohash para una búsqueda por radio (en metros) */
export function geohashBoundsForRadius(center: LatLng, radiusM: number) {
  return geohashQueryBounds([center.lat, center.lng], radiusM);
}

/** Distancia (m) entre dos puntos */
export function distanceM(a: LatLng, b: LatLng) {
  return distanceBetween([a.lat, a.lng], [b.lat, b.lng]) * 1000;
}
