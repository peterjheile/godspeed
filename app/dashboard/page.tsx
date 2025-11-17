import { prisma } from "@/lib/db";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default async function DashboardPage() {
  const [eventCount, memberCount, nextEvent, recentMembers] = await Promise.all([
    prisma.event.count(),
    prisma.member.count(),
    prisma.event.findFirst({
      where: { startAt: { gt: new Date() } },
      orderBy: { startAt: "asc" },
    }),
    prisma.member.findMany({
      orderBy: { joinedAt: "desc" },
      take: 5,
    }),
  ]);

  return (
      <div className="max-w-5xl mx-auto py-10 space-y-10">
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard label="Total Events" value={eventCount} />
          <StatCard label="Team Members" value={memberCount} />
          <StatCard
            label="Next Event"
            value={nextEvent ? nextEvent.name : "No upcoming events"}
          />
        </div>

        {/* Recent Members */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Members</CardTitle>
            <CardDescription>
              Members who joined the team most recently.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentMembers.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No members found. Add some to the database.
              </p>
            ) : (
              <ul className="space-y-4">
                {recentMembers.map((member) => (
                  <li
                    key={member.id}
                    className="flex items-center justify-between border rounded-md p-3"
                  >
                    <span className="font-medium">{member.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {member.joinedAt.toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
  );
}

function StatCard({ label, value }: { label: string; value: any }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}