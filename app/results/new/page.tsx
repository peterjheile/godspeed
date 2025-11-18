import { prisma } from "@/lib/db";
import { RaceType } from "@prisma/client";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { InfoIcon } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type MemberOption = {
  id: string;
  name: string;
};

type RaceTemplateOption = {
  id: string;
  name: string;
  type: RaceType;
};

const RACE_TYPE_LABELS: Record<RaceType, string> = {
  LITTLE_500: "Little 500",
  MISS_N_OUT: "Miss N Out",
  TEAM_PURSUIT: "Team Pursuit",
  INDIVIDUAL_TT: "Individual Time Trial",
  OTHER: "Other / Custom",
};

const SEMESTER_LABELS = ["Spring", "Summer", "Fall"] as const;
type Semester = (typeof SEMESTER_LABELS)[number];

async function createResult(formData: FormData) {
  "use server";
  await requireAdmin();

  const raceTemplateIdRaw = (formData.get("raceTemplateId") ?? "")
    .toString()
    .trim();
  const raceTemplateId =
    raceTemplateIdRaw && raceTemplateIdRaw !== "none"
      ? raceTemplateIdRaw
      : null;

  const raceTypeRaw = (formData.get("raceType") ?? "").toString().trim();
  const raceNameRaw = (formData.get("raceName") ?? "").toString().trim();

  const seasonTermRaw = (formData.get("seasonTerm") ?? "")
    .toString()
    .trim() as Semester | "";
  const seasonYearRaw = (formData.get("seasonYear") ?? "").toString().trim();

  const dateRaw = (formData.get("date") ?? "").toString().trim();
  const location =
    (formData.get("location") ?? "").toString().trim() || null;

  const memberIdRaw = (formData.get("memberId") ?? "").toString().trim();
  const memberId = memberIdRaw === "none" ? null : memberIdRaw || null;

  const riderName =
    (formData.get("riderName") ?? "").toString().trim() || null;
  const teamName =
    (formData.get("teamName") ?? "").toString().trim() || null;
  const category =
    (formData.get("category") ?? "").toString().trim() || null;
  const placeRaw = (formData.get("place") ?? "").toString().trim();
  const timeStr =
    (formData.get("time") ?? "").toString().trim() || null;
  const notes =
    (formData.get("notes") ?? "").toString().trim() || null;

  const markRecurring = formData.get("markRecurring") === "on";

  if (!seasonTermRaw || !seasonYearRaw) {
    throw new Error("Season term and year are required.");
  }

  const seasonYear = parseInt(seasonYearRaw, 10);
  if (Number.isNaN(seasonYear)) {
    throw new Error("Season year must be a valid number.");
  }

  const seasonLabel = `${seasonTermRaw} ${seasonYear}`;
  const date = dateRaw ? new Date(dateRaw) : null;
  const place = placeRaw ? parseInt(placeRaw, 10) || null : null;

  let raceType: RaceType;
  let raceName: string;

  // If a recurring template was chosen, use its type + name
  if (raceTemplateId) {
    const template = await prisma.raceDefinition.findUnique({
      where: { id: raceTemplateId },
    });

    if (!template) {
      throw new Error("Selected recurring race template does not exist.");
    }

    raceType = template.type;
    raceName = template.name;
  } else {
    if (!raceTypeRaw || !raceNameRaw) {
      throw new Error("Race type and race name are required.");
    }
    raceType = raceTypeRaw as RaceType;
    raceName = raceNameRaw;
  }

  // Try to find existing race with same type + name + season
  let race = await prisma.race.findFirst({
    where: {
      type: raceType,
      name: raceName,
      seasonLabel,
    },
  });

  if (!race) {
    race = await prisma.race.create({
      data: {
        type: raceType,
        name: raceName,
        seasonLabel,
        date,
        location,
      },
    });
  } else if (date || location) {
    // Optionally update metadata if provided
    await prisma.race.update({
      where: { id: race.id },
      data: {
        date: date ?? race.date,
        location: location ?? race.location,
      },
    });
  }

  // If requested, save this race definition as a recurring template
  if (!raceTemplateId && markRecurring) {
    await prisma.raceDefinition.upsert({
      where: {
        // use a composite-like constraint via unique index if desired,
        // but for now just search manually by type + name.
        // If you later add a unique index, adjust this.
        // For now we'll just search and then create/update.
        id: "", // will fail, so we do findFirst/create below instead if needed
      },
      update: {},
      create: {
        type: raceType,
        name: raceName,
        isRecurring: true,
      },
    }).catch(async () => {
      // Simple fallback: if upsert fails due to lacking unique constraint, do manual check
      const existing = await prisma.raceDefinition.findFirst({
        where: {
          type: raceType,
          name: raceName,
        },
      });

      if (!existing) {
        await prisma.raceDefinition.create({
          data: {
            type: raceType,
            name: raceName,
            isRecurring: true,
          },
        });
      } else if (!existing.isRecurring) {
        await prisma.raceDefinition.update({
          where: { id: existing.id },
          data: { isRecurring: true },
        });
      }
    });
  }

  await prisma.raceResult.create({
    data: {
      raceId: race.id,
      memberId,
      riderName,
      teamName,
      category,
      place,
      time: timeStr,
      notes,
    },
  });

  redirect("/results");
}

