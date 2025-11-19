import { requireAdmin } from "@/lib/auth"
import { changePasswordAction } from "./action"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function ChangePasswordPage() {
  // Only ADMIN or SUPERADMIN can access this
  await requireAdmin()

  return (
    <div className="max-w-xl mx-auto py-8 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Change Password
        </h1>
        <Link
          href="/dashboard"
          className="text-sm text-slate-400 hover:text-slate-100"
        >
          ← Back to dashboard
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Update your password</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={changePasswordAction} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="currentPassword">Current password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="newPassword">New password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="confirmPassword">Confirm new password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
              />
            </div>

            <Button type="submit">Change password</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}