import { requireAdmin, getSession } from "@/lib/auth"
import { changeEmailAction } from "./action"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function ChangeEmailPage() {
  await requireAdmin()

  const session = await getSession()
  const currentEmail = (session?.user as any)?.email as string | undefined

  return (
    <div className="max-w-xl mx-auto py-8 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Change Email
        </h1>
        <Link
          href="/admin/account"
          className="text-sm text-slate-400 hover:text-slate-100"
        >
          ← Back to account
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Update your email</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={changeEmailAction} className="space-y-4">
            <div className="space-y-1">
              <Label>Current email</Label>
              <Input
                value={currentEmail || ""}
                disabled
                className="bg-slate-900/60"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="newEmail">New email</Label>
              <Input
                id="newEmail"
                name="newEmail"
                type="email"
                required
                placeholder="new-email@example.com"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">
                Confirm with password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Current password"
              />
            </div>

            <p className="text-xs text-slate-400">
              After changing your email, you&apos;ll be logged out and must
              sign in again with the new address.
            </p>

            <Button type="submit">Change email</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}