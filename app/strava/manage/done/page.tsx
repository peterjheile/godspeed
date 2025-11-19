type DoneProps = {
  searchParams: Promise<{ type?: string }>;
};

export default async function StravaManageDonePage({ searchParams }: DoneProps) {
  const { type } = await searchParams;



  const message =
    type === "delete"
      ? "Your Strava data has been deleted from Godspeed Cycling and your account is disconnected."
      : "Your Strava account has been disconnected from Godspeed Cycling.";

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-3">
        <h1 className="text-2xl font-semibold">Done</h1>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}