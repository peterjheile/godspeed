"use server"

import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"
import { getSession, requireAdmin } from "@/lib/auth"
import { redirect } from "next/navigation"

function isStrongPassword(pw: string) {
  const longEnough = pw.length >= 10
  const hasLetter = /[A-Za-z]/.test(pw)
  const hasNumber = /[0-9]/.test(pw)
  const hasSymbol = /[^A-Za-z0-9]/.test(pw)
  return longEnough && hasLetter && hasNumber && hasSymbol
}

export async function changePasswordAction(formData: FormData) {
  await requireAdmin()

  const session = await getSession()
  const email = (session?.user as any)?.email as string | undefined

  if (!email) {
    redirect("/admin/login?error=unauthorized")
  }

  const currentPassword = formData.get("currentPassword")?.toString() ?? ""
  const newPassword = formData.get("newPassword")?.toString() ?? ""
  const confirmPassword = formData.get("confirmPassword")?.toString() ?? ""

  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new Error("All password fields are required.")
  }

  if (newPassword !== confirmPassword) {
    throw new Error("New passwords do not match.")
  }

  if (!isStrongPassword(newPassword)) {
    throw new Error(
      "New password must be at least 10 characters and include a letter, a number, and a symbol."
    )
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.passwordHash) {
    throw new Error("User not found or password not set.")
  }

  const ok = await bcrypt.compare(currentPassword, user.passwordHash)
  if (!ok) {
    throw new Error("Current password is incorrect.")
  }

  const newHash = await bcrypt.hash(newPassword, 10)

  await prisma.user.update({
    where: { email },
    data: { passwordHash: newHash },
  })

  redirect("/dashboard?passwordChanged=1")
}