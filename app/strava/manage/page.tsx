import { redirect } from "next/navigation";
import {
  disconnectMemberStravaById,
  deleteMemberStravaDataById,
  getMemberByDisconnectToken,
} from "@/lib/member-strava";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type PageProps = {
  searchParams: Promise <{ token?: string }>
};

export default async function StravaManagePage({ searchParams }: PageProps) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Strava link not found</CardTitle>
            <CardDescription>
              This page requires a valid manage link. Please use the link you
              received when you connected Strava, or contact your coach.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const member = await getMemberByDisconnectToken(token);

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Invalid or expired link</CardTitle>
            <CardDescription>
              This manage link is no longer valid. If you want to disconnect
              Strava or delete your data, please contact your coach.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // ✅ TS-safe: capture just the id in a separate const
  const memberId = member.id;

  // Server actions for the two buttons
  async function disconnectAction() {
    "use server";
    await disconnectMemberStravaById(memberId);
    redirect("/strava/manage/done?type=disconnect");
  }

  async function deleteDataAction() {
    "use server";
    await deleteMemberStravaDataById(memberId);
    redirect("/strava/manage/done?type=delete");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Manage Strava connection</CardTitle>
          <CardDescription>
            These options apply to {member.name}&apos;s connection to Godspeed
            Cycling.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            You can disconnect Strava so no new rides are synced, or delete all
            rides we&apos;ve already stored for you in the Godspeed Cycling app.
          </p>

          <Separator />

          <form action={disconnectAction} className="space-y-1">
            <h3 className="text-sm font-medium text-foreground">
              Disconnect Strava
            </h3>
            <p className="text-xs text-muted-foreground">
              Stops Godspeed Cycling from accessing your Strava account and
              syncing new rides. Your existing rides will remain in the app.
            </p>
            <Button type="submit" variant="outline" className="mt-2">
              Disconnect Strava
            </Button>
          </form>

          <Separator />

          <form action={deleteDataAction} className="space-y-1">
            <h3 className="text-sm font-medium text-foreground">
              Delete my Strava data
            </h3>
            <p className="text-xs text-muted-foreground">
              Deletes all rides associated with your Strava account from the
              Godspeed Cycling app and disconnects Strava. This cannot be
              undone.
            </p>
            <Button type="submit" variant="destructive" className="mt-2">
              Delete my data
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}