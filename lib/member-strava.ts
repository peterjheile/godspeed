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

export async function deleteMemberStravaDataById(memberId: string) {
  // Delete rides for this rider
  await prisma.ride.deleteMany({
    where: { memberId },
  });

  // Also disconnect Strava and clear token (now that data is gone)
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