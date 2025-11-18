"use client";

import { useMemo, useState } from "react";
import { RaceType } from "@prisma/client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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
  date: string | null; // ISO
  location: string | null;
  results: ResultEntry[];
};

type ResultsExplorerProps = {
  races: RaceForClient[];
};

const RACE_TYPE_LABELS: Record<RaceType, string> = {
  LITTLE_500: "Little 500",
  MISS_N_OUT: "Miss N Out",
  TEAM_PURSUIT: "Team Pursuit",
  INDIVIDUAL_TT: "Individual Time Trial",
  OTHER: "Other",
};

type TypeFilter = "ALL" | RaceType;
type TimeframeFilter = "ALL" | "1S" | "1Y" | "2Y" | "5Y";

function parseSeasonDate(seasonLabel: string): Date | null {
  const parts = seasonLabel.split(" ");
  if (parts.length !== 2) return null;
  const [term, yearStr] = parts;
  const year = parseInt(yearStr, 10);
  if (Number.isNaN(year)) return null;

  const lower = term.toLowerCase();
  if (lower === "spring") {
    return new Date(year, 2, 1); // March 1
  }
  if (lower === "summer") {
    return new Date(year, 5, 15); // June 15
  }
  if (lower === "fall") {
    return new Date(year, 8, 1); // September 1
  }
  // fallback
  return new Date(year, 0, 1);
}

function getRaceReferenceDate(race: RaceForClient): Date | null {
  if (race.date) {
    const d = new Date(race.date);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return parseSeasonDate(race.seasonLabel);
}

function isWithinTimeframe(
  refDate: Date | null,
  timeframe: TimeframeFilter
): boolean {
  if (timeframe === "ALL") return true;
  if (!refDate) return false;

  const now = new Date();
  const cutoff = new Date(now);

  switch (timeframe) {
    case "1S": {
      // Approximate last semester as last 6 months
      cutoff.setMonth(cutoff.getMonth() - 6);
      break;
    }
    case "1Y": {
      cutoff.setFullYear(cutoff.getFullYear() - 1);
      break;
    }
    case "2Y": {
      cutoff.setFullYear(cutoff.getFullYear() - 2);
      break;
    }
    case "5Y": {
      cutoff.setFullYear(cutoff.getFullYear() - 5);
      break;
    }
    default:
      return true;
  }

  return refDate >= cutoff;
}

export default function ResultsExplorer({ races }: ResultsExplorerProps) {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");
  const [seasonFilter, setSeasonFilter] = useState<string>("ALL");
  const [timeframeFilter, setTimeframeFilter] =
    useState<TimeframeFilter>("ALL");

  const seasons = useMemo(() => {
    const s = new Set<string>();
    races.forEach((r) => s.add(r.seasonLabel));
    return Array.from(s).sort().reverse();
  }, [races]);

  const filteredRaces = useMemo(() => {
    return races.filter((race) => {
      if (typeFilter !== "ALL" && race.type !== typeFilter) return false;
      if (seasonFilter !== "ALL" && race.seasonLabel !== seasonFilter) {
        return false;
      }
      const refDate = getRaceReferenceDate(race);
      if (!isWithinTimeframe(refDate, timeframeFilter)) return false;
      return true;
    });
  }, [races, typeFilter, seasonFilter, timeframeFilter]);

  // Group by race type for sections
  const groupedByType = useMemo(() => {
    const groups: Partial<Record<RaceType, RaceForClient[]>> = {};
    for (const race of filteredRaces) {
      if (!groups[race.type]) groups[race.type] = [];
      groups[race.type]!.push(race);
    }
    return groups;
  }, [filteredRaces]);

  return (
    <div className="space-y-6">
      {/* Header + filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Results</h1>
          <p className="text-sm text-muted-foreground">
            Race results across Little 500, Miss N Out, Team Pursuit, ITTs, and
            custom events.
          </p>
          <p className="text-xs text-muted-foreground">
            Filter by race type, semester/year, and timeframe (e.g. last
            semester, last 1–5 years).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Race type filter */}
          <div className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">
              Race type
            </span>
            <Select
              value={typeFilter}
              onValueChange={(value) =>
                setTypeFilter(value as TypeFilter)
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All types</SelectItem>
                {Object.values(RaceType).map((t) => (
                  <SelectItem key={t} value={t}>
                    {RACE_TYPE_LABELS[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Season filter */}
          <div className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">
              Semester / timeframe label
            </span>
            <Select
              value={seasonFilter}
              onValueChange={(value) => setSeasonFilter(value)}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder="All seasons" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All seasons</SelectItem>
                {seasons.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Timeframe filter */}
          <div className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">
              Timeframe
            </span>
            <div className="flex gap-1">
              <Button
                type="button"
                variant={timeframeFilter === "1S" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframeFilter("1S")}
              >
                1S
              </Button>
              <Button
                type="button"
                variant={timeframeFilter === "1Y" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframeFilter("1Y")}
              >
                1Y
              </Button>
              <Button
                type="button"
                variant={timeframeFilter === "2Y" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframeFilter("2Y")}
              >
                2Y
              </Button>
              <Button
                type="button"
                variant={timeframeFilter === "5Y" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframeFilter("5Y")}
              >
                5Y
              </Button>
              <Button
                type="button"
                variant={timeframeFilter === "ALL" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframeFilter("ALL")}
              >
                All
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Sections per race type */}
      <div className="space-y-8">
        {Object.values(RaceType).map((raceType) => {
          const racesForType = groupedByType[raceType] ?? [];
          if (racesForType.length === 0) return null;

          return (
            <section key={raceType} className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {RACE_TYPE_LABELS[raceType]}
                </h2>
                <Badge variant="outline">
                  {racesForType.length} race
                  {racesForType.length === 1 ? "" : "s"}
                </Badge>
              </div>
              <Separator />

              <div className="space-y-4">
                {racesForType.map((race) => (
                  <Card key={race.id}>
                    <CardHeader>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <CardTitle>{race.name}</CardTitle>
                          <CardDescription>
                            {race.seasonLabel}
                            {race.date && (
                              <>
                                {" · "}
                                {new Date(
                                  race.date
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </>
                            )}
                            {race.location && (
                              <>
                                {" · "}
                                {race.location}
                              </>
                            )}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {race.results.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          No results recorded yet.
                        </p>
                      ) : (
                        <div className="space-y-1">
                          {race.results.map((res) => {
                            const name =
                              res.memberName ||
                              res.riderName ||
                              res.teamName ||
                              "Unknown";

                            return (
                              <div
                                key={res.id}
                                className="flex flex-col justify-between gap-1 rounded-md border px-3 py-2 text-sm md:flex-row md:items-center"
                              >
                                <div className="space-y-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    {res.place && (
                                      <Badge variant="outline">
                                        #{res.place}
                                      </Badge>
                                    )}
                                    <span className="font-medium">
                                      {name}
                                    </span>
                                    {res.category && (
                                      <span className="text-xs text-muted-foreground">
                                        {res.category}
                                      </span>
                                    )}
                                  </div>
                                  {res.notes && (
                                    <p className="text-xs text-muted-foreground">
                                      {res.notes}
                                    </p>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground md:text-right">
                                  {res.time && (
                                    <div>Result: {res.time}</div>
                                  )}
                                  {res.teamName && res.teamName !== name && (
                                    <div>Team: {res.teamName}</div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}