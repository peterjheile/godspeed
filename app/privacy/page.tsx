export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground">
          Last updated: [DATE]
        </p>
      </header>

      <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          Godspeed Cycling (&quot;we&quot;, &quot;our&quot;, or &quot;the
          App&quot;) provides a team-oriented cycling platform that allows
          riders to connect their Strava accounts and share activity data with
          coaches and staff. This Privacy Policy explains what we collect, how
          we use it, and your choices.
        </p>

        <h2 className="text-lg font-semibold text-foreground">
          1. Information We Collect
        </h2>

        <h3 className="text-sm font-semibold text-foreground">
          1.1 Strava Data (when you connect your account)
        </h3>
        <p>
          If you choose to connect your Strava account, we access certain data
          through the Strava API with your permission, including:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Strava athlete ID</li>
          <li>
            Activity data such as ride name, date, distance, elevation, speed,
            polyline (GPS route), moving time, and related metrics
          </li>
          <li>
            Access and refresh tokens used only by our server to sync new
            activities
          </li>
        </ul>
        <p>
          We do <span className="font-medium">not</span> collect your Strava
          password and do <span className="font-medium">not</span> post anything
          to your Strava account.
        </p>

        <h3 className="text-sm font-semibold text-foreground">
          1.2 Information You Provide Directly
        </h3>
        <p>We may store information you provide, such as:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Name</li>
          <li>Email address (optional)</li>
          <li>Profile details such as bio or avatar URL</li>
          <li>Team role (rider, coach, staff, etc.)</li>
        </ul>

        <h3 className="text-sm font-semibold text-foreground">
          1.3 Automatically Collected Information
        </h3>
        <p>
          We may collect basic technical information such as server logs to keep
          the App secure and reliable. We do not currently use advertising
          trackers.
        </p>

        <h2 className="text-lg font-semibold text-foreground">
          2. How We Use Your Information
        </h2>
        <p>We use your information to:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Display your rides and statistics for coaches and staff</li>
          <li>
            Show team-wide maps, leaderboards, and ride summaries for connected
            athletes
          </li>
          <li>Provide public or team-visible profiles for riders who opt in</li>
        </ul>
        <p>
          We do <span className="font-medium">not</span> sell your data, use it
          for advertising, or train machine-learning models with it.
        </p>

        <h2 className="text-lg font-semibold text-foreground">
          3. Data Storage &amp; Security
        </h2>
        <ul className="list-disc list-inside space-y-1">
          <li>
            Data is stored in a secured database accessible only by our
            server-side application.
          </li>
          <li>
            Strava tokens are stored server-side and are never exposed to your
            browser or other users.
          </li>
          <li>
            We take reasonable measures to protect your data, but no system can
            be 100% secure.
          </li>
        </ul>

        <h2 className="text-lg font-semibold text-foreground">
          4. Disconnecting Strava
        </h2>
        <p>
          You can disconnect Strava from the App at any time:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            By visiting Strava &rarr; Settings &rarr; My Apps &rarr; Revoke
            access for our app.
          </li>
          <li>
            By using your &quot;Manage Strava&quot; link (provided when you
            connect).
          </li>
          <li>
            By contacting a coach or staff member who can disconnect it on your
            behalf.
          </li>
        </ul>
        <p>
          When disconnected, we stop syncing new rides from your Strava account.
        </p>

        <h2 className="text-lg font-semibold text-foreground">
          5. Deleting Your Strava Data
        </h2>
        <p>
          You can request deletion of your imported Strava data at any time by:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Using the &quot;Delete my data&quot; option on your manage page</li>
          <li>Asking a coach or staff member</li>
          <li>Emailing us at <span className="font-mono">[YOUR_EMAIL]</span></li>
        </ul>
        <p>
          When you request deletion, we will remove:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Imported Strava activities (rides)</li>
          <li>Stored Strava tokens</li>
          <li>Your Strava athlete ID and connection metadata</li>
        </ul>
        <p>
          We aim to complete deletion requests within{" "}
          <span className="font-medium">30 days</span>.
        </p>

        <h2 className="text-lg font-semibold text-foreground">
          6. Public Visibility
        </h2>
        <p>
          Only riders who explicitly connect their Strava account via OAuth will
          have their rides or statistics displayed on public or team-visible
          pages. No data is shown for athletes who do not authorize the App.
        </p>

        <h2 className="text-lg font-semibold text-foreground">
          7. Changes to This Policy
        </h2>
        <p>
          We may update this Privacy Policy from time to time. When we do, we
          will update the &quot;Last updated&quot; date at the top of this page.
        </p>

        <h2 className="text-lg font-semibold text-foreground">
          8. Contact
        </h2>
        <p>
          If you have questions or concerns about this policy, contact us at:{" "}
          <span className="font-mono">peterjheile@gmail.com</span>.
        </p>
      </section>
    </div>
  );
}