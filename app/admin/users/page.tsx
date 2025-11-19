import { prisma } from "@/lib/db"
import { requireSuperAdmin } from "@/lib/auth"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { updateUserRoleAction, deleteUserAction } from "./actions"

type AdminUsersPageProps = {
  searchParams: Promise<{
    error: string;
  }>
}



export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {


  await requireSuperAdmin()

  const  { error } = await searchParams

  const users = await prisma.user.findMany({
    orderBy: { email: "asc" },
  })

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Admin Users</h1>
        <Button asChild>
          <Link href="/admin/users/create">New admin</Link>
        </Button>
      </div>

      {/* Error "popup" / banner */}
      {error === "must_have_superadmin" && (
        <div className="rounded-md border border-red-500/60 bg-red-950/60 px-3 py-2 text-sm text-red-100">
          <p className="font-medium">Action blocked</p>
          <p className="text-xs text-red-200/90">
            There must always be at least one SUPERADMIN. You can&apos;t remove or demote the last superadmin.
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-sm text-slate-400">No users found yet.</p>
          ) : (
            <div className="space-y-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-md border border-slate-800 px-3 py-2 text-sm"
                >
                  <div>
                    <div className="font-medium">
                      {user.name || user.email || "Unnamed user"}
                    </div>
                    <div className="text-xs text-slate-400">
                      {user.email || "No email"}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Role badge */}
                    <span className="text-xs uppercase tracking-wide">
                      <span className="rounded-full border border-emerald-500/60 px-2 py-0.5 text-emerald-300">
                        {user.role}
                      </span>
                    </span>

                    {/* Role controls */}
                    {user.role === "USER" && (
                      <>
                        <form action={updateUserRoleAction}>
                          <input type="hidden" name="userId" value={user.id} />
                          <input type="hidden" name="role" value="ADMIN" />
                          <Button
                            type="submit"
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            Make admin
                          </Button>
                        </form>

                        <form action={updateUserRoleAction}>
                          <input type="hidden" name="userId" value={user.id} />
                          <input type="hidden" name="role" value="SUPERADMIN" />
                          <Button
                            type="submit"
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            Make superadmin
                          </Button>
                        </form>
                      </>
                    )}

                    {user.role === "ADMIN" && (
                      <>
                        <form action={updateUserRoleAction}>
                          <input type="hidden" name="userId" value={user.id} />
                          <input type="hidden" name="role" value="USER" />
                          <Button
                            type="submit"
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            Make user
                          </Button>
                        </form>

                        <form action={updateUserRoleAction}>
                          <input type="hidden" name="userId" value={user.id} />
                          <input type="hidden" name="role" value="SUPERADMIN" />
                          <Button
                            type="submit"
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            Make superadmin
                          </Button>
                        </form>
                      </>
                    )}

                    {user.role === "SUPERADMIN" && (
                      <>
                        <form action={updateUserRoleAction}>
                          <input type="hidden" name="userId" value={user.id} />
                          <input type="hidden" name="role" value="ADMIN" />
                          <Button
                            type="submit"
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            Make admin
                          </Button>
                        </form>

                        <form action={updateUserRoleAction}>
                          <input type="hidden" name="userId" value={user.id} />
                          <input type="hidden" name="role" value="USER" />
                          <Button
                            type="submit"
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            Make user
                          </Button>
                        </form>
                      </>
                    )}

                    {/* Remove button */}
                    <form action={deleteUserAction}>
                      <input type="hidden" name="userId" value={user.id} />
                      <Button
                        type="submit"
                        variant="destructive"
                        size="sm"
                        className="text-xs"
                      >
                        Remove
                      </Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}