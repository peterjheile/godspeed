import { prisma } from "@/lib/db"
import { requireAdmin, getSession } from "@/lib/auth"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

function RoleBadge({ role }: { role: "USER" | "ADMIN" | "SUPERADMIN" | undefined }) {
  if (!role) return null

  if (role === "SUPERADMIN") {
    return (
      <Badge className="bg-emerald-700/70 border-emerald-400/70 text-emerald-50">
        SUPERADMIN
      </Badge>
    )
  }

  if (role === "ADMIN") {
    return (
      <Badge className="bg-sky-700/70 border-sky-400/70 text-sky-50">
        ADMIN
      </Badge>
    )
  }

  return (
      <Badge variant="outline">
        USER
      </Badge>
  )
}

export default async function AccountPage() {
  // Only ADMIN or SUPERADMIN
  await requireAdmin()

  const session = await getSession()
  const email = (session?.user as any)?.email as string | undefined
  const name = session?.user?.name ?? ""

  const role = (session?.user as any)?.role as
    | "USER"
    | "ADMIN"
    | "SUPERADMIN"
    | undefined

  const user = email
    ? await prisma.user.findUnique({
        where: { email },
      })
    : null

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">My Account</h1>
        <Link
          href="/dashboard"
          className="text-sm text-slate-400 hover:text-slate-100"
        >
          ← Back to dashboard
        </Link>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Account details</CardTitle>
          </div>
          <RoleBadge role={role} />
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <div className="text-slate-400">Name</div>
            <div className="text-slate-50">{name || "Not set"}</div>
          </div>

          <div>
            <div className="text-slate-400">Email</div>
            <div className="text-slate-50">
              {email || "Unknown (no email on session)"}
            </div>
          </div>

          <div>
            <div className="text-slate-400">Role</div>
            <div className="text-slate-50">
              {role || "Unknown"}
            </div>
          </div>

          <div>
            <div className="text-slate-400">Created</div>
            <div className="text-slate-50">
              {user?.createdAt
                ? user.createdAt.toLocaleDateString()
                : "Unknown"}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Security</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="outline">
            <Link href="/admin/account/password">
              Change password
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/account/email">
              Change email
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}