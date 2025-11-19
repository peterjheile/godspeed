import { requireSuperAdmin } from "@/lib/auth"
import { AdminCreateForm } from "./AdminCreateForm"

export default async function CreateAdminPage() {
  await requireSuperAdmin()

  return <AdminCreateForm />
}