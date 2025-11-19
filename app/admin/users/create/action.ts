"use server"

import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { requireSuperAdmin } from "@/lib/auth"
import { redirect } from "next/navigation"

function isStrongPassword(pw: string) {
  // at least 10 chars, 1 letter, 1 number, 1 symbol
  const longEnough = pw.length >= 10
  const hasLetter = /[A-Za-z]/.test(pw)
  const hasNumber = /[0-9]/.test(pw)
  const hasSymbol = /[^A-Za-z0-9]/.test(pw)
  return longEnough && hasLetter && hasNumber && hasSymbol
}

export type CreateAdminState = {
  error?: string
}

export async function createAdminAction(
  prevState: CreateAdminState,
  formData: FormData
): Promise<CreateAdminState> {
  await requireSuperAdmin()

  const email = formData.get("email")?.toString().trim()
  const name = formData.get("name")?.toString().trim()
  const password = formData.get("password")?.toString() ?? ""

  if (!email || !password) {
    return { error: "Email and password are required." }
  }

  if (!isStrongPassword(password)) {
    return {
      error:
        "Password must be at least 10 characters and include a letter, a number, and a symbol.",
    }
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return { error: "A user with that email already exists." }
  }

  const passwordHash = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      email,
      name: name || null,
      passwordHash,
      role: "ADMIN", // still default to ADMIN; SUPERADMIN is via promotions
    },
  })

  // On success, just go back to the users list
  redirect("/admin/users")
}