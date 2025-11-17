
import { RoutesMap, type Route } from "@/components/map/RoutesMap";
import type { LatLngExpression } from "leaflet";

export default async function MapPage() {
  const routes: Route[] = [
    {
      id: "campus-loops",
      label: "Campus Loops – Easy Ride",
      positions: [
        [39.1679, -86.523],
        [39.1695, -86.518],
        [39.171, -86.522],
        [39.169, -86.526],
        [39.1679, -86.523],
      ] as LatLngExpression[],
    },
    {
      id: "stadium-laps",
      label: "Stadium Laps – Intervals",
      positions: [
        [39.1705, -86.526],
        [39.1712, -86.523],
        [39.17, -86.52],
        [39.1688, -86.522],
        [39.1705, -86.526],
      ] as LatLngExpression[],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-6">
      <header className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight">Team Routes</h1>
        <p className="text-sm text-muted-foreground">
          Example routes around Bloomington. Later, these will come from real rides.
        </p>
      </header>

      <RoutesMap routes={routes} />
    </div>
  );
}