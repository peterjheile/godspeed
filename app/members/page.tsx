import { prisma } from "@/lib/db";


export default async function TeamPage() {
  const members = await prisma.member.findMany({
    orderBy: { name: "asc" },
  });

  return (
      <div className="max-w-4xl mx-auto py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold">Team</h1>
          <p className="text-sm text-muted-foreground">
            Riders, coaches, mechanics, and alumni of Godspeed.
          </p>
        </header>

        {members.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No team members found.
          </p>
        ) : (
          <ul className="space-y-4">
            {members.map((member) => (
              <li
                key={member.id}
                className="flex items-start justify-between gap-4 border rounded-lg p-4"
              >
                <div>
                  <h2 className="text-lg font-medium">{member.name}</h2>
                  {member.email && (
                    <p className="text-xs text-muted-foreground">
                      {member.email}
                    </p>
                  )}
                </div>

                <span className="text-xs px-2 py-1 rounded-full border uppercase tracking-wide">
                  {member.role}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
  );
}