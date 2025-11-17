
import { prisma } from "@/lib/db";
import { RoutesMap, type Route } from "@/components/map/RoutesMap";
import type { LatLngExpression } from "leaflet";

export default async function MapPage() {
  const now = new Date();
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const rides = await prisma.ride.findMany({
    where: {
      startedAt: {
        gte: twoWeeksAgo,
      },
    },
    include: {
      member: true,
    },
    orderBy: {
      startedAt: "asc",
    },
  });

  const routes: Route[] = rides
    .map((ride) => {
      let coords: [number, number][] = [];

      try {
        coords = JSON.parse(ride.polyline) as [number, number][];
      } catch {
        return null; // skip bad data
      }

      const positions: LatLngExpression[] = coords;

      return {
        id: ride.id,
        label: `${ride.member.name} — ${ride.distanceKm ?? 0} km`,
        positions,
      } satisfies Route;
    })
    .filter((r): r is Route => r !== null);

  return (
      <div className="max-w-5xl mx-auto py-10 space-y-6">
        <header className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight">Team Routes</h1>
          <p className="text-sm text-muted-foreground">
            Rides from the last two weeks, visualized around Bloomington.
          </p>
        </header>

        {routes.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No rides found in the last 14 days. Seed some rides or go ride 🚴‍♂️
          </p>
        ) : (
          <RoutesMap routes={routes} />
        )}
      </div>
  );
}
