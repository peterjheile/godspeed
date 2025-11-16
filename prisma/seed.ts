import { PrismaClient, EventType, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Basic users
  const peter = await prisma.user.upsert({
    where: { email: "peter@example.com" },
    update: {},
    create: {
      email: "peter@example.com",
      name: "Peter Heile",
      role: UserRole.CAPTAIN,
    },
  });

  const alex = await prisma.user.upsert({
    where: { email: "alex@example.com" },
    update: {},
    create: {
      email: "alex@example.com",
      name: "Alex Rider",
      role: UserRole.RIDER,
    },
  });

  // A couple of events
  await prisma.event.createMany({
    data: [
      {
        title: "Sunday Long Ride",
        description: "Easy pace, 2–3 hours. Meet at church parking lot.",
        startAt: new Date("2025-04-13T08:00:00Z"),
        endAt: new Date("2025-04-13T11:00:00Z"),
        locationName: "St. Paul Church",
        type: EventType.TRAINING,
        createdByUserId: peter.id,
      },
      {
        title: "Midweek Tempo Session",
        description: "Tempo laps around campus circuit.",
        startAt: new Date("2025-04-16T18:00:00Z"),
        endAt: new Date("2025-04-16T19:30:00Z"),
        locationName: "Campus Circuit",
        type: EventType.TRAINING,
        createdByUserId: alex.id,
      },
    ],
    skipDuplicates: true,
  });

  // A couple of rides
  await prisma.ride.createMany({
    data: [
      {
        userId: peter.id,
        name: "Tuesday Night Tempo",
        distanceM: 39000,
        movingTimeS: 5400,
        elevationGainM: 450,
        startDate: new Date("2025-04-08T22:00:00Z"),
      },
      {
        userId: peter.id,
        name: "Recovery Spin",
        distanceM: 22000,
        movingTimeS: 3600,
        elevationGainM: 120,
        startDate: new Date("2025-04-09T21:00:00Z"),
      },
      {
        userId: alex.id,
        name: "Campus Laps",
        distanceM: 18000,
        movingTimeS: 3200,
        elevationGainM: 80,
        startDate: new Date("2025-04-07T21:30:00Z"),
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });