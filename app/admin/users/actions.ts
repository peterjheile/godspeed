"use server"

import { prisma } from "@/lib/db"
import { requireSuperAdmin } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function updateUserRoleAction(formData: FormData) {
  await requireSuperAdmin()

  const userId = formData.get("userId")?.toString()
  const role = formData.get("role")?.toString() as
    | "USER"
    | "ADMIN"
    | "SUPERADMIN"
    | undefined

  if (!userId || !role) {
    throw new Error("Missing userId or role")
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    redirect("/admin/users?error=user_not_found")
  }

  // If we're changing a SUPERADMIN to something else,
  // make sure this is NOT the last remaining superadmin.
  if (user!.role === "SUPERADMIN" && role !== "SUPERADMIN") {
    const superCount = await prisma.user.count({
      where: { role: "SUPERADMIN" },
    })

    if (superCount <= 1) {
      // Prevent leaving the system with zero superadmins
      redirect("/admin/users?error=must_have_superadmin")
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  })

  redirect("/admin/users")
}

export async function deleteUserAction(formData: FormData) {
  await requireSuperAdmin()

  const userId = formData.get("userId")?.toString()

  if (!userId) {
    throw new Error("Missing userId")
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    redirect("/admin/users?error=user_not_found")
  }

  // If we're deleting a SUPERADMIN, make sure they are not the last one
  if (user!.role === "SUPERADMIN") {
    const superCount = await prisma.user.count({
      where: { role: "SUPERADMIN" },
    })

    if (superCount <= 1) {
      redirect("/admin/users?error=must_have_superadmin")
    }
  }

  await prisma.user.delete({
    where: { id: userId },
  })

  redirect("/admin/users")
}