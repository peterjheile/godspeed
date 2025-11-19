export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Terms of Use
        </h1>
        <p className="text-sm text-muted-foreground">
          Last updated: [DATE]
        </p>
      </header>

      <section className="space-y-4 text-sm leading-relaxed text-muted-foreground">
        <p>
          These Terms of Use (&quot;Terms&quot;) govern your use of the Godspeed
          Cycling Team Portal (&quot;the App&quot;). By accessing or using the
          App, you agree to be bound by these Terms.
        </p>

        <h2 className="text-lg font-semibold text-foreground">
          1. Purpose of the App
        </h2>
        <p>
          The App is designed for members, coaches, and staff of the Godspeed
          Cycling team to:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Connect Strava accounts for training analysis</li>
          <li>View team rides, maps, and statistics</li>
          <li>Support communication and coordination around training</li>
        </ul>

        <h2 className="text-lg font-semibold text-foreground">
          2. Eligibility
        </h2>
        <p>
          You may use the App if you are a rider, coach, staff member, or guest
          viewer associated with the Godspeed Cycling team and you agree to
          comply with these Terms and any applicable team rules.
        </p>

        <h2 className="text-lg font-semibold text-foreground">
          3. Strava Integration
        </h2>
        <p>
          The App integrates with Strava via OAuth. When you connect your Strava
          account:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            You authorize us to access your Strava activities and related
            metrics as described in our Privacy Policy.
          </li>
          <li>
            You may disconnect the integration at any time through Strava
            &quot;My Apps&quot; or through the App&apos;s manage page.
          </li>
          <li>
            You may request deletion of imported Strava data at any time.
          </li>
        </ul>
        <p>
          We will never post to your Strava account on your behalf. We only read
          activity data for display and analysis within the team context.
        </p>

        <h2 className="text-lg font-semibold text-foreground">
          4. Acceptable Use
        </h2>
        <p>You agree not to:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Attempt to access data you are not authorized to view</li>
          <li>Interfere with the security or operation of the App</li>
          <li>
            Reverse-engineer, decompile, or attempt to derive the source of the
            App
          </li>
          <li>Use the App for commercial advertising or data resale</li>
          <li>
            Misuse Strava data or violate Strava&apos;s own Terms of Service
          </li>
        </ul>

        <h2 className="text-lg font-semibold text-foreground">
          5. Public Profiles and Visibility
        </h2>
        <p>
          Activity data is only displayed for riders who explicitly connect
          their Strava account via OAuth. Public or team-visible pages may show:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Rider name and role</li>
          <li>Basic stats (e.g., total distance, elevation)</li>
          <li>Maps of rides and recent activity summaries</li>
        </ul>
        <p>
          If you do not connect Strava, no ride data will be shown for you. You
          may disconnect at any time.
        </p>

        <h2 className="text-lg font-semibold text-foreground">
          6. Termination
        </h2>
        <p>
          We may suspend or terminate your access to the App at any time, with
          or without notice, for reasons including but not limited to:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Security concerns</li>
          <li>Misuse of the App or data</li>
          <li>Violation of these Terms or team rules</li>
        </ul>
        <p>
          You may stop using the App at any time and may request data deletion
          as described in the Privacy Policy.
        </p>

        <h2 className="text-lg font-semibold text-foreground">
          7. Disclaimer of Warranties
        </h2>
        <p>
          The App is provided on an &quot;as-is&quot; and &quot;as-available&quot;
          basis, without warranties of any kind. We do not guarantee that the
          App will be error-free, secure, or continuously available.
        </p>

        <h2 className="text-lg font-semibold text-foreground">
          8. Limitation of Liability
        </h2>
        <p>
          To the maximum extent permitted by law, we are not liable for any
          indirect, incidental, special, consequential, or punitive damages, or
          any loss of data, revenue, or profits arising from your use of the
          App.
        </p>

        <h2 className="text-lg font-semibold text-foreground">
          9. Changes to These Terms
        </h2>
        <p>
          We may update these Terms from time to time. When we do, we will
          update the &quot;Last updated&quot; date at the top of this page. By
          continuing to use the App after changes take effect, you agree to the
          updated Terms.
        </p>

        <h2 className="text-lg font-semibold text-foreground">
          10. Contact
        </h2>
        <p>
          If you have questions about these Terms, contact us at:{" "}
          <span className="font-mono">peterjheile@gmail.com</span>.
        </p>
      </section>
    </div>
  );
}