export default async function NewResultPage() {
  await requireAdmin();

  const [members, templates] = await Promise.all([
    prisma.member.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.raceDefinition.findMany({
      where: { isRecurring: true },
      orderBy: [{ type: "asc" }, { name: "asc" }],
    }),
  ]);

  const memberOptions: MemberOption[] = members.map((m) => ({
    id: m.id,
    name: m.name,
  }));

  const raceTemplates: RaceTemplateOption[] = templates.map((t) => ({
    id: t.id,
    name: t.name,
    type: t.type,
  }));

  const now = new Date();
  const currentYear = now.getFullYear();
  const years = Array.from({ length: 8 }).map((_, idx) => currentYear - 4 + idx);

  // rough guess for default semester based on current month
  const month = now.getMonth() + 1;
  const defaultTerm: Semester =
    month >= 1 && month <= 4
      ? "Spring"
      : month <= 7
      ? "Summer"
      : "Fall";

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add race result</h1>
          <p className="text-muted-foreground text-sm">
            Create or reuse a race and record a flexible result entry.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Race & result</CardTitle>
          <CardDescription>
            Define the race (type, semester, year) and add a single result row.
            You can submit multiple times for multiple riders.
          </CardDescription>
        </CardHeader>

        <form action={createResult}>
          <CardContent className="space-y-6">
            {/* Race metadata */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Race
              </h2>

              {/* Optional recurring race preset */}
              {raceTemplates.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="raceTemplateId">Recurring race preset</Label>
                  <div className="flex flex-wrap items-center gap-2">
                    <Select name="raceTemplateId" defaultValue="none">
                      <SelectTrigger id="raceTemplateId" className="w-64">
                        <SelectValue placeholder="None / custom race" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">
                          None / custom race
                        </SelectItem>
                        {raceTemplates.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {RACE_TYPE_LABELS[t.type]} · {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span
                      className="text-xs text-muted-foreground flex items-center gap-1"
                      title="Select a saved recurring race to reuse its name and type. You can still set a new semester and year."
                    >
                      <InfoIcon className="size-3" />
                      Hover for info
                    </span>
                  </div>
                </div>
              )}

              {/* Type + Semester + Year */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="raceType">Race type</Label>
                  <Select name="raceType" defaultValue={RaceType.LITTLE_500}>
                    <SelectTrigger id="raceType">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(RaceType).map((t) => (
                        <SelectItem key={t} value={t}>
                          {RACE_TYPE_LABELS[t]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seasonTerm">Semester</Label>
                  <Select name="seasonTerm" defaultValue={defaultTerm}>
                    <SelectTrigger id="seasonTerm">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {SEMESTER_LABELS.map((term) => (
                        <SelectItem key={term} value={term}>
                          {term}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seasonYear">Year</Label>
                  <Select
                    name="seasonYear"
                    defaultValue={currentYear.toString()}
                  >
                    <SelectTrigger id="seasonYear">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="raceName">Race name</Label>
                  <Input
                    id="raceName"
                    name="raceName"
                    placeholder="Little 500, Godspeed Alumni Crit..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Race date (optional)</Label>
                  <Input id="date" name="date" type="date" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location (optional)</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="Bloomington, IN"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="markRecurring"
                  name="markRecurring"
                  type="checkbox"
                  className="h-4 w-4 rounded border border-input"
                />
                <Label
                  htmlFor="markRecurring"
                  className="flex items-center gap-1 text-sm"
                >
                  Mark this race as recurring
                  <span
                    title="If enabled, this race name and type will appear as a preset in future result forms."
                  >
                    <InfoIcon className="size-3 text-muted-foreground" />
                  </span>
                </Label>
              </div>
            </div>

            <hr className="my-2" />

            {/* Result row */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Result entry
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Member vs rider name */}
                <div className="space-y-2">
                  <Label htmlFor="memberId">Member (optional)</Label>
                  <Select name="memberId" defaultValue="none">
                    <SelectTrigger id="memberId">
                      <SelectValue placeholder="Select member (or leave blank)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">
                        None / custom rider
                      </SelectItem>
                      {memberOptions.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    If the rider isn&apos;t in the system, leave this as
                    &quot;None&quot; and use the Rider name field.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="riderName">Rider name (optional)</Label>
                  <Input
                    id="riderName"
                    name="riderName"
                    placeholder="Name to display for this result"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="teamName">Team name (optional)</Label>
                  <Input
                    id="teamName"
                    name="teamName"
                    placeholder="Godspeed, Cutters..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category (optional)</Label>
                  <Input
                    id="category"
                    name="category"
                    placeholder="Men's A, Women's, Alumni..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="place">Place (optional)</Label>
                  <Input
                    id="place"
                    name="place"
                    type="number"
                    min={1}
                    placeholder="1 for winner..."
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="time">Time / result metric</Label>
                  <Input
                    id="time"
                    name="time"
                    placeholder="2:13:45, 35 laps, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    placeholder="Any extra context: weather, crashes, primes..."
                  />
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            <Button type="submit">Save result</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}