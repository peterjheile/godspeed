"use server"

import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"
import { getSession, requireAdmin } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function changeEmailAction(formData: FormData) {
  // Must be ADMIN or SUPERADMIN
  await requireAdmin()

  const session = await getSession()
  const currentEmail = (session?.user as any)?.email as string | undefined

  if (!currentEmail) {
    redirect("/admin/login?error=unauthorized")
  }

  const newEmail = formData.get("newEmail")?.toString().trim()
  const password = formData.get("password")?.toString()

  if (!newEmail || !password) {
    throw new Error("New email and password are required.")
  }

  // Basic check: must be a different email
  if (newEmail === currentEmail) {
    throw new Error("New email must be different from your current email.")
  }

  // Make sure no one else already has this email
  const existing = await prisma.user.findUnique({
    where: { email: newEmail },
  })

  if (existing) {
    throw new Error("That email is already in use.")
  }

  const user = await prisma.user.findUnique({
    where: { email: currentEmail },
  })

  if (!user || !user.passwordHash) {
    throw new Error("User not found or password not set.")
  }

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) {
    throw new Error("Password is incorrect.")
  }

  await prisma.user.update({
    where: { email: currentEmail },
    data: { email: newEmail },
  })

  // Log them out so they must log in with the new email
  redirect(
    `/api/auth/signout?callbackUrl=${encodeURIComponent(
      "/admin/login?emailChanged=1"
    )}`
  )
}