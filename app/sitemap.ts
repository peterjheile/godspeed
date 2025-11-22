import type { MetadataRoute } from "next";
// import { prisma } from "@/lib/db"; // if/when you want DB-driven routes

const baseUrl = "https://godspeedcycling.org";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1) Static public routes (small, finite list)
  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/history",
    "/members",
    "/events",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  // 2) Dynamic routes (example: events from DB)
  // Uncomment & adapt when you’re ready:
  /*
  const events = await prisma.event.findMany({
    select: { slug: true, updatedAt: true },
    where: { isPublic: true },
  });

  const eventRoutes: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${baseUrl}/events/${event.slug}`,
    lastModified: event.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));
  */

  // 3) Combine and return
  return [
    ...staticRoutes,
    // ...eventRoutes,
  ];
}