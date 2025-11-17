import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  // Fetch data in parallel for performance
  const [eventCount, memberCount, nextEvent, recentMembers] = await Promise.all([
    prisma.event.count(),

    prisma.member.count(),

    prisma.event.findFirst({
      where: { startAt: { gt: new Date() } },
      orderBy: { startAt: "asc" },
    }),

    prisma.member.findMany({
      orderBy: { joinedAt: "desc" },
      take: 5, // show 5 most recent members
    }),
  ]);

  console.log(nextEvent, "hello");

  return (
      <div className="max-w-4xl mx-auto py-8 space-y-10">
        <h1 className="text-3xl font-semibold">Dashboard</h1>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card label="Events" value={eventCount} />
          <Card label="Team Members" value={memberCount} />
          <Card
            label="Next Event"
            value={nextEvent ? nextEvent.name : "None scheduled"}
          />
        </div>

        {/* Recent members */}
        <section>
          <h2 className="text-xl font-medium mb-4">Recent Members</h2>

          <ul className="space-y-3">
            {recentMembers.map((member) => (
              <li
                key={member.id}
                className="border p-3 rounded-lg flex justify-between items-center"
              >
                <span className="font-medium">{member.name}</span>
                <span className="text-xs text-muted-foreground">
                  {member.joinedAt.toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>

          {recentMembers.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No members found. Seed some in your database.
            </p>
          )}
        </section>
      </div>
  );
}

function Card({ label, value }: { label: string; value: any }) {
  return (
    <div className="border rounded-lg p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold mt-2">{value}</p>
    </div>
  );
}