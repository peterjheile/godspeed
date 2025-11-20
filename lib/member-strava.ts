import { prisma } from "@/lib/db";

export async function disconnectMemberStravaById(memberId: string) {
  await prisma.member.update({
    where: { id: memberId },
    data: {
      stravaAthleteId: null,
      stravaAccessToken: null,
      stravaRefreshToken: null,
      stravaTokenExpiresAt: null,
      stravaConnectedAt: null,
      // Optionally: keep token or clear it, depending on how you want re-connection
      // If you want token to still work to delete data later, keep it.
      // If you want it one-time, set to null. Here we keep it.
    },
  });
}


async function deauthorizeStravaOnStravaSide(accessToken: string | null) {
  if (!accessToken) return;

  try {
    await fetch("https://www.strava.com/oauth/deauthorize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("Failed to deauthorize Strava on Strava side:", err);
    // Not fatal — we still proceed with local cleanup
  }
}






export async function deleteMemberStravaDataById(memberId: string) {
  // First, get the member so we can retrieve their access token
  const member = await prisma.member.findUnique({
    where: { id: memberId },
    select: { stravaAccessToken: true },
  });

  // If they have an active access token, revoke on Strava's side
  if (member?.stravaAccessToken) {
    await deauthorizeStravaOnStravaSide(member.stravaAccessToken);
  }

  // Delete local Strava data (rides)
  await prisma.ride.deleteMany({
    where: { memberId },
  });

  // Clear all Strava-related fields
  await prisma.member.update({
    where: { id: memberId },
    data: {
      stravaAthleteId: null,
      stravaAccessToken: null,
      stravaRefreshToken: null,
      stravaTokenExpiresAt: null,
      stravaConnectedAt: null,
      stravaDisconnectToken: null,
    },
  });
}

/**
 * Helper: given a disconnect token, find the member.
 */
export async function getMemberByDisconnectToken(token: string) {
  if (!token) return null;

  return prisma.member.findFirst({
    where: { stravaDisconnectToken: token },
  });
}