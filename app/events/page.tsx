import { prisma } from "@/lib/db";
import { AppShell } from "@/components/layout/AppShell";

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { startAt: "asc" },
  });

  return (
      <div className="max-w-4xl mx-auto py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold">Team Events</h1>
          <p className="text-sm text-muted-foreground">
            Upcoming training sessions, races, and team activities.
          </p>
        </header>

        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming events.</p>
        ) : (
          <ul className="space-y-4">
            {events.map((event) => (
              <li
                key={event.id}
                className="p-4 border rounded-lg flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">{event.name}</h2>

                  <span className="text-xs px-2 py-1 border rounded-full uppercase tracking-wider">
                    {event.type}
                  </span>
                </div>

                {/* Dates */}
                <p className="text-sm text-muted-foreground">
                  {event.startAt.toLocaleString()}
                  {event.endAt && ` → ${event.endAt.toLocaleString()}`}
                </p>

                {/* Location */}
                {event.location && (
                  <p className="text-sm text-muted-foreground">
                    📍 {event.location}
                  </p>
                )}

                {/* Description */}
                {event.description && (
                  <p className="text-sm mt-1">{event.description}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
  );
}