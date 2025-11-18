import { prisma } from "@/lib/db";
import ResultsExplorer from "@/components/results/ResultsExplorer";
import { RaceType } from "@prisma/client";

type ResultEntry = {
  id: string;
  riderName: string | null;
  memberName: string | null;
  teamName: string | null;
  category: string | null;
  place: number | null;
  time: string | null;
  notes: string | null;
};

type RaceForClient = {
  id: string;
  name: string;
  type: RaceType;
  seasonLabel: string;
  date: string | null;
  location: string | null;
  results: ResultEntry[];
};

export default async function ResultsPage() {
  const racesDb = await prisma.race.findMany({
    include: {
      results: {
        include: { member: true },
        orderBy: { place: "asc" },
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  const races: RaceForClient[] = racesDb.map((race) => ({
    id: race.id,
    name: race.name,
    type: race.type,
    seasonLabel: race.seasonLabel,
    date: race.date ? race.date.toISOString() : null,
    location: race.location,
    results: race.results.map((res) => ({
      id: res.id,
      riderName: res.riderName,
      memberName: res.member ? res.member.name : null,
      teamName: res.teamName,
      category: res.category,
      place: res.place,
      time: res.time,
      notes: res.notes,
    })),
  }));

  return (
    <div className="space-y-4">
      <ResultsExplorer races={races} />
    </div>
  );
